import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZH's DEV LOG | 技术笔记",
  description: "记录学习计算机语言、部署服务的技术博客",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
