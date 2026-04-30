import Link from "next/link";
import { redirect } from "next/navigation";
import { PageFrame } from "@/components/ourchive";
import { archiveActivities } from "@/lib/archiveActivities";
import { ArchiveAlbum } from "./ArchiveAlbum";

type ArchivePageProps = {
  searchParams?: Promise<{ activity?: string | string[] }>;
};

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const params = searchParams ? await searchParams : {};
  const activityParam = Array.isArray(params.activity) ? params.activity[0] : params.activity;

  if (activityParam) {
    redirect(`/archive/${activityParam}`);
  }

  return (
    <PageFrame>
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-sky-600">
            返回群聊
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-950">活动记录馆</h1>
            <p className="mt-1 text-xs text-slate-400">把每一次热闹，整理成可以翻阅的社群相册。</p>
          </div>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-600">共 {archiveActivities.length} 份活动档案</span>
      </header>

      <main className="min-h-[calc(100vh-96px)] overflow-hidden bg-[#edf5fb] px-6 py-7">
        <ArchiveAlbum activities={archiveActivities} />
      </main>
    </PageFrame>
  );
}
