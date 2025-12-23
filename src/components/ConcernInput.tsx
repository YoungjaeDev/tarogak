"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ConcernInputProps {
  concern: string;
  onConcernChange: (concern: string) => void;
  minLength?: number;
}

export default function ConcernInput({
  concern,
  onConcernChange,
  minLength = 10,
}: ConcernInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isValid = concern.length >= minLength;
  const remainingChars = Math.max(0, minLength - concern.length);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">
          구체적인 고민을 들려주세요
        </h2>
        <p className="text-sm text-purple-300">
          최소 {minLength}자 이상 입력해주세요
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="concern" className="text-purple-200">
          고민 내용
        </Label>
        <Textarea
          id="concern"
          placeholder="예: 현재 직장에 계속 다녀야 할지, 이직을 준비해야 할지 고민입니다..."
          value={concern}
          onChange={(e) => onConcernChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`min-h-32 bg-purple-950/50 border-purple-700 text-white placeholder:text-purple-400 focus-visible:border-purple-500 ${
            isFocused || concern.length === 0
              ? ""
              : isValid
              ? "border-green-600"
              : "border-red-600"
          }`}
          maxLength={500}
        />
        <div className="flex justify-between text-sm">
          <span
            className={`${
              isValid ? "text-green-400" : "text-purple-400"
            }`}
          >
            {isValid
              ? "입력 완료"
              : `${remainingChars}자 더 입력해주세요`}
          </span>
          <span className="text-purple-400">{concern.length}/500</span>
        </div>
      </div>
    </div>
  );
}
