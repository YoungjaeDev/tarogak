"use client";

import { Category, CATEGORIES } from "@/types";
import { Button } from "@/components/ui/button";
import { Heart, Briefcase, Users, DollarSign, MoreHorizontal } from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
}

const categoryIcons: Record<Category, React.ReactNode> = {
  love: <Heart className="h-5 w-5" />,
  career: <Briefcase className="h-5 w-5" />,
  relationship: <Users className="h-5 w-5" />,
  finance: <DollarSign className="h-5 w-5" />,
  etc: <MoreHorizontal className="h-5 w-5" />,
};

export default function CategorySelector({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">
          어떤 고민이 있으신가요?
        </h2>
        <p className="text-sm text-purple-300">
          고민의 주제를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {CATEGORIES.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            className={`h-auto py-4 flex flex-col items-center gap-2 ${
              selectedCategory === category.value
                ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                : "bg-purple-950/50 hover:bg-purple-900/50 text-purple-200 border-purple-700"
            }`}
            onClick={() => onSelectCategory(category.value)}
          >
            {categoryIcons[category.value]}
            <div className="text-center">
              <div className="font-semibold">{category.label}</div>
              <div className="text-xs opacity-80">{category.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
