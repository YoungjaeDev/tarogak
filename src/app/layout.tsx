import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "타로각 - AI 타로 해석",
  description: "당신의 고민에 맞춤화된 AI 타로 해석 서비스",
  openGraph: {
    title: "타로각 - 60초 만에 끝내는 AI 타로",
    description: "익명으로, 무료로, 60초 만에. 당신의 고민을 AI 타로 마스터가 들어드립니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "타로각",
  },
  twitter: {
    card: "summary_large_image",
    title: "타로각 - AI 타로 해석",
    description: "익명으로, 무료로, 60초 만에. 당신의 고민을 AI 타로 마스터가 들어드립니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <div className="container mx-auto px-4">
                <p>타로각은 엔터테인먼트 목적으로 제공되는 AI 타로 리딩 서비스입니다.</p>
                <p className="mt-1">
                  제공되는 해석은 전문적인 의학적, 법률적, 재무적 조언을 대체할 수 없으며,
                  <br className="hidden sm:block" />
                  중요한 결정 시에는 관련 전문가와 상의하시기 바랍니다.
                </p>
                <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                  © 2025 Tarogak. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
