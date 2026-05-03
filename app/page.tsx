"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Avatar, ChatBubble, MainNav, QqSystemBar } from "@/components/ourchive";
import {
  chatMessages,
  conversations,
  coreActivity,
  currentGroup,
  type ChatMessage,
} from "@/lib/mockData";
import {
  clearUploadedWorks,
  createDemoUploadedWork,
  demoUploadImagePath,
  getUploadedWorksServerSnapshot,
  getUploadedWorksSnapshot,
  parseUploadedWorksSnapshot,
  saveUploadedWork,
  subscribeUploadedWorks,
  type UploadedWork,
} from "@/lib/uploadedWorks";
import { createPendingActivityId, savePendingActivity } from "@/lib/pendingActivity";
import { reimuBirthdayImages } from "@/lib/reimuBirthdayAssets";

type ApprovalState = "pending" | "postponed" | "pinned" | "ignored";
type ActivityPreview = {
  id?: string;
  title: string;
  time: string;
  format: string;
  target: string;
  source: string;
  description: string;
  rawMessage?: string;
  isDetected?: boolean;
};

let approvalHandledInRuntime = false;
let approvalStateInRuntime: ApprovalState = "pending";
let uploadedWorksClearedForReloadInRuntime = false;
const unreadStateInRuntime = {
  works: true,
  archive: true,
  activityPreview: true,
};

function markWorksReadInRuntime() {
  unreadStateInRuntime.works = false;
}

function markArchiveReadInRuntime() {
  unreadStateInRuntime.archive = false;
}

function markActivityPreviewReadInRuntime() {
  unreadStateInRuntime.activityPreview = false;
}

const sidebarWorks = [
  { title: "《神社清晨的灵梦》", type: "开场插画", author: "墨团", activity: "灵梦生日图文接力活动", image: reimuBirthdayImages.shrineMorningFinal },
  { title: "《神社来信》", type: "短篇文字", author: "未央", activity: "灵梦生日图文接力活动", image: reimuBirthdayImages.shrineLetter },
  { title: "《灵梦生日表情包》", type: "表情包", author: "小满", activity: "灵梦生日图文接力活动", image: reimuBirthdayImages.stickerSheet },
  { title: "《合辑封面分镜》", type: "封面候选", author: "阿璃", activity: "灵梦生日图文接力活动", image: reimuBirthdayImages.anthologyStoryboard },
];

type SidebarWork = {
  title: string;
  type: string;
  author: string;
  activity: string;
  image?: string;
};

const sidebarActivities = [
  { title: "灵梦生日图文接力活动", date: "2026.04.29 - 2026.05.07", desc: "24小时图文接力，完成生日纪念合辑", href: "/archive/reimu-birthday" },
  { title: "角色 in 校园——实景明信片拍摄与绘制活动", date: "2026.03.22 - 2026.03.30", desc: "实景拍摄与角色绘制形成明信片作品", href: "/archive/campus-postcard" },
  { title: "水灯节场贩与招新活动", date: "2026.03.10 - 2026.03.15", desc: "线下摊位、无料交换与招新经验沉淀", href: "/archive/water-lantern-fair" },
  { title: "故事接龙——给定开头的图文续写活动", date: "2026.02.18 - 2026.02.25", desc: "基于开头续写故事并配插图漫画", href: "/archive/story-relay" },
];

const timeKeywords = ["下个月月底", "下个月", "月底", "下周", "周六", "周日", "明天", "后天", "5月", "6月", "晚上", "下午", "什么时候", "做什么", "最近", "这周", "周末"];
const activityKeywords = ["创作", "接力", "活动", "一起", "画", "绘制", "拍摄", "明信片", "扑克牌", "角色", "投稿", "合辑", "小漫画", "表情包", "共创", "企划", "做一套", "来一个"];

function extractActivityTime(content: string) {
  if (content.includes("下个月月底")) return "下个月月底";
  if (content.includes("下个月")) return "下个月";
  if (content.includes("下周")) return "下周";
  if (content.includes("周六")) return "周六";
  if (content.includes("周日")) return "周日";
  if (content.includes("明天")) return "明天";
  if (content.includes("后天")) return "后天";
  if (content.includes("这周") || content.includes("周末")) return "本周/周末";
  return timeKeywords.find((keyword) => content.includes(keyword)) ?? "待确认";
}

function extractActivityTitle(content: string) {
  if (content.includes("角色扑克牌") || content.includes("扑克牌")) return "角色扑克牌共创活动";
  if (content.includes("创作接力")) return "创作接力共创活动";
  if (content.includes("明信片")) return "角色明信片共创活动";
  if (content.includes("表情包")) return "表情包共创活动";
  return "未命名共创活动";
}

function describeDetectedActivity(title: string) {
  if (title === "角色扑克牌共创活动") return "从群聊发起的角色主题共创活动，成员可认领角色绘制、卡面设计和设定说明。";
  if (title === "创作接力共创活动") return "从群聊发起的创作接力活动，成员可以按顺序认领内容、补充图文并完成合辑整理。";
  if (title === "角色明信片共创活动") return "从群聊发起的角色明信片共创活动，成员可以提供场景、绘制角色并整理成统一展示。";
  if (title === "表情包共创活动") return "从群聊发起的表情包共创活动，成员可以一起补梗、绘制表情并整理成群内可用素材。";
  return "从群聊发起的共创活动，具体主题、时间和投稿形式还需要管理员确认。";
}

function detectActivityIntent(combinedText: string, rawMessage: string) {
  const hasTime = timeKeywords.some((keyword) => combinedText.includes(keyword));
  const hasActivity = activityKeywords.some((keyword) => combinedText.includes(keyword));
  if (!hasTime || !hasActivity) return null;

  const title = extractActivityTitle(combinedText);
  const time = extractActivityTime(combinedText);
  return {
    id: createPendingActivityId(),
    title,
    time,
    format: "共创活动",
    target: "群成员",
    source: "管理员刚刚发送的群聊消息",
    description: describeDetectedActivity(title),
    rawMessage,
    isDetected: true,
  } satisfies ActivityPreview;
}

function buildDetectionReply(activity: ActivityPreview, messageCount: number) {
  if (activity.title === "未命名共创活动") {
    return "我把最近几条群聊合起来看了一下，像是有一次新的共创活动正在被发起，要不要先整理成活动卡？";
  }

  if (messageCount > 1) {
    return `我把你刚才几条消息合起来看了一下，像是在发起一次「${activity.title}」。要不要先整理成活动卡给管理员确认？`;
  }

  return `我从这条消息里识别到一个可能的新活动：「${activity.title}」。要不要先整理成活动卡给管理员确认？`;
}

function ConversationList() {
  return (
    <aside className="flex w-[306px] shrink-0 flex-col border-r border-slate-200 bg-[#f3f6fb]">
      <div className="flex items-center gap-2 px-4 pb-3 pt-4">
        <div className="flex h-9 flex-1 items-center rounded-lg bg-white px-3 text-sm text-slate-400 shadow-sm">搜索</div>
        <button className="grid size-9 place-items-center rounded-lg bg-white text-xl text-slate-500 shadow-sm hover:bg-sky-50 hover:text-sky-500">
          +
        </button>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        {conversations.map((item) => (
          <button
            key={item.id}
            className={`flex w-full items-center gap-3 rounded-[14px] p-3 text-left transition ${
              item.active ? "bg-white shadow-sm" : "hover:bg-white/80"
            }`}
          >
            <div className="relative">
              <Avatar label={item.avatar} src={item.avatarSrc} />
              {item.unread && item.name !== "书画社活动群" ? (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                  {item.unread}
                </span>
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
              <p className="mt-1 truncate text-xs text-slate-500">{item.message}</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

function ApprovalModal({
  activity,
  onClose,
  onIgnore,
  onLater,
  onEdit,
  onApprove,
  onSave,
}: {
  activity?: ActivityPreview;
  onClose: () => void;
  onIgnore: () => void;
  onLater: () => void;
  onEdit?: () => void;
  onApprove: (activity: ActivityPreview) => void;
  onSave: () => void;
}) {
  const initialActivity = activity ?? {
    title: coreActivity.title,
    time: coreActivity.time,
    format: coreActivity.format,
    target: `${coreActivity.participants}人`,
    source: "最近若干条群聊消息",
    description: coreActivity.shortDescription,
  };
  const [display, setDisplay] = useState<ActivityPreview>(initialActivity);
  const [draft, setDraft] = useState<ActivityPreview>(initialActivity);
  const [isEditing, setIsEditing] = useState(false);

  function updateDraft(field: keyof ActivityPreview, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function startEditing() {
    setDraft(display);
    setIsEditing(true);
    onEdit?.();
  }

  function cancelEditing() {
    setDraft(display);
    setIsEditing(false);
  }

  function saveEditing() {
    setDisplay(draft);
    setIsEditing(false);
    onSave();
  }

  const approvalData = isEditing ? draft : display;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/10 pt-24">
      <div className="z-[60] w-[420px] rounded-[18px] border border-sky-100 bg-white p-5 shadow-2xl shadow-sky-200/50">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-sky-500">✨ 群小记识别到活动策划</p>
            <h2 className="mt-1 text-lg font-bold text-slate-950">{approvalData.title}</h2>
            <p className="mt-1 text-xs text-slate-400">来源：{approvalData.source}</p>
          </div>
          <button onClick={onClose} className="rounded-full px-2 text-lg text-slate-400 hover:bg-slate-100">
            x
          </button>
        </div>
        <div className="space-y-2 rounded-[14px] bg-slate-50 p-4 text-sm text-slate-600">
          <p>我从最近的群聊里抓到一组活动相关信息，请管理员确认后发布。</p>
          {isEditing ? (
            <>
              <EditField label="活动名称" value={draft.title} onChange={(value) => updateDraft("title", value)} />
              <EditField label="初步时间" value={draft.time} onChange={(value) => updateDraft("time", value)} />
              <EditField label="活动形式" value={draft.format} onChange={(value) => updateDraft("format", value)} />
              <EditField label="参与对象" value={draft.target} onChange={(value) => updateDraft("target", value)} />
              <label className="block text-xs font-semibold text-slate-500">
                活动描述
                <textarea
                  value={draft.description}
                  onChange={(event) => updateDraft("description", event.target.value)}
                  className="mt-1 h-20 w-full resize-none rounded-xl bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-100"
                />
              </label>
            </>
          ) : (
            <>
              <p>活动名称：{display.title}</p>
              <p>初步时间：{display.time || "待确认"}</p>
              <p>活动形式：{display.format}</p>
              <p>参与对象：{display.target}</p>
              <p>描述：{display.description}</p>
            </>
          )}
          {approvalData.rawMessage ? <p className="rounded-xl bg-white px-3 py-2 text-xs leading-5 text-slate-500">原始消息：{approvalData.rawMessage}</p> : null}
        </div>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {isEditing ? (
            <>
              <button onClick={cancelEditing} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500 hover:bg-slate-200">
                取消
              </button>
              <button onClick={saveEditing} className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-600 hover:bg-sky-100">
                保存修改
              </button>
              <button onClick={() => onApprove(draft)} className="rounded-lg bg-[#12b7f5] px-3 py-2 text-sm font-semibold text-white hover:bg-sky-500">
                通过并置顶
              </button>
            </>
          ) : (
            <>
              <button onClick={onIgnore} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500 hover:bg-rose-50 hover:text-rose-500">
                忽略此活动
              </button>
              <button onClick={onLater} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                稍后处理
              </button>
              <button onClick={startEditing} className="rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-600 hover:bg-sky-100">
                编辑信息
              </button>
              <button onClick={() => onApprove(display)} className="rounded-lg bg-[#12b7f5] px-3 py-2 text-sm font-semibold text-white hover:bg-sky-500">
                通过并置顶
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EditField({ label, onChange, value }: { label: string; onChange: (value: string) => void; value: string }) {
  return (
    <label className="block text-xs font-semibold text-slate-500">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-9 w-full rounded-xl bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}

function SummaryFloat({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-6 top-6 z-20 w-64 rounded-[14px] border border-white/80 bg-white/95 p-3 shadow-lg shadow-slate-200/80 backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-900">群小记｜聊天摘要</h3>
        <button onClick={onClose} className="rounded-full px-1.5 text-sm leading-5 text-slate-400 hover:bg-slate-100">
          x
        </button>
      </div>
      <p className="mb-2 text-xs font-semibold text-slate-500">🔥 最近大家在聊</p>
      <div className="rounded-xl bg-sky-50/70 p-2.5">
        <p className="mb-1.5 text-xs font-semibold text-sky-700">🎯 当前热聊</p>
        <ul className="space-y-1 text-xs leading-5 text-slate-600">
          <li>灵梦生日图文接力</li>
          <li>开场图与短篇认领</li>
          <li>生日合辑排版</li>
        </ul>
      </div>
      <div className="mt-2 rounded-xl bg-violet-50/60 p-2.5">
        <p className="mb-1.5 text-xs font-semibold text-violet-700">📅 本周热议</p>
        <ul className="space-y-1 text-xs leading-5 text-slate-600">
          <li>图文接力分工</li>
          <li>投稿格式与作品状态</li>
          <li>过程稿与最终稿整理</li>
        </ul>
      </div>
      <p className="mt-2 rounded-xl bg-slate-50 px-2.5 py-2 text-xs leading-5 text-slate-500">
        已自动忽略食堂闲聊与无关表情包。
      </p>
    </div>
  );
}

function UploadModal({
  onClose,
  onPublish,
}: {
  onClose: () => void;
  onPublish: (work: UploadedWork) => void;
}) {
  const [selected, setSelected] = useState(false);
  const [title, setTitle] = useState("《角色扑克牌设定图》");
  const [type, setType] = useState<UploadedWork["type"]>("插画");
  const [description, setDescription] = useState("角色扑克牌共创活动的第一张卡面设定图，尝试把角色特征整理成适合卡牌展示的视觉元素。");
  const [authorizedForWall, setAuthorizedForWall] = useState(true);
  const [authorizedForPromo, setAuthorizedForPromo] = useState(true);
  const [syncedToQzone, setSyncedToQzone] = useState(true);
  const [error, setError] = useState("");

  function handlePublish() {
    if (!selected) {
      setError("请先选择一张作品图片。");
      return;
    }

    onPublish(
      createDemoUploadedWork({
        title,
        type,
        description,
        authorizedForWall,
        authorizedForPromo,
        syncedToQzone,
      }),
    );
  }

  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-slate-900/20 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-[470px] flex-col rounded-[18px] bg-white p-5 shadow-2xl">
        <div className="mb-3 flex shrink-0 items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950">上传作品</h2>
          <button onClick={onClose} className="rounded-full px-2 text-slate-400 hover:bg-slate-100">
            x
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
          <div
            className="grid h-48 place-items-center overflow-hidden rounded-[14px] bg-gradient-to-br from-rose-100 via-white to-sky-200 bg-cover bg-center p-4 text-center"
            style={selected ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.16), rgba(15, 23, 42, 0.12)), url(${demoUploadImagePath})` } : undefined}
          >
            {selected ? (
              <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-sm font-bold text-slate-800">reimu-card-demo.png</p>
                <p className="mt-1 text-xs text-slate-500">已选取预设图片</p>
              </div>
            ) : (
              <div>
                <div className="mx-auto mb-2 grid size-11 place-items-center rounded-2xl bg-white text-2xl shadow-sm">🖼️</div>
                <p className="text-sm font-bold text-slate-800">选择要发布的作品图片</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(true);
                    setError("");
                  }}
                  className="mt-3 rounded-xl bg-[#12b7f5] px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-500"
                >
                  选取本地文件
                </button>
                <p className="mt-2 text-xs text-slate-500">Demo 将使用预设图片模拟本地上传</p>
              </div>
            )}
          </div>
          <div className="mt-3 space-y-3 text-sm text-slate-600">
            {selected ? (
              <div className="grid gap-2.5">
                <label className="text-xs font-semibold text-slate-500">
                  作品标题
                  <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 h-9 w-full rounded-xl bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-100" />
                </label>
                <label className="text-xs font-semibold text-slate-500">
                  作品类型
                  <select value={type} onChange={(event) => setType(event.target.value as UploadedWork["type"])} className="mt-1 h-9 w-full rounded-xl bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-100">
                    {["插画", "文字", "漫画", "表情包", "摄影"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold text-slate-500">
                  作品描述
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 h-16 w-full resize-none rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-100" />
                </label>
              </div>
            ) : null}
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={authorizedForWall} onChange={(event) => setAuthorizedForWall(event.target.checked)} className="size-4 accent-sky-500" />
              加入群作品墙
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={authorizedForPromo} onChange={(event) => setAuthorizedForPromo(event.target.checked)} className="size-4 accent-sky-500" />
              允许用于社群宣发
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={syncedToQzone} onChange={(event) => setSyncedToQzone(event.target.checked)} className="size-4 accent-sky-500" />
              同步到QQ空间
            </label>
            {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-500">{error}</p> : null}
            <p className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
              作品仅用于本群展示、活动记录和授权范围内的宣发整理，不会用于模型训练。
            </p>
          </div>
        </div>
        <div className="mt-4 flex shrink-0 justify-end gap-2 border-t border-slate-100 bg-white pt-4">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            取消
          </button>
          <button onClick={handlePublish} className="rounded-lg bg-[#12b7f5] px-4 py-2 text-sm font-bold text-white hover:bg-sky-500">
            上传并发布
          </button>
        </div>
      </div>
    </div>
  );
}

function RightCommunityPanel({
  activityPreviewUnread,
  approvalState,
  archiveUnread,
  onActivityPreviewOpen,
  onArchiveOpen,
  onReopenApproval,
  onWorksOpen,
  pinnedActivity,
  recentWorks,
  worksUnread,
}: {
  activityPreviewUnread: boolean;
  approvalState: ApprovalState;
  archiveUnread: boolean;
  onActivityPreviewOpen: () => void;
  onArchiveOpen: () => void;
  onReopenApproval: () => void;
  onWorksOpen: () => void;
  pinnedActivity: ActivityPreview;
  recentWorks: SidebarWork[];
  worksUnread: boolean;
}) {
  const pinnedActivityHref = pinnedActivity.id
    ? `/archive/${pinnedActivity.id}${pinnedActivity.isDetected || pinnedActivity.source === "chat-detected" ? "?source=chat-detected" : ""}`
    : "/archive/reimu-birthday";

  return (
    <aside className="flex min-h-0 w-[330px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-slate-200 bg-white p-4 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
      <section className="relative rounded-[14px] bg-gradient-to-br from-sky-50 to-violet-50 p-4">
        {activityPreviewUnread ? <span className="absolute right-3 top-3 size-2 rounded-full bg-red-500" /> : null}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-950">活动预告</h2>
        </div>
        {approvalState === "pinned" ? (
          <Link href={pinnedActivityHref} onClick={onActivityPreviewOpen} className="block rounded-xl p-1 transition hover:bg-white/45">
            <p className="text-sm font-semibold text-slate-800">{pinnedActivity.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{pinnedActivity.description}</p>
            <span className="mt-4 inline-flex rounded-lg bg-white px-3 py-2 text-sm font-semibold text-sky-600 shadow-sm">
              查看活动详情
            </span>
          </Link>
        ) : approvalState === "postponed" || approvalState === "pending" ? (
          <div className="space-y-3">
            <button onClick={onReopenApproval} className="w-full rounded-xl border border-dashed border-amber-200 bg-white/70 p-3 text-left text-sm text-slate-600 hover:bg-white">
              <span className="font-semibold text-amber-700">待处理：</span>
              {coreActivity.title}
              <span className="mt-2 block text-xs text-slate-400">点击重新打开群小记活动确认</span>
            </button>
            <Link
              href="/archive/reimu-birthday"
              onClick={onActivityPreviewOpen}
              className="inline-flex rounded-lg bg-white px-3 py-2 text-sm font-semibold text-sky-600 shadow-sm hover:bg-sky-50"
            >
              查看活动详情
            </Link>
          </div>
        ) : (
          <p className="rounded-xl bg-white/70 p-3 text-sm text-slate-400">暂时没有新的活动预告。</p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-950">近期作品</h2>
          <Link href="/works" onClick={onWorksOpen} className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-500">
            {worksUnread ? <span className="size-1.5 rounded-full bg-red-500" /> : null}
            查看更多作品 →
          </Link>
        </div>
        <Link href="/works" onClick={onWorksOpen} className="block space-y-3">
          {recentWorks.map((work) => (
            <div key={work.title} className="relative flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              {worksUnread ? <span className="absolute right-3 top-3 size-1.5 rounded-full bg-red-500" /> : null}
              {work.image ? (
                <span
                  className="h-14 w-14 shrink-0 rounded-lg bg-gradient-to-br from-rose-100 via-white to-sky-100 bg-cover bg-center"
                  style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.08), rgba(15, 23, 42, 0.12)), url(${work.image})` }}
                />
              ) : null}
              <span className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{work.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {work.type}｜作者：{work.author}
                </p>
                <p className="mt-1 truncate text-xs text-slate-400">{work.activity}</p>
              </span>
            </div>
          ))}
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-950">近期活动</h2>
          <Link href="/archive" onClick={onArchiveOpen} className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-500">
            {archiveUnread ? <span className="size-1.5 rounded-full bg-red-500" /> : null}
            查看更多活动 →
          </Link>
        </div>
        <div className="space-y-3">
          {sidebarActivities.map((activity) => (
            <Link key={activity.href} href={activity.href} onClick={onArchiveOpen} className="relative flex gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-sky-50">
              {archiveUnread ? <span className="absolute right-3 top-3 size-1.5 rounded-full bg-red-500" /> : null}
              <span className="grid w-24 shrink-0 place-items-center rounded-lg bg-white px-2 py-1 text-center text-[11px] font-bold leading-4 text-sky-500">
                {activity.date}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{activity.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}

export default function Home() {
  const router = useRouter();
  const [approvalState, setApprovalState] = useState<ApprovalState>(approvalStateInRuntime);
  const [showApproval, setShowApproval] = useState(!approvalHandledInRuntime);
  const [pendingDetectedActivity, setPendingDetectedActivity] = useState<ActivityPreview | null>(null);
  const [pinnedActivity, setPinnedActivity] = useState<ActivityPreview>({
    id: "reimu-birthday",
    title: coreActivity.title,
    time: coreActivity.time,
    format: coreActivity.format,
    target: `${coreActivity.participants}人`,
    source: "最近若干条群聊消息",
    description: coreActivity.shortDescription,
  });
  const [showSummary, setShowSummary] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [toast, setToast] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>(chatMessages);
  const [inputValue, setInputValue] = useState("");
  const [activityPreviewUnread, setActivityPreviewUnread] = useState(unreadStateInRuntime.activityPreview);
  const [worksUnread, setWorksUnread] = useState(unreadStateInRuntime.works);
  const [archiveUnread, setArchiveUnread] = useState(unreadStateInRuntime.archive);
  const uploadedWorksSnapshot = useSyncExternalStore(subscribeUploadedWorks, getUploadedWorksSnapshot, getUploadedWorksServerSnapshot);
  const recentWorks = useMemo<SidebarWork[]>(() => {
    const uploaded = parseUploadedWorksSnapshot(uploadedWorksSnapshot).map((work) => ({
      title: work.title,
      type: work.type,
      author: work.author,
      activity: work.source,
      image: work.image,
    }));
    return [...uploaded, ...sidebarWorks];
  }, [uploadedWorksSnapshot]);

  useEffect(() => {
    if (uploadedWorksClearedForReloadInRuntime) return;
    const [navigation] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (navigation?.type === "reload") {
      clearUploadedWorks();
    }
    uploadedWorksClearedForReloadInRuntime = true;
  }, []);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [showToast]);

  function publishWork(work: UploadedWork) {
    saveUploadedWork(work);
    unreadStateInRuntime.works = true;
    setWorksUnread(true);
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setVisibleMessages((current) => [
      ...current,
      {
        id: Date.now(),
        author: "我",
        avatar: "管",
        avatarSrc: "/avatars/admin.png",
        role: "管理员",
        time,
        content: `我上传了新作品${work.title}。`,
        self: true,
        attachment: {
          title: work.title,
          description: `${work.type}｜已加入群作品墙｜允许用于社群宣发｜已同步到QQ空间`,
          gradient: "from-sky-200 via-white to-violet-200",
          tag: "已加入群作品墙",
          image: work.image,
        },
      },
      {
        id: Date.now() + 1,
        author: "群小记",
        avatar: "小记",
        role: "群小记",
        time,
        content: `我已经把${work.title}整理到作品墙，并记录了展示与宣发授权。需要的话，之后可以继续整理成活动素材。`,
      },
    ]);
    setShowUpload(false);
    setToast("上传并发布成功");
    setShowToast(true);
  }

  function handleApprovalHandled(nextState?: ApprovalState) {
    approvalHandledInRuntime = true;
    setShowApproval(false);
    if (nextState) {
      approvalStateInRuntime = nextState;
      setApprovalState(nextState);
    }
  }

  function openWorks() {
    markWorksReadInRuntime();
    setWorksUnread(false);
  }

  function openArchive() {
    markArchiveReadInRuntime();
    setArchiveUnread(false);
  }

  function openActivityPreview() {
    markActivityPreviewReadInRuntime();
    setActivityPreviewUnread(false);
  }

  function handleQuickNavigate(href: string) {
    if (href === "/works") openWorks();
    if (href === "/archive") openArchive();
    router.push(href);
  }

  function handleSendMessage() {
    const content = inputValue.trim();
    if (!content) return;

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const nextUserMessage: ChatMessage = {
      id: Date.now(),
      author: "我",
      avatar: "管",
      avatarSrc: "/avatars/admin.png",
      role: "管理员",
      time,
      content,
      self: true,
    };

    const nextMessages = [...visibleMessages, nextUserMessage];
    const recentUserMessages = nextMessages
      .filter((message) => message.author === "我")
      .slice(-3)
      .map((message) => message.content);
    const combinedText = recentUserMessages.join(" ");
    const rawMessage = recentUserMessages.join(" / ");
    const coreApprovalOpen = showApproval && approvalState !== "ignored" && approvalState !== "pinned";
    const canDetectNewActivity = !pendingDetectedActivity && !coreApprovalOpen;
    const detected = canDetectNewActivity ? detectActivityIntent(combinedText, rawMessage) : null;

    const messagesToShow = detected
      ? [
          ...nextMessages,
          {
            id: Date.now() + 1,
            author: "群小记",
            avatar: "小记",
            role: "群小记",
            time,
            content: buildDetectionReply(detected, recentUserMessages.length),
          } satisfies ChatMessage,
        ]
      : nextMessages;

    setVisibleMessages(messagesToShow);

    setInputValue("");
    if (detected) setPendingDetectedActivity(detected);
  }

  return (
    <div className="h-screen overflow-hidden bg-[#dfeaf5] p-4 text-slate-900">
      <div className="mx-auto flex h-full max-w-[1480px] flex-col overflow-hidden rounded-[18px] border border-white/80 bg-white shadow-2xl shadow-slate-300/70">
        <QqSystemBar />
        <div className="relative flex min-h-0 flex-1">
          <MainNav />
          <ConversationList />
          <main className="relative flex min-w-0 flex-1 flex-col bg-[#edf5fb]">
            <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
              <div>
                <h1 className="text-lg font-bold text-slate-950">{currentGroup.name}</h1>
                <p className="mt-1 text-xs text-slate-500">
                  {currentGroup.members} 位成员 · 当前身份：{currentGroup.role} · 今日创作热度 92%
                </p>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                {["电话", "视频", "屏幕", "更多"].map((item) => (
                  <button key={item} className="rounded-lg bg-slate-100 px-3 py-2 text-xs hover:bg-sky-100 hover:text-sky-600">
                    {item}
                  </button>
                ))}
              </div>
            </header>

            <section className="flex-1 overflow-y-auto px-7 py-6">
              <div className="mx-auto mb-5 w-fit rounded-full bg-white/80 px-4 py-1 text-xs text-slate-400">4.29 - 5.07 主群聊记录</div>
              <div className="space-y-5 pb-32 pr-20">
                {visibleMessages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
              </div>
              {showApproval && approvalState !== "ignored" && approvalState !== "pinned" ? (
                <ApprovalModal
                  onClose={() => handleApprovalHandled()}
                  onIgnore={() => {
                    handleApprovalHandled("ignored");
                  }}
                  onLater={() => {
                    handleApprovalHandled("postponed");
                  }}
                  onSave={() => {
                    setToast("活动信息已更新");
                    setShowToast(true);
                  }}
                  onApprove={(activity) => {
                    setPinnedActivity({ ...activity, id: activity.id ?? "reimu-birthday" });
                    handleApprovalHandled("pinned");
                    setToast("活动已置顶到右侧预告");
                    setShowToast(true);
                  }}
                />
              ) : null}
              {pendingDetectedActivity ? (
                <ApprovalModal
                  activity={pendingDetectedActivity}
                  onClose={() => setPendingDetectedActivity(null)}
                  onIgnore={() => setPendingDetectedActivity(null)}
                  onLater={() => setPendingDetectedActivity(null)}
                  onSave={() => {
                    setToast("活动信息已更新");
                    setShowToast(true);
                  }}
                  onApprove={(activity) => {
                    const pendingActivity = savePendingActivity(activity);
                    setPinnedActivity({
                      ...activity,
                      id: pendingActivity.id,
                      source: pendingActivity.source,
                      isDetected: true,
                    });
                    approvalHandledInRuntime = true;
                    approvalStateInRuntime = "pinned";
                    setApprovalState("pinned");
                    setPendingDetectedActivity(null);
                    setShowApproval(false);
                    setToast("活动已置顶到右侧预告");
                    setShowToast(true);
                  }}
                />
              ) : null}
            </section>
            {showSummary ? <SummaryFloat onClose={() => setShowSummary(false)} /> : null}

            <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {[
                  { label: "💬 群小记问答", href: "/assistant" },
                  { label: "📚 活动记录馆", href: "/archive" },
                  { label: "🖼️ 作品墙", href: "/works" },
                  { label: "✨ 群小记宣发", href: "/promo?activity=reimu-birthday" },
                ].map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => handleQuickNavigate(item.href)}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:bg-sky-50 hover:text-sky-600"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mb-3 flex items-center gap-2 text-slate-500">
                {["表情", "图片", "文件"].map((tool) => (
                  <button key={tool} className="rounded-md px-2.5 py-1 text-sm hover:bg-slate-100 hover:text-sky-600">
                    {tool}
                  </button>
                ))}
                <button onClick={() => setShowUpload(true)} className="rounded-md px-2.5 py-1 text-sm hover:bg-slate-100 hover:text-sky-600">
                  作品上传
                </button>
              </div>
              <textarea
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="h-20 w-full resize-none rounded-xl bg-slate-50 p-3 text-sm text-slate-800 outline-none ring-1 ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-sky-200"
                placeholder="试着发起一次新活动，例如：下个月月底我们制作一套角色扑克牌吧；也可以点击上方「作品上传」体验作品同步。"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">群小记会整理活动与作品；你也可以点击「作品上传」体验作品墙同步，发布前仍由管理员确认。</span>
                <button onClick={handleSendMessage} className="rounded-lg bg-[#12b7f5] px-5 py-2 text-sm font-bold text-white shadow-sm hover:bg-sky-500">
                  发送
                </button>
              </div>
            </footer>
          </main>
          <RightCommunityPanel
            activityPreviewUnread={activityPreviewUnread}
            approvalState={approvalState}
            archiveUnread={archiveUnread}
            onActivityPreviewOpen={openActivityPreview}
            onArchiveOpen={openArchive}
            onReopenApproval={() => setShowApproval(true)}
            onWorksOpen={openWorks}
            pinnedActivity={pinnedActivity}
            recentWorks={recentWorks}
            worksUnread={worksUnread}
          />
          {showUpload ? <UploadModal onClose={() => setShowUpload(false)} onPublish={publishWork} /> : null}
          {showToast && toast ? (
            <div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full bg-slate-950 px-5 py-3 text-sm text-white shadow-xl">
              <span>{toast}</span>
              {toast.includes("上传") ? (
                <Link href="/works" onClick={openWorks} className="font-semibold text-sky-200">
                  查看作品
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => setShowToast(false)}
                className="rounded-full px-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
                aria-label="关闭提示"
              >
                ×
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
