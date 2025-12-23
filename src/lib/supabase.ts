import { createClient } from '@supabase/supabase-js';
import type { Category, Orientation } from '@/types';

// Supabase 환경변수 검증
// 새로운 키 형식 (sb_publishable_...) 또는 기존 키 형식 (eyJ...) 모두 지원
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.\n' +
      '필요한 환경변수: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'
  );
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseKey);

// 리딩 결과 데이터베이스 타입
export interface ReadingRow {
  id: string;
  category: Category;
  concern: string;
  card_id: string;
  orientation: Orientation;
  interpretation: string;
  created_at: string;
}

// 리딩 결과 삽입 데이터 타입
export interface InsertReadingData {
  category: Category;
  concern: string;
  card_id: string;
  orientation: Orientation;
  interpretation: string;
}

/**
 * 리딩 결과를 데이터베이스에 저장
 * @param data 저장할 리딩 데이터
 * @returns 저장된 리딩 데이터 또는 에러
 */
export async function saveReading(data: InsertReadingData) {
  const { data: reading, error } = await supabase
    .from('readings')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('리딩 저장 실패:', error);
    throw new Error(`리딩 저장에 실패했습니다: ${error.message}`);
  }

  return reading as ReadingRow;
}

/**
 * 특정 리딩 결과를 ID로 조회
 * @param id 리딩 ID
 * @returns 리딩 데이터
 * @throws 조회 실패 시 에러
 */
export async function getReadingById(id: string) {
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('리딩 조회 실패:', error);
    throw new Error(`리딩 조회에 실패했습니다: ${error.message}`);
  }

  return data as ReadingRow;
}

/**
 * 최근 리딩 결과 목록 조회
 * @param limit 조회할 개수 (기본값: 10)
 * @returns 리딩 목록
 */
export async function getRecentReadings(limit: number = 10) {
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('리딩 목록 조회 실패:', error);
    throw new Error(`리딩 목록 조회에 실패했습니다: ${error.message}`);
  }

  return data as ReadingRow[];
}

/**
 * 특정 카테고리의 리딩 결과 조회
 * @param category 카테고리
 * @param limit 조회할 개수 (기본값: 10)
 * @returns 리딩 목록
 */
export async function getReadingsByCategory(
  category: Category,
  limit: number = 10
) {
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('카테고리별 리딩 조회 실패:', error);
    throw new Error(`리딩 조회에 실패했습니다: ${error.message}`);
  }

  return data as ReadingRow[];
}

/**
 * Supabase 연결 테스트
 * @returns 연결 성공 여부
 */
export async function testConnection() {
  try {
    const { error } = await supabase.from('readings').select('count').limit(1);

    if (error) {
      console.error('Supabase 연결 테스트 실패:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Supabase 연결 테스트 중 에러:', error);
    return false;
  }
}
