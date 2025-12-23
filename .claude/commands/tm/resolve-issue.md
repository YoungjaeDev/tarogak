# TaskMaster 기반 GitHub Issue 해결하기

GitHub Issue를 TaskMaster subtask 단위로 체계적으로 해결하고 PR을 생성합니다.

**중요**: 이 커맨드는 TaskMaster와 GitHub Issue를 연동합니다.
- **GitHub Issue 번호**: `#1`, `#2` 형태 (GitHub에서 생성된 번호)
- **TaskMaster Task ID**: `task 1`, `task 1.1` 형태 (tasks.json 기준)

`@CLAUDE.md`의 프로젝트 지침을 준수할 것.

---

## 아규먼트

`$ARGUMENTS`로 다음 중 하나를 받습니다:
- GitHub Issue 번호 (예: `1`, `#1`)
- TaskMaster Task ID (예: `task 1`, `task:1`)

---

## 작업 순서

### 1. 아규먼트 파싱 및 ID 매핑

```
입력값 분석:
- "#1" 또는 "1" → GitHub Issue 번호로 해석
- "task 1" 또는 "task:1" → TaskMaster Task ID로 해석
```

**GitHub Issue 번호인 경우:**

```bash
# 1단계: Issue 정보 가져오기
gh issue view $ISSUE_NUMBER --json number,title,body,state

# 2단계: 본문에서 TaskMaster Task ID 추출
BODY=$(gh issue view $ISSUE_NUMBER --json body --jq '.body')
echo "$BODY" | grep -oP "Task Master 참조: task \K[0-9]+"

# 예상 출력: 1 (숫자만)
```

**추출 실패 시 (Task Master 참조가 없는 경우):**
```
→ Issue가 sync-to-github로 생성된 게 아닐 수 있음
→ 사용자에게 TaskMaster Task ID 직접 입력 요청
→ AskUserQuestion: "이 Issue에 해당하는 TaskMaster Task ID가 무엇인가요?"
```

**TaskMaster Task ID인 경우:**
```bash
# tasks.json에서 해당 태스크 확인
task-master show $TASK_ID

# 해당하는 GitHub Issue 찾기 (역방향 매핑)
gh issue list --search "in:body \"Task Master 참조: task $TASK_ID\"" --json number,title
```

**GitHub Issue를 찾지 못한 경우 (중요):**
```
→ sync-to-github가 실행되지 않은 상태일 수 있음
→ 절대로 임의로 GitHub Issue를 새로 생성하지 말 것
→ AskUserQuestion으로 사용자에게 확인:
  1. "sync-to-github를 먼저 실행할까요?" (Issue 동기화 후 진행)
  2. "Issue 없이 브랜치만 생성하고 진행할까요?" (task-N 브랜치 사용)
  3. "작업을 중단할까요?"
→ 사용자 선택에 따라 진행
```

### 2. 태스크 정보 확인

```bash
# TaskMaster에서 태스크 상세 정보 확인
task-master show $TASK_ID

# 출력 예시:
# Task 1: Next.js 15 프로젝트 초기 설정
# Status: pending
# Dependencies: none
# Subtasks: (none)
```

**확인 사항:**
- [ ] 태스크 상태가 `pending` 또는 `in-progress`인지
- [ ] 의존성 태스크가 모두 완료되었는지 (`task-master show`로 dependencies 확인)

### 3. Subtask 확장 (필요시)

```bash
# subtask가 없는 경우에만 실행
task-master expand --id=$TASK_ID --research
```

**확장 후 확인:**
```bash
task-master show $TASK_ID
# Subtasks:
#   - 1.1: 프로젝트 생성 (pending)
#   - 1.2: Shadcn/ui 초기화 (pending)
#   - 1.3: 의존성 설치 (pending)
#   ...
```

### 4. 브랜치 생성

```bash
# main 또는 master에서 새 브랜치 생성
git checkout main && git pull origin main
git checkout -b issue-$ISSUE_NUMBER
```

**브랜치 명명 규칙:**
- `issue-1` (GitHub Issue #1 작업용)
- `issue-1-subtask-1.2` (특정 subtask만 작업 시, 선택사항)

### 5. Subtask 순차 처리

**처리 순서 결정:**
```bash
# subtask 목록과 의존성 확인
task-master show $TASK_ID
```

**각 subtask별 처리 루프:**

```
[Subtask 1.1 시작]
1. task-master set-status --id=1.1 --status=in-progress
2. subtask 내용에 따라 코드 구현
3. 구현 완료 후 검증 (빌드, 린트, 테스트)
4. task-master set-status --id=1.1 --status=done
5. task-master update-subtask --id=1.1 --prompt="구현 완료: [간단한 설명]"

[Subtask 1.2 시작]
... 반복 ...
```

**중요 원칙:**
- 한 번에 하나의 subtask만 `in-progress`
- 의존성이 있는 subtask는 선행 subtask 완료 후 처리
- 각 subtask 완료 시 즉시 상태 업데이트

### 6. 메인 태스크 완료 처리

모든 subtask가 `done` 상태가 되면:

```bash
# 메인 태스크 완료
task-master set-status --id=$TASK_ID --status=done

# 최종 확인
task-master show $TASK_ID
```

### 7. 커밋 및 푸시

```bash
# 변경사항 확인
git status
git diff

# 커밋 (태스크 정보 포함)
git add .
git commit -m "feat: [Task $TASK_ID] 태스크 제목

- subtask 1.1: 완료 내용
- subtask 1.2: 완료 내용
...

Task Master 참조: task $TASK_ID
Closes #$ISSUE_NUMBER"

# 푸시
git push -u origin issue-$ISSUE_NUMBER
```

### 8. PR 생성

```bash
gh pr create \
  --title "[Task $TASK_ID] 태스크 제목" \
  --body "$(cat <<'EOF'
## 개요
GitHub Issue #$ISSUE_NUMBER 해결

## TaskMaster 태스크 정보
- **Task ID**: $TASK_ID
- **Task 제목**: [태스크 제목]

## 완료된 Subtask
- [x] subtask 1.1: [설명]
- [x] subtask 1.2: [설명]
- [x] subtask 1.3: [설명]

## 변경 사항
- [주요 변경 내용 요약]

## 테스트
- [ ] 빌드 성공
- [ ] 린트 통과
- [ ] 기능 테스트 완료

## 관련 이슈
Closes #$ISSUE_NUMBER

---
Task Master 참조: task $TASK_ID
EOF
)"
```

### 9. GitHub Issue 업데이트

```bash
# Issue에 진행 상황 코멘트 추가
gh issue comment $ISSUE_NUMBER --body "PR #[PR번호] 생성 완료. 코드리뷰 요청드립니다.

**완료된 작업:**
$(task-master show $TASK_ID | grep -A 100 'Subtasks:')"
```

---

## ID 매핑 참조표

| 구분 | 형식 | 예시 | 설명 |
|------|------|------|------|
| GitHub Issue | `#N` | `#1`, `#12` | GitHub에서 자동 부여 |
| TaskMaster 메인 태스크 | `task N` | `task 1`, `task 12` | tasks.json의 id 필드 |
| TaskMaster Subtask | `task N.M` | `task 1.1`, `task 1.2` | 메인태스크.서브태스크 |

**매핑 규칙:**
- `sync-to-github` 실행 시 Issue 본문에 `Task Master 참조: task N` 포함됨
- 이를 통해 GitHub Issue ↔ TaskMaster Task 연결

---

## 작업 지침

- 불명확한 요구사항이나 구현 방향이 여러 가지일 경우 AskUserQuestion 도구로 사용자에게 확인
- 한글로 답할 것, 주석 및 마크다운도 한글로 작성할 것
- 코드나 문서 작성 시 이모지 사용 금지
- PR 설명은 한글로 작성
- 컴포넌트가 데모 페이지에 추가되는 경우, Playwright MCP를 사용해 해당 컴포넌트를 E2E 테스트로 검증
- 일회성 테스트 스크립트나 임시 헬퍼 파일은 작업 완료 후 반드시 삭제
- 커밋, PR, 이슈에 'Generated with Claude', 'Co-Authored-By: Claude' 등 Claude attribution 금지

---

## 검증 및 완료 기준

**중요**: 체크박스를 완료로 표시하기 전에 반드시 실제 동작을 확인해야 합니다.

### 검증 원칙
1. **실제 실행 필수**: 코드/설정이 실제로 동작하는지 직접 실행하여 확인
2. **증거 제시**: 완료를 증명할 수 있는 실제 출력이나 결과를 보여줄 것
3. **추측 금지**: 확인하지 않은 것은 "미확인" 또는 "추정됨"으로 명시
4. **부분 완료 구분**: 코드는 작성했지만 테스트하지 않은 경우 명확히 구분

### 금지 사항
- 실행하지 않고 "동작할 것으로 예상됩니다"라고 보고
- 로그를 보지 않고 "로그에 나타날 것입니다"라고 단언
- 추측을 사실처럼 보고

---

## 주의사항

1. **ID 혼동 주의**
   - GitHub Issue `#1`과 TaskMaster `task 1`은 다를 수 있음
   - 항상 Issue 본문의 "Task Master 참조" 확인

2. **subtask 순서 준수**
   - 의존성이 있는 subtask는 반드시 순서대로 처리
   - `task-master show`로 dependencies 확인

3. **상태 업데이트 즉시 수행**
   - subtask 완료 즉시 `set-status --status=done`
   - 진행 상황이 tasks.json에 실시간 반영되어야 함

4. **커밋 메시지에 참조 포함**
   - `Task Master 참조: task N` 포함
   - `Closes #N` 또는 `Fixes #N` 포함

---

## 에러 처리

**의존성 미완료:**
```
Error: Task 1의 의존성 task 0이 완료되지 않았습니다.
→ 선행 태스크 먼저 완료 필요
```

**subtask expand 실패:**
```
Error: expand 실패
→ task-master expand --id=$TASK_ID --force 시도
```

**빌드/테스트 실패:**
```
→ 해당 subtask를 in-progress로 유지
→ 문제 해결 후 다시 진행
→ task-master update-subtask --id=N.M --prompt="이슈: [설명]"
```
