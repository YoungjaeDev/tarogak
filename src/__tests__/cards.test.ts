import {
  CARDS,
  getCardById,
  drawRandomCard,
  getCardsBySuit,
  getMajorArcana,
  getMinorArcana,
} from '@/data/cards';

describe('타로 카드 데이터', () => {
  test('전체 카드 수는 78장이어야 함', () => {
    expect(CARDS.length).toBe(78);
  });

  test('메이저 아르카나는 22장이어야 함', () => {
    const major = getMajorArcana();
    expect(major.length).toBe(22);
  });

  test('마이너 아르카나는 56장이어야 함', () => {
    const minor = getMinorArcana();
    expect(minor.length).toBe(56);
  });

  test('각 수트는 14장씩이어야 함', () => {
    expect(getCardsBySuit('wands').length).toBe(14);
    expect(getCardsBySuit('cups').length).toBe(14);
    expect(getCardsBySuit('swords').length).toBe(14);
    expect(getCardsBySuit('pentacles').length).toBe(14);
  });

  test('모든 카드는 필수 필드를 가져야 함', () => {
    CARDS.forEach((card) => {
      expect(card.id).toBeDefined();
      expect(card.name).toBeDefined();
      expect(card.type).toBeDefined();
      expect(card.imageUrl).toBeDefined();
      expect(card.meaningUpright).toBeDefined();
      expect(card.meaningReversed).toBeDefined();
      expect(card.keywords).toBeDefined();
      expect(Array.isArray(card.keywords)).toBe(true);
    });
  });

  test('카드 ID로 카드를 찾을 수 있어야 함', () => {
    const fool = getCardById('major-00');
    expect(fool).toBeDefined();
    expect(fool?.name).toContain('바보');

    const aceOfWands = getCardById('wands-01');
    expect(aceOfWands).toBeDefined();
    expect(aceOfWands?.name).toContain('완드 에이스');
  });

  test('랜덤 카드 뽑기가 동작해야 함', () => {
    const card = drawRandomCard();
    expect(card).toBeDefined();
    expect(CARDS).toContain(card);
  });

  test('메이저 아르카나는 type이 major이어야 함', () => {
    const major = getMajorArcana();
    major.forEach((card) => {
      expect(card.type).toBe('major');
    });
  });

  test('마이너 아르카나는 type이 minor이고 suit을 가져야 함', () => {
    const minor = getMinorArcana();
    minor.forEach((card) => {
      expect(card.type).toBe('minor');
      expect(card.suit).toBeDefined();
      expect(['wands', 'cups', 'swords', 'pentacles']).toContain(card.suit);
    });
  });

  test('카드 ID가 중복되지 않아야 함', () => {
    const ids = CARDS.map((card) => card.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  test('모든 이미지 경로가 /cards/로 시작해야 함', () => {
    CARDS.forEach((card) => {
      expect(card.imageUrl).toMatch(/^\/cards\//);
    });
  });
});
