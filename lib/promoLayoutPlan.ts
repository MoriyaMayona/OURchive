import { promoTemplates, type PromoPlatform, type PromoStyle } from "@/lib/promoData";
import type { PromoActivityData } from "@/lib/promoActivities";

export type LayoutPlatform = "poster" | "xiaohongshu" | "wechat" | "qqzone" | "lofter";
export type LayoutCategory = "image-cover" | "xiaohongshu-cover-plus-notes" | "wechat-longform" | "qqzone-post";
export type VisualStyle = "dreamy-minimal" | "scrapbook-collage" | "magazine-editorial" | "text-driven" | "film-moodboard" | "soft-community";

export type PromoLayoutAsset = {
  id?: string;
  title: string;
  type: string;
  author?: string;
  description?: string;
  reason?: string;
  image?: string;
};

export type TitlePlan = {
  rawTitle: string;
  titleLines: string[];
  highlightWords: string[];
  subtitle?: string;
  eyebrow?: string;
  titleTone: "warm" | "energetic" | "editorial" | "poetic" | "structured" | "community";
  titleLayout: "center-large" | "left-stacked" | "overlay-on-image" | "top-banner" | "magazine-title" | "card-title";
};

export type AssetPlanItem = {
  assetId: string;
  title: string;
  image?: string;
  author?: string;
  type: string;
  role: "hero" | "support" | "detail" | "process" | "cover" | "texture" | "ending";
  priority: number;
  usage: "main-visual" | "cover-image" | "collage-tile" | "body-illustration" | "process-proof" | "author-work" | "ending-card";
  cropHint: "center" | "top" | "bottom" | "left" | "right" | "full" | "square" | "vertical" | "horizontal";
  caption?: string;
  pairingReason: string;
};

export type ContentSection = {
  id: string;
  sectionType:
    | "hook"
    | "intro"
    | "activity-background"
    | "process"
    | "work-highlight"
    | "member-contribution"
    | "emotion"
    | "summary"
    | "call-to-action"
    | "quote"
    | "tag-block";
  heading?: string;
  text: string;
  bullets?: string[];
  highlightSentence?: string;
  relatedAssetIds?: string[];
  layoutHint: "text-only" | "image-first" | "text-first" | "two-column" | "quote-card" | "image-grid" | "timeline" | "list-card";
  pageSuggestion?: number;
};

export type XiaohongshuPlan = {
  coverType: "strong-title-cover" | "scrapbook-cover" | "multi-image-cover" | "text-driven-cover" | "soft-mood-cover";
  noteStructure: {
    hook: string;
    bodyParagraphs: string[];
    highlightBullets: string[];
    ending: string;
  };
  pagePlan: {
    page: number;
    pageType: "cover" | "image-story" | "text-card" | "work-grid" | "highlight-list" | "ending-card";
    title?: string;
    text?: string;
    assetIds?: string[];
    designNote: string;
  }[];
  symbolStyle: {
    tone: "light-cute" | "clean" | "doujin" | "editorial";
    recommendedMarkers: string[];
    emojiLevel: "none" | "light" | "medium";
  };
  hashtagStrategy: {
    primaryTags: string[];
    secondaryTags: string[];
    tagPlacement: "caption-end" | "image-footer" | "both";
  };
};

export type WechatPlan = {
  articleStructure: {
    heading: string;
    purpose: string;
    recommendedAssetIds: string[];
  }[];
  longImageSections: {
    order: number;
    sectionTitle: string;
    sectionSubtitle?: string;
    text: string;
    assetIds: string[];
    layout: "hero-section" | "text-image" | "image-text" | "two-column" | "work-list" | "timeline" | "summary-card";
    reason: string;
  }[];
  imageTextPairing: {
    assetId: string;
    pairedText: string;
    reason: string;
  }[];
  endingModule: {
    title: string;
    text: string;
    callToAction?: string;
  };
};

export type PosterPlan = {
  posterType: "event-key-visual" | "completion-poster" | "anthology-cover" | "recruitment-poster" | "work-collage";
  composition: "single-hero-image" | "image-background-title-overlay" | "collage-grid" | "magazine-cover" | "center-title-surrounding-assets";
  keyVisualAssetId: string;
  supportingAssetIds: string[];
  textBlocks: {
    role: "eyebrow" | "main-title" | "subtitle" | "date" | "tagline" | "footer";
    text: string;
    placement: "top-left" | "top-center" | "top-right" | "center" | "bottom-left" | "bottom-center" | "bottom-right";
  }[];
  moodKeywords: string[];
};

export type TypographyHint = {
  titleSize: "large" | "extra-large" | "display";
  titleWeight: "bold" | "heavy" | "serif-display";
  bodyStyle: "short-lines" | "structured" | "editorial" | "caption";
  alignment: "left" | "center" | "mixed";
  lineBreakStrategy: "manual-title-lines" | "auto-wrap" | "short-sentence-blocks";
};

export type DecorationHint = {
  density: "none" | "light" | "medium";
  elements: ("stickers" | "stars" | "ribbons" | "tape" | "quote-mark" | "date-chip" | "tag-pills" | "paper-texture" | "film-frame" | "handwritten-note")[];
  colorMood: "soft-blue" | "pink-blue" | "warm-cream" | "black-editorial" | "red-white" | "pastel";
};

export type ExportHint = {
  exportAspectRatio: "3:4" | "4:5" | "1:1" | "9:16" | "long-image";
  recommendedWidth: number;
  recommendedHeight: number;
  safeAreaNote: string;
};

export type LayoutPlan = {
  version: "1.0";
  platform: LayoutPlatform;
  layoutCategory: LayoutCategory;
  visualStyle: VisualStyle;
  templateRecommendation: {
    templateId: string;
    templateName: string;
    reason: string;
  };
  titlePlan: TitlePlan;
  assetPlan: AssetPlanItem[];
  contentPlan: ContentSection[];
  xiaohongshuPlan?: XiaohongshuPlan;
  wechatPlan?: WechatPlan;
  posterPlan?: PosterPlan;
  typographyHint: TypographyHint;
  decorationHint: DecorationHint;
  exportHint: ExportHint;
};

const validVisualStyles = new Set<VisualStyle>(["dreamy-minimal", "scrapbook-collage", "magazine-editorial", "text-driven", "film-moodboard", "soft-community"]);
const validTitleLayouts = new Set<TitlePlan["titleLayout"]>(["center-large", "left-stacked", "overlay-on-image", "top-banner", "magazine-title", "card-title"]);
const validTitleTones = new Set<TitlePlan["titleTone"]>(["warm", "energetic", "editorial", "poetic", "structured", "community"]);
const validRoles = new Set<AssetPlanItem["role"]>(["hero", "support", "detail", "process", "cover", "texture", "ending"]);
const validUsages = new Set<AssetPlanItem["usage"]>(["main-visual", "cover-image", "collage-tile", "body-illustration", "process-proof", "author-work", "ending-card"]);
const validCropHints = new Set<AssetPlanItem["cropHint"]>(["center", "top", "bottom", "left", "right", "full", "square", "vertical", "horizontal"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function stringArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : fallback;
}

function numberValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function slugify(value: string, fallback: string) {
  const slug = value
    .toLowerCase()
    .replace(/[《》「」"'“”]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function splitTitle(title: string) {
  if (title.length <= 14) return [title];
  const separators = ["｜", "：", "——", "-", " "];
  for (const separator of separators) {
    if (title.includes(separator)) return title.split(separator).map((line) => line.trim()).filter(Boolean).slice(0, 3);
  }

  const first = Math.ceil(title.length / 3);
  const second = Math.ceil((title.length - first) / 2);
  return [title.slice(0, first), title.slice(first, first + second), title.slice(first + second)].filter(Boolean);
}

export function mapPromoPlatformToLayoutPlatform(platform: PromoPlatform | string): LayoutPlatform {
  if (platform === "小红书") return "xiaohongshu";
  if (platform === "公众号") return "wechat";
  if (platform === "Lofter") return "lofter";
  return "qqzone";
}

function getFallbackTemplateId(platform: LayoutPlatform) {
  if (platform === "xiaohongshu") return promoTemplates.find((template) => template.id === "redbook-cover")?.id ?? "redbook-grid";
  if (platform === "wechat") return promoTemplates.find((template) => template.id === "wechat-review")?.id ?? "wechat-works";
  if (platform === "poster") return "poster-birthday";
  return promoTemplates.find((template) => template.id === "poster-collection")?.id ?? "poster-birthday";
}

export function resolveTemplateId(templateId: string | undefined, platform: LayoutPlatform) {
  if (templateId && promoTemplates.some((template) => template.id === templateId)) return templateId;
  return getFallbackTemplateId(platform);
}

function getTemplateName(templateId: string) {
  return promoTemplates.find((template) => template.id === templateId)?.name ?? "社群合辑展示模板";
}

function getLayoutCategory(platform: LayoutPlatform): LayoutCategory {
  if (platform === "xiaohongshu") return "xiaohongshu-cover-plus-notes";
  if (platform === "wechat") return "wechat-longform";
  if (platform === "qqzone") return "qqzone-post";
  return "image-cover";
}

function getVisualStyle(platform: LayoutPlatform, style: PromoStyle | string): VisualStyle {
  if (platform === "xiaohongshu") return "scrapbook-collage";
  if (platform === "wechat") return "magazine-editorial";
  if (style === "文艺") return "film-moodboard";
  if (style === "官方") return "text-driven";
  return "soft-community";
}

function exportHintForPlatform(platform: LayoutPlatform): ExportHint {
  if (platform === "xiaohongshu") {
    return { exportAspectRatio: "4:5", recommendedWidth: 1080, recommendedHeight: 1350, safeAreaNote: "标题和标签避开上下 96px，避免平台裁切。" };
  }
  if (platform === "wechat") {
    return { exportAspectRatio: "long-image", recommendedWidth: 900, recommendedHeight: 1800, safeAreaNote: "长图分段之间保留留白，正文不贴边。" };
  }
  return { exportAspectRatio: "3:4", recommendedWidth: 1080, recommendedHeight: 1440, safeAreaNote: "主标题放在中心安全区，底部保留作者与活动信息。" };
}

function normalizeAssets(activity: PromoActivityData, assets: PromoLayoutAsset[]): PromoLayoutAsset[] {
  const source: PromoLayoutAsset[] =
    assets.length > 0
      ? assets
      : activity.images.map((item) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          description: item.motif,
          image: item.image,
        }));
  return source.map((asset, index) => {
    const title = stringValue(asset.title, activity.works[index]?.title ?? `素材 ${index + 1}`);
    const sourceImage = activity.images.find((item) => item.title === title || item.id === asset.id);
    const sourceWork = activity.works.find((work) => work.title === title);
    return {
      id: asset.id ?? sourceImage?.id ?? slugify(title, `asset-${index + 1}`),
      title,
      type: stringValue(asset.type, sourceWork?.type ?? sourceImage?.type ?? "作品素材"),
      author: asset.author ?? sourceWork?.author,
      description: asset.description ?? asset.reason ?? sourceImage?.motif,
      reason: asset.reason,
      image: asset.image ?? sourceImage?.image ?? sourceWork?.image,
    };
  });
}

function buildAssetPlan(activity: PromoActivityData, assets: PromoLayoutAsset[]): AssetPlanItem[] {
  return normalizeAssets(activity, assets).map((asset, index) => {
    const role: AssetPlanItem["role"] = index === 0 ? "hero" : index === 1 ? "support" : asset.type.includes("草稿") || asset.type.includes("分镜") ? "process" : "detail";
    const usage: AssetPlanItem["usage"] = index === 0 ? "main-visual" : role === "process" ? "process-proof" : "collage-tile";
    return {
      assetId: asset.id ?? slugify(asset.title, `asset-${index + 1}`),
      title: asset.title,
      image: asset.image,
      author: asset.author,
      type: asset.type,
      role,
      priority: index + 1,
      usage,
      cropHint: index === 0 ? "vertical" : "center",
      caption: asset.author ? `${asset.type}｜${asset.author}` : asset.type,
      pairingReason: asset.description ?? asset.reason ?? "适合作为当前活动的宣发素材。",
    };
  });
}

function buildContentPlan(activity: PromoActivityData, copy: { body: string }, assetPlan: AssetPlanItem[]): ContentSection[] {
  const heroAssetId = assetPlan[0]?.assetId;
  const supportIds = assetPlan.slice(1, 4).map((asset) => asset.assetId);
  return [
    {
      id: "hook",
      sectionType: "hook",
      heading: "活动亮点",
      text: activity.summary,
      highlightSentence: "这次活动的作品和过程都值得被好好整理出来。",
      relatedAssetIds: heroAssetId ? [heroAssetId] : [],
      layoutHint: "image-first",
      pageSuggestion: 1,
    },
    {
      id: "works",
      sectionType: "work-highlight",
      heading: "作品成果",
      text: copy.body.split("\n").find((line) => line.trim()) ?? activity.summary,
      bullets: activity.works.slice(0, 4).map((work) => `${work.title}｜${work.author}｜${work.type}`),
      relatedAssetIds: supportIds,
      layoutHint: "image-grid",
      pageSuggestion: 2,
    },
    {
      id: "ending",
      sectionType: "summary",
      heading: "记录沉淀",
      text: "把活动缘起、创作过程、作品成果和成员贡献放在同一套宣发里，方便之后复盘与展示。",
      relatedAssetIds: assetPlan.slice(-1).map((asset) => asset.assetId),
      layoutHint: "quote-card",
      pageSuggestion: 3,
    },
  ];
}

function buildXiaohongshuPlan(activity: PromoActivityData, title: string, tags: string[], assetPlan: AssetPlanItem[]): XiaohongshuPlan {
  const markers = ["✦", "♡", "·"];
  return {
    coverType: assetPlan.length >= 3 ? "scrapbook-cover" : "strong-title-cover",
    noteStructure: {
      hook: `${activity.name}整理好了。`,
      bodyParagraphs: [activity.summary, "从主视觉到过程稿，每一张素材都对应了活动里的一个瞬间。"],
      highlightBullets: activity.works.slice(0, 3).map((work) => work.type),
      ending: "这种松散但认真完成的共创感，很适合同好群。",
    },
    pagePlan: [
      {
        page: 1,
        pageType: "cover",
        title,
        assetIds: assetPlan.slice(0, 2).map((asset) => asset.assetId),
        designNote: "首图使用主视觉素材，叠加醒目断行标题和关键词标签。",
      },
      {
        page: 2,
        pageType: "work-grid",
        title: "作品一览",
        assetIds: assetPlan.slice(0, 6).map((asset) => asset.assetId),
        designNote: "用多图拼贴展示不同作品类型，让读者快速理解活动产出。",
      },
      {
        page: 3,
        pageType: "ending-card",
        title: "一起完成的记录",
        text: "把参与者、作品和过程都留在同一份归档里。",
        assetIds: assetPlan.slice(-1).map((asset) => asset.assetId),
        designNote: "结尾页放感谢与标签，适合收藏和转发。",
      },
    ],
    symbolStyle: {
      tone: "light-cute",
      recommendedMarkers: markers,
      emojiLevel: "light",
    },
    hashtagStrategy: {
      primaryTags: tags.slice(0, 3),
      secondaryTags: tags.slice(3, 6),
      tagPlacement: "both",
    },
  };
}

function buildWechatPlan(activity: PromoActivityData, assetPlan: AssetPlanItem[]): WechatPlan {
  const heroAssetId = assetPlan[0]?.assetId ?? "hero";
  return {
    articleStructure: [
      { heading: "活动缘起", purpose: "交代活动为什么发起，以及社群如何参与。", recommendedAssetIds: [heroAssetId] },
      { heading: "创作过程", purpose: "展示素材从认领、草稿到整理的过程。", recommendedAssetIds: assetPlan.slice(1, 3).map((asset) => asset.assetId) },
      { heading: "作品成果", purpose: "集中展示本次活动产出的作品类型。", recommendedAssetIds: assetPlan.slice(0, 4).map((asset) => asset.assetId) },
    ],
    longImageSections: [
      {
        order: 1,
        sectionTitle: "活动缘起",
        text: activity.summary,
        assetIds: [heroAssetId],
        layout: "hero-section",
        reason: "主视觉最能概括活动整体成果，适合作为公众号头图。",
      },
      {
        order: 2,
        sectionTitle: "作品成果",
        text: "本次宣发建议把不同类型的作品放在同一段里展示，形成完整的活动回顾。",
        assetIds: assetPlan.slice(0, 4).map((asset) => asset.assetId),
        layout: "work-list",
        reason: "作品列表可以同时呈现作者、类型和素材缩略图。",
      },
      {
        order: 3,
        sectionTitle: "经验沉淀",
        text: "保留投稿信息、作者署名和素材用途，方便后续复盘与二次宣发。",
        assetIds: assetPlan.slice(-1).map((asset) => asset.assetId),
        layout: "summary-card",
        reason: "结尾总结适合沉淀为可复用经验。",
      },
    ],
    imageTextPairing: assetPlan.slice(0, 4).map((asset) => ({
      assetId: asset.assetId,
      pairedText: `${asset.title} 适合放在${asset.role === "hero" ? "开头主视觉" : "作品展示"}段落。`,
      reason: asset.pairingReason,
    })),
    endingModule: {
      title: "经验沉淀",
      text: "统一素材、文案和排版计划后，活动记录会更容易被再次使用。",
      callToAction: "更多活动记录可在群创档案中查看。",
    },
  };
}

function buildPosterPlan(activity: PromoActivityData, title: string, assetPlan: AssetPlanItem[]): PosterPlan {
  const heroAssetId = assetPlan[0]?.assetId ?? "hero";
  return {
    posterType: "completion-poster",
    composition: assetPlan.length > 1 ? "image-background-title-overlay" : "single-hero-image",
    keyVisualAssetId: heroAssetId,
    supportingAssetIds: assetPlan.slice(1, 4).map((asset) => asset.assetId),
    textBlocks: [
      { role: "eyebrow", text: "OURchive 活动回顾", placement: "top-left" },
      { role: "main-title", text: title, placement: "center" },
      { role: "date", text: activity.time, placement: "bottom-left" },
      { role: "footer", text: activity.name, placement: "bottom-right" },
    ],
    moodKeywords: ["社群共创", "作品归档", "活动纪念"],
  };
}

export function buildDefaultLayoutPlan({
  activity,
  assets,
  body,
  platform,
  style,
  tags,
  title,
}: {
  activity: PromoActivityData;
  assets: PromoLayoutAsset[];
  body: string;
  platform: PromoPlatform | string;
  style: PromoStyle | string;
  tags: string[];
  title: string;
}): LayoutPlan {
  const layoutPlatform = mapPromoPlatformToLayoutPlatform(platform);
  const templateId = resolveTemplateId(undefined, layoutPlatform);
  const assetPlan = buildAssetPlan(activity, assets);
  const titleLines = splitTitle(title);
  const highlightWords = titleLines.length > 1 ? [titleLines[Math.min(1, titleLines.length - 1)]] : activity.tags.slice(0, 1).map((tag) => tag.replace(/^#/, ""));
  const contentPlan = buildContentPlan(activity, { body }, assetPlan);
  const plan: LayoutPlan = {
    version: "1.0",
    platform: layoutPlatform,
    layoutCategory: getLayoutCategory(layoutPlatform),
    visualStyle: getVisualStyle(layoutPlatform, style),
    templateRecommendation: {
      templateId,
      templateName: getTemplateName(templateId),
      reason: "根据当前平台和素材数量自动匹配的基础模板。",
    },
    titlePlan: {
      rawTitle: title,
      titleLines,
      highlightWords,
      subtitle: activity.summary.slice(0, 42),
      eyebrow: "OURchive 活动回顾",
      titleTone: layoutPlatform === "wechat" ? "structured" : layoutPlatform === "xiaohongshu" ? "energetic" : "community",
      titleLayout: layoutPlatform === "wechat" ? "magazine-title" : layoutPlatform === "xiaohongshu" ? "center-large" : "overlay-on-image",
    },
    assetPlan,
    contentPlan,
    posterPlan: buildPosterPlan(activity, title, assetPlan),
    typographyHint: {
      titleSize: layoutPlatform === "wechat" ? "large" : "display",
      titleWeight: layoutPlatform === "wechat" ? "bold" : "heavy",
      bodyStyle: layoutPlatform === "wechat" ? "structured" : "short-lines",
      alignment: layoutPlatform === "wechat" ? "left" : "mixed",
      lineBreakStrategy: "manual-title-lines",
    },
    decorationHint: {
      density: layoutPlatform === "wechat" ? "light" : "medium",
      elements: layoutPlatform === "xiaohongshu" ? ["stickers", "stars", "tag-pills", "tape"] : ["date-chip", "tag-pills"],
      colorMood: activity.id === "reimu-birthday" ? "red-white" : layoutPlatform === "wechat" ? "soft-blue" : "pastel",
    },
    exportHint: exportHintForPlatform(layoutPlatform),
  };

  if (layoutPlatform === "xiaohongshu") {
    plan.xiaohongshuPlan = buildXiaohongshuPlan(activity, title, tags, assetPlan);
  }

  if (layoutPlatform === "wechat") {
    plan.wechatPlan = buildWechatPlan(activity, assetPlan);
  }

  return plan;
}

function normalizeTitlePlan(value: unknown, fallback: TitlePlan): TitlePlan {
  if (!isRecord(value)) return fallback;
  const rawTitle = stringValue(value.rawTitle, fallback.rawTitle);
  const titleLines = stringArray(value.titleLines, fallback.titleLines);
  const titleTone = validTitleTones.has(value.titleTone as TitlePlan["titleTone"]) ? (value.titleTone as TitlePlan["titleTone"]) : fallback.titleTone;
  const titleLayout = validTitleLayouts.has(value.titleLayout as TitlePlan["titleLayout"]) ? (value.titleLayout as TitlePlan["titleLayout"]) : fallback.titleLayout;
  return {
    rawTitle,
    titleLines: titleLines.length > 0 ? titleLines : splitTitle(rawTitle),
    highlightWords: stringArray(value.highlightWords, fallback.highlightWords),
    subtitle: typeof value.subtitle === "string" ? value.subtitle : fallback.subtitle,
    eyebrow: typeof value.eyebrow === "string" ? value.eyebrow : fallback.eyebrow,
    titleTone,
    titleLayout,
  };
}

function normalizeAssetPlan(value: unknown, activity: PromoActivityData, fallback: AssetPlanItem[]): AssetPlanItem[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((item, index) => {
      if (!isRecord(item)) return null;
      const title = stringValue(item.title, fallback[index]?.title ?? activity.works[index]?.title ?? `素材 ${index + 1}`);
      const sourceImage = activity.images.find((asset) => asset.id === item.assetId || asset.title === title);
      const sourceWork = activity.works.find((work) => work.title === title);
      const role = validRoles.has(item.role as AssetPlanItem["role"]) ? (item.role as AssetPlanItem["role"]) : fallback[index]?.role ?? (index === 0 ? "hero" : "support");
      const usage = validUsages.has(item.usage as AssetPlanItem["usage"]) ? (item.usage as AssetPlanItem["usage"]) : fallback[index]?.usage ?? (index === 0 ? "main-visual" : "collage-tile");
      const cropHint = validCropHints.has(item.cropHint as AssetPlanItem["cropHint"]) ? (item.cropHint as AssetPlanItem["cropHint"]) : fallback[index]?.cropHint ?? "center";
      const normalized: AssetPlanItem = {
        assetId: stringValue(item.assetId, sourceImage?.id ?? fallback[index]?.assetId ?? slugify(title, `asset-${index + 1}`)),
        title,
        image: stringValue(item.image, sourceImage?.image ?? sourceWork?.image ?? fallback[index]?.image),
        author: stringValue(item.author, sourceWork?.author ?? fallback[index]?.author),
        type: stringValue(item.type, sourceWork?.type ?? sourceImage?.type ?? fallback[index]?.type ?? "作品素材"),
        role,
        priority: numberValue(item.priority, index + 1),
        usage,
        cropHint,
        caption: typeof item.caption === "string" ? item.caption : fallback[index]?.caption,
        pairingReason: stringValue(item.pairingReason, fallback[index]?.pairingReason ?? "适合作为当前活动的宣发素材。"),
      };
      return normalized;
    })
    .filter((item): item is AssetPlanItem => item !== null)
    .sort((a, b) => a.priority - b.priority);

  return normalized.length > 0 ? normalized : fallback;
}

function normalizeContentPlan(value: unknown, fallback: ContentSection[]): ContentSection[] {
  if (!Array.isArray(value)) return fallback;
  const normalized = value
    .map((section, index) => {
      if (!isRecord(section)) return null;
      const normalized: ContentSection = {
        id: stringValue(section.id, fallback[index]?.id ?? `section-${index + 1}`),
        sectionType: stringValue(section.sectionType, fallback[index]?.sectionType ?? "summary") as ContentSection["sectionType"],
        heading: typeof section.heading === "string" ? section.heading : fallback[index]?.heading,
        text: stringValue(section.text, fallback[index]?.text ?? ""),
        bullets: stringArray(section.bullets, fallback[index]?.bullets),
        highlightSentence: typeof section.highlightSentence === "string" ? section.highlightSentence : fallback[index]?.highlightSentence,
        relatedAssetIds: stringArray(section.relatedAssetIds, fallback[index]?.relatedAssetIds),
        layoutHint: stringValue(section.layoutHint, fallback[index]?.layoutHint ?? "text-only") as ContentSection["layoutHint"],
        pageSuggestion: typeof section.pageSuggestion === "number" ? section.pageSuggestion : fallback[index]?.pageSuggestion,
      };
      return normalized;
    })
    .filter((section): section is ContentSection => section !== null && section.text.length > 0);
  return normalized.length > 0 ? normalized : fallback;
}

export function normalizeLayoutPlan(value: unknown, fallback: LayoutPlan, activity: PromoActivityData): LayoutPlan {
  if (!isRecord(value)) return fallback;
  let platform = ["poster", "xiaohongshu", "wechat", "qqzone", "lofter"].includes(value.platform as string) ? (value.platform as LayoutPlatform) : fallback.platform;
  if (platform === "xiaohongshu" && !fallback.xiaohongshuPlan) platform = fallback.platform;
  if (platform === "wechat" && !fallback.wechatPlan) platform = fallback.platform;
  const templateId = resolveTemplateId(isRecord(value.templateRecommendation) ? stringValue(value.templateRecommendation.templateId) : undefined, platform);
  const assetPlan = normalizeAssetPlan(value.assetPlan, activity, fallback.assetPlan);
  const plan: LayoutPlan = {
    ...fallback,
    platform,
    layoutCategory: ["image-cover", "xiaohongshu-cover-plus-notes", "wechat-longform", "qqzone-post"].includes(value.layoutCategory as string)
      ? (value.layoutCategory as LayoutCategory)
      : fallback.layoutCategory,
    visualStyle: validVisualStyles.has(value.visualStyle as VisualStyle) ? (value.visualStyle as VisualStyle) : fallback.visualStyle,
    templateRecommendation: {
      templateId,
      templateName: getTemplateName(templateId),
      reason: isRecord(value.templateRecommendation) ? stringValue(value.templateRecommendation.reason, fallback.templateRecommendation.reason) : fallback.templateRecommendation.reason,
    },
    titlePlan: normalizeTitlePlan(value.titlePlan, fallback.titlePlan),
    assetPlan,
    contentPlan: normalizeContentPlan(value.contentPlan, fallback.contentPlan),
  };

  if (platform === "xiaohongshu") {
    plan.xiaohongshuPlan = fallback.xiaohongshuPlan;
    if (isRecord(value.xiaohongshuPlan)) {
      const candidate = value.xiaohongshuPlan;
      plan.xiaohongshuPlan = {
        ...fallback.xiaohongshuPlan!,
        coverType: stringValue(candidate.coverType, fallback.xiaohongshuPlan!.coverType) as XiaohongshuPlan["coverType"],
        noteStructure: isRecord(candidate.noteStructure)
          ? {
              hook: stringValue(candidate.noteStructure.hook, fallback.xiaohongshuPlan!.noteStructure.hook),
              bodyParagraphs: stringArray(candidate.noteStructure.bodyParagraphs, fallback.xiaohongshuPlan!.noteStructure.bodyParagraphs),
              highlightBullets: stringArray(candidate.noteStructure.highlightBullets, fallback.xiaohongshuPlan!.noteStructure.highlightBullets),
              ending: stringValue(candidate.noteStructure.ending, fallback.xiaohongshuPlan!.noteStructure.ending),
            }
          : fallback.xiaohongshuPlan!.noteStructure,
        pagePlan: Array.isArray(candidate.pagePlan) && candidate.pagePlan.length > 0 ? (candidate.pagePlan as XiaohongshuPlan["pagePlan"]) : fallback.xiaohongshuPlan!.pagePlan,
        symbolStyle: isRecord(candidate.symbolStyle) ? { ...fallback.xiaohongshuPlan!.symbolStyle, ...(candidate.symbolStyle as Partial<XiaohongshuPlan["symbolStyle"]>) } : fallback.xiaohongshuPlan!.symbolStyle,
        hashtagStrategy: isRecord(candidate.hashtagStrategy)
          ? { ...fallback.xiaohongshuPlan!.hashtagStrategy, ...(candidate.hashtagStrategy as Partial<XiaohongshuPlan["hashtagStrategy"]>) }
          : fallback.xiaohongshuPlan!.hashtagStrategy,
      };
    }
  }

  if (platform === "wechat") {
    plan.wechatPlan = fallback.wechatPlan;
    if (isRecord(value.wechatPlan)) {
      plan.wechatPlan = {
        ...fallback.wechatPlan!,
        articleStructure: Array.isArray(value.wechatPlan.articleStructure) ? (value.wechatPlan.articleStructure as WechatPlan["articleStructure"]) : fallback.wechatPlan!.articleStructure,
        longImageSections: Array.isArray(value.wechatPlan.longImageSections) ? (value.wechatPlan.longImageSections as WechatPlan["longImageSections"]) : fallback.wechatPlan!.longImageSections,
        imageTextPairing: Array.isArray(value.wechatPlan.imageTextPairing) ? (value.wechatPlan.imageTextPairing as WechatPlan["imageTextPairing"]) : fallback.wechatPlan!.imageTextPairing,
        endingModule: isRecord(value.wechatPlan.endingModule) ? { ...fallback.wechatPlan!.endingModule, ...(value.wechatPlan.endingModule as Partial<WechatPlan["endingModule"]>) } : fallback.wechatPlan!.endingModule,
      };
    }
  }

  if (isRecord(value.posterPlan)) {
    plan.posterPlan = { ...fallback.posterPlan!, ...(value.posterPlan as Partial<PosterPlan>) };
  }

  return plan;
}
