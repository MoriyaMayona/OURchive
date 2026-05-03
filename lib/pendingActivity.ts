export const pendingActivityStorageKey = "ourchive_pending_activity";

export type ChatDetectedPendingActivity = {
  id: string;
  title: string;
  name: string;
  date: string;
  time: string;
  description: string;
  tags: string[];
  participants: unknown[];
  works: unknown[];
  source: "chat-detected";
  format?: string;
  target?: string;
  rawMessage?: string;
};

type PendingActivityInput = {
  id?: string;
  title: string;
  time?: string;
  format?: string;
  target?: string;
  description: string;
  rawMessage?: string;
};

export function createPendingActivityId() {
  return `detected-${Date.now()}`;
}

export function normalizePendingActivity(activity: PendingActivityInput): ChatDetectedPendingActivity {
  const time = activity.time || "待确认";
  return {
    id: activity.id || createPendingActivityId(),
    title: activity.title,
    name: activity.title,
    date: time,
    time,
    description: activity.description,
    tags: ["群聊识别", "共创活动", "待管理员确认"],
    participants: [],
    works: [],
    source: "chat-detected",
    format: activity.format,
    target: activity.target,
    rawMessage: activity.rawMessage,
  };
}

export function savePendingActivity(activity: PendingActivityInput) {
  const pendingActivity = normalizePendingActivity(activity);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(pendingActivityStorageKey, JSON.stringify(pendingActivity));
    } catch (error) {
      console.warn("Failed to save pending activity", error);
    }
  }

  return pendingActivity;
}

export function loadPendingActivity() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(pendingActivityStorageKey) || window.sessionStorage.getItem(pendingActivityStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.id === "string" ? (parsed as ChatDetectedPendingActivity) : null;
  } catch (error) {
    console.warn("Failed to load pending activity", error);
    return null;
  }
}
