"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/hooks/useLocalStorage";
import { CATEGORIES, StoredReading } from "@/types";
import { ArrowLeft, History } from "lucide-react";

const STORAGE_KEY = "tarogak_readings";

function getCategoryLabel(value: StoredReading["category"]) {
  return CATEGORIES.find((category) => category.value === value)?.label ?? value;
}

export default function HistoryPage() {
  const [readings] = useLocalStorage<StoredReading[]>(STORAGE_KEY, []);

  const sortedReadings = useMemo(() => {
    return [...readings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [readings]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-950 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
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

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">리딩 히스토리</h1>
            <p className="text-purple-300">저장된 리딩 결과를 확인하세요</p>
          </div>

          {sortedReadings.length === 0 ? (
            <div className="text-center py-12 text-purple-300">
              아직 저장된 리딩이 없습니다
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedReadings.map((reading) => (
                <Link
                  key={reading.id}
                  href={`/result/${reading.id}`}
                  className="group rounded-lg border border-purple-800 bg-purple-950/30 p-4 transition hover:border-purple-600"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative h-28 w-20 overflow-hidden rounded-md border border-purple-700 bg-purple-950/70">
                      <Image
                        src={reading.card.imageUrl}
                        alt={reading.card.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-purple-300">
                        <span className="inline-flex items-center gap-1">
                          <History className="h-3.5 w-3.5" />
                          {getCategoryLabel(reading.category)}
                        </span>
                        <span>
                          {new Date(reading.createdAt).toLocaleString("ko-KR")}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold text-white">
                        {reading.card.name}
                      </h2>
                      <p className="text-sm text-purple-200">
                        {reading.concern}
                      </p>
                    </div>
                    <div className="text-sm text-purple-300">
                      {reading.orientation === "upright" ? "정방향" : "역방향"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
