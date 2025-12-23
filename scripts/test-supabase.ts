import { testConnection } from '../src/lib/supabase';

/**
 * Supabase 연결 테스트 스크립트
 *
 * 사용법:
 * 1. .env.local 파일에 Supabase 환경변수 설정
 * 2. npx tsx scripts/test-supabase.ts 실행
 */
async function main() {
  console.log('Supabase 연결 테스트 시작...\n');

  try {
    const isConnected = await testConnection();

    if (isConnected) {
      console.log('✓ Supabase 연결 성공!');
      console.log('✓ readings 테이블에 접근 가능합니다.');
      process.exit(0);
    } else {
      console.error('✗ Supabase 연결 실패');
      console.error('다음을 확인해주세요:');
      console.error('1. .env.local 파일의 환경변수가 올바른지 확인');
      console.error('2. Supabase 프로젝트가 활성화되어 있는지 확인');
      console.error('3. schema.sql이 실행되었는지 확인');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ 테스트 중 에러 발생:', error);
    process.exit(1);
  }
}

main();
