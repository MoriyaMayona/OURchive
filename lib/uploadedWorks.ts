import type { Work } from "@/lib/mockData";

export const uploadedWorksStorageKey = "ourchive_uploaded_works";
export const demoUploadImagePath = "/demo-uploads/reimu-card-demo.png";
const uploadedWorksChangedEvent = "ourchive_uploaded_works_changed";

export type UploadedWork = {
  id: string;
  title: string;
  author: string;
  authorId: string;
  type: Work["type"];
  source: string;
  image: string;
  description: string;
  tags: string[];
  likes: number;
  comments: string[];
  authorizedForWall: boolean;
  authorizedForPromo: boolean;
  syncedToQzone: boolean;
  createdAt: string;
};

export function createDemoUploadedWork(overrides: Partial<UploadedWork> = {}): UploadedWork {
  return {
    id: "role-card-demo",
    title: "《角色扑克牌设定图》",
    author: "我",
    authorId: "admin",
    type: "插画",
    source: "角色扑克牌共创活动",
    image: demoUploadImagePath,
    description: "角色扑克牌共创活动的第一张卡面设定图，尝试把角色特征整理成适合卡牌展示的视觉元素。",
    tags: ["角色扑克牌", "共创活动", "卡面设定"],
    likes: 0,
    comments: [
      "南枝：这个卡面方向可以！感觉很适合做成一整套角色牌。",
      "墨团：如果后面每个角色都有花色和技能说明，会很有收藏感。",
      "未央：这张可以当扑克牌企划的第一张样卡。",
      "阿璃：角色特征已经挺清楚了，边框再统一一下就很完整。",
      "小满：想看红魔馆/妖怪山那几组也做成牌！",
    ],
    authorizedForWall: true,
    authorizedForPromo: true,
    syncedToQzone: true,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export function loadUploadedWorks() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.sessionStorage.getItem(uploadedWorksStorageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UploadedWork[]) : [];
  } catch (error) {
    console.warn("Failed to load uploaded works", error);
    return [];
  }
}

export function parseUploadedWorksSnapshot(snapshot: string) {
  try {
    const parsed = JSON.parse(snapshot);
    return Array.isArray(parsed) ? (parsed as UploadedWork[]) : [];
  } catch (error) {
    console.warn("Failed to parse uploaded works", error);
    return [];
  }
}

export function getUploadedWorksSnapshot() {
  if (typeof window === "undefined") return "[]";
  return window.sessionStorage.getItem(uploadedWorksStorageKey) ?? "[]";
}

export function getUploadedWorksServerSnapshot() {
  return "[]";
}

export function subscribeUploadedWorks(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const notify = () => onStoreChange();
  window.addEventListener("storage", notify);
  window.addEventListener(uploadedWorksChangedEvent, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(uploadedWorksChangedEvent, notify);
  };
}

export function saveUploadedWork(work: UploadedWork) {
  if (typeof window === "undefined") return [work];

  const current = loadUploadedWorks();
  const next = [work, ...current.filter((item) => item.id !== work.id)];
  try {
    window.sessionStorage.setItem(uploadedWorksStorageKey, JSON.stringify(next));
    window.dispatchEvent(new Event(uploadedWorksChangedEvent));
  } catch (error) {
    console.warn("Failed to save uploaded work", error);
  }
  return next;
}

export function clearUploadedWorks() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(uploadedWorksStorageKey);
    window.dispatchEvent(new Event(uploadedWorksChangedEvent));
  } catch (error) {
    console.warn("Failed to clear uploaded works", error);
  }
}

export function uploadedWorkToWork(work: UploadedWork): Work {
  return {
    id: work.id,
    title: work.title,
    type: work.type,
    author: work.author,
    authorId: work.authorId,
    avatar: "管",
    avatarSrc: "/avatars/admin.png",
    activity: work.source,
    comments: work.comments.length,
    likes: work.likes,
    commentList: work.comments,
    tags: work.tags,
    gradient: "from-sky-200 via-white to-violet-200",
    image: work.image,
    description: work.description,
    authorizationText: work.authorizedForPromo ? "已授权展示与宣发整理" : "已授权展示",
    syncedToQzone: work.syncedToQzone,
    activityId: work.id,
    sourceType: "uploaded",
  };
}
