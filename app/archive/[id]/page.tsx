import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, PageFrame } from "@/components/ourchive";
import { archiveActivities, getArchiveActivity, type ArchiveActivity } from "@/lib/archiveActivities";

type ArchiveDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return archiveActivities.map((activity) => ({ id: activity.id }));
}

export default async function ArchiveDetailPage({ params }: ArchiveDetailPageProps) {
  const { id } = await params;
  const activity = getArchiveActivity(id);

  if (!activity) notFound();

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
        <Link href={`/promo?activity=${activity.id}`} className="rounded-xl bg-[#12b7f5] px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-500">
          整理宣发素材
        </Link>
      </header>

      <main className="min-h-[calc(100vh-96px)] bg-[#edf5fb] p-6">
        <HeroCard activity={activity} />

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
          <section className="space-y-5">
            <MembersCard activity={activity} />
            <WorksCard activity={activity} />
          </section>

          <section className="space-y-5">
            <TimelineCard activity={activity} />
            <LearningsCard activity={activity} />
            <StatusCard activity={activity} />
          </section>
        </div>
      </main>
    </PageFrame>
  );
}

function HeroCard({ activity }: { activity: ArchiveActivity }) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-sm">
      <div
        className={`grid min-h-64 place-items-end bg-gradient-to-br ${activity.heroGradient} bg-cover bg-center p-6`}
        style={activity.heroImage ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.2)), url(${activity.heroImage})` } : undefined}
      >
        <div className="w-full rounded-[22px] bg-white/88 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-black ${activity.accent}`}>{activity.date}</span>
            {activity.typeLabels.map((label) => (
              <span key={label} className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-600">
                {label}
              </span>
            ))}
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950">{activity.title}</h1>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">{activity.summary}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:w-[420px]">
            <Stat label="参与人数" value={`${activity.participantCount} 人`} />
            <Stat label="作品数量" value={`${activity.workCount} 件`} />
          </div>
        </div>
      </div>
      {activity.background || activity.openingText ? (
        <div className="grid gap-3 border-t border-slate-100 p-5 md:grid-cols-2">
          {activity.background ? (
            <div className="rounded-2xl bg-slate-50 p-4">
              <h2 className="text-sm font-bold text-slate-950">活动背景</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{activity.background}</p>
            </div>
          ) : null}
          {activity.openingText ? (
            <div className="rounded-2xl bg-violet-50 p-4">
              <h2 className="text-sm font-bold text-violet-800">给定开头</h2>
              <p className="mt-2 text-sm leading-6 text-violet-700">“{activity.openingText}”</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function MembersCard({ activity }: { activity: ArchiveActivity }) {
  return (
    <section className="rounded-[20px] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">参与成员</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {activity.members.map((member) => (
          <div key={`${activity.id}-${member.name}`} className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
            <Avatar label={member.avatar} src={member.avatarSrc} className="size-8 rounded-full" />
            <div>
              <p className="text-xs font-bold text-slate-800">{member.name}</p>
              <p className="text-[11px] text-slate-500">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WorksCard({ activity }: { activity: ArchiveActivity }) {
  return (
    <section className="rounded-[20px] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">创作成果</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {activity.works.map((work) => (
          <article key={`${activity.id}-${work.title}`} className="overflow-hidden rounded-[18px] border border-slate-100 bg-slate-50">
            <div
              className={`grid h-32 place-items-center bg-gradient-to-br ${work.gradient} bg-cover bg-center p-4 text-center`}
              style={work.image ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.18)), url(${work.image})` } : undefined}
            >
              <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-slate-600">{work.type}</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-950">{work.title}</h3>
              <p className="mt-1 text-xs font-semibold text-sky-600">{work.author}｜{work.type}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{work.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TimelineCard({ activity }: { activity: ArchiveActivity }) {
  return (
    <section className="rounded-[20px] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">小记整理时间线</h2>
      <div className="mt-4 space-y-0">
        {activity.timeline.map((item, index) => (
          <div key={`${activity.id}-${item.date}-${index}`} className="grid grid-cols-[72px_1fr] gap-3">
            <div className="text-right text-xs font-black text-sky-600">{item.date}</div>
            <div className="relative border-l-2 border-sky-100 pb-5 pl-4">
              <span className="absolute -left-[7px] top-0 size-3 rounded-full border-2 border-white bg-[#12b7f5]" />
              <p className="rounded-2xl bg-sky-50 px-3 py-2 text-sm leading-6 text-slate-700">{item.event}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LearningsCard({ activity }: { activity: ArchiveActivity }) {
  return (
    <section className="rounded-[20px] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">经验总结</h2>
      <div className="mt-4 grid gap-3">
        {activity.learnings.map((learning, index) => (
          <div key={`${activity.id}-learning-${index}`} className="rounded-2xl bg-gradient-to-br from-white to-sky-50 p-4">
            <p className="text-sm leading-6 text-slate-700">{learning}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusCard({ activity }: { activity: ArchiveActivity }) {
  return (
    <section className="rounded-[20px] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">归档状态</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {activity.statuses.map((status) => (
          <div key={`${activity.id}-${status.label}`} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <span className="text-sm font-semibold text-slate-600">{status.label}</span>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-emerald-600">{status.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
