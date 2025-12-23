"use client";

import { Sparkles } from "lucide-react";

export default function CardFlipAnimation() {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="relative h-56 w-40 perspective-1000">
        <div className="card-flip absolute inset-0">
          <div className="card-face card-back">
            <div className="h-full w-full rounded-lg border border-purple-700 bg-gradient-to-br from-purple-900 via-purple-950 to-black shadow-xl">
              <div className="flex h-full items-center justify-center">
                <Sparkles className="h-10 w-10 text-purple-300 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="card-face card-front">
            <div className="h-full w-full rounded-lg border border-purple-700 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-950 shadow-xl" />
          </div>
        </div>
      </div>
      <p className="text-sm text-purple-300">카드를 뽑는 중입니다</p>
    </div>
  );
}
