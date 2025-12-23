import { GoogleGenAI } from '@google/genai';
import type { Card, Category, Orientation } from '@/types';

// Gemini API 키 검증
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    'GEMINI_API_KEY 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
  );
}

// Gemini 클라이언트 초기화
const ai = new GoogleGenAI({ apiKey });

// 모델 설정
const MODEL = 'gemini-2.5-flash';

// 카테고리 한글 매핑
const CATEGORY_LABELS: Record<Category, string> = {
  love: '연애',
  career: '취업/이직',
  relationship: '인간관계',
  finance: '재정',
  etc: '일상',
};

// 타로 해석 프롬프트 템플릿 생성
function createInterpretationPrompt(
  card: Card,
  orientation: Orientation,
  category: Category,
  concern: string
): string {
  const cardMeaning =
    orientation === 'upright' ? card.meaningUpright : card.meaningReversed;
  const orientationLabel = orientation === 'upright' ? '정방향' : '역방향';
  const categoryLabel = CATEGORY_LABELS[category];

  return `당신은 따뜻하고 공감 능력이 뛰어난 타로 상담사입니다.

[뽑힌 카드 정보]
- 카드: ${card.name}
- 방향: ${orientationLabel}
- 기본 의미: ${cardMeaning}
- 키워드: ${card.keywords.join(', ')}

[사용자 고민]
- 분야: ${categoryLabel}
- 내용: ${concern}

[해석 지침]
1. 카드의 기본 의미를 바탕으로 사용자의 구체적인 고민에 맞춤형 해석을 제공하세요.
2. 단정적인 표현("~해야 합니다", "~입니다")을 피하고 제안형 표현("~해보는 건 어떨까요?", "~일 수 있어요")을 사용하세요.
3. 공감과 위로의 톤을 유지하면서도 실질적인 조언을 담아주세요.
4. 반드시 300자 이상 500자 이하로 작성하세요. 이것은 필수 조건입니다.
5. 불필요한 인사말이나 마무리 인사 없이 바로 해석 내용만 작성하세요.

해석:`;
}

// Gemini API 에러 타입
export class GeminiError extends Error {
  constructor(
    message: string,
    public readonly code: 'RATE_LIMIT' | 'TIMEOUT' | 'API_ERROR' | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

// 타로 해석 생성
export async function generateInterpretation(
  card: Card,
  orientation: Orientation,
  category: Category,
  concern: string
): Promise<string> {
  const prompt = createInterpretationPrompt(card, orientation, category, concern);

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const text = response.text;

    if (!text || text.trim().length === 0) {
      throw new GeminiError('빈 응답이 반환되었습니다.', 'API_ERROR');
    }

    const trimmedText = text.trim();

    // 최소 길이 검증 (DB 제약조건: 100자 이상)
    if (trimmedText.length < 100) {
      throw new GeminiError(
        'AI 해석이 너무 짧습니다. 다시 시도해주세요.',
        'API_ERROR'
      );
    }

    return trimmedText;
  } catch (error) {
    // Gemini API 특정 에러 처리
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (message.includes('quota') || message.includes('rate')) {
        throw new GeminiError(
          'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
          'RATE_LIMIT'
        );
      }

      if (message.includes('timeout') || message.includes('deadline')) {
        throw new GeminiError(
          'AI 응답 시간이 초과되었습니다. 다시 시도해주세요.',
          'TIMEOUT'
        );
      }

      if (error instanceof GeminiError) {
        throw error;
      }

      throw new GeminiError(`AI 해석 생성 실패: ${error.message}`, 'API_ERROR');
    }

    throw new GeminiError('알 수 없는 오류가 발생했습니다.', 'UNKNOWN');
  }
}

// Gemini API 연결 테스트
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Hello, respond with just "OK"' }],
        },
      ],
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });
    const text = response.text;
    return text?.toLowerCase().includes('ok') ?? false;
  } catch {
    return false;
  }
}
