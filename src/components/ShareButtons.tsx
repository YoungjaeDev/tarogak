"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  url?: string;
}

export default function ShareButtons({ url }: ShareButtonsProps) {
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (isCopying) return;
    setIsCopying(true);
    try {
      const shareUrl = url ?? window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("링크가 복사되었습니다");
    } catch (error) {
      console.error("링크 복사 실패:", error);
      toast.error("링크 복사에 실패했습니다");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={handleCopy}
        disabled={isCopying}
        className="border-purple-700 text-purple-100 hover:bg-purple-900/50 hover:text-white"
      >
        <Link2 className="mr-2 h-4 w-4" />
        링크 복사
      </Button>
    </div>
  );
}
