-- 타로 리딩 결과를 저장하는 테이블
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(20) NOT NULL CHECK (category IN ('love', 'career', 'relationship', 'finance', 'etc')),
  concern TEXT NOT NULL CHECK (char_length(concern) >= 10),
  card_id VARCHAR(20) NOT NULL,
  orientation VARCHAR(10) NOT NULL CHECK (orientation IN ('upright', 'reversed')),
  interpretation TEXT NOT NULL CHECK (char_length(interpretation) BETWEEN 300 AND 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- 누구나 리딩 결과를 삽입할 수 있도록 허용 (익명 사용자 지원)
CREATE POLICY "Anyone can insert"
  ON readings
  FOR INSERT
  WITH CHECK (true);

-- 누구나 리딩 결과를 조회할 수 있도록 허용
CREATE POLICY "Anyone can read"
  ON readings
  FOR SELECT
  USING (true);

-- created_at 컬럼에 인덱스 생성 (최신 리딩 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_readings_created_at
  ON readings(created_at DESC);

-- category 컬럼에 인덱스 생성 (카테고리별 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_readings_category
  ON readings(category);
