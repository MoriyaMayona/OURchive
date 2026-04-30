"use client";

import Link from "next/link";
import { useState } from "react";
import type { ChatMessage, Work } from "@/lib/mockData";

export function Avatar({
  label,
  fallbackText,
  src,
  active = false,
  className = "",
}: {
  label: string;
  fallbackText?: string;
  src?: string;
  active?: boolean;
  className?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const text = fallbackText ?? label;

  if (src && !imageFailed) {
    return (
      <img
        src={src}
        alt={label}
        onError={() => setImageFailed(true)}
        className={`size-11 shrink-0 rounded-[14px] object-cover shadow-sm ${
          active ? "ring-2 ring-sky-300 ring-offset-2" : ""
        } ${className}`}
      />
    );
  }

  return (
    <div
      className={`grid size-11 shrink-0 place-items-center rounded-[14px] bg-gradient-to-br from-cyan-300 via-sky-400 to-violet-400 text-sm font-bold text-white shadow-sm ${
        active ? "ring-2 ring-sky-300 ring-offset-2" : ""
      } ${className}`}
    >
      {text}
    </div>
  );
}

export function AssistantAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-300 via-sky-400 to-violet-400 text-xs font-black text-white shadow-sm ${className}`}
    >
      小记
    </div>
  );
}

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#dfeaf5] p-4 text-slate-900">
      <div className="mx-auto min-h-[calc(100vh-32px)] max-w-[1480px] overflow-hidden rounded-[18px] border border-white/80 bg-white shadow-2xl shadow-slate-300/70">
        {children}
      </div>
    </div>
  );
}

export function SimpleHeader({
  title,
  backHref = "/",
  backLabel = "返回群聊",
  right,
}: {
  title: string;
  backHref?: string;
  backLabel?: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-sky-100 hover:text-sky-600"
        >
          {backLabel}
        </Link>
        <h1 className="text-lg font-bold text-slate-950">{title}</h1>
      </div>
      {right}
    </header>
  );
}

export function QqSystemBar() {
  return (
    <div className="flex h-10 items-center justify-between bg-[#12b7f5] px-4 text-white">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs">Q</span>
        群创档案 OURchive
      </div>
      <div className="flex items-center gap-2 text-xs opacity-90">
        <Link href="/assistant" className="rounded-full bg-white/15 px-3 py-1 hover:bg-white/25">
          群小记问答
        </Link>
        <span>管理员在线</span>
      </div>
    </div>
  );
}

export function MainNav() {
  const items = [
    { label: "消息", icon: "💬", href: "/" },
    { label: "好友", icon: "👥", href: "/" },
    { label: "群聊", icon: "🏮", href: "/" },
    { label: "空间", icon: "⭐", href: "/space" },
  ];

  return (
    <nav className="flex w-[78px] shrink-0 flex-col items-center gap-4 bg-[#253247] py-5 text-white">
      <img
        src="/avatars/admin.png"
        alt="管理员头像"
        className="size-11 rounded-[14px] border border-white/20 bg-white/10 object-cover shadow-sm"
      />
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          title={item.label}
          className={`flex h-11 w-14 flex-col items-center justify-center rounded-[14px] text-[11px] transition ${
            item.label === "群聊" ? "bg-white/18 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span className="text-base leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
      <button className="mt-auto flex h-11 w-14 flex-col items-center justify-center rounded-[14px] text-[11px] text-slate-300 hover:bg-white/10 hover:text-white">
        <span className="text-base leading-none">⚙</span>
        设置
      </button>
    </nav>
  );
}

export function ChatBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={`flex gap-3 ${message.self ? "justify-end" : ""}`}>
      {!message.self && <Avatar label={message.avatar} src={message.avatarSrc} className="size-9 rounded-full" />}
      <div className={`flex max-w-[70%] flex-col ${message.self ? "items-end" : "items-start"}`}>
        <div className={`mb-1 flex items-center gap-2 text-xs ${message.self ? "justify-end" : ""}`}>
          <span className="font-medium text-slate-600">{message.author}</span>
          {message.role ? (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] ${
                message.role === "管理员"
                  ? "bg-amber-100 text-amber-700"
                : message.role === "群小记"
                    ? "bg-violet-100 text-violet-700"
                    : "bg-sky-100 text-sky-700"
              }`}
            >
              {message.role}
            </span>
          ) : null}
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
          {message.adminOnly ? <div className="mb-1 text-xs font-semibold text-violet-500">仅管理成员可见</div> : null}
          <p>{message.content}</p>
          {message.attachment ? (
            <div className="mt-3 overflow-hidden rounded-[14px] border border-white/70 bg-white text-slate-700 shadow-sm">
              <div
                className={`relative grid h-24 place-items-center bg-gradient-to-br ${message.attachment.gradient} bg-cover bg-center text-sm font-bold text-white`}
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
      {message.self && <Avatar label={message.avatar} src={message.avatarSrc} className="size-9 rounded-full from-amber-300 to-orange-400" />}
    </div>
  );
}

export function WorkCard({ work }: { work: Work }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`grid h-36 place-items-center bg-gradient-to-br ${work.gradient} text-sm font-bold text-white`}>
        {work.type}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900">{work.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{work.activity}</p>
          </div>
          <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-600">{work.type}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Link href="/space" className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600">
            <Avatar label={work.avatar} src={work.avatarSrc} className="size-8 rounded-full" />
            {work.author}
          </Link>
          <span className="text-xs text-slate-400">{work.comments} 条留言</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {work.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
              #{tag}
            </span>
          ))}
        </div>
        <Link href="/space" className="mt-3 inline-flex text-xs font-semibold text-sky-600 hover:text-sky-500">
          去QQ空间看更多 →
        </Link>
      </div>
    </div>
  );
}

export function SoftCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[14px] bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}
