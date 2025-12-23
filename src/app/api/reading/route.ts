import { NextRequest, NextResponse } from 'next/server';
import { drawRandomCard, getCardById } from '@/data/cards';
import { generateInterpretation, GeminiError } from '@/lib/gemini';
import { saveReading, getReadingById } from '@/lib/supabase';
import type { Category, Orientation } from '@/types';

// 검증 상수
const MIN_CONCERN_LENGTH = 10;
const MAX_CONCERN_LENGTH = 500;

// HTML 태그 제거 (XSS 방지)
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

// 유효한 카테고리 목록
const VALID_CATEGORIES: Category[] = [
  'love',
  'career',
  'relationship',
  'finance',
  'etc',
];

// 요청 본문 타입
interface ReadingRequest {
  category: string;
  concern: string;
}

// 응답 타입
interface ReadingResponse {
  id: string;
  card: {
    id: string;
    name: string;
    imageUrl: string;
    keywords: string[];
    meaningUpright: string;
    meaningReversed: string;
  };
  orientation: Orientation;
  interpretation: string;
}

// 랜덤 방향 결정 (정방향 50%, 역방향 50%)
function drawRandomOrientation(): Orientation {
  const randomValues = crypto.getRandomValues(new Uint32Array(1));
  return randomValues[0] % 2 === 0 ? 'upright' : 'reversed';
}

// 요청 검증
function validateRequest(body: ReadingRequest): {
  valid: boolean;
  error?: string;
} {
  // 카테고리 검증
  if (!body.category) {
    return { valid: false, error: '카테고리를 선택해주세요.' };
  }

  if (!VALID_CATEGORIES.includes(body.category as Category)) {
    return { valid: false, error: '유효하지 않은 카테고리입니다.' };
  }

  // 고민 내용 검증
  if (!body.concern) {
    return { valid: false, error: '고민 내용을 입력해주세요.' };
  }

  if (body.concern.trim().length < MIN_CONCERN_LENGTH) {
    return { valid: false, error: `고민 내용을 ${MIN_CONCERN_LENGTH}자 이상 입력해주세요.` };
  }

  if (body.concern.length > MAX_CONCERN_LENGTH) {
    return { valid: false, error: `고민 내용은 ${MAX_CONCERN_LENGTH}자 이하로 입력해주세요.` };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body: ReadingRequest = await request.json();

    // 요청 검증
    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const category = body.category as Category;
    const concern = sanitizeInput(body.concern);

    // 카드 랜덤 선택
    const card = drawRandomCard();

    // 방향 랜덤 결정
    const orientation = drawRandomOrientation();

    // AI 해석 생성
    let interpretation: string;
    try {
      interpretation = await generateInterpretation(
        card,
        orientation,
        category,
        concern
      );
    } catch (error) {
      if (error instanceof GeminiError) {
        const statusCode = error.code === 'RATE_LIMIT' ? 429 : 500;
        return NextResponse.json(
          { error: error.message },
          { status: statusCode }
        );
      }
      throw error;
    }

    // Supabase에 결과 저장
    const savedReading = await saveReading({
      category,
      concern,
      card_id: card.id,
      orientation,
      interpretation,
    });

    // 응답 생성
    const response: ReadingResponse = {
      id: savedReading.id,
      card: {
        id: card.id,
        name: card.name,
        imageUrl: card.imageUrl,
        keywords: card.keywords,
        meaningUpright: card.meaningUpright,
        meaningReversed: card.meaningReversed,
      },
      orientation,
      interpretation,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('리딩 API 에러:', error);

    // JSON 파싱 에러
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: '잘못된 요청 형식입니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

// 특정 리딩 조회 (GET /api/reading?id=xxx)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '리딩 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // Supabase에서 리딩 조회
    const reading = await getReadingById(id);

    // 카드 정보 조회
    const card = getCardById(reading.card_id);

    if (!card) {
      return NextResponse.json(
        { error: '카드 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const response: ReadingResponse = {
      id: reading.id,
      card: {
        id: card.id,
        name: card.name,
        imageUrl: card.imageUrl,
        keywords: card.keywords,
        meaningUpright: card.meaningUpright,
        meaningReversed: card.meaningReversed,
      },
      orientation: reading.orientation,
      interpretation: reading.interpretation,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('리딩 조회 에러:', error);

    return NextResponse.json(
      { error: '리딩을 찾을 수 없습니다.' },
      { status: 404 }
    );
  }
}
