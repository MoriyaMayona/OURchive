import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "群创档案 OURchive",
  description: "QQ社群内容资产助手前端 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full bg-[#f5f7fa] text-slate-900">{children}</body>
    </html>
  );
}
