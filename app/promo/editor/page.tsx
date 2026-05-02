"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { getDefaultPromoDraft, loadPromoDraft, subscribePromoDraft, type PromoDraftAsset } from "@/lib/promoDraft";
import {
  getPromoCopy,
  promoPlatforms,
  promoTemplates,
  type PromoImage,
  type PromoPlatform,
  type PromoStyle,
  type PromoTemplate,
  type PromoWork,
} from "@/lib/promoData";
import { getPromoActivity } from "@/lib/promoActivities";
import { mapPromoPlatformToLayoutPlatform, resolveTemplateId, type AssetPlanItem, type LayoutPlan } from "@/lib/promoLayoutPlan";
import { reimuBirthdayImages } from "@/lib/reimuBirthdayAssets";

const platformSet = new Set<PromoPlatform>(["QQ空间", "小红书", "Lofter", "公众号"]);
const styleSet = new Set<PromoStyle>(["同好群口吻", "文艺", "活泼", "官方"]);
const exportGradients = [
  "linear-gradient(135deg, #FDECEF 0%, #E0F2FE 100%)",
  "linear-gradient(135deg, #E0F2FE 0%, #FCE7F3 100%)",
  "linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 100%)",
];

function getBackgroundImageStyle(image: string | undefined, fallbackGradient = exportGradients[0]) {
  return {
    backgroundImage: image ? `url(${image})` : fallbackGradient,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };
}

type ResolvedPromoAsset = PromoDraftAsset & {
  selectedAssetId?: string;
  slotId?: string;
};

function readPlatform(value: string | null): PromoPlatform {
  return value && platformSet.has(value as PromoPlatform) ? (value as PromoPlatform) : "QQ空间";
}

function readStyle(value: string | null): PromoStyle {
  return value && styleSet.has(value as PromoStyle) ? (value as PromoStyle) : "同好群口吻";
}

function getAssetForPlanItem(item: AssetPlanItem, fallbackAssets: PromoDraftAsset[]): PromoDraftAsset {
  const fallback = fallbackAssets.find((asset) => asset.id === item.assetId || asset.title === item.title);
  return {
    id: item.assetId,
    title: item.title,
    type: item.type,
    author: item.author,
    description: item.pairingReason,
    image: item.image ?? fallback?.image,
  };
}

function getPlannedAssets(layoutPlan: LayoutPlan, fallbackAssets: PromoDraftAsset[]) {
  const planned = layoutPlan.assetPlan
    .slice()
    .sort((a, b) => a.priority - b.priority)
    .map((item) => getAssetForPlanItem(item, fallbackAssets));

  return planned.length > 0 ? planned : fallbackAssets;
}

function getHeroAsset(layoutPlan: LayoutPlan, assets: PromoDraftAsset[]) {
  const heroPlan =
    layoutPlan.assetPlan.find((asset) => asset.role === "hero") ??
    layoutPlan.assetPlan.find((asset) => asset.usage === "main-visual") ??
    layoutPlan.assetPlan[0];
  if (!heroPlan) return assets[0];
  return assets.find((asset) => asset.id === heroPlan.assetId || asset.title === heroPlan.title) ?? getAssetForPlanItem(heroPlan, assets);
}

function getAssetsByIds(ids: string[] | undefined, layoutPlan: LayoutPlan, fallbackAssets: PromoDraftAsset[]) {
  if (!ids || ids.length === 0) return [];
  return ids
    .map((id) => {
      const fallback = fallbackAssets.find((asset) => asset.id === id || asset.title === id);
      if (fallback) return fallback;
      const planned = layoutPlan.assetPlan.find((asset) => asset.assetId === id || asset.title === id);
      return planned ? getAssetForPlanItem(planned, fallbackAssets) : null;
    })
    .filter((asset): asset is PromoDraftAsset => Boolean(asset));
}

function renderTitleLines(layoutPlan: LayoutPlan, fallbackTitle: string) {
  const lines = layoutPlan.titlePlan.titleLines.length > 0 ? layoutPlan.titlePlan.titleLines : [fallbackTitle];
  const highlights = layoutPlan.titlePlan.highlightWords;

  return lines.map((line, lineIndex) => {
    const highlight = highlights.find((word) => line.includes(word));
    if (!highlight) {
      return (
        <span key={`${line}-${lineIndex}`} className="block">
          {line}
        </span>
      );
    }

    const [before, after] = line.split(highlight);
    return (
      <span key={`${line}-${lineIndex}`} className="block">
        {before}
        <span style={{ color: "#DB2777", fontWeight: 900 }}>{highlight}</span>
        {after}
      </span>
    );
  });
}

function getRecommendedTemplateId(platform: PromoPlatform) {
  return resolveTemplateId(undefined, mapPromoPlatformToLayoutPlatform(platform));
}

function getVisibleTemplates(platform: PromoPlatform) {
  const visible = promoTemplates.filter((template) => template.compatiblePlatforms.includes(platform));
  return visible.length > 0 ? visible : promoTemplates;
}

function getBodyParagraphs(body: string) {
  return body
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function getAssetSlotId(asset: PromoDraftAsset, index: number) {
  return asset.id || asset.title || `asset-${index}`;
}

function getAssetLibraryItemId(asset: PromoDraftAsset, index: number) {
  return asset.id || asset.title || `library-asset-${index}`;
}

function workToDraftAsset(work: PromoWork, index: number): PromoDraftAsset {
  return {
    id: work.title || `work-${index}`,
    title: work.title || `作品 ${index + 1}`,
    type: work.type || "作品",
    author: work.author || "",
    image: work.image,
  };
}

function imageToDraftAsset(image: PromoImage, works: PromoWork[], index: number): PromoDraftAsset {
  const pairedWork = works.find((work) => work.title === image.title);
  return {
    id: image.id || image.title || `image-${index}`,
    title: image.title || `素材 ${index + 1}`,
    type: pairedWork?.type || image.type || "素材",
    author: pairedWork?.author || "",
    description: image.motif,
    image: image.image,
  };
}

function dedupeAssets(assets: PromoDraftAsset[]) {
  const seen = new Set<string>();
  return assets.filter((asset, index) => {
    const key = getAssetLibraryItemId(asset, index);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function resolveAssetForSlot({
  assetLibrary,
  originalAsset,
  overrides,
  slotId,
}: {
  assetLibrary: PromoDraftAsset[];
  originalAsset: PromoDraftAsset;
  overrides: Record<string, string>;
  slotId: string;
}): ResolvedPromoAsset {
  const selectedAssetId = overrides[slotId] || getAssetLibraryItemId(originalAsset, 0);
  const selectedAsset =
    assetLibrary.find((asset, index) => getAssetLibraryItemId(asset, index) === selectedAssetId || asset.title === selectedAssetId) ??
    assetLibrary.find((asset) => asset.title === originalAsset.title) ??
    originalAsset ??
    assetLibrary[0];

  return {
    ...originalAsset,
    ...selectedAsset,
    id: slotId,
    selectedAssetId: getAssetLibraryItemId(selectedAsset, 0),
    slotId,
    title: selectedAsset.title || originalAsset.title || "素材",
    type: selectedAsset.type || originalAsset.type || "素材",
    author: selectedAsset.author || originalAsset.author || "",
    image: selectedAsset.image || originalAsset.image,
    description: selectedAsset.description || originalAsset.description,
    reason: selectedAsset.reason || originalAsset.reason,
  };
}

function getSafeXiaohongshuPage(page: { page?: number; pageType?: string; title?: string; text?: string; designNote?: string }, index: number) {
  const pageNumber = page.page ?? index + 1;
  const pageTitle = page.title || page.pageType || `第 ${pageNumber} 页`;
  const pageNote = page.designNote || page.text || "根据当前活动内容生成分页建议。";
  return { pageNumber, pageTitle, pageNote };
}

function getSafeContentSection(
  section: { heading?: string; sectionType?: string; text?: string; highlightSentence?: string; bullets?: string[] },
  index: number,
) {
  const sectionTitle = section.heading || section.sectionType || `段落 ${index + 1}`;
  const sectionText = section.highlightSentence || section.text || section.bullets?.join("、") || "根据当前活动内容生成的正文段落。";
  return { sectionTitle, sectionText };
}

function getSafeWechatSection(
  section: { order?: number; sectionTitle?: string; sectionSubtitle?: string; text?: string; assetIds?: string[] },
  index: number,
) {
  const sectionOrder = section.order ?? index + 1;
  const sectionTitle = section.sectionTitle || `章节 ${sectionOrder}`;
  const sectionText = section.text || section.sectionSubtitle || "根据当前活动内容生成的图文段落。";
  const sectionAssetIds = Array.isArray(section.assetIds) ? section.assetIds : [];
  return { sectionOrder, sectionTitle, sectionText, sectionAssetIds };
}

function getTemplateAssets(activityId: string, template: PromoTemplate, fallbackAssets: PromoDraftAsset[]): PromoDraftAsset[] {
  if (activityId !== "reimu-birthday") return fallbackAssets.slice(0, template.imageSlots);

  const assetsByTemplate: Record<string, PromoDraftAsset[]> = {
    "lofter-mood-poster": [
      { title: "《灵梦生日图文接力合辑》", type: "合辑封面", author: "阿璃 / 群体共创", image: reimuBirthdayImages.anthologyCover },
    ],
    "lofter-work-memorial": [
      { title: "《灵梦生日图文接力合辑》", type: "合辑封面", author: "阿璃 / 群体共创", image: reimuBirthdayImages.anthologyCover },
    ],
    "wechat-activity-longform": [
      { title: "《灵梦生日图文接力合辑》", type: "合辑封面", author: "阿璃 / 群体共创", image: reimuBirthdayImages.anthologyCover },
      { title: "《神社清晨的灵梦》构图草稿", type: "构图草稿", author: "墨团", image: reimuBirthdayImages.shrineMorningSketch },
      { title: "《生日小漫画分镜》", type: "漫画分镜", author: "阿璃", image: reimuBirthdayImages.mangaStoryboard },
    ],
    "wechat-works-showcase": [
      { title: "《神社清晨的灵梦》", type: "开场插画", author: "墨团", image: reimuBirthdayImages.shrineMorningFinal },
      { title: "《神社来信》", type: "短篇文字", author: "未央", image: reimuBirthdayImages.shrineLetter },
      { title: "《灵梦生日表情包》", type: "表情包", author: "小满", image: reimuBirthdayImages.stickerSheet },
      { title: "《赛钱箱旁边的生日蛋糕》", type: "小插图", author: "青禾", image: reimuBirthdayImages.birthdayCake },
    ],
    "qqzone-cover-post": [
      { title: "《神社清晨的灵梦》", type: "开场插画", author: "墨团", image: reimuBirthdayImages.shrineMorningFinal },
    ],
    "qqzone-memory-card": [
      { title: "《神社清晨的灵梦》", type: "开场插画", author: "墨团", image: reimuBirthdayImages.shrineMorningFinal },
      { title: "《神社来信》", type: "短篇文字", author: "未央", image: reimuBirthdayImages.shrineLetter },
      { title: "《赛钱箱旁边的生日蛋糕》", type: "小插图", author: "青禾", image: reimuBirthdayImages.birthdayCake },
    ],
    "xhs-title-cover": [
      { title: "《神社清晨的灵梦》", type: "开场插画", author: "墨团", image: reimuBirthdayImages.shrineMorningFinal },
    ],
    "xhs-scrapbook-cover": [
      { title: "《神社清晨的灵梦》", type: "开场插画", author: "墨团", image: reimuBirthdayImages.shrineMorningFinal },
      { title: "《灵梦生日表情包》", type: "表情包", author: "小满", image: reimuBirthdayImages.stickerSheet },
      { title: "《赛钱箱旁边的生日蛋糕》", type: "小插图", author: "青禾", image: reimuBirthdayImages.birthdayCake },
    ],
  };

  return (assetsByTemplate[template.id] ?? fallbackAssets).slice(0, template.imageSlots);
}

function TemplatePreview({
  assets,
  body,
  layoutPlan,
  tags,
  template,
  title,
  activityTime,
}: {
  assets: PromoDraftAsset[];
  body: string;
  layoutPlan: LayoutPlan;
  tags: string[];
  template: PromoTemplate;
  title: string;
  activityTime: string;
}) {
  const isLong = template.category === "公众号";
  const visibleAssets = assets.slice(0, Math.max(template.imageSlots, layoutPlan.platform === "wechat" ? 4 : 1));
  const heroAsset = getHeroAsset(layoutPlan, assets);
  const bodyParagraphs = getBodyParagraphs(body);
  const primaryTags = (layoutPlan.xiaohongshuPlan?.hashtagStrategy.primaryTags ?? tags).slice(0, 3);

  if (template.id === "lofter-mood-poster") {
    return (
      <article
        className="mx-auto aspect-[3/4] w-[420px] max-w-full overflow-hidden"
        style={{
          ...getBackgroundImageStyle(heroAsset?.image, exportGradients[0]),
          color: "#FFFFFF",
          boxShadow: "none",
        }}
      >
        <div className="relative flex h-full flex-col justify-between overflow-hidden p-8">
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.34)" }} />
          <div className="relative z-10 flex items-center justify-between gap-4 text-xs font-black tracking-[0.18em]">
            <span>{layoutPlan.titlePlan.eyebrow ?? "OURchive 活动回顾"}</span>
            <span>{activityTime}</span>
          </div>
          <div className="relative z-10">
            <h2 className="text-5xl font-black leading-tight text-white">{renderTitleLines(layoutPlan, title)}</h2>
            {layoutPlan.titlePlan.subtitle ? <p className="mt-5 max-w-[18rem] text-sm font-semibold leading-7 text-white/88">{layoutPlan.titlePlan.subtitle}</p> : null}
          </div>
          <div className="relative z-10 flex items-end justify-between gap-6 text-xs font-bold leading-5 text-white/80">
            <span>{template.name}</span>
            <span className="text-right">{heroAsset?.title ?? "主视觉"}</span>
          </div>
        </div>
      </article>
    );
  }

  if (template.id === "lofter-work-memorial") {
    return (
      <article
        className="mx-auto aspect-[3/4] w-[420px] max-w-full overflow-hidden bg-white"
        style={{ color: "#111827", boxShadow: "none" }}
      >
        <div
          className="h-[58%] bg-cover bg-center"
          style={getBackgroundImageStyle(heroAsset?.image, exportGradients[2])}
        />
        <div className="space-y-4 p-8">
          <p className="text-xs font-black tracking-[0.18em]" style={{ color: "#64748B" }}>OURchive 群小记整理｜{activityTime}</p>
          <h2 className="text-4xl font-black leading-tight">{renderTitleLines(layoutPlan, title)}</h2>
          <div className="rounded-md p-4" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E5E7EB" }}>
            <p className="text-sm font-black">{heroAsset?.title ?? "作品主视觉"}</p>
            <p className="mt-1 text-xs font-semibold" style={{ color: "#64748B" }}>{heroAsset?.author ? `${heroAsset.author}｜` : ""}{heroAsset?.type ?? "作品素材"}</p>
          </div>
          {layoutPlan.titlePlan.subtitle ? <p className="text-sm leading-7" style={{ color: "#475569" }}>{layoutPlan.titlePlan.subtitle}</p> : null}
        </div>
      </article>
    );
  }

  if (template.id === "qqzone-cover-post" || template.id === "xhs-title-cover") {
    return (
      <article
        className={`mx-auto w-[520px] max-w-full overflow-hidden ${template.id === "xhs-title-cover" ? "aspect-[3/4]" : "aspect-[4/5]"}`}
        style={{
          ...getBackgroundImageStyle(heroAsset?.image, exportGradients[0]),
          color: "#FFFFFF",
          boxShadow: "none",
        }}
      >
        <div className="relative flex h-full flex-col justify-between p-8 text-center">
          <div className="absolute inset-0" style={{ backgroundColor: template.id === "qqzone-cover-post" ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.30)" }} />
          <div className="relative z-10 flex items-center justify-between gap-4 text-xs font-black tracking-[0.16em]" style={{ color: template.id === "qqzone-cover-post" ? "#0F172A" : "rgba(255,255,255,0.85)" }}>
            <span>{layoutPlan.titlePlan.eyebrow ?? "OURchive 活动回顾"}</span>
            <span>{activityTime}</span>
          </div>
          <div className="relative z-10 mx-auto max-w-[86%]">
            <h2 className="text-5xl font-black leading-tight" style={{ color: template.id === "qqzone-cover-post" ? "#0F172A" : "#FFFFFF" }}>{renderTitleLines(layoutPlan, title)}</h2>
            {layoutPlan.titlePlan.subtitle ? <p className="mx-auto mt-5 max-w-[22rem] text-sm font-semibold leading-7" style={{ color: template.id === "qqzone-cover-post" ? "#334155" : "rgba(255,255,255,0.88)" }}>{layoutPlan.titlePlan.subtitle}</p> : null}
          </div>
          <div className="relative z-10 flex flex-wrap justify-center gap-2">
            {primaryTags.map((tag, index) => (
              <span key={`cover-tag-${tag || "tag"}-${index}`} className="rounded-full px-3 py-1 text-xs font-black" style={{ backgroundColor: template.id === "qqzone-cover-post" ? "rgba(255,255,255,0.78)" : "rgba(219,39,119,0.72)", color: template.id === "qqzone-cover-post" ? "#0F172A" : "#FFFFFF" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    );
  }

  if (template.id === "qqzone-memory-card") {
    return (
      <article className="mx-auto w-[520px] max-w-full overflow-hidden bg-white" style={{ color: "#111827", boxShadow: "none" }}>
        <div
          className="relative grid aspect-[16/10] place-items-end overflow-hidden bg-cover bg-center p-6"
          style={getBackgroundImageStyle(heroAsset?.image, exportGradients[0])}
        >
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,255,255,0.28)" }} />
          <div className="relative z-10 w-full rounded-md bg-white/86 p-4 text-left">
            <p className="text-xs font-black" style={{ color: "#2563EB" }}>QQ空间动态｜{activityTime}</p>
            <h2 className="mt-2 text-3xl font-black leading-tight">{renderTitleLines(layoutPlan, title)}</h2>
          </div>
        </div>
        <div className="space-y-4 p-7">
          <p className="whitespace-pre-line text-sm font-semibold leading-7" style={{ color: "#334155" }}>{bodyParagraphs.slice(0, 2).join("\n\n")}</p>
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            {visibleAssets.slice(1, 3).map((asset, index) => (
              <div key={`qq-memory-asset-${asset.id ?? asset.title ?? "asset"}-${index}`} className="rounded-md p-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                <p className="truncate text-xs font-black">{asset.title}</p>
                <p className="mt-1 truncate text-[11px]" style={{ color: "#64748B" }}>{asset.author ? `${asset.author}｜` : ""}{asset.type}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    );
  }

  if (template.id === "xhs-scrapbook-cover") {
    return (
      <article
        className="mx-auto aspect-[3/4] w-[520px] max-w-full overflow-hidden"
        style={{ ...getBackgroundImageStyle(heroAsset?.image, exportGradients[1]), color: "#111827", boxShadow: "none" }}
      >
        <div className="relative h-full p-7">
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,255,255,0.42)" }} />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex justify-between text-xs font-black tracking-[0.16em]" style={{ color: "#DB2777" }}>
              <span>小红书首图</span>
              <span>{activityTime}</span>
            </div>
            <div className="relative">
              <div className="absolute -left-3 -top-7 rotate-[-8deg] rounded-sm px-4 py-1 text-xs font-black" style={{ backgroundColor: "#FDE68A", color: "#92400E" }}>OURchive</div>
              <h2 className="rounded-md bg-white/88 p-5 text-5xl font-black leading-tight shadow-sm">{renderTitleLines(layoutPlan, title)}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {primaryTags.map((tag, index) => (
                  <span key={`xhs-scrap-tag-${tag || "tag"}-${index}`} className="rounded-full px-3 py-1 text-xs font-black" style={{ backgroundColor: "#FCE7F3", color: "#BE185D" }}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {visibleAssets.slice(1, 3).map((asset, index) => (
                <div key={`xhs-scrap-asset-${asset.id ?? asset.title ?? "asset"}-${index}`} className="rotate-[-2deg] rounded-md bg-white p-2 shadow-sm">
                  <div className="aspect-[4/3] rounded bg-cover bg-center" style={getBackgroundImageStyle(asset.image, exportGradients[index])} />
                  <p className="mt-2 truncate text-[11px] font-black">{asset.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (template.id === "wechat-works-showcase") {
    return (
      <article className="mx-auto min-h-[720px] w-[520px] max-w-full overflow-hidden bg-white" style={{ color: "#111827", boxShadow: "none" }}>
        <div
          className="relative grid aspect-[2.35/1] place-items-center overflow-hidden bg-cover bg-center p-8 text-center"
          style={getBackgroundImageStyle(heroAsset?.image, exportGradients[0])}
        >
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(15,23,42,0.30)" }} />
          <div className="relative z-10">
            <p className="text-xs font-black tracking-[0.18em] text-white/80">公众号作品展示｜{activityTime}</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-white">{renderTitleLines(layoutPlan, title)}</h2>
          </div>
        </div>
        <div className="space-y-4 p-7">
          {bodyParagraphs[0] ? <p className="text-sm leading-7" style={{ color: "#475569" }}>{bodyParagraphs[0]}</p> : null}
          <div className="space-y-3">
            {visibleAssets.slice(0, 4).map((asset, index) => (
              <section key={`wechat-work-card-${asset.id ?? asset.title ?? "asset"}-${index}`} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 rounded-md p-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                <div className="aspect-[4/3] rounded-md bg-cover bg-center" style={getBackgroundImageStyle(asset.image, exportGradients[index % exportGradients.length])} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{asset.title}</p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: "#64748B" }}>{asset.author ? `${asset.author}｜` : ""}{asset.type}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5" style={{ color: "#475569" }}>{asset.description ?? asset.reason ?? "活动作品展示素材。"}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`mx-auto overflow-hidden ${
        isLong ? "min-h-[720px] w-[520px] max-w-full" : "aspect-[3/4] w-[420px] max-w-full"
      }`}
      style={{
        backgroundColor: "#FFFFFF",
        color: "#111827",
        boxShadow: "none",
      }}
    >
      <div
        className={`relative grid ${isLong ? "aspect-[2.35/1]" : "h-1/2"} place-items-center overflow-hidden p-8 text-center`}
        style={{
          ...getBackgroundImageStyle(heroAsset?.image, exportGradients[0]),
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: heroAsset?.image ? "rgba(15,23,42,0.30)" : "rgba(255,255,255,0.10)" }} />
        <div className="relative z-10 max-w-[86%] px-4 py-3">
          <p className="text-sm font-black tracking-[0.16em]" style={{ color: heroAsset?.image ? "#FFFFFF" : "#2563EB" }}>
            {layoutPlan.titlePlan.eyebrow ?? activityTime}
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight" style={{ color: heroAsset?.image ? "#FFFFFF" : "#111827" }}>
            {renderTitleLines(layoutPlan, title)}
          </h2>
          {layoutPlan.titlePlan.subtitle ? (
            <p className="mt-4 text-sm font-semibold leading-6" style={{ color: heroAsset?.image ? "rgba(255,255,255,0.88)" : "#374151" }}>
              {layoutPlan.titlePlan.subtitle}
            </p>
          ) : null}
          <p className="mt-3 text-xs font-bold" style={{ color: heroAsset?.image ? "rgba(255,255,255,0.78)" : "#2563EB" }}>
            {template.name}｜{activityTime}
          </p>
        </div>
      </div>
      <div className="space-y-5 p-7">
        {layoutPlan.platform === "wechat" && layoutPlan.wechatPlan ? (
          <div className="space-y-5">
            {layoutPlan.wechatPlan.longImageSections.map((section, index) => {
              const { sectionOrder, sectionTitle, sectionText, sectionAssetIds } = getSafeWechatSection(section, index);
              const sectionAssets = getAssetsByIds(sectionAssetIds, layoutPlan, assets);
              return (
                <section key={`wechat-section-${sectionOrder}-${sectionTitle}-${index}`} className="rounded-md p-4" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                  <p className="text-xs font-black" style={{ color: "#2563EB" }}>
                    {String(sectionOrder).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-xl font-black" style={{ color: "#111827" }}>
                    {sectionTitle}
                  </h3>
                  {section.sectionSubtitle ? <p className="mt-1 text-xs font-bold" style={{ color: "#64748B" }}>{section.sectionSubtitle}</p> : null}
                  <p className="mt-3 text-sm leading-7" style={{ color: "#374151" }}>{sectionText}</p>
                  {sectionAssets.length > 0 ? (
                    <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: sectionAssets.length > 1 ? "repeat(2, minmax(0, 1fr))" : "1fr" }}>
                      {sectionAssets.slice(0, 2).map((asset, assetIndex) => (
                        <div key={`wechat-section-asset-${sectionOrder}-${asset.id ?? asset.title ?? "asset"}-${assetIndex}`} className="grid aspect-[4/3] place-items-center rounded-md bg-cover bg-center p-2 text-center" style={{ ...getBackgroundImageStyle(asset.image, exportGradients[0]), border: "1px solid #E5E7EB" }}>
                          <span className="rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: "#FFFFFF", color: "#374151" }}>{asset.title}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })}
            <section className="rounded-md p-4" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E5E7EB" }}>
              <h3 className="text-xl font-black" style={{ color: "#111827" }}>{layoutPlan.wechatPlan.endingModule.title}</h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "#374151" }}>{layoutPlan.wechatPlan.endingModule.text}</p>
              {layoutPlan.wechatPlan.endingModule.callToAction ? <p className="mt-2 text-xs font-bold" style={{ color: "#2563EB" }}>{layoutPlan.wechatPlan.endingModule.callToAction}</p> : null}
            </section>
          </div>
        ) : (
          <div className="space-y-3">
            {layoutPlan.contentPlan.slice(0, 3).map((section, index) => {
              const { sectionTitle, sectionText } = getSafeContentSection(section, index);
              return (
              <section key={`${section.id || "section"}-${index}-${sectionTitle}`} className="rounded-md p-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                <h3 className="text-sm font-black" style={{ color: "#111827" }}>{sectionTitle}</h3>
                <p className="mt-1 text-sm leading-7" style={{ color: "#374151" }}>{sectionText}</p>
                {section.highlightSentence ? <p className="mt-2 text-xs font-bold" style={{ color: "#DB2777" }}>{section.highlightSentence}</p> : null}
              </section>
              );
            })}
          </div>
        )}
        <div className={`grid gap-3 ${visibleAssets.length > 1 ? "grid-cols-3" : "grid-cols-1"}`}>
          {visibleAssets.map((asset, index) => (
            <div
              key={`visible-asset-${asset.id ?? asset.title ?? asset.image ?? "asset"}-${index}`}
              className="grid aspect-[4/3] place-items-center rounded-md bg-cover bg-center p-2 text-center"
              style={{
                ...getBackgroundImageStyle(asset.image, exportGradients[index % exportGradients.length]),
                border: "1px solid #E5E7EB",
              }}
            >
              <span
                className="rounded-full px-2 py-1 text-[11px] font-bold"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#374151",
                }}
              >
                {asset.title}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(layoutPlan.xiaohongshuPlan?.hashtagStrategy.primaryTags ?? tags).slice(0, 5).map((tag, index) => (
            <span key={`preview-tag-${tag || "tag"}-${index}`} className="rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function PromoEditorContent() {
  const searchParams = useSearchParams();
  const activity = getPromoActivity(searchParams.get("activity") || "reimu-birthday");
  const initialPlatform = readPlatform(searchParams.get("platform"));
  const initialStyle = readStyle(searchParams.get("style"));
  const initialCopy = useMemo(() => getPromoCopy(initialPlatform, initialStyle, activity), [activity, initialPlatform, initialStyle]);
  const defaultDraft = useMemo(() => getDefaultPromoDraft(activity, initialPlatform, initialStyle), [activity, initialPlatform, initialStyle]);
  const storedDraft = useSyncExternalStore(
    useCallback((onStoreChange) => subscribePromoDraft(activity.id, onStoreChange), [activity.id]),
    useCallback(() => loadPromoDraft(activity), [activity]),
    () => null,
  );
  const activeDraft = storedDraft ?? defaultDraft;
  const draftPlatform = promoPlatforms.includes(activeDraft.platform as PromoPlatform) ? (activeDraft.platform as PromoPlatform) : initialPlatform;

  const [selectedTemplateOverride, setSelectedTemplateOverride] = useState<string | null>(null);
  const [titleOverride, setTitleOverride] = useState<string | null>(null);
  const [bodyOverride, setBodyOverride] = useState<string | null>(null);
  const [tagsOverride, setTagsOverride] = useState<string[] | null>(null);
  const [layoutAdviceOverride, setLayoutAdviceOverride] = useState<string | null>(null);
  const [assetOverrides, setAssetOverrides] = useState<Record<string, string>>({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const layoutPlan = activeDraft.layoutPlan;
  const visibleTemplates = useMemo(() => getVisibleTemplates(draftPlatform), [draftPlatform]);
  const recommendedTemplateId = resolveTemplateId(layoutPlan.templateRecommendation.templateId, mapPromoPlatformToLayoutPlatform(draftPlatform)) || getRecommendedTemplateId(draftPlatform);
  const selectedTemplateId =
    selectedTemplateOverride && visibleTemplates.some((template) => template.id === selectedTemplateOverride)
      ? selectedTemplateOverride
      : recommendedTemplateId;
  const title = titleOverride ?? activeDraft.title ?? initialCopy.title;
  const body = bodyOverride ?? activeDraft.body ?? initialCopy.body;
  const tags = tagsOverride ?? activeDraft.tags ?? initialCopy.tags;
  const layoutAdvice = layoutAdviceOverride ?? activeDraft.layoutAdvice ?? initialCopy.layout;
  const matchedAssets = activeDraft.matchedAssets.length > 0 ? activeDraft.matchedAssets : defaultDraft.matchedAssets;
  const draftStatus = storedDraft ? "已载入小记宣发草稿" : "当前使用默认示例文案";

  useEffect(() => {
    setSelectedTemplateOverride(null);
  }, [activity.id, draftPlatform]);

  useEffect(() => {
    setAssetOverrides({});
  }, [activity.id]);

  const selectedTemplate = useMemo(
    () => visibleTemplates.find((template) => template.id === selectedTemplateId) ?? visibleTemplates[0] ?? promoTemplates[0],
    [selectedTemplateId, visibleTemplates],
  );
  const assetLibrary = useMemo(
    () =>
      dedupeAssets([
        ...matchedAssets,
        ...defaultDraft.matchedAssets,
        ...activity.images.map((image, index) => imageToDraftAsset(image, activity.works, index)),
        ...activity.works.map((work, index) => workToDraftAsset(work, index)),
      ]),
    [activity.images, activity.works, defaultDraft.matchedAssets, matchedAssets],
  );
  const templateAssets = useMemo(() => {
    const plannedAssets = getPlannedAssets(layoutPlan, matchedAssets);
    const baseAssets = (plannedAssets.length > 0 ? plannedAssets : getTemplateAssets(activity.id, selectedTemplate, matchedAssets)).slice(0, Math.max(selectedTemplate.imageSlots, layoutPlan.platform === "wechat" ? 4 : 1));
    return baseAssets.map((asset, index) => {
      const slotId = getAssetSlotId(asset, index);
      return resolveAssetForSlot({
        assetLibrary,
        originalAsset: asset,
        overrides: assetOverrides,
        slotId,
      });
    });
  }, [activity.id, assetLibrary, assetOverrides, layoutPlan, matchedAssets, selectedTemplate]);

  const handleDownloadPNG = useCallback(async () => {
    if (!previewRef.current || isDownloading) return;

    setIsDownloading(true);
    setDownloadError("");
    setDownloadStatus("");

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "reimu-birthday-promo.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadStatus("PNG 已保存");
    } catch (error) {
      console.error("Failed to export PNG", error);
      setDownloadError("导出失败，请稍后重试。");
      alert("导出失败，请稍后重试");
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading]);

  return (
    <div className="h-screen overflow-hidden bg-[#dfeaf5] p-4 text-slate-900">
      <div className="mx-auto flex h-full max-w-[1480px] flex-col overflow-hidden rounded-[18px] border border-white/80 bg-white shadow-2xl shadow-slate-300/70">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
          <div className="flex items-center gap-3">
            <Link href={`/promo?activity=${encodeURIComponent(activity.id)}`} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-sky-600">
              返回宣发素材
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-950">宣发模板编辑</h1>
              <p className="text-xs text-slate-500">当前活动：{activity.name}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{draftStatus}</span>
          </div>
          <button
            type="button"
            onClick={handleDownloadPNG}
            disabled={isDownloading}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isDownloading ? "正在导出..." : "下载 PNG"}
          </button>
        </header>

        <main className="grid min-h-0 flex-1 grid-cols-[340px_minmax(0,1fr)_360px] gap-4 bg-[#edf5fb] p-4">
          <aside className="min-h-0 overflow-y-auto rounded-[18px] bg-white p-4 shadow-sm [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            <h2 className="text-base font-bold text-slate-950">模板</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">当前平台：{draftPlatform}，已默认匹配推荐排版。</p>
            <div className="mt-3 space-y-2">
              {visibleTemplates.map((template, index) => (
                <button
                  key={`template-${template.id}-${index}`}
                  type="button"
                  onClick={() => setSelectedTemplateOverride(template.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedTemplateId === template.id ? "border-sky-300 bg-sky-50 text-sky-900" : "border-slate-100 bg-slate-50 text-slate-700 hover:border-sky-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold">{template.name}</span>
                    <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500">{template.category}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{template.description}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="min-h-0 overflow-y-auto rounded-[18px] bg-slate-100 p-6 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            <div
              ref={previewRef}
              id="promo-export-area"
              className="mx-auto w-fit"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#111827",
                boxShadow: "none",
              }}
            >
              <TemplatePreview assets={templateAssets} body={body} layoutPlan={layoutPlan} tags={tags} template={selectedTemplate} title={title} activityTime={activity.time} />
            </div>
          </section>

          <aside className="min-h-0 overflow-y-auto rounded-[18px] bg-white p-4 shadow-sm [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            <h2 className="text-base font-bold text-slate-950">文案草稿</h2>
            {downloadError ? <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">{downloadError}</p> : null}
            {downloadStatus ? <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">{downloadStatus}</p> : null}
            <label className="mt-4 block text-xs font-bold text-slate-500">
              标题
              <textarea
                value={title}
                onChange={(event) => setTitleOverride(event.target.value)}
                className="mt-2 min-h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white"
              />
            </label>
            <label className="mt-4 block text-xs font-bold text-slate-500">
              正文
              <textarea
                value={body}
                onChange={(event) => setBodyOverride(event.target.value)}
                className="mt-2 min-h-80 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white"
              />
            </label>
            <label className="mt-4 block text-xs font-bold text-slate-500">
              标签
              <textarea
                value={tags.join(" ")}
                onChange={(event) => setTagsOverride(event.target.value.split(/\s+/).filter(Boolean))}
                className="mt-2 min-h-20 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white"
              />
            </label>
            <label className="mt-4 block text-xs font-bold text-slate-500">
              小记排版建议
              <textarea
                value={layoutAdvice}
                onChange={(event) => setLayoutAdviceOverride(event.target.value)}
                className="mt-2 min-h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white"
              />
            </label>
            <section className="mt-4 rounded-xl bg-sky-50 p-3">
              <p className="text-xs font-bold text-sky-800">小记排版计划</p>
              <div className="mt-2 space-y-1.5 text-xs leading-5 text-slate-600">
                <p>推荐模板：{selectedTemplate.name}</p>
                <p>标题断行：{layoutPlan.titlePlan.titleLines.join(" / ")}</p>
                <p>重点词：{layoutPlan.titlePlan.highlightWords.join(" / ") || "无"}</p>
                <p>主视觉：{getHeroAsset(layoutPlan, templateAssets)?.title ?? "未匹配"}</p>
                <p>图片角色：{layoutPlan.assetPlan.slice(0, 5).map((asset) => `${asset.title || "素材"}=${asset.role || "support"}`).join("；")}</p>
                {layoutPlan.xiaohongshuPlan ? (
                  <p>
                    正文结构：
                    {layoutPlan.xiaohongshuPlan.pagePlan
                      .map((page, index) => {
                        const { pageNumber, pageTitle } = getSafeXiaohongshuPage(page, index);
                        return `P${pageNumber} ${pageTitle}`;
                      })
                      .join(" / ")}
                  </p>
                ) : null}
                {layoutPlan.wechatPlan ? <p>正文结构：{layoutPlan.wechatPlan.longImageSections.map((section, index) => getSafeWechatSection(section, index).sectionTitle).join(" / ")}</p> : null}
              </div>
            </section>
            {layoutPlan.xiaohongshuPlan ? (
              <section className="mt-4 rounded-xl bg-rose-50 p-3">
                <p className="text-xs font-bold text-rose-800">小红书正文分页建议</p>
                <div className="mt-2 space-y-2 text-xs leading-5 text-slate-600">
                  <p className="font-semibold text-slate-800">{layoutPlan.xiaohongshuPlan.noteStructure.hook}</p>
                  {layoutPlan.xiaohongshuPlan.pagePlan.map((page, index) => {
                    const { pageNumber, pageTitle, pageNote } = getSafeXiaohongshuPage(page, index);
                    return (
                      <div key={`xhs-page-${pageNumber}-${page.pageType ?? "text-card"}-${page.title ?? "untitled"}-${index}`} className="rounded-lg bg-white/70 px-3 py-2">
                        <p className="font-bold text-slate-800">P{pageNumber}｜{pageTitle}：</p>
                        <p className="mt-1 text-slate-600">{pageNote}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}
            <section className="mt-4 rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-bold text-slate-500">已匹配素材</p>
              <div className="mt-2 space-y-2">
                {templateAssets.map((asset, index) => (
                  <div key={`matched-asset-${asset.id ?? asset.title ?? asset.image ?? "asset"}-${index}`} className="rounded-lg bg-white p-2 text-xs leading-5 text-slate-600">
                    <div className="flex gap-2">
                      <div
                        className="h-14 w-20 shrink-0 rounded-md bg-cover bg-center"
                        style={getBackgroundImageStyle(asset.image, exportGradients[index % exportGradients.length])}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-slate-800">{asset.title}</p>
                        <p>{asset.type}{asset.author ? `｜${asset.author}` : ""}</p>
                        <p className="line-clamp-2 text-[11px] text-slate-500">{asset.description ?? asset.reason ?? "适合作为当前活动的宣发素材。"}</p>
                      </div>
                    </div>
                    <label className="mt-2 block text-[11px] font-bold text-slate-500">
                      图片选择
                      <select
                        value={(asset as ResolvedPromoAsset).selectedAssetId ?? getAssetLibraryItemId(asset, index)}
                        onChange={(event) => {
                          const slotId = (asset as ResolvedPromoAsset).slotId ?? getAssetSlotId(asset, index);
                          setAssetOverrides((current) => ({ ...current, [slotId]: event.target.value }));
                        }}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white"
                      >
                        <option value="">渐变占位</option>
                        {assetLibrary.map((libraryAsset, assetIndex) => (
                          <option key={`asset-option-${getAssetLibraryItemId(libraryAsset, assetIndex)}-${assetIndex}`} value={getAssetLibraryItemId(libraryAsset, assetIndex)}>
                            {libraryAsset.title}{libraryAsset.author ? `｜${libraryAsset.author}` : ""}{libraryAsset.type ? `｜${libraryAsset.type}` : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default function PromoEditorPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#dfeaf5] text-sm font-semibold text-slate-600">正在打开宣发编辑器...</div>}>
      <PromoEditorContent />
    </Suspense>
  );
}
