"use client";

import Link from "next/link";
import { Suspense, useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar } from "@/components/ourchive";
import { buildPromoDraft, getDefaultMatchedAssets, loadPromoDraft, savePromoDraft, subscribePromoDraft, type PromoDraftAsset } from "@/lib/promoDraft";
import type { LayoutPlan } from "@/lib/promoLayoutPlan";
import {
  getPromoCopy,
  getPromoImageForTitle,
  promoPlatforms,
  promoStyles,
  type PromoPlatform,
  type PromoStyle,
} from "@/lib/promoData";
import { getPromoActivity, getPromoActivityDataForRequest, getPromoImageForActivityTitle } from "@/lib/promoActivities";

type GeneratedPromoCopy = {
  title: string;
  body: string;
  tags: string[];
  layout: string;
  layoutPlan?: LayoutPlan;
};

type GeneratedPromoAsset = {
  id?: string;
  title?: string;
  type?: string;
  author?: string;
  reason?: string;
  image?: string;
};

function PromoContent() {
  const searchParams = useSearchParams();
  const activity = getPromoActivity(searchParams.get("activity") || "reimu-birthday");
  const defaultMatchedAssets = useMemo(() => getDefaultMatchedAssets(activity), [activity]);
  const storedDraft = useSyncExternalStore(
    useCallback((onStoreChange) => subscribePromoDraft(activity.id, onStoreChange), [activity.id]),
    useCallback(() => loadPromoDraft(activity), [activity]),
    () => null,
  );
  const restoredPlatform = storedDraft && promoPlatforms.includes(storedDraft.platform as PromoPlatform) ? (storedDraft.platform as PromoPlatform) : null;
  const restoredStyle = storedDraft && promoStyles.includes(storedDraft.style as PromoStyle) ? (storedDraft.style as PromoStyle) : null;
  const [platformOverride, setPlatformOverride] = useState<PromoPlatform | null>(null);
  const [styleOverride, setStyleOverride] = useState<PromoStyle | null>(null);
  const platform = platformOverride ?? restoredPlatform ?? "QQ空间";
  const style = styleOverride ?? restoredStyle ?? "同好群口吻";
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedPromoCopy | null>(null);
  const [matchedAssets, setMatchedAssets] = useState<PromoDraftAsset[]>(defaultMatchedAssets);
  const [draftNotice, setDraftNotice] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const mockCopy = useMemo(() => getPromoCopy(platform, style, activity), [activity, platform, style]);
  const canUseStoredDraft = !platformOverride && !styleOverride && storedDraft;
  const copy = useMemo(
    () =>
      generatedCopy ??
      (canUseStoredDraft
        ? { title: storedDraft.title, body: storedDraft.body, tags: storedDraft.tags, layout: storedDraft.layoutAdvice, layoutPlan: storedDraft.layoutPlan }
        : mockCopy),
    [canUseStoredDraft, generatedCopy, mockCopy, storedDraft],
  );
  const visibleMatchedAssets = generatedCopy ? matchedAssets : canUseStoredDraft ? storedDraft.matchedAssets : defaultMatchedAssets;
  const visibleLayoutPlan = generatedCopy?.layoutPlan ?? (canUseStoredDraft ? storedDraft.layoutPlan : undefined);
  const visibleDraftNotice = draftNotice || (canUseStoredDraft ? "已载入本次宣发草稿" : "");
  const editorHref = useMemo(
    () => `/promo/editor?activity=${encodeURIComponent(activity.id)}&platform=${encodeURIComponent(platform)}&style=${encodeURIComponent(style)}`,
    [activity.id, platform, style],
  );

  const persistCurrentDraft = useCallback(
    (nextCopy = copy, nextAssets = visibleMatchedAssets) => {
      const draft = buildPromoDraft({
        activity,
        platform,
        style,
        copy: {
          title: nextCopy.title,
          body: nextCopy.body,
          tags: nextCopy.tags,
          layout: nextCopy.layout,
        },
        matchedAssets: nextAssets,
        layoutPlan: "layoutPlan" in nextCopy ? nextCopy.layoutPlan : undefined,
      });

      savePromoDraft(draft);
      return draft;
    },
    [activity, copy, platform, style, visibleMatchedAssets],
  );

  const resetGeneratedCopy = useCallback(() => {
    setGeneratedCopy(null);
    setMatchedAssets(defaultMatchedAssets);
    setDraftNotice("");
    setGenerateError("");
  }, [defaultMatchedAssets]);

  const handlePlatformChange = useCallback(
    (nextPlatform: PromoPlatform) => {
      setPlatformOverride(nextPlatform);
      resetGeneratedCopy();
    },
    [resetGeneratedCopy],
  );

  const handleStyleChange = useCallback(
    (nextStyle: PromoStyle) => {
      setStyleOverride(nextStyle);
      resetGeneratedCopy();
    },
    [resetGeneratedCopy],
  );

  const regeneratePromoCopy = useCallback(async () => {
    setIsGenerating(true);
    setGenerateError("");

    try {
      const response = await fetch("/api/generate-promo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform,
          style,
          activityId: activity.id,
          activityData: {
            ...getPromoActivityDataForRequest(activity),
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result?.error === "Missing DEEPSEEK_API_KEY") {
          setGenerateError("小记暂时还没连接好，请查看 docs/DEEPSEEK_SETUP.md。");
          return;
        }

        setGenerateError("小记暂时没整理成功，已保留当前文案。请检查配置或网络连接。");
        return;
      }

      const nextCopy = {
        title: result.title,
        body: result.body,
        tags: Array.isArray(result.tags) ? result.tags : mockCopy.tags,
        layout: result.layoutAdvice || mockCopy.layout,
        layoutPlan: result.layoutPlan,
      };
      const nextAssets =
        Array.isArray(result.matchedAssets) && result.matchedAssets.length > 0
          ? result.matchedAssets
              .map((asset: GeneratedPromoAsset) => ({
                id: typeof asset.id === "string" ? asset.id : undefined,
                title: typeof asset.title === "string" ? asset.title : "",
                type: typeof asset.type === "string" ? asset.type : "",
                author: typeof asset.author === "string" ? asset.author : undefined,
                description: typeof asset.reason === "string" ? asset.reason : undefined,
                reason: typeof asset.reason === "string" ? asset.reason : undefined,
                image:
                  typeof asset.image === "string"
                    ? asset.image
                    : typeof asset.title === "string"
                      ? getPromoImageForActivityTitle(activity, asset.title) ?? getPromoImageForTitle(asset.title)
                      : undefined,
              }))
              .filter((asset: PromoDraftAsset) => asset.title && asset.type)
          : defaultMatchedAssets;

      setGeneratedCopy(nextCopy);
      setMatchedAssets(nextAssets);
      savePromoDraft(
        buildPromoDraft({
          activity,
          platform,
          style,
          copy: {
            title: nextCopy.title,
            body: nextCopy.body,
            tags: nextCopy.tags,
            layoutAdvice: nextCopy.layout,
          },
          matchedAssets: nextAssets,
          layoutPlan: nextCopy.layoutPlan,
        }),
      );
      setDraftNotice("已保存为小记宣发草稿");
    } catch {
      setGenerateError("小记暂时没整理成功，已保留当前文案。请检查配置或网络连接。");
    } finally {
      setIsGenerating(false);
    }
  }, [activity, defaultMatchedAssets, mockCopy.layout, mockCopy.tags, platform, style]);

  return (
    <div className="h-screen overflow-hidden bg-[#dfeaf5] p-4 text-slate-900">
      <div className="mx-auto flex h-full max-w-[1480px] flex-col overflow-hidden rounded-[18px] border border-white/80 bg-white shadow-2xl shadow-slate-300/70">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
          <div className="flex items-center gap-3">
            <Link href="/activity" className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-sky-600">
              返回活动详情
            </Link>
            <Link href="/" className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-sky-600">
              返回群聊
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-950">群小记｜宣发素材</h1>
              <p className="text-xs text-slate-500">当前活动：{activity.name}</p>
            </div>
          </div>
          <span className="text-xs text-slate-400">基于活动记录、作品草稿与群聊归档生成</span>
        </header>

        <main className="grid min-h-0 flex-1 grid-cols-[360px_minmax(0,1fr)] gap-4 bg-[#edf5fb] p-4">
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-[18px] bg-white shadow-sm">
            <div className="shrink-0 border-b border-slate-100 px-4 py-3">
              <h2 className="text-base font-bold text-slate-950">素材整理</h2>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
              <section className="rounded-[14px] bg-sky-50/70 p-3">
                <h3 className="text-sm font-bold text-sky-800">活动信息</h3>
                <div className="mt-2 space-y-1.5 text-xs leading-5 text-slate-600">
                  <p>活动名称：{activity.name}</p>
                  <p>时间：{activity.time}</p>
                  <p>活动形式：{activity.format}</p>
                  <p>来源：{activity.source}</p>
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-bold text-slate-950">参与成员</h3>
                <div className="grid grid-cols-2 gap-2">
                  {activity.members.map((member) => (
                    <div key={member.name} className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-50 p-2">
                      <Avatar label={member.avatar} src={member.avatarSrc} className="size-8 rounded-full" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-800">{member.name}</p>
                        <p className="truncate text-[11px] text-slate-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-bold text-slate-950">作品素材</h3>
                <div className="space-y-2">
                  {activity.works.map((work) => (
                    <div key={work.title} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                      <p className="truncate text-xs font-bold text-slate-800">{work.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {work.author}｜{work.type}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-2 text-sm font-bold text-slate-950">推荐图片</h3>
                <div className="grid grid-cols-2 gap-2">
                  {activity.images.map((image) => (
                    <div key={image.id} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                      <div
                        className={`grid aspect-[4/3] place-items-center bg-gradient-to-br ${image.gradient} bg-cover bg-center`}
                        style={image.image ? { backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05), rgba(15, 23, 42, 0.16)), url(${image.image})` } : undefined}
                      >
                        <div className="rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold text-slate-600">{image.motif}</div>
                      </div>
                      <div className="p-2">
                        <p className="truncate text-[11px] font-bold text-slate-800">{image.title}</p>
                        <p className="mt-0.5 text-[10px] text-slate-500">{image.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </aside>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-[18px] bg-white shadow-sm">
            <div className="shrink-0 border-b border-slate-100 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-slate-950">小记生成文案</h2>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">{generatedCopy ? "小记生成" : "示例文案"}</span>
                  {visibleDraftNotice ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{visibleDraftNotice}</span> : null}
                  <button
                    type="button"
                    onClick={regeneratePromoCopy}
                    disabled={isGenerating}
                    className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isGenerating ? "小记整理中..." : "让小记重新生成"}
                  </button>
                </div>
              </div>
              {generateError ? <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">{generateError}</p> : null}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold text-slate-500">平台选择</span>
                {promoPlatforms.map((item) => (
                  <button
                    key={item}
                    onClick={() => handlePlatformChange(item)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${platform === item ? "bg-sky-500 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-600"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold text-slate-500">风格选择</span>
                {promoStyles.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleStyleChange(item)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${style === item ? "bg-violet-500 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-600"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
                <section className="rounded-[16px] bg-slate-50 p-4">
                  <p className="text-xs font-bold text-sky-600">标题建议</p>
                  <h3 className="mt-2 text-2xl font-black leading-tight text-slate-950">{copy.title}</h3>
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{copy.body}</p>
                </section>

                <div className="space-y-3">
                  <section className="rounded-[16px] bg-sky-50 p-4 text-sky-800">
                    <p className="text-sm font-bold">标签推荐</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {copy.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                  <section className="rounded-[16px] bg-violet-50 p-4 text-violet-800">
                    <p className="text-sm font-bold">小记排版建议</p>
                    <p className="mt-2 text-sm leading-6">{copy.layout}</p>
                  </section>
                  {visibleLayoutPlan ? (
                    <section className="rounded-[16px] bg-white p-4 text-slate-700 ring-1 ring-slate-100">
                      <p className="text-sm font-bold text-slate-900">排版计划摘要</p>
                      <div className="mt-2 space-y-1 text-xs leading-5">
                        <p>模板：{visibleLayoutPlan.templateRecommendation.templateName}</p>
                        <p>标题：{visibleLayoutPlan.titlePlan.titleLines.join(" / ")}</p>
                        <p>主图：{visibleLayoutPlan.assetPlan.find((asset) => asset.role === "hero" || asset.usage === "main-visual")?.title ?? visibleLayoutPlan.assetPlan[0]?.title}</p>
                      </div>
                    </section>
                  ) : null}
                  <section className="rounded-[16px] bg-gradient-to-br from-rose-50 to-sky-50 p-4">
                    <p className="text-sm font-bold text-slate-900">已匹配素材</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {visibleMatchedAssets.slice(0, 4).map((asset, index) => (
                        <div
                          key={`${asset.title}-${index}`}
                          className={`grid aspect-[5/3] place-items-center rounded-xl bg-gradient-to-br ${activity.images[index]?.gradient ?? "from-rose-100 to-sky-100"} bg-cover bg-center p-2 text-center`}
                          style={asset.image ? { backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.08), rgba(15, 23, 42, 0.14)), url(${asset.image})` } : undefined}
                        >
                          <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-slate-600">{asset.title}｜{asset.type}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-4">
              <div className="flex justify-end">
                <Link
                  href={editorHref}
                  onClick={() => {
                    persistCurrentDraft();
                  }}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#12b7f5] to-violet-500 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-sky-200 transition hover:brightness-105"
                >
                  点击选择模板在线编辑 →
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function PromoPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#dfeaf5] text-sm font-semibold text-slate-600">正在打开宣发素材...</div>}>
      <PromoContent />
    </Suspense>
  );
}
