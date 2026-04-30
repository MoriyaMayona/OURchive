"use client";

import Link from "next/link";
import { Suspense, useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { getDefaultPromoDraft, loadPromoDraft, subscribePromoDraft, type PromoDraftAsset } from "@/lib/promoDraft";
import {
  getPromoCopy,
  promoPlatforms,
  promoTemplates,
  type PromoPlatform,
  type PromoStyle,
  type PromoTemplate,
} from "@/lib/promoData";
import { getPromoActivity } from "@/lib/promoActivities";
import { resolveTemplateId, type AssetPlanItem, type LayoutPlan } from "@/lib/promoLayoutPlan";
import { reimuBirthdayImages } from "@/lib/reimuBirthdayAssets";

const platformSet = new Set<PromoPlatform>(["QQ空间", "小红书", "Lofter", "公众号"]);
const styleSet = new Set<PromoStyle>(["同好群口吻", "文艺", "活泼", "官方"]);
const exportGradients = [
  "linear-gradient(135deg, #FDECEF 0%, #E0F2FE 100%)",
  "linear-gradient(135deg, #E0F2FE 0%, #FCE7F3 100%)",
  "linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 100%)",
];

function readPlatform(value: string | null): PromoPlatform {
  return value && platformSet.has(value as PromoPlatform) ? (value as PromoPlatform) : "QQ空间";
}

function readStyle(value: string | null): PromoStyle {
  return value && styleSet.has(value as PromoStyle) ? (value as PromoStyle) : "同好群口吻";
}

function getInitialTemplateId(platform: PromoPlatform) {
  return promoTemplates.find((template) => template.platform === platform)?.id ?? promoTemplates[0].id;
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
  return heroPlan ? getAssetForPlanItem(heroPlan, assets) : assets[0];
}

function getAssetsByIds(ids: string[] | undefined, layoutPlan: LayoutPlan, fallbackAssets: PromoDraftAsset[]) {
  if (!ids || ids.length === 0) return [];
  return ids
    .map((id) => layoutPlan.assetPlan.find((asset) => asset.assetId === id || asset.title === id))
    .filter((asset): asset is AssetPlanItem => Boolean(asset))
    .map((asset) => getAssetForPlanItem(asset, fallbackAssets));
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

function getTemplateAssets(activityId: string, template: PromoTemplate, fallbackAssets: PromoDraftAsset[]): PromoDraftAsset[] {
  if (activityId !== "reimu-birthday") return fallbackAssets.slice(0, template.imageSlots);

  const assetsByTemplate: Record<string, PromoDraftAsset[]> = {
    "poster-birthday": [
      { title: "《灵梦生日图文接力合辑》", type: "合辑封面", author: "阿璃 / 群体共创", image: reimuBirthdayImages.anthologyCover },
    ],
    "poster-collection": [
      { title: "《灵梦生日图文接力合辑》", type: "合辑封面", author: "阿璃 / 群体共创", image: reimuBirthdayImages.anthologyCover },
      { title: "《神社清晨的灵梦》", type: "开场插画", author: "墨团", image: reimuBirthdayImages.shrineMorningFinal },
      { title: "《灵梦生日表情包》", type: "表情包", author: "小满", image: reimuBirthdayImages.stickerSheet },
    ],
    "wechat-review": [
      { title: "《灵梦生日图文接力合辑》", type: "合辑封面", author: "阿璃 / 群体共创", image: reimuBirthdayImages.anthologyCover },
      { title: "《神社清晨的灵梦》构图草稿", type: "构图草稿", author: "墨团", image: reimuBirthdayImages.shrineMorningSketch },
      { title: "《生日小漫画分镜》", type: "漫画分镜", author: "阿璃", image: reimuBirthdayImages.mangaStoryboard },
    ],
    "wechat-works": [
      { title: "《灵梦生日图文接力合辑》", type: "合辑封面", author: "阿璃 / 群体共创", image: reimuBirthdayImages.anthologyCover },
      { title: "《神社清晨的灵梦》构图草稿", type: "构图草稿", author: "墨团", image: reimuBirthdayImages.shrineMorningSketch },
      { title: "《生日小漫画分镜》", type: "漫画分镜", author: "阿璃", image: reimuBirthdayImages.mangaStoryboard },
    ],
    "redbook-cover": [
      { title: "《神社清晨的灵梦》", type: "开场插画", author: "墨团", image: reimuBirthdayImages.shrineMorningFinal },
    ],
    "redbook-grid": [
      { title: "《神社清晨的灵梦》", type: "开场插画", author: "墨团", image: reimuBirthdayImages.shrineMorningFinal },
      { title: "《神社来信》", type: "短篇文字", author: "未央", image: reimuBirthdayImages.shrineLetter },
      { title: "《灵梦生日表情包》", type: "表情包", author: "小满", image: reimuBirthdayImages.stickerSheet },
      { title: "《赛钱箱旁边的生日蛋糕》", type: "小插图", author: "青禾", image: reimuBirthdayImages.birthdayCake },
      { title: "《礼物清单》", type: "短篇栏目", author: "夜雀", image: reimuBirthdayImages.giftChecklist },
      { title: "《合辑封面分镜》", type: "封面分镜", author: "阿璃", image: reimuBirthdayImages.anthologyStoryboard },
    ],
  };

  return (assetsByTemplate[template.id] ?? fallbackAssets).slice(0, template.imageSlots);
}

function TemplatePreview({
  assets,
  body,
  layoutAdvice,
  layoutPlan,
  tags,
  template,
  title,
  activityTime,
}: {
  assets: PromoDraftAsset[];
  body: string;
  layoutAdvice: string;
  layoutPlan: LayoutPlan;
  tags: string[];
  template: PromoTemplate;
  title: string;
  activityTime: string;
}) {
  const isSquare = template.category === "小红书";
  const isLong = template.category === "公众号";
  const visibleAssets = assets.slice(0, Math.max(template.imageSlots, layoutPlan.platform === "wechat" ? 4 : 1));
  const heroAsset = getHeroAsset(layoutPlan, assets);
  const marker = layoutPlan.xiaohongshuPlan?.symbolStyle.recommendedMarkers[0] ?? "✦";

  return (
    <article
      className={`mx-auto overflow-hidden ${
        isSquare ? "aspect-square w-[520px] max-w-full" : isLong ? "min-h-[720px] w-[520px] max-w-full" : "aspect-[3/4] w-[420px] max-w-full"
      }`}
      style={{
        backgroundColor: "#FFFFFF",
        color: "#111827",
        boxShadow: "none",
      }}
    >
      <div
        className={`relative grid ${isLong ? "min-h-72" : "h-1/2"} place-items-center overflow-hidden p-8 text-center`}
        style={{
          background: heroAsset?.image ? undefined : exportGradients[0],
          backgroundImage: heroAsset?.image ? `linear-gradient(rgba(255,255,255,0.18), rgba(15,23,42,0.44)), url(${heroAsset.image})` : undefined,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="relative z-10 rounded-md px-4 py-3" style={{ backgroundColor: heroAsset?.image ? "rgba(255,255,255,0.86)" : "transparent" }}>
          <p className="text-sm font-black tracking-[0.16em]" style={{ color: "#2563EB" }}>
            {layoutPlan.titlePlan.eyebrow ?? activityTime}
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight" style={{ color: "#111827" }}>
            {renderTitleLines(layoutPlan, title)}
          </h2>
          {layoutPlan.titlePlan.subtitle ? (
            <p className="mt-4 text-sm font-semibold" style={{ color: "#374151" }}>
              {layoutPlan.titlePlan.subtitle}
            </p>
          ) : null}
          <p className="mt-3 text-xs font-bold" style={{ color: "#2563EB" }}>
            {template.name}｜{activityTime}
          </p>
        </div>
      </div>
      <div className="space-y-5 p-7">
        {layoutPlan.platform === "wechat" && layoutPlan.wechatPlan ? (
          <div className="space-y-5">
            {layoutPlan.wechatPlan.longImageSections.map((section) => {
              const sectionAssets = getAssetsByIds(section.assetIds, layoutPlan, assets);
              return (
                <section key={`${section.order}-${section.sectionTitle}`} className="rounded-md p-4" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                  <p className="text-xs font-black" style={{ color: "#2563EB" }}>
                    {String(section.order).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 text-xl font-black" style={{ color: "#111827" }}>
                    {section.sectionTitle}
                  </h3>
                  {section.sectionSubtitle ? <p className="mt-1 text-xs font-bold" style={{ color: "#64748B" }}>{section.sectionSubtitle}</p> : null}
                  <p className="mt-3 text-sm leading-7" style={{ color: "#374151" }}>{section.text}</p>
                  {sectionAssets.length > 0 ? (
                    <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: sectionAssets.length > 1 ? "repeat(2, minmax(0, 1fr))" : "1fr" }}>
                      {sectionAssets.slice(0, 2).map((asset) => (
                        <div key={`${section.order}-${asset.title}`} className="grid aspect-[4/3] place-items-center rounded-md bg-cover bg-center p-2 text-center" style={{ background: asset.image ? undefined : exportGradients[0], backgroundImage: asset.image ? `url(${asset.image})` : undefined, border: "1px solid #E5E7EB" }}>
                          <span className="rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: "#FFFFFF", color: "#374151" }}>{asset.title}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        ) : layoutPlan.platform === "xiaohongshu" && layoutPlan.xiaohongshuPlan ? (
          <div className="space-y-4">
            <p className="text-sm font-bold leading-7" style={{ color: "#374151" }}>
              {layoutPlan.xiaohongshuPlan.noteStructure.hook}
            </p>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              {layoutPlan.xiaohongshuPlan.pagePlan.slice(0, 4).map((page) => {
                const pageAssets = getAssetsByIds(page.assetIds, layoutPlan, assets);
                const firstAsset = pageAssets[0];
                return (
                  <section key={page.page} className="rounded-md p-3" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA" }}>
                    <p className="text-[11px] font-black" style={{ color: "#DB2777" }}>{marker} PAGE {page.page}</p>
                    <h3 className="mt-1 text-sm font-black" style={{ color: "#111827" }}>{page.title ?? page.pageType}</h3>
                    {firstAsset ? (
                      <div className="mt-2 grid aspect-[4/3] place-items-center rounded-md bg-cover bg-center p-2 text-center" style={{ background: firstAsset.image ? undefined : exportGradients[1], backgroundImage: firstAsset.image ? `url(${firstAsset.image})` : undefined, border: "1px solid #E5E7EB" }}>
                        <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ backgroundColor: "#FFFFFF", color: "#374151" }}>{firstAsset.title}</span>
                      </div>
                    ) : null}
                    <p className="mt-2 text-[11px] leading-5" style={{ color: "#475569" }}>{page.text ?? page.designNote}</p>
                  </section>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {layoutPlan.contentPlan.slice(0, 3).map((section) => (
              <section key={section.id} className="rounded-md p-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                {section.heading ? <h3 className="text-sm font-black" style={{ color: "#111827" }}>{section.heading}</h3> : null}
                <p className="mt-1 text-sm leading-7" style={{ color: "#374151" }}>{section.text}</p>
                {section.highlightSentence ? <p className="mt-2 text-xs font-bold" style={{ color: "#DB2777" }}>{section.highlightSentence}</p> : null}
              </section>
            ))}
          </div>
        )}
        <div className={`grid gap-3 ${visibleAssets.length > 1 ? "grid-cols-3" : "grid-cols-1"}`}>
          {visibleAssets.map((asset, index) => (
            <div
              key={`${asset.title}-${index}`}
              className="grid aspect-[4/3] place-items-center rounded-md bg-cover bg-center p-2 text-center"
              style={{
                background: asset.image ? undefined : exportGradients[index % exportGradients.length],
                backgroundImage: asset.image ? `url(${asset.image})` : undefined,
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
        {layoutAdvice ? (
          <p
            className="rounded-md p-3 text-xs font-semibold leading-5"
            style={{
              backgroundColor: "#EFF6FF",
              color: "#2563EB",
              border: "1px solid #BFDBFE",
            }}
          >
            {layoutAdvice}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {(layoutPlan.xiaohongshuPlan?.hashtagStrategy.primaryTags ?? tags).slice(0, 5).map((tag) => (
            <span key={tag} className="rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}>
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const layoutPlan = activeDraft.layoutPlan;
  const selectedTemplateId = selectedTemplateOverride ?? resolveTemplateId(layoutPlan.templateRecommendation.templateId, layoutPlan.platform);
  const title = titleOverride ?? activeDraft.title ?? initialCopy.title;
  const body = bodyOverride ?? activeDraft.body ?? initialCopy.body;
  const tags = tagsOverride ?? activeDraft.tags ?? initialCopy.tags;
  const layoutAdvice = layoutAdviceOverride ?? activeDraft.layoutAdvice ?? initialCopy.layout;
  const matchedAssets = activeDraft.matchedAssets.length > 0 ? activeDraft.matchedAssets : defaultDraft.matchedAssets;
  const draftStatus = storedDraft ? "已载入小记宣发草稿" : "当前使用默认示例文案";

  const selectedTemplate = useMemo(
    () => promoTemplates.find((template) => template.id === selectedTemplateId) ?? promoTemplates[0],
    [selectedTemplateId],
  );
  const templateAssets = useMemo(() => {
    const plannedAssets = getPlannedAssets(layoutPlan, matchedAssets);
    return plannedAssets.length > 0 ? plannedAssets : getTemplateAssets(activity.id, selectedTemplate, matchedAssets);
  }, [activity.id, layoutPlan, matchedAssets, selectedTemplate]);

  const handleDownloadPNG = useCallback(async () => {
    if (!previewRef.current || isDownloading) return;

    setIsDownloading(true);
    setDownloadError("");

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
            {isDownloading ? "导出中..." : "下载 PNG"}
          </button>
        </header>

        <main className="grid min-h-0 flex-1 grid-cols-[340px_minmax(0,1fr)_360px] gap-4 bg-[#edf5fb] p-4">
          <aside className="min-h-0 overflow-y-auto rounded-[18px] bg-white p-4 shadow-sm [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            <h2 className="text-base font-bold text-slate-950">模板</h2>
            <div className="mt-3 space-y-2">
              {promoTemplates.map((template) => (
                <button
                  key={template.id}
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
              <TemplatePreview assets={templateAssets} body={body} layoutAdvice={layoutAdvice} layoutPlan={layoutPlan} tags={tags} template={selectedTemplate} title={title} activityTime={activity.time} />
            </div>
          </section>

          <aside className="min-h-0 overflow-y-auto rounded-[18px] bg-white p-4 shadow-sm [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            <h2 className="text-base font-bold text-slate-950">文案草稿</h2>
            {downloadError ? <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">{downloadError}</p> : null}
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
            <section className="mt-4 rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-bold text-slate-500">已匹配素材</p>
              <div className="mt-2 space-y-2">
                {templateAssets.map((asset, index) => (
                  <div key={`${asset.title}-${index}`} className="rounded-lg bg-white px-3 py-2 text-xs leading-5 text-slate-600">
                    <p className="font-bold text-slate-800">{asset.title}</p>
                    <p>{asset.type}{asset.author ? `｜${asset.author}` : ""}</p>
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
