"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Avatar, PageFrame, SimpleHeader } from "@/components/ourchive";
import { avatarImages } from "@/lib/mockData";
import type { CommunitySource } from "@/lib/communityKnowledge";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
};

const questionGroups = [
  {
    title: "教学问答",
    questions: ["明信片一般开多大的画布？", "表情包投稿有什么格式要求？"],
  },
  {
    title: "群历史",
    questions: ["上一次活动是什么时候？", "之前做过哪些类似活动？"],
  },
  {
    title: "活动指南",
    questions: ["第一次参加图文接力要准备什么？", "策划一次活动需要提前准备什么？"],
  },
];

const initialSources: CommunitySource[] = [
  {
    title: "灵梦生日图文接力活动记录",
    type: "活动记录",
    description: "新人参加图文接力时需要确认主题、截止时间和投稿格式。",
    href: "/archive/reimu-birthday",
  },
  {
    title: "群内投稿格式说明",
    type: "投稿规则",
    description: "作品名、作者名、作品类型、稿件状态和授权范围需要写清楚。",
  },
  {
    title: "作品授权与署名规则",
    type: "投稿规则",
    description: "草稿、过程稿和最终稿要分别标注，署名按作者指定名称。",
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "user",
    content: "第一次参加图文接力要准备什么？",
  },
  {
    id: 2,
    role: "assistant",
    content:
      "先别紧张，把自己能完成的一小段认领下来就好。你需要确认主题、截止时间、投稿格式，再准备作品名、作者名、作品类型和授权范围。如果还没想好完整作品，也可以先交草稿或构思，管理员会帮你归档。第一次参加重点不是卷，是顺利加入接力～",
  },
];

const loadingLines = ["我翻一下群里的活动记录～", "稍等，我找找以前的经验…"];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [sources, setSources] = useState<CommunitySource[]>(initialSources);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const nextId = useRef(3);

  async function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    setError("");
    setInputValue("");
    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      content: trimmed,
    };
    const loadingMessage: ChatMessage = {
      id: nextId.current++,
      role: "assistant",
      content: loadingLines[userMessage.id % loadingLines.length],
      loading: true,
    };

    const history = [...messages, userMessage].map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((current) => [...current, userMessage, loadingMessage]);

    try {
      const response = await fetch("/api/community-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmed,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error("Community assistant request failed");
      }

      const result = (await response.json()) as {
        answer?: string;
        sources?: CommunitySource[];
      };

      setMessages((current) =>
        current.map((message) =>
          message.id === loadingMessage.id
            ? {
                ...message,
                content: result.answer || "我没能整理出稳定答案，最好问管理员确认一下。",
                loading: false,
              }
            : message,
        ),
      );
      setSources(Array.isArray(result.sources) && result.sources.length > 0 ? result.sources : initialSources);
    } catch {
      setError("刚刚没连上经验助手，我先把聊天留着，你可以再试一次。");
      setMessages((current) =>
        current.map((message) =>
          message.id === loadingMessage.id
            ? {
                ...message,
                content: "我这边刚刚翻记录卡住了。可以再问我一次，或者先按：主题、截止时间、投稿格式、授权范围这四件事准备。",
                loading: false,
              }
            : message,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageFrame>
      <SimpleHeader title="群小记｜社群经验问答" backHref="/" backLabel="返回群聊" />
      <main className="grid h-[calc(100vh-96px)] grid-cols-[300px_minmax(0,1fr)_320px] gap-5 bg-[#edf5fb] p-6">
        <aside className="min-h-0 overflow-y-auto rounded-[18px] bg-white p-4 shadow-sm [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
          <h2 className="font-bold text-slate-950">常见问题</h2>
          <p className="mt-2 text-xs leading-5 text-slate-500">点一个问题，我会按社群历史经验帮你翻。</p>
          <div className="mt-4 space-y-4">
            {questionGroups.map((group) => (
              <section key={group.title}>
                <h3 className="mb-2 text-xs font-black text-sky-600">{group.title}</h3>
                <div className="space-y-2">
                  {group.questions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendQuestion(question)}
                      disabled={isLoading}
                      className="w-full rounded-xl bg-slate-50 p-3 text-left text-sm leading-6 text-slate-600 transition hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-[18px] bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h1 className="text-lg font-bold text-slate-950">和群小记聊聊</h1>
            <p className="mt-1 text-xs text-slate-500">像问熟悉群历史的社团前辈，活动组织、投稿准备、历史记录都可以问。</p>
          </div>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-[#edf5fb] p-5 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>

          <div className="border-t border-slate-100 p-4">
            {error ? <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">{error}</p> : null}
            <div className="flex gap-2">
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendQuestion(inputValue);
                }}
                className="h-10 flex-1 rounded-xl bg-slate-50 px-3 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-100"
                placeholder="问问社群活动怎么组织、作品怎么准备…"
              />
              <button
                type="button"
                onClick={() => sendQuestion(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="rounded-xl bg-[#12b7f5] px-5 text-sm font-bold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isLoading ? "查找中" : "发送"}
              </button>
            </div>
          </div>
        </section>

        <aside className="min-h-0 overflow-y-auto rounded-[18px] bg-white p-4 shadow-sm [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
          <h2 className="font-bold text-slate-950">引用来源</h2>
          <p className="mt-2 text-xs leading-5 text-slate-500">回答会参考活动记录、作品归档和群内规则。</p>
          <div className="mt-4 space-y-3">
            {sources.map((source) => {
              const card = (
                <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 transition hover:bg-sky-50">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900">{source.title}</h3>
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-sky-600">{source.type}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{source.description}</p>
                </div>
              );

              return source.href ? (
                <Link key={`${source.title}-${source.type}`} href={source.href}>
                  {card}
                </Link>
              ) : (
                <div key={`${source.title}-${source.type}`}>{card}</div>
              );
            })}
          </div>
        </aside>
      </main>
    </PageFrame>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end gap-3">
        <div className="max-w-[72%]">
          <div className="mb-1 text-right text-xs font-semibold text-slate-500">我</div>
          <div className="rounded-2xl rounded-tr-md bg-[#12b7f5] px-4 py-2.5 text-sm leading-6 text-white shadow-sm">{message.content}</div>
        </div>
        <Avatar label="管" src={avatarImages.admin} className="size-9 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#12b7f5] text-xs font-black text-white shadow-sm">小记</div>
      <div className="max-w-[76%]">
        <div className="mb-1 flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">群小记</span>
          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-600">社群前辈口吻</span>
        </div>
        <div className={`whitespace-pre-line rounded-2xl rounded-tl-md px-4 py-2.5 text-sm leading-6 shadow-sm ${message.loading ? "bg-sky-50 text-sky-700" : "bg-white text-slate-700"}`}>
          {message.content}
        </div>
      </div>
    </div>
  );
}
