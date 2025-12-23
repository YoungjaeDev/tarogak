"use client";

import { Card, Orientation } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CardMeaningModalProps {
  card: Card;
  orientation: Orientation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CardMeaningModal({
  card,
  orientation,
  open,
  onOpenChange,
}: CardMeaningModalProps) {
  const isReversed = orientation === "reversed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-purple-950 border-purple-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {card.name}
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            {card.type === "major" ? "메이저 아르카나" : "마이너 아르카나"}
            {card.suit && ` - ${card.suit}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-purple-200 mb-2">
              키워드
            </h4>
            <div className="flex flex-wrap gap-2">
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

          <div>
            <h4 className="font-semibold text-green-400 mb-2">
              정방향 의미
            </h4>
            <p className="text-purple-100 leading-relaxed">
              {card.meaningUpright}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-orange-400 mb-2">
              역방향 의미
            </h4>
            <p className="text-purple-100 leading-relaxed">
              {card.meaningReversed}
            </p>
          </div>

          <div className="pt-4 border-t border-purple-800">
            <p className="text-sm text-purple-400">
              현재 카드는{" "}
              <span className={isReversed ? "text-orange-400 font-semibold" : "text-green-400 font-semibold"}>
                {isReversed ? "역방향" : "정방향"}
              </span>
              입니다
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
