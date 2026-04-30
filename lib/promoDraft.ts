import {
  getPromoCopy,
  type PromoCopy,
  type PromoPlatform,
  type PromoStyle,
} from "@/lib/promoData";
import { getDefaultMatchedAssetsForActivity, type PromoActivityData } from "@/lib/promoActivities";
import { buildDefaultLayoutPlan, normalizeLayoutPlan, type LayoutPlan, type PromoLayoutAsset } from "@/lib/promoLayoutPlan";

export function getPromoDraftStorageKey(activityId: string) {
  return `ourchive_promo_draft_${activityId}`;
}

export type PromoDraftAsset = {
  id?: string;
  title: string;
  type: string;
  author?: string;
  description?: string;
  reason?: string;
  image?: string;
};

export type PromoDraft = {
  activityId: string;
  platform: string;
  style: string;
  title: string;
  body: string;
  tags: string[];
  layoutAdvice: string;
  matchedAssets: PromoDraftAsset[];
  layoutPlan: LayoutPlan;
  activity: {
    id: string;
    name: string;
    time: string;
  };
  updatedAt: string;
};

export function getDefaultMatchedAssets(activity: PromoActivityData): PromoDraftAsset[] {
  return getDefaultMatchedAssetsForActivity(activity);
}

export function buildPromoDraft({
  activity,
  copy,
  layoutPlan,
  matchedAssets = getDefaultMatchedAssets(activity),
  platform,
  style,
}: {
  activity: PromoActivityData;
  copy: Pick<PromoCopy, "title" | "body" | "tags"> & { layout?: string; layoutAdvice?: string };
  layoutPlan?: unknown;
  matchedAssets?: PromoDraftAsset[];
  platform: PromoPlatform | string;
  style: PromoStyle | string;
}): PromoDraft {
  const layoutAdvice = copy.layoutAdvice ?? copy.layout ?? "";
  const fallbackLayoutPlan = buildDefaultLayoutPlan({
    activity,
    assets: matchedAssets as PromoLayoutAsset[],
    body: copy.body,
    platform,
    style,
    tags: Array.isArray(copy.tags) ? copy.tags : [],
    title: copy.title,
  });

  return {
    activityId: activity.id,
    platform,
    style,
    title: copy.title,
    body: copy.body,
    tags: Array.isArray(copy.tags) ? copy.tags : [],
    layoutAdvice,
    matchedAssets,
    layoutPlan: normalizeLayoutPlan(layoutPlan, fallbackLayoutPlan, activity),
    activity: {
      id: activity.id,
      name: activity.name,
      time: activity.time,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function getDefaultPromoDraft(activity: PromoActivityData, platform: PromoPlatform, style: PromoStyle): PromoDraft {
  return buildPromoDraft({
    activity,
    platform,
    style,
    copy: getPromoCopy(platform, style, activity),
  });
}

let cachedDraftRaw: string | null = null;
let cachedDraft: PromoDraft | null = null;

export function loadPromoDraft(activity: PromoActivityData): PromoDraft | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(getPromoDraftStorageKey(activity.id));
    if (!raw) {
      cachedDraftRaw = null;
      cachedDraft = null;
      return null;
    }

    if (raw === cachedDraftRaw) return cachedDraft;

    const draft = JSON.parse(raw) as Partial<PromoDraft>;
    if (!draft.title || !draft.body) {
      cachedDraftRaw = raw;
      cachedDraft = null;
      return null;
    }

    cachedDraftRaw = raw;
    cachedDraft = {
      activityId: activity.id || (typeof draft.activityId === "string" ? draft.activityId : draft.activity?.id ?? "reimu-birthday"),
      platform: typeof draft.platform === "string" ? draft.platform : "QQ空间",
      style: typeof draft.style === "string" ? draft.style : "同好群口吻",
      title: draft.title,
      body: draft.body,
      tags: Array.isArray(draft.tags) ? draft.tags.filter((tag): tag is string => typeof tag === "string") : [],
      layoutAdvice: typeof draft.layoutAdvice === "string" ? draft.layoutAdvice : "",
      matchedAssets: Array.isArray(draft.matchedAssets) ? draft.matchedAssets : getDefaultMatchedAssets(activity),
      layoutPlan: normalizeLayoutPlan(
        draft.layoutPlan,
        buildDefaultLayoutPlan({
          activity,
          assets: Array.isArray(draft.matchedAssets) ? (draft.matchedAssets as PromoLayoutAsset[]) : (getDefaultMatchedAssets(activity) as PromoLayoutAsset[]),
          body: draft.body,
          platform: typeof draft.platform === "string" ? draft.platform : "QQ空间",
          style: typeof draft.style === "string" ? draft.style : "同好群口吻",
          tags: Array.isArray(draft.tags) ? draft.tags.filter((tag): tag is string => typeof tag === "string") : [],
          title: draft.title,
        }),
        activity,
      ),
      activity: {
        id: draft.activity?.id ?? activity.id,
        name: draft.activity?.name ?? activity.name,
        time: draft.activity?.time ?? activity.time,
      },
      updatedAt: draft.updatedAt ?? new Date().toISOString(),
    };

    return cachedDraft;
  } catch (error) {
    console.warn("Failed to load promo draft", error);
    cachedDraftRaw = null;
    cachedDraft = null;
    return null;
  }
}

export function subscribePromoDraft(activityId: string, onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === getPromoDraftStorageKey(activityId)) onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener("ourchive-promo-draft", onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("ourchive-promo-draft", onStoreChange);
  };
}

export function savePromoDraft(draft: PromoDraft) {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(getPromoDraftStorageKey(draft.activityId || draft.activity.id), JSON.stringify(draft));
    window.dispatchEvent(new Event("ourchive-promo-draft"));
  } catch (error) {
    console.warn("Failed to save promo draft", error);
  }
}
