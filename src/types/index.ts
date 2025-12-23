// 타로 카드 타입 (메이저/마이너)
export type CardType = 'major' | 'minor';

// 마이너 아르카나 수트
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';

// 카드 방향
export type Orientation = 'upright' | 'reversed';

// 고민 카테고리
export type Category = 'love' | 'career' | 'relationship' | 'finance' | 'etc';

// 타로 카드 인터페이스
export interface Card {
  id: string; // 카드 고유 ID (예: "major-00", "wands-01")
  name: string; // 카드 이름 (예: "The Fool", "Ace of Wands")
  type: CardType; // 카드 타입
  suit?: Suit; // 마이너 아르카나인 경우 수트
  number?: number; // 카드 번호 (메이저: 0-21, 마이너: 1-14)
  imageUrl: string; // 이미지 경로
  meaningUpright: string; // 정방향 의미
  meaningReversed: string; // 역방향 의미
  keywords: string[]; // 키워드 배열
}

// 타로 리딩 결과 인터페이스
export interface Reading {
  id: string; // 리딩 고유 ID
  userId?: string; // 사용자 ID (익명 가능)
  category: Category; // 고민 카테고리
  concern: string; // 구체적 고민 내용
  card: Card; // 뽑힌 카드
  orientation: Orientation; // 카드 방향
  interpretation: string; // AI 해석 (300-500자)
  createdAt: Date; // 생성 시각
  saved?: boolean; // 저장 여부
}

// 카테고리 표시 정보
export interface CategoryInfo {
  value: Category;
  label: string;
  description: string;
}

// 카테고리 목록
export const CATEGORIES: CategoryInfo[] = [
  { value: 'love', label: '연애', description: '사랑과 연애에 관한 고민' },
  { value: 'career', label: '취업/이직', description: '직업과 커리어에 관한 고민' },
  { value: 'relationship', label: '인간관계', description: '대인관계에 관한 고민' },
  { value: 'finance', label: '재정', description: '금전과 재정에 관한 고민' },
  { value: 'etc', label: '기타', description: '그 외 일상의 고민' },
];
