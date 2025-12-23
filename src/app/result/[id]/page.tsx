"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReadingResult from "@/components/ReadingResult";
import CardMeaningModal from "@/components/CardMeaningModal";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Card, Category, Orientation, StoredReading } from "@/types";
import { toast } from "sonner";

const STORAGE_KEY = "tarogak_readings";

interface ReadingResponse {
  id: string;
  category: Category;
  concern: string;
  card: Card;
  orientation: Orientation;
  interpretation: string;
}

export default function ResultPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [showCardMeaning, setShowCardMeaning] = useState(false);
  const [reading, setReading] = useState<ReadingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setStoredReadings] = useLocalStorage<StoredReading[]>(STORAGE_KEY, []);

  useEffect(() => {
    const fetchReading = async () => {
      try {
        const response = await fetch(`/api/reading?id=${params.id}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const message =
            errorData?.error ?? "리딩 결과를 불러오지 못했습니다.";
          throw new Error(message);
        }

        const data: ReadingResponse = await response.json();
        setReading(data);

        const stored: StoredReading = {
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
          const filtered = prev.filter((item) => item.id !== stored.id);
          return [stored, ...filtered].slice(0, 20);
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "리딩 결과를 불러오지 못했습니다.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReading();
  }, [params.id, setStoredReadings]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-950 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-purple-200 hover:text-white hover:bg-purple-900/50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로 가기
          </Button>

          <Link href="/">
            <Button
              variant="ghost"
              className="text-purple-200 hover:text-white hover:bg-purple-900/50"
            >
              <Home className="mr-2 h-4 w-4" />
              홈으로
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              타로 리딩 결과
            </h1>
            <p className="text-purple-300">
              당신을 위한 메시지를 받았습니다
            </p>
          </div>

          {isLoading ? (
            <div className="text-center text-purple-300">
              리딩 결과를 불러오는 중입니다
            </div>
          ) : reading ? (
            <ReadingResult
              card={reading.card}
              orientation={reading.orientation}
              interpretation={reading.interpretation}
              onShowCardMeaning={() => setShowCardMeaning(true)}
            />
          ) : (
            <div className="text-center text-purple-300">
              리딩 결과를 찾을 수 없습니다
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/reading">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                다시 뽑기
              </Button>
            </Link>
          </div>
          <ShareButtons />

          <div className="text-center text-sm text-purple-400 pt-4">
            <p>이 해석은 AI에 의해 생성되었습니다</p>
            <p className="mt-2">중요한 결정은 신중하게 내려주세요</p>
          </div>
        </div>
      </div>

      {reading && (
        <CardMeaningModal
          card={reading.card}
          orientation={reading.orientation}
          open={showCardMeaning}
          onOpenChange={setShowCardMeaning}
        />
      )}
    </main>
  );
}
