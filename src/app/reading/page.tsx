"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Category, StoredReading } from "@/types";
import { Button } from "@/components/ui/button";
import CategorySelector from "@/components/CategorySelector";
import ConcernInput from "@/components/ConcernInput";
import CardFlipAnimation from "@/components/CardFlipAnimation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import useLocalStorage from "@/hooks/useLocalStorage";
import { toast } from "sonner";

const STORAGE_KEY = "tarogak_readings";
const ANIMATION_DURATION_MS = 3000;

interface ReadingResponse {
  id: string;
  category: Category;
  concern: string;
  card: {
    id: string;
    name: string;
    imageUrl: string;
  };
  orientation: "upright" | "reversed";
  interpretation: string;
}

export default function ReadingPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [concern, setConcern] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [, setStoredReadings] = useLocalStorage<StoredReading[]>(STORAGE_KEY, []);

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
    if (!selectedCategory) return;

    setIsLoading(true);

    const animationPromise = new Promise<void>((resolve) => {
      timeoutRef.current = setTimeout(() => {
        resolve();
      }, ANIMATION_DURATION_MS);
    });

    try {
      const apiPromise = fetch("/api/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: selectedCategory,
          concern,
        }),
      });

      const [response] = await Promise.all([apiPromise, animationPromise]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.error ?? "리딩 생성 중 오류가 발생했습니다.";
        throw new Error(message);
      }

      const data: ReadingResponse = await response.json();

      const newReading: StoredReading = {
        id: data.id,
        category: data.category,
        concern: data.concern,
        card: {
          id: data.card.id,
          name: data.card.name,
          imageUrl: data.card.imageUrl,
        },
        orientation: data.orientation,
        interpretation: data.interpretation,
        createdAt: new Date().toISOString(),
      };

      setStoredReadings((prev) => {
        const filtered = prev.filter((item) => item.id !== newReading.id);
        return [newReading, ...filtered].slice(0, 20);
      });

      router.push(`/result/${data.id}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "리딩 생성 중 오류가 발생했습니다.";
      toast.error(message);
      setIsLoading(false);
    }
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
              <div className="flex flex-col items-center gap-4">
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
                {isLoading && <CardFlipAnimation />}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
