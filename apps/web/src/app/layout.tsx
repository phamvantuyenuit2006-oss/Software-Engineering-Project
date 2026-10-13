import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VietAI Life — Nền tảng AI Agent Dành Cho Người Việt",
  description: "Trợ lý AI thông minh, hiểu người Việt, đồng hành cùng học tập, công việc, kinh doanh và đời sống.",
  keywords: ["VietAI", "AI Agent", "Trợ lý AI", "AI Việt Nam", "RAG", "LLM", "Học tiếng Anh B1"],
  openGraph: {
    title: "VietAI Life — AI Agent Platform for Vietnamese People",
    description: "AI hiểu người Việt, đồng hành cùng cuộc sống.",
    url: "https://vietailife.vn",
    siteName: "VietAI Life",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
