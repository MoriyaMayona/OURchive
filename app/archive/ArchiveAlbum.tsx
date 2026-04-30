"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ArchiveActivity } from "@/lib/archiveActivities";

const albumDates: Record<string, string> = {
  "reimu-birthday": "2026.04.29 - 2026.05.07",
  "campus-postcard": "2026.03.22 - 2026.03.30",
  "water-lantern-fair": "2026.03.10 - 2026.03.15",
  "story-relay": "2026.02.18 - 2026.02.25",
};

const albumOrder = ["reimu-birthday", "campus-postcard", "water-lantern-fair", "story-relay"];

const albumSummaries: Record<string, string> = {
  "reimu-birthday": "插画、短篇、表情包与网页预览一起组成生日纪念合辑。",
  "campus-postcard": "校园实景照片被重新绘制成一组角色明信片。",
  "water-lantern-fair": "线下摊位留下作品展示、无料交换与招新经验。",
  "story-relay": "从一个神社异变开头延展出图文故事集。",
};

export function ArchiveAlbum({ activities }: { activities: ArchiveActivity[] }) {
  const sortedActivities = useMemo(
    () =>
      [...activities].sort((a, b) => {
        return albumOrder.indexOf(a.id) - albumOrder.indexOf(b.id);
      }),
    [activities],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const turnPage = (nextIndex: number) => {
    if (isAnimating || nextIndex === activeIndex) return;

    setIsAnimating(true);
    setActiveIndex(nextIndex);
    window.setTimeout(() => setIsAnimating(false), 800);
  };

  const goPrevious = () => {
    turnPage(activeIndex === 0 ? sortedActivities.length - 1 : activeIndex - 1);
  };

  const goNext = () => {
    turnPage(activeIndex === sortedActivities.length - 1 ? 0 : activeIndex + 1);
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/80 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-sky-500">社群活动相册</p>
          <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950">把每一次热闹，整理成可以翻阅的社群相册</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-500">按时间翻看活动成果、参与成员和可复用经验。</p>
      </div>

      <div className="relative mt-8 rounded-[28px] bg-[#f6fbff] px-4 py-8 shadow-inner shadow-sky-100/70">
        <div className="pointer-events-none absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-sky-100" />
        <button
          type="button"
          onClick={goPrevious}
          disabled={isAnimating}
          className="absolute left-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-xl font-black text-slate-600 shadow-md transition duration-[800ms] ease-in-out hover:-translate-x-0.5 hover:bg-sky-50 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="查看上一张活动相册"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={isAnimating}
          className="absolute right-4 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white text-xl font-black text-slate-600 shadow-md transition duration-[800ms] ease-in-out hover:translate-x-0.5 hover:bg-sky-50 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="查看下一张活动相册"
        >
          ›
        </button>

        <div className="relative mx-auto h-[560px] max-w-6xl">
          {sortedActivities.map((activity, index) => {
            const offset = index - activeIndex;
            const isActive = offset === 0;
            const isNeighbor = Math.abs(offset) === 1;
            const wrappedOffset =
              offset > sortedActivities.length / 2
                ? offset - sortedActivities.length
                : offset < -sortedActivities.length / 2
                  ? offset + sortedActivities.length
                  : offset;
            const visible = Math.abs(wrappedOffset) <= 1 || sortedActivities.length <= 3;

            return (
              <AlbumCard
                key={activity.id}
                activity={activity}
                date={albumDates[activity.id] ?? activity.date}
                index={index}
                isActive={isActive}
                isNeighbor={isNeighbor}
                summary={albumSummaries[activity.id] ?? activity.summary}
                visible={visible}
                wrappedOffset={wrappedOffset}
                onFocus={() => {
                  if (!isAnimating) turnPage(index);
                }}
              />
            );
          })}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {sortedActivities.map((activity, index) => (
            <button
              key={`${activity.id}-dot`}
              type="button"
              onClick={() => turnPage(index)}
              disabled={isAnimating}
              aria-label={`查看${activity.title}`}
              className={`h-2.5 rounded-full transition duration-[800ms] ease-in-out disabled:cursor-not-allowed disabled:opacity-40 ${activeIndex === index ? "w-8 bg-[#12b7f5]" : "w-2.5 bg-slate-300 hover:bg-sky-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function AlbumCard({
  activity,
  date,
  index,
  isActive,
  isNeighbor,
  onFocus,
  summary,
  visible,
  wrappedOffset,
}: {
  activity: ArchiveActivity;
  date: string;
  index: number;
  isActive: boolean;
  isNeighbor: boolean;
  onFocus: () => void;
  summary: string;
  visible: boolean;
  wrappedOffset: number;
}) {
  const rotation = isActive ? 0 : wrappedOffset > 0 ? 2 : -2;
  const transform = isActive
    ? "translateX(-50%) translateY(0) scale(1) rotate(0deg)"
    : `translateX(calc(-50% + ${wrappedOffset * 360}px)) translateY(${isNeighbor ? "34px" : "72px"}) scale(${isNeighbor ? 0.9 : 0.8}) rotate(${rotation}deg)`;

  return (
    <Link
      href={`/archive/${activity.id}`}
      onMouseEnter={onFocus}
      className={`absolute left-1/2 top-0 w-[min(440px,82vw)] rounded-[28px] bg-white p-4 shadow-2xl shadow-slate-300/60 transition-all duration-[800ms] ease-in-out hover:-translate-y-1 ${
        isActive ? "z-10 opacity-100" : isNeighbor ? "z-0 opacity-60" : "z-0 opacity-30"
      } ${visible ? "pointer-events-auto" : "pointer-events-none"}`}
      style={{ transform }}
    >
      <span className="absolute left-6 top-6 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-xs font-black text-sky-600 shadow-sm">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute right-7 top-7 z-10 h-8 w-8 rounded-bl-[22px] border-b border-l border-white/80 bg-white/65" />

      <div
        className={`relative h-64 overflow-hidden rounded-[24px] bg-gradient-to-br ${activity.heroGradient} bg-cover bg-center`}
        style={activity.heroImage ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.18)), url(${activity.heroImage})` } : undefined}
      >
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/88 p-4 shadow-sm backdrop-blur-sm">
          <p className={`text-xs font-black ${activity.accent}`}>{date}</p>
          <h3 className="mt-1 text-2xl font-black leading-tight text-slate-950">{activity.title}</h3>
        </div>
      </div>

      <div className="px-1 pb-2 pt-4">
        <div className="flex flex-wrap gap-2">
          {activity.typeLabels.slice(0, 3).map((label) => (
            <span key={label} className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-600">
              {label}
            </span>
          ))}
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{summary}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold text-slate-400">参与人数</p>
            <p className="mt-1 text-xl font-black text-slate-950">{activity.participantCount}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold text-slate-400">作品数量</p>
            <p className="mt-1 text-xl font-black text-slate-950">{activity.workCount}</p>
          </div>
        </div>
        <div className="mt-4 inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-600">
          查看活动档案
        </div>
      </div>
    </Link>
  );
}
