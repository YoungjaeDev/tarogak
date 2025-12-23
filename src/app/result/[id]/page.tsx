"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReadingResult from "@/components/ReadingResult";
import CardMeaningModal from "@/components/CardMeaningModal";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { drawRandomCard } from "@/data/cards";
import { Orientation } from "@/types";

export default function ResultPage() {
  const router = useRouter();
  const [showCardMeaning, setShowCardMeaning] = useState(false);

  // TODO: 실제로는 API에서 결과를 가져와야 함
  // 임시로 랜덤 카드와 더미 데이터 사용
  const card = drawRandomCard();
  const orientation: Orientation = Math.random() > 0.5 ? "upright" : "reversed";
  const interpretation =
    "당신은 지금 새로운 시작을 앞두고 있습니다. 이 카드는 당신에게 변화를 두려워하지 말고, 내면의 목소리에 귀 기울이라고 말하고 있어요.\n\n현재 상황에서 조금 더 용기를 내어 한 걸음 나아가 보는 건 어떨까요? 비록 불확실하더라도, 당신 안에는 이미 충분한 능력과 지혜가 있습니다.\n\n다만 무모한 결정보다는 신중하게 준비하면서도, 기회가 왔을 때는 과감하게 잡을 수 있는 균형이 필요해 보입니다.";

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

          <ReadingResult
            card={card}
            orientation={orientation}
            interpretation={interpretation}
            onShowCardMeaning={() => setShowCardMeaning(true)}
          />

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

          <div className="text-center text-sm text-purple-400 pt-4">
            <p>이 해석은 AI에 의해 생성되었습니다</p>
            <p className="mt-2">중요한 결정은 신중하게 내려주세요</p>
          </div>
        </div>
      </div>

      <CardMeaningModal
        card={card}
        orientation={orientation}
        open={showCardMeaning}
        onOpenChange={setShowCardMeaning}
      />
    </main>
  );
}
