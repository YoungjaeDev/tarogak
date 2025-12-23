/**
 * 타로 카드 데이터 검증 스크립트
 *
 * 실행: npx tsx scripts/validate-cards.ts
 */

import { CARDS, getMajorArcana, getMinorArcana, getCardsBySuit } from '../src/data/cards';

console.log('타로 카드 데이터 검증 시작...\n');

let errorCount = 0;

// 1. 전체 카드 수 검증
console.log('1. 전체 카드 수 검증');
if (CARDS.length === 78) {
  console.log(`   ✓ 전체 카드 수: ${CARDS.length}장`);
} else {
  console.error(`   ✗ 전체 카드 수 오류: ${CARDS.length}장 (기대값: 78장)`);
  errorCount++;
}

// 2. 메이저 아르카나 검증
console.log('\n2. 메이저 아르카나 검증');
const majorCards = getMajorArcana();
if (majorCards.length === 22) {
  console.log(`   ✓ 메이저 아르카나: ${majorCards.length}장`);
} else {
  console.error(`   ✗ 메이저 아르카나 오류: ${majorCards.length}장 (기대값: 22장)`);
  errorCount++;
}

// 3. 마이너 아르카나 검증
console.log('\n3. 마이너 아르카나 검증');
const minorCards = getMinorArcana();
if (minorCards.length === 56) {
  console.log(`   ✓ 마이너 아르카나: ${minorCards.length}장`);
} else {
  console.error(`   ✗ 마이너 아르카나 오류: ${minorCards.length}장 (기대값: 56장)`);
  errorCount++;
}

// 4. 수트별 카드 수 검증
console.log('\n4. 수트별 카드 수 검증');
const suits = ['wands', 'cups', 'swords', 'pentacles'] as const;
suits.forEach((suit) => {
  const cards = getCardsBySuit(suit);
  if (cards.length === 14) {
    console.log(`   ✓ ${suit}: ${cards.length}장`);
  } else {
    console.error(`   ✗ ${suit} 오류: ${cards.length}장 (기대값: 14장)`);
    errorCount++;
  }
});

// 5. 필수 필드 검증
console.log('\n5. 필수 필드 검증');
const missingFields: string[] = [];
CARDS.forEach((card) => {
  if (!card.id) missingFields.push(`${card.name || '이름없음'}: id 누락`);
  if (!card.name) missingFields.push(`${card.id || '아이디없음'}: name 누락`);
  if (!card.type) missingFields.push(`${card.id}: type 누락`);
  if (!card.imageUrl) missingFields.push(`${card.id}: imageUrl 누락`);
  if (!card.meaningUpright) missingFields.push(`${card.id}: meaningUpright 누락`);
  if (!card.meaningReversed) missingFields.push(`${card.id}: meaningReversed 누락`);
  if (!card.keywords || !Array.isArray(card.keywords)) {
    missingFields.push(`${card.id}: keywords 누락 또는 배열 아님`);
  }
});

if (missingFields.length === 0) {
  console.log('   ✓ 모든 카드가 필수 필드를 가지고 있습니다');
} else {
  console.error('   ✗ 필수 필드 누락:');
  missingFields.forEach((msg) => console.error(`     - ${msg}`));
  errorCount += missingFields.length;
}

// 6. 카드 ID 중복 검증
console.log('\n6. 카드 ID 중복 검증');
const ids = CARDS.map((card) => card.id);
const uniqueIds = new Set(ids);
if (ids.length === uniqueIds.size) {
  console.log('   ✓ 카드 ID 중복 없음');
} else {
  console.error(`   ✗ 카드 ID 중복 발견: ${ids.length - uniqueIds.size}개`);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  duplicates.forEach((id) => console.error(`     - ${id}`));
  errorCount++;
}

// 7. 이미지 경로 검증
console.log('\n7. 이미지 경로 검증');
const invalidPaths = CARDS.filter((card) => !card.imageUrl.startsWith('/cards/'));
if (invalidPaths.length === 0) {
  console.log('   ✓ 모든 이미지 경로가 /cards/로 시작합니다');
} else {
  console.error('   ✗ 잘못된 이미지 경로:');
  invalidPaths.forEach((card) => console.error(`     - ${card.id}: ${card.imageUrl}`));
  errorCount += invalidPaths.length;
}

// 8. 마이너 아르카나 수트 검증
console.log('\n8. 마이너 아르카나 수트 검증');
const invalidSuits = minorCards.filter((card) => !card.suit);
if (invalidSuits.length === 0) {
  console.log('   ✓ 모든 마이너 아르카나 카드가 수트를 가지고 있습니다');
} else {
  console.error('   ✗ 수트 누락:');
  invalidSuits.forEach((card) => console.error(`     - ${card.id}`));
  errorCount += invalidSuits.length;
}

// 결과 출력
console.log('\n' + '='.repeat(50));
if (errorCount === 0) {
  console.log('✓ 모든 검증 통과! 타로 카드 데이터가 정상입니다.');
  process.exit(0);
} else {
  console.error(`✗ ${errorCount}개의 오류 발견`);
  process.exit(1);
}
