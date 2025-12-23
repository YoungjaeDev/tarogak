# 타로각 MVP - Claude Code 가이드

## 프로젝트 개요

타로각은 고민 입력 시 AI가 타로 카드를 뽑아 맞춤 해석을 제공하는 서비스입니다.

- **목표**: 런칭 후 30일 내 MAU 5,000명, D7 Retention 30%+
- **타겟**: 결정장애를 겪는 20대 대학생 및 직장인
- **가치 제안**: 익명으로, 무료로, 60초 만에 AI 타로 리딩

## IMPORTANT
- **이모지 금지**: 문서나 웹페이지에 이모지를 사용하지 않습니다. 아이콘이 필요한 경우 Lucide React 아이콘을 사용합니다.
- **새 기능 구현 시 사전 승인**: UI 관련 새 기능을 구현하기 전에 반드시 사용자의 승인(`AskUserQuestion` Tool 사용)을 받습니다.
- **단순한 구현 선호**: 오버 엔지니어링을 피합니다. 요청받은 것만 구현하고, 불필요한 기능이나 리팩토링은 하지 않습니다.
- **TypeScript 활용**: 타입 안정성을 위해 TypeScript를 적극 활용합니다.
- **서버 컴포넌트 우선**: 클라이언트 컴포넌트보다 서버 컴포넌트를 우선적으로 사용합니다.
- **Shadcn MCP 활용**: UI 컴포넌트 생성 시 반드시 Shadcn MCP를 사용합니다.

## 기술 스택

### Frontend
- **Next.js 15.5.9**: App Router 기반
- **React 19**: 최신 React 버전
- **TypeScript 5**: 타입 안정성
- **Tailwind CSS 4**: 스타일링

### Backend & Infrastructure
- **Supabase**: Backend, Database, Auth
- **Gemini API**: AI 타로 해석 생성
- **Vercel**: 배포

### 주요 의존성
```json
{
  "@google/generative-ai": "^0.24.1",
  "@supabase/supabase-js": "^2.89.0",
  "next": "^15.5.9",
  "react": "^19.0.0"
}
```

## 디렉토리 구조

```
tarogak-mvp/
├── src/
│   └── app/              # Next.js App Router
│       ├── layout.tsx    # 루트 레이아웃
│       ├── page.tsx      # 홈페이지
│       └── globals.css   # 전역 스타일
├── .claude/              # Claude Code 설정
│   ├── agents/          # 커스텀 에이전트 정의
│   ├── commands/        # 프로젝트 커맨드/스킬
│   └── skills/          # 프로젝트 스킬
├── .github/
│   └── workflows/       # GitHub Actions 워크플로우
├── .env.local.example   # 환경변수 템플릿
├── tarogak-prd.md       # 제품 요구사항 문서
└── package.json
```

## 환경 설정

### 환경변수 설정
`.env.local.example`을 `.env.local`로 복사 후 다음 값 설정:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### 로컬 개발 서버 실행
```bash
npm run dev
```

## 개발 규칙

### 코드 스타일
- TypeScript strict mode 사용
- ESLint 규칙 준수 (`npm run lint`)
- Tailwind CSS 사용 (인라인 클래스)

### 커밋 메시지
Conventional Commits 형식 사용:
```
feat: 새로운 기능 추가
fix: 버그 수정
chore: 빌드/설정 변경
docs: 문서 변경
refactor: 리팩토링
```

### 브랜치 전략
- `master`: 메인 브랜치
- `issue-{번호}`: 이슈별 작업 브랜치

## API 제약사항

### Gemini API 무료 티어 제한
- 분당 15회 요청
- 일일 1,500회 요청
- MVP 테스트용으로 충분하나, 트래픽 모니터링 필요

## 윤리적 고려사항

### AI 해석 톤
- 단정적 답변 지양
- "~해보는 건 어떨까요?" 형태의 제안형 표현 사용
- 민감한 결정(건강, 재정 등)에 대한 면책 문구 포함

## 핵심 기능 요구사항

### 타로 리딩 플로우
1. 고민 카테고리 선택 (연애/취업/인간관계/재정/기타)
2. 구체적 고민 입력 (최소 10자)
3. 카드 뽑기 애니메이션 (3초)
4. 결과 표시: 카드 이미지 + 카드명 + AI 해석 (300-500자)

### 성능 목표
- 리딩 생성 API 응답 시간: P95 < 5초
- 리딩 생성 성공률: 99%+

## MVP 제외 항목
- 쓰리카드/켈틱크로스 등 복잡한 스프레드
- 유료 결제/구독
- 소셜 로그인
- 커뮤니티/댓글 기능
- 타로 외 다른 점술

## 참고 문서
- 제품 요구사항: `tarogak-prd.md`
- API 문서: (추후 추가 예정)
