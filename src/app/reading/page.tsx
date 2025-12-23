"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import CategorySelector from "@/components/CategorySelector";
import ConcernInput from "@/components/ConcernInput";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ReadingPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [concern, setConcern] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const canSubmit = selectedCategory !== null && concern.length >= 10;

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsLoading(true);

    // TODO: 실제 API 호출로 대체 필요
    // 임시로 3초 후 결과 페이지로 이동
    timeoutRef.current = setTimeout(() => {
      router.push(`/result/temp-id`);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-950 to-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-purple-200 hover:text-white hover:bg-purple-900/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">타로 리딩 시작</h1>
            <p className="text-purple-300">
              고민을 입력하고 카드를 뽑아보세요
            </p>
          </div>

          <div className="bg-purple-950/30 border border-purple-800 rounded-lg p-6 space-y-8">
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {selectedCategory && (
              <ConcernInput
                concern={concern}
                onConcernChange={setConcern}
                minLength={10}
              />
            )}
          </div>

          {selectedCategory && (
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                disabled={!canSubmit || isLoading}
                onClick={handleSubmit}
                className="text-lg px-8 py-6 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:text-purple-500"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                    카드를 뽑는 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    카드 뽑기
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
