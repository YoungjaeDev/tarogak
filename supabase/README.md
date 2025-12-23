# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

### 1.1 Supabase 계정 생성
1. [Supabase](https://supabase.com) 접속
2. "Start your project" 또는 "Sign In" 클릭
3. GitHub 계정으로 로그인

### 1.2 새 프로젝트 생성
1. Dashboard에서 "New Project" 클릭
2. 프로젝트 정보 입력:
   - **Name**: tarogak-mvp (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (안전하게 보관)
   - **Region**: Northeast Asia (Seoul) 선택 (한국 서비스이므로)
   - **Pricing Plan**: Free 선택
3. "Create new project" 클릭
4. 프로젝트 생성 완료까지 약 2분 소요

### 1.3 API 키 확인
프로젝트 생성 후 Settings > API에서 다음 정보 확인:
- **Project URL**: `https://xxx.supabase.co` 형식
- **Publishable Key** (새 형식): `sb_publishable_...` 형식의 공개 키
  - 또는 기존 **anon public key**: `eyJ...` 형식 (호환 지원)

## 2. 환경변수 설정

프로젝트 루트의 `.env.local` 파일 생성:

```bash
# Supabase (새로운 API 키 형식 - 2024)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_your_key_here

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

> 참고: 2024년부터 Supabase가 새로운 키 형식을 사용합니다. 기존 `anon` 키도 호환됩니다.

## 3. 데이터베이스 스키마 적용

### 3.1 SQL Editor 접근
1. Supabase Dashboard에서 SQL Editor 메뉴 클릭
2. "New query" 클릭

### 3.2 스키마 실행
`supabase/schema.sql` 파일의 내용을 복사하여 SQL Editor에 붙여넣고 "Run" 클릭

또는 Supabase CLI 사용:
```bash
# Supabase CLI 설치 (처음 한 번만)
npm install -g supabase

# 프로젝트 연결
supabase link --project-ref your-project-ref

# 마이그레이션 실행
supabase db push
```

### 3.3 테이블 생성 확인
1. Table Editor 메뉴에서 `readings` 테이블 확인
2. 컬럼 구조 확인:
   - id (UUID, Primary Key)
   - category (VARCHAR)
   - concern (TEXT)
   - card_id (VARCHAR)
   - orientation (VARCHAR)
   - interpretation (TEXT)
   - created_at (TIMESTAMPTZ)

## 4. RLS (Row Level Security) 정책 확인

`readings` 테이블의 RLS 정책이 올바르게 설정되었는지 확인:
1. Table Editor > readings 테이블 선택
2. "RLS" 탭 클릭
3. 다음 정책들이 활성화되어 있는지 확인:
   - "Anyone can insert" (INSERT 작업 허용)
   - "Anyone can read" (SELECT 작업 허용)

## 5. 연결 테스트

다음 명령어로 Supabase 연결 테스트:

```bash
npm run dev
```

브라우저 콘솔에서 에러가 없는지 확인

## 문제 해결

### "Invalid API key" 에러
- `.env.local` 파일의 키 값이 올바른지 확인
- 개발 서버 재시작 (`npm run dev`)

### "relation does not exist" 에러
- `schema.sql` 파일이 올바르게 실행되었는지 확인
- SQL Editor에서 `SELECT * FROM readings;` 쿼리로 테이블 존재 확인

### RLS 정책 관련 에러
- Table Editor에서 RLS 정책이 활성화되어 있는지 확인
- `schema.sql`의 POLICY 문이 올바르게 실행되었는지 확인

## 참고 자료
- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
