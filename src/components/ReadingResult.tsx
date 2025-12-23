"use client";

import { Card, Orientation } from "@/types";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Image from "next/image";

interface ReadingResultProps {
  card: Card;
  orientation: Orientation;
  interpretation: string;
  onShowCardMeaning: () => void;
}

export default function ReadingResult({
  card,
  orientation,
  interpretation,
  onShowCardMeaning,
}: ReadingResultProps) {
  const isReversed = orientation === "reversed";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="relative w-full max-w-sm mx-auto aspect-[2/3] bg-purple-950/50 border-2 border-purple-700 rounded-lg overflow-hidden shadow-2xl">
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            className={`object-cover ${isReversed ? "rotate-180" : ""}`}
            sizes="(max-width: 768px) 100vw, 384px"
            priority
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {card.name}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className={`text-lg ${isReversed ? "text-orange-400" : "text-green-400"}`}>
              {isReversed ? "역방향" : "정방향"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowCardMeaning}
              className="text-purple-300 hover:text-white hover:bg-purple-900/50"
            >
              <Info className="h-4 w-4 mr-1" />
              카드 의미
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-purple-950/30 border border-purple-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          AI 해석
        </h3>
        <p className="text-purple-100 leading-relaxed whitespace-pre-wrap">
          {interpretation}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {card.keywords.map((keyword) => (
          <span
            key={keyword}
            className="px-3 py-1 bg-purple-900/50 text-purple-200 text-sm rounded-full border border-purple-700"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
