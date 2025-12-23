---
description: Jupyter Notebook(.ipynb) 파일 안전 편집
---

# Notebook 편집

Jupyter Notebook 파일을 올바른 도구로 안전하게 편집합니다.

## 필수 규칙

1. **도구 사용**: `NotebookEdit` 도구만 사용
   - `Edit`, `Write`, `search_replace` 등 텍스트 편집 도구 사용 금지
   - .ipynb는 JSON 구조이므로 전용 도구 필수

2. **셀 삽입 순서**: 새 노트북 작성 시 순서 보장 필수
   - **중요**: `cell_id` 미지정 시 항상 맨 앞에 삽입됨
   - **방법 1 (권장)**: 이전 셀의 cell_id를 추적하여 순차 삽입
     ```
     첫 셀 삽입 → cell_id='abc123' 반환
     두 번째 셀 삽입 시 cell_id='abc123' 지정 → 첫 셀 다음에 삽입
     세 번째 셀 삽입 시 cell_id='def456' 지정 → 두 번째 셀 다음에 삽입
     ```
   - **방법 2**: 역순 삽입 (마지막 셀부터 첫 셀까지)
   - **절대 금지**: cell_id 없이 순차 삽입 (역순 결과 발생)

3. **source 형식**: NotebookEdit 사용 시 source가 string으로 저장될 수 있음
   - **문제**: `"line1\\nline2"` (string) → Jupyter에서 `\n`이 그대로 표시됨
   - **정상**: `["line1\n", "line2\n"]` (list of strings)
   - **해결**: 새 노트북 생성 시 Python으로 직접 JSON 작성 권장

4. **편집 후 검증**: 수정 후 반드시 확인
   - JSON 구문 유효성 검증
   - 셀 실행 순서 보존 확인 (Read로 첫 30줄 확인)
   - 함수/임포트/의존성 누락 확인
   - 명시적 지시가 없으면 셀 출력 보존

## 처리 원칙

- **전용 도구만 사용**: NotebookEdit 외 다른 편집 도구 절대 금지
- **구조 보존**: 기존 셀 순서 및 출력 유지
- **검증 필수**: 편집 후 즉시 변경사항 확인
- **CLAUDE.md 준수**: 프로젝트 지침 엄수
