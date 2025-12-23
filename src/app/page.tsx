import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-900 via-purple-950 to-black text-white px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            타로각
          </h1>
          <p className="text-xl md:text-2xl text-purple-200">
            AI가 해석하는 당신만의 타로 리딩
          </p>
        </div>

        <div className="space-y-4 text-purple-100">
          <p className="text-lg md:text-xl">
            고민이 있으신가요?
          </p>
          <p className="text-base md:text-lg text-purple-300">
            익명으로, 무료로, 60초 만에 AI 타로 해석을 받아보세요
          </p>
        </div>

        <div className="pt-4">
          <Link href="/reading">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              카드 뽑기
            </Button>
          </Link>
        </div>

        <div className="pt-8 text-sm text-purple-400">
          <p>타로는 당신의 내면을 돌아보는 도구입니다</p>
          <p className="mt-2">중요한 결정은 신중하게 내려주세요</p>
        </div>
      </div>
    </main>
  );
}
