"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageFrame } from "@/components/ourchive";
import { getArchiveActivity } from "@/lib/archiveActivities";
import { loadPendingActivity, type ChatDetectedPendingActivity } from "@/lib/pendingActivity";

export function PendingArchiveDetail({ requestedId }: { requestedId: string }) {
  const [pendingActivity, setPendingActivity] = useState<ChatDetectedPendingActivity | null | undefined>(undefined);

  useEffect(() => {
    const stored = loadPendingActivity();
    setPendingActivity(stored?.id === requestedId ? stored : null);
  }, [requestedId]);

  const fallbackActivity = useMemo(() => getArchiveActivity("reimu-birthday"), []);

  if (pendingActivity === undefined) {
    return (
      <PageFrame>
        <main className="min-h-[calc(100vh-96px)] bg-[#edf5fb] p-6">
          <section className="rounded-[24px] border border-white/80 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-sky-600">正在读取群聊识别活动...</p>
          </section>
        </main>
      </PageFrame>
    );
  }

  if (!pendingActivity && fallbackActivity) {
    return (
      <PageFrame>
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
          <Link href="/" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-sky-600">
            返回群聊
          </Link>
          <Link href="/archive/reimu-birthday" className="rounded-xl bg-[#12b7f5] px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-500">
            查看默认活动
          </Link>
        </header>
        <main className="min-h-[calc(100vh-96px)] bg-[#edf5fb] p-6">
          <section className="rounded-[24px] border border-white/80 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-amber-600">未找到聊天识别活动</p>
            <h1 className="mt-3 text-3xl font-black text-slate-950">{fallbackActivity.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              未找到对应的临时活动数据，已保留默认活动入口。
            </p>
          </section>
        </main>
      </PageFrame>
    );
  }

  if (!pendingActivity) return null;

  return (
    <PageFrame>
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/archive" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-sky-600">
            返回活动记录馆
          </Link>
          <Link href="/" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-sky-600">
            返回群聊
          </Link>
        </div>
        <span className="rounded-xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">需要管理员确认</span>
      </header>

      <main className="min-h-[calc(100vh-96px)] bg-[#edf5fb] p-6">
        <section className="overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-sm">
          <div className="grid min-h-64 place-items-end bg-gradient-to-br from-sky-100 via-white to-amber-100 p-6">
            <div className="w-full rounded-[22px] bg-white/90 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-sky-600">{pendingActivity.date}</span>
                {pendingActivity.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-600">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950">{pendingActivity.title}</h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">{pendingActivity.description}</p>
              <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-800">
                这是从群聊发起的共创活动，当前仍需要管理员确认主题、时间、参与方式和归档信息。
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
          <section className="rounded-[20px] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">活动草稿</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <p>活动名称：{pendingActivity.name}</p>
              <p>初步时间：{pendingActivity.time}</p>
              <p>活动形式：{pendingActivity.format || "共创活动"}</p>
              <p>参与对象：{pendingActivity.target || "群成员"}</p>
            </div>
          </section>

          <section className="rounded-[20px] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">归档状态</h2>
            <div className="mt-4 grid gap-3">
              {["主题与规则待确认", "参与成员待认领", "作品列表待提交", "发布前需管理员审核"].map((item) => (
                <p key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                  {item}
                </p>
              ))}
            </div>
          </section>
        </div>
      </main>
    </PageFrame>
  );
}
