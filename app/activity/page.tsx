"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, PageFrame, SimpleHeader } from "@/components/ourchive";
import { archiveSummary, avatarImages, coreActivity } from "@/lib/mockData";
import { reimuBirthdayImages, reimuBirthdayWorks } from "@/lib/reimuBirthdayAssets";

type Participant = {
  name: string;
  role?: string;
  avatar: string;
  avatarSrc?: string;
  admin?: boolean;
};

type ActivityMessage = {
  id: number;
  author: string;
  role: string;
  avatar: string;
  avatarSrc?: string;
  time: string;
  content: string;
  adminOnly?: boolean;
  self?: boolean;
  attachment?: {
    title: string;
    description: string;
    gradient: string;
    tag?: string;
    image?: string;
  };
};

type MessageVisibility = "public" | "admin";

const defaultPublicInput = "完结撒花~~各位老师都好强大";
const defaultAdminInput = "各位辛苦啦，我们等下用小记整理排版一下，宣发到小红书吧~";

const activityAdmins: Participant[] = [
  { name: "我", role: "管理员", avatar: "管", avatarSrc: avatarImages.admin, admin: true },
  { name: "南枝", role: "策划管理员", avatar: "南", avatarSrc: avatarImages.nanzhi, admin: true },
  { name: "墨团", role: "美术管理员", avatar: "墨", avatarSrc: avatarImages.motuan, admin: true },
  { name: "阿璃", role: "整理管理员", avatar: "璃", avatarSrc: avatarImages.ali, admin: true },
  { name: "小周", role: "技术/归档管理员", avatar: "周", avatarSrc: avatarImages.xiaozhou, admin: true },
];

const participants: Participant[] = [
  { name: "南枝", avatar: "南", avatarSrc: avatarImages.nanzhi },
  { name: "墨团", avatar: "墨", avatarSrc: avatarImages.motuan },
  { name: "未央", avatar: "未", avatarSrc: avatarImages.weiyang },
  { name: "阿璃", avatar: "璃", avatarSrc: avatarImages.ali },
  { name: "小周", avatar: "周", avatarSrc: avatarImages.xiaozhou },
  { name: "小满", avatar: "满" },
  { name: "青禾", avatar: "青" },
  { name: "夜雀", avatar: "夜" },
  { name: "河童", avatar: "河" },
  { name: "竹取", avatar: "竹" },
  { name: "桃", avatar: "桃" },
];

const adminUser: Participant = {
  ...activityAdmins[0],
};

const activityMessages: ActivityMessage[] = [
  {
    id: 1,
    author: "南枝",
    role: "策划管理员",
    avatar: "南",
    avatarSrc: avatarImages.nanzhi,
    time: "4.29 21:28",
    content: "灵梦生日快到了，要不要做一次图文接力？形式轻一点，大家有空就参加。",
  },
  {
    id: 2,
    author: "墨团",
    role: "美术管理员",
    avatar: "墨",
    avatarSrc: avatarImages.motuan,
    time: "4.29 21:30",
    content: "可以啊，插画、短篇、表情包、小漫画都能参加吧？",
  },
  {
    id: 3,
    author: "南枝",
    role: "策划管理员",
    avatar: "南",
    avatarSrc: avatarImages.nanzhi,
    time: "4.30 12:10",
    content: "那我们定成 24 小时图文接力？最后整理成一份生日纪念合辑。",
  },
  {
    id: 4,
    author: "墨团",
    role: "美术管理员",
    avatar: "墨",
    avatarSrc: avatarImages.motuan,
    time: "5.01 20:00",
    content: "我认领开场插画《神社清晨的灵梦》，想画灵梦早上打开神社门的画面。",
    attachment: {
      title: "《神社清晨的灵梦》构图草稿",
      description: "开场插画 / 神社清晨 / 红白配色 / 构图草稿",
      gradient: "from-rose-200 via-orange-100 to-sky-200",
      tag: "草稿",
      image: reimuBirthdayImages.shrineMorningSketch,
    },
  },
  {
    id: 5,
    author: "未央",
    role: "写手",
    avatar: "未",
    avatarSrc: avatarImages.weiyang,
    time: "5.02 18:40",
    content: "那我接一篇短篇《神社来信》，写灵梦收到大家礼物之前的独白。",
  },
  {
    id: 6,
    author: "阿璃",
    role: "画手",
    avatar: "璃",
    avatarSrc: avatarImages.ali,
    time: "5.02 21:15",
    content: "封面可以不要太满，红白配色加一点神社木纹，标题留白多一点会更像纪念合辑。",
  },
  {
    id: 7,
    author: "小满",
    role: "画手",
    avatar: "满",
    time: "5.03 22:15",
    content: "我先做《灵梦生日表情包》第一版草稿，想放几个“生日快乐”“赛钱箱空了”之类的梗。",
    attachment: {
      title: "《灵梦生日表情包》第一版草稿",
      description: "表情包 / 生日快乐 / 赛钱箱 / 过程稿",
      gradient: "from-cyan-100 via-sky-200 to-fuchsia-100",
      tag: "草稿",
      image: reimuBirthdayImages.stickerSheet,
    },
  },
  {
    id: 8,
    author: "青禾",
    role: "画手",
    avatar: "青",
    time: "5.04 16:20",
    content: "我补一张《赛钱箱旁边的生日蛋糕》小插图，尺寸可以小一点，放在合辑中段。",
  },
  {
    id: 9,
    author: "夜雀",
    role: "写手",
    avatar: "夜",
    time: "5.04 21:00",
    content: "我想加一个《礼物清单》栏目，大家每个人写一句送给灵梦的礼物说明，感觉很有同好感。",
  },
  {
    id: 10,
    author: "河童",
    role: "技术",
    avatar: "河",
    time: "5.05 19:30",
    content: "如果最后素材够，我可以做《灵梦生日合辑网页预览》，把插画、短篇和表情包串起来。",
  },
  {
    id: 11,
    author: "小周",
    role: "技术/归档管理员",
    avatar: "周",
    avatarSrc: avatarImages.xiaozhou,
    time: "5.05 20:10",
    content: "我会把投稿按作者、类型、状态、授权情况先建一个表，后面整理活动记录会更清楚。",
    adminOnly: true,
  },
  {
    id: 12,
    author: "南枝",
    role: "策划管理员",
    avatar: "南",
    avatarSrc: avatarImages.nanzhi,
    time: "5.06 19:40",
    content: "今晚20:00正式开始接力！大家发稿时记得写清楚：作品名、作者名、作品类型、是否最终稿。",
  },
  {
    id: 121,
    author: "小周",
    role: "技术/归档管理员",
    avatar: "周",
    avatarSrc: avatarImages.xiaozhou,
    time: "5.06 19:42",
    content: "收到，我先把投稿格式贴一下。",
  },
  {
    id: 122,
    author: "小周",
    role: "技术/归档管理员",
    avatar: "周",
    avatarSrc: avatarImages.xiaozhou,
    time: "5.06 19:43",
    content: "投稿格式：作品名 / 作者名 / 类型 / 是否最终稿 / 是否允许进入活动记录。",
  },
  {
    id: 13,
    author: "墨团",
    role: "美术管理员",
    avatar: "墨",
    avatarSrc: avatarImages.motuan,
    time: "5.06 20:30",
    content: "《神社清晨的灵梦》线稿细化完成了，先发一版过程稿。",
    attachment: {
      title: "《神社清晨的灵梦》线稿",
      description: "开场插画 / 线稿 / 过程稿",
      gradient: "from-rose-100 via-red-100 to-amber-100",
      tag: "线稿",
      image: reimuBirthdayImages.shrineMorningLineart,
    },
  },
  {
    id: 14,
    author: "未央",
    role: "写手",
    avatar: "未",
    avatarSrc: avatarImages.weiyang,
    time: "5.07 00:15",
    content: "《神社来信》写完前半段了，后面想接到大家送礼物的场景。",
  },
  {
    id: 15,
    author: "小满",
    role: "画手",
    avatar: "满",
    time: "5.07 12:00",
    content: "表情包补了两个新表情，一个是“今天不除妖”，一个是“赛钱箱生日特供”。",
    attachment: {
      title: "《灵梦生日表情包》半成品",
      description: "表情包 / 新增两枚 / 半成品",
      gradient: "from-sky-100 via-fuchsia-100 to-rose-100",
      tag: "半成品",
      image: reimuBirthdayImages.stickerSheet,
    },
  },
  {
    id: 16,
    author: "阿璃",
    role: "画手",
    avatar: "璃",
    avatarSrc: avatarImages.ali,
    time: "5.07 15:30",
    content: "我做了一张封面分镜，感觉可以用红白色块分割，把作品列表放在右下角。",
    attachment: {
      title: "《合辑封面分镜》",
      description: "封面候选 / 红白配色 / 排版草图",
      gradient: "from-red-100 via-white to-slate-200",
      tag: "封面候选",
      image: reimuBirthdayImages.anthologyStoryboard,
    },
  },
  {
    id: 17,
    author: "南枝",
    role: "策划管理员",
    avatar: "南",
    avatarSrc: avatarImages.nanzhi,
    time: "5.07 18:20",
    content: "结束前需要确认每个作品的署名和授权范围，过程稿和最终稿也要分开标注。",
    adminOnly: true,
  },
  {
    id: 18,
    author: "小周",
    role: "技术/归档管理员",
    avatar: "周",
    avatarSrc: avatarImages.xiaozhou,
    time: "5.07 19:10",
    content: "目前已记录：开场插画、短篇、表情包、小插图、礼物清单、网页预览。等20:00后我会统一按类型归档。",
    adminOnly: true,
  },
  {
    id: 19,
    author: "河童",
    role: "技术",
    avatar: "河",
    time: "5.07 19:40",
    content: "网页预览结构已经搭好了，等最终稿齐了就能放进去。",
  },
  {
    id: 20,
    author: "南枝",
    role: "策划管理员",
    avatar: "南",
    avatarSrc: avatarImages.nanzhi,
    time: "5.07 20:00",
    content: "接力收稿啦！辛苦大家，后面会把这次活动整理成完整记录。",
  },
];

const extractedTimeline = [
  "4.29 21:28  南枝提出灵梦生日图文接力设想",
  "4.30 12:10  确认 24 小时接力与生日纪念合辑形式",
  "5.01 20:00  墨团认领《神社清晨的灵梦》",
  "5.02 18:40  未央认领《神社来信》",
  "5.03 22:15  小满提交《灵梦生日表情包》第一版草稿",
  "5.04 16:20  青禾补充《赛钱箱旁边的生日蛋糕》小插图构思",
  "5.05 19:30  河童确认合辑网页预览结构",
  "5.06 20:00  活动正式开始，开放接力投稿",
  "5.07 12:00  成员补交半成品与过程稿",
  "5.07 20:00  活动收稿，进入作品整理阶段",
];

const extractedTodo = ["作品授权与署名", "过程稿 / 最终稿标注", "合辑封面候选", "接力顺序记录", "作品类型归档"];

const extractedImages = [
  "《神社清晨的灵梦》构图草稿",
  "《神社清晨的灵梦》线稿",
  "《灵梦生日表情包》第一版草稿",
  "《灵梦生日表情包》半成品",
  "《赛钱箱旁边的生日蛋糕》构思图",
  "合辑封面分镜",
];

const extractedHighlights = [
  "已识别 6 类作品条目：插画、短篇、表情包、小插图、礼物清单、网页预览",
  "活动从 4.29 策划讨论持续到 5.07 收稿，节点完整",
  "整理重点集中在署名授权、稿件状态、接力顺序和类型归档",
];

let hasJoinedActivityInRuntime = false;
let activityRecordGeneratedInRuntime = false;

export default function ActivityPage() {
  const [hasJoined, setHasJoined] = useState(hasJoinedActivityInRuntime);
  const [generated, setGenerated] = useState(activityRecordGeneratedInRuntime);
  const [visibility, setVisibility] = useState<MessageVisibility>("public");
  const [inputValue, setInputValue] = useState(defaultPublicInput);
  const [publicPresetSent, setPublicPresetSent] = useState(false);
  const [adminPresetSent, setAdminPresetSent] = useState(false);
  const [discussionMessages, setDiscussionMessages] = useState<ActivityMessage[]>(activityMessages);

  function sendMessage() {
    const content = inputValue.trim();
    if (!content) return;
    setDiscussionMessages((current) => [
      ...current,
      {
        id: Date.now(),
        author: "我",
        avatar: "管",
        avatarSrc: "/avatars/admin.png",
        time: "现在",
        content,
        role: "管理员",
        self: true,
        adminOnly: visibility === "admin",
      },
    ]);
    if (visibility === "public") setPublicPresetSent(true);
    if (visibility === "admin") setAdminPresetSent(true);
    setInputValue("");
  }

  function handleJoin() {
    hasJoinedActivityInRuntime = true;
    setHasJoined(true);
  }

  function handleGenerateRecord() {
    activityRecordGeneratedInRuntime = true;
    setGenerated(true);
  }

  const displayParticipants = hasJoined ? [adminUser, ...participants] : participants;

  return (
    <PageFrame>
      <SimpleHeader title="活动详情" backHref="/" backLabel="返回群聊" right={<span className="text-xs text-slate-400">群小记从群聊识别创建</span>} />
      <div className="grid min-h-[calc(100vh-96px)] grid-cols-[minmax(0,1fr)_350px] bg-[#edf5fb]">
        <main className="min-w-0 overflow-y-auto p-6">
          <section className="rounded-[18px] bg-gradient-to-br from-white to-sky-50 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">进行中</span>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">已发布</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-950">{coreActivity.title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{coreActivity.description}</p>
              </div>
              <button
                disabled={hasJoined}
                onClick={handleJoin}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition ${
                  hasJoined
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "bg-[#12b7f5] text-white hover:bg-sky-500"
                }`}
              >
                {hasJoined ? "已参与" : "一键参与"}
              </button>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-[14px] bg-white/80 p-4 text-sm">
                <p className="text-xs text-slate-400">时间</p>
                <p className="mt-1 font-semibold text-slate-800">{coreActivity.time}</p>
              </div>
              <div className="rounded-[14px] bg-white/80 p-4 text-sm">
                <p className="text-xs text-slate-400">形式</p>
                <p className="mt-1 font-semibold text-slate-800">{coreActivity.format}</p>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[18px] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-950">参与成员</h2>
              <span className="text-sm text-slate-500">已参与 {displayParticipants.length} 人</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {displayParticipants.map((member) => (
                <div key={`${member.name}-${member.avatar}`} className="flex flex-col items-center gap-2">
                  <Avatar label={member.avatar} src={member.avatarSrc} active={member.admin} />
                  <span className={`text-xs ${member.admin ? "font-semibold text-sky-600" : "text-slate-500"}`}>
                    {member.name}
                    {member.admin ? <span className="ml-1 rounded-full bg-sky-50 px-1.5 py-0.5 text-[10px] text-sky-600">管理员</span> : null}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-[18px] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-950">创作成果</h2>
              <span className="text-sm text-slate-500">{reimuBirthdayWorks.length} 件作品与过程稿</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reimuBirthdayWorks.map((work) => (
                <article key={work.title} className="overflow-hidden rounded-[16px] border border-slate-100 bg-slate-50">
                  <div
                    className={`grid h-36 place-items-center bg-gradient-to-br ${work.gradient} bg-cover bg-center p-4 text-center`}
                    style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.18)), url(${work.image})` }}
                  >
                    <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-slate-700">{work.type}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-950">{work.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-sky-600">{work.author}｜{work.type}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-5 flex h-[560px] flex-col overflow-hidden rounded-[18px] bg-[#edf5fb] shadow-sm ring-1 ring-white/80">
            <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4">
              <h2 className="font-bold text-slate-950">活动讨论区</h2>
              <p className="mt-1 text-xs text-slate-500">活动相关讨论会从主群聊同步归档；仅管理员可见内容只在活动页内展示。</p>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
              {discussionMessages.map((message) => (
                <ActivityChatBubble key={message.id} message={message} />
              ))}
            </div>
            <div className="shrink-0 border-t border-slate-200 bg-white p-4">
              <div className="mb-3 inline-flex rounded-full bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setVisibility("public");
                    setInputValue(publicPresetSent ? "" : defaultPublicInput);
                  }}
                  className={`rounded-full px-3 py-1 transition ${
                    visibility === "public" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  公开
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVisibility("admin");
                    setInputValue(adminPresetSent ? "" : defaultAdminInput);
                  }}
                  className={`rounded-full px-3 py-1 transition ${
                    visibility === "admin" ? "bg-violet-100 text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  仅管理员可见
                </button>
              </div>
              <textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                className="h-20 w-full resize-none rounded-xl bg-slate-50 p-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-sky-100"
                placeholder={visibility === "admin" ? "发送仅管理成员可见的讨论..." : "以管理员身份参与活动讨论..."}
              />
              <div className="mt-3 flex justify-end">
                <button onClick={sendMessage} className="rounded-lg bg-[#12b7f5] px-5 py-2 text-sm font-bold text-white hover:bg-sky-500">
                  发送
                </button>
              </div>
            </div>
          </section>
        </main>

        <aside className="border-l border-slate-200 bg-white p-5">
          <div className="sticky top-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">群小记｜活动整理</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${generated ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {generated ? "整理完成" : "草稿中"}
              </span>
            </div>
            <div className="space-y-4">
              <p className="rounded-xl bg-sky-50 px-3 py-2 text-xs leading-5 text-sky-700">
                我会把活动相关讨论、作品草稿和成员补充整理成可复用的活动记录。
              </p>
              <TimelinePanel title="活动时间线" items={extractedTimeline} />
              <Panel title={generated ? "精选内容" : "待确认事项"} items={generated ? extractedHighlights : extractedTodo} tone="violet" />
              <Panel title={generated ? "经验摘要" : "推荐归档图片"} items={generated ? archiveSummary.learnings : extractedImages} tone="sky" />
            </div>
            {!generated ? (
              <button onClick={handleGenerateRecord} className="mt-5 w-full rounded-xl bg-[#12b7f5] px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500">
                生成活动记录
              </button>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/archive?activity=reimu-birthday" className="rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-100">
                  查看活动记录
                </Link>
                <Link href="/promo?activity=reimu-birthday" className="rounded-lg bg-violet-50 px-3 py-2 text-center text-sm font-semibold text-violet-700 hover:bg-violet-100">
                  整理宣发素材
                </Link>
              </div>
            )}
          </div>
        </aside>
      </div>
    </PageFrame>
  );
}

function Panel({ title, items, tone = "slate" }: { title: string; items: string[]; tone?: "slate" | "violet" | "sky" }) {
  const colors = {
    slate: "bg-slate-50 text-slate-700",
    violet: "bg-violet-50 text-violet-700",
    sky: "bg-sky-50 text-sky-700",
  };
  return (
    <section className={`rounded-[14px] p-4 ${colors[tone]}`}>
      <h3 className="mb-2 text-sm font-bold">{title}</h3>
      <div className="space-y-2 text-sm leading-6">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </section>
  );
}

function TimelinePanel({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[14px] bg-slate-50 p-4 text-slate-700">
      <h3 className="mb-3 text-sm font-bold">{title}</h3>
      <div className="space-y-2.5 text-xs leading-5">
        {items.map((item) => (
          <div key={item} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-400" />
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityChatBubble({ message }: { message: ActivityMessage }) {
  return (
    <div className={`flex gap-3 ${message.self ? "justify-end" : ""}`}>
      {!message.self ? <Avatar label={message.avatar} src={message.avatarSrc} className="size-9 rounded-full" /> : null}
      <div className={`flex max-w-[74%] flex-col ${message.self ? "items-end" : "items-start"}`}>
        <div className={`mb-1 flex items-center gap-2 text-xs ${message.self ? "justify-end" : ""}`}>
          <span className="font-medium text-slate-600">{message.author}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] ${
              message.adminOnly ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700"
            }`}
          >
            {message.role}
          </span>
          <span className="text-slate-400">{message.time}</span>
        </div>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm ${
            message.adminOnly
              ? "border border-violet-100 bg-violet-50 text-violet-800"
              : message.self
                ? "rounded-tr-md bg-[#12b7f5] text-white"
                : "rounded-tl-md bg-white text-slate-800"
          }`}
        >
          {message.adminOnly ? <div className="mb-1 text-xs font-semibold text-violet-500">仅管理员可见</div> : null}
          <p>{message.content}</p>
          {message.attachment ? (
            <div className="mt-3 overflow-hidden rounded-[14px] border border-white/70 bg-white text-slate-700 shadow-sm">
              <div
                className={`relative grid h-28 place-items-center bg-gradient-to-br ${message.attachment.gradient} bg-cover bg-center text-sm font-bold text-white`}
                style={message.attachment.image ? { backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.1), rgba(124, 58, 237, 0.18)), url(${message.attachment.image})` } : undefined}
              >
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600">作品预览</span>
                {message.attachment.tag ? (
                  <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-sky-600">{message.attachment.tag}</span>
                ) : null}
              </div>
              <div className="p-3">
                <p className="font-bold text-slate-900">{message.attachment.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{message.attachment.description}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {message.self ? <Avatar label={message.avatar} src={message.avatarSrc} active className="size-9 rounded-full" /> : null}
    </div>
  );
}
