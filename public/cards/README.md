# 타로 카드 이미지 가이드

## 디렉토리 구조

```
public/cards/
├── major-00-fool.jpg           # 메이저 아르카나 (22장)
├── major-01-magician.jpg
├── ...
├── major-21-world.jpg
├── wands-01-ace.jpg            # 완드 (14장)
├── wands-02.jpg
├── ...
├── wands-14-king.jpg
├── cups-01-ace.jpg             # 컵 (14장)
├── cups-02.jpg
├── ...
├── cups-14-king.jpg
├── swords-01-ace.jpg           # 소드 (14장)
├── swords-02.jpg
├── ...
├── swords-14-king.jpg
├── pentacles-01-ace.jpg        # 펜타클 (14장)
├── pentacles-02.jpg
├── ...
└── pentacles-14-king.jpg
```

## 이미지 소스

### Public Domain Rider-Waite 이미지

Rider-Waite 타로 카드는 1909년 출판되어 퍼블릭 도메인에 속합니다.

**추천 소스:**
1. **Sacred Texts Archive**
   - URL: https://www.sacred-texts.com/tarot/pkt/index.htm
   - 각 카드별 페이지에서 고해상도 이미지 다운로드 가능
   - 메이저 아르카나: https://www.sacred-texts.com/tarot/pkt/pktar01.htm (예: The Magician)
   - 마이너 아르카나: https://www.sacred-texts.com/tarot/pkt/pktwaac.htm (예: Ace of Wands)

2. **Wikimedia Commons**
   - URL: https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck
   - SVG 또는 고해상도 JPG 형식 다운로드 가능

3. **GitHub 저장소**
   - 검색: "rider waite tarot images public domain"
   - 일부 개발자들이 정리한 이미지 세트 활용 가능

## 이미지 사양

- **형식**: JPG 또는 PNG
- **권장 크기**: 최소 400x700px (세로 비율 유지)
- **파일명**: 위 디렉토리 구조의 명명 규칙 준수
- **라이선스**: Public Domain 또는 상업적 사용 가능한 라이선스

## 임시 플레이스홀더

개발 단계에서는 다음과 같은 플레이스홀더 이미지를 사용할 수 있습니다:
- https://placehold.co/400x700/png (400x700 크기 플레이스홀더)
- 실제 배포 전 반드시 실제 타로 카드 이미지로 교체 필요

## 다운로드 스크립트 (예정)

나중에 자동화 스크립트를 작성하여 Sacred Texts에서 이미지를 일괄 다운로드할 수 있습니다.

```bash
# 예시 (구현 예정)
npm run download:tarot-images
```

## 체크리스트

- [ ] 메이저 아르카나 22장 이미지 다운로드
- [ ] 완드 수트 14장 이미지 다운로드
- [ ] 컵 수트 14장 이미지 다운로드
- [ ] 소드 수트 14장 이미지 다운로드
- [ ] 펜타클 수트 14장 이미지 다운로드
- [ ] 파일명 규칙 확인
- [ ] 이미지 크기 및 품질 확인
- [ ] 라이선스 확인 (Public Domain)
