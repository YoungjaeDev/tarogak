# PR 머지 후 정리 (TaskMaster 연동)

PR이 머지된 후 브랜치 정리, TaskMaster 상태 업데이트, CLAUDE.md 업데이트를 수행합니다.

**중요 - ID 구분:**
- **GitHub PR/Issue**: `#1`, `#2` (GitHub 번호)
- **TaskMaster Task**: `task 1`, `task 1.1` (tasks.json 기준)

`@CLAUDE.md`의 프로젝트 지침을 준수할 것.

---

## 아규먼트

- PR 번호 (선택): 없으면 대화 맥락에서 파악하거나 최근 머지된 PR 목록에서 선택 요청

---

## 작업 순서

### 1. PR 정보 확인

```bash
# 아규먼트로 PR 번호가 주어지면 해당 PR 사용
# 없으면 최근 머지 PR 목록 표시
gh pr list --state merged --limit 5

# PR 상세 정보 확인
gh pr view <PR번호> --json number,title,baseRefName,headRefName,body,state
```

**확인 사항:**
- `state`가 `MERGED`인지 확인
- PR 본문에서 `Task Master 참조: task N` 추출

### 2. TaskMaster Task ID 추출

PR 본문 또는 연결된 Issue에서 TaskMaster ID 파악:

```bash
# PR 본문에서 추출
gh pr view <PR번호> --json body | grep -o "Task Master 참조: task [0-9.]*"

# 또는 연결된 Issue에서 추출
gh pr view <PR번호> --json closedIssues
```

**추출 결과 예시:**
```
Task Master 참조: task 1
→ TaskMaster Task ID: 1
→ 관련 Subtasks: 1.1, 1.2, 1.3 (있는 경우)
```

### 3. TaskMaster 상태 업데이트

```bash
# 메인 태스크 상태 확인
task-master show <TASK_ID>

# 모든 subtask가 done인지 확인
# subtask가 있고 모두 완료되었다면:
task-master set-status --id=<TASK_ID> --status=done

# subtask가 있고 일부만 완료된 경우:
# → 메인 태스크는 in-progress 유지
# → 완료된 subtask만 done 처리
```

**상태 업데이트 규칙:**

| 상황 | 메인 태스크 상태 | Subtask 상태 |
|------|------------------|--------------|
| PR 머지 완료, subtask 없음 | done | N/A |
| PR 머지 완료, 모든 subtask 완료 | done | 모두 done |
| PR 머지 완료, 일부 subtask 남음 | in-progress | 완료분만 done |

### 4. 로컬 변경사항 확인

```bash
git status --porcelain
```

- **Untracked 파일 (`??`)**: 브랜치 이동에 영향 없으므로 무시하고 진행
- **Modified/Staged 파일 (`M`, `A`, `D` 등)**: AskUserQuestion으로 처리 방법 질문:
  - **stash 후 진행**: `git stash push -m "post-merge: 임시 저장"`
  - **변경사항 버리기**: `git checkout -- . && git clean -fd`
  - **작업 중단**: 사용자가 직접 처리
- **stash 선택 시**: 작업 완료 후 AskUserQuestion으로 stash 복원 여부 질문:
  - **pop**: `git stash pop` (stash 제거하면서 복원)
  - **apply**: `git stash apply` (stash 유지하면서 복원)
  - **나중에**: 사용자가 직접 처리

### 5. 베이스 브랜치로 이동

```bash
git fetch origin
git checkout <baseRefName>  # 보통 main
git pull origin <baseRefName>
```

### 6. 이슈 브랜치 정리 (선택)

AskUserQuestion으로 로컬 브랜치 삭제 여부 질문:

```bash
# 삭제 원하면
git branch -d <headRefName>  # 예: issue-1
```

### 7. 다음 태스크 확인

```bash
# TaskMaster에서 다음 작업 가능한 태스크 확인
task-master next

# 출력 예시:
# Next task: Task 2 - 디자인 시스템 및 테마 구축
# Dependencies satisfied: Task 1 (done)
```

### 8. CLAUDE.md 분석 및 업데이트

**분석 대상:**
- 해결된 Issue/Task 관련 임시 지침 (`#1`, `task 1` 언급)
- 오래되거나 부정확한 정보
- 새로 발견한 패턴/컨벤션

**업데이트 제안 작성 후 사용자 확인:**
- 삭제 대상: 해결된 이슈 관련 임시 메모
- 추가 대상: 작업 중 발견한 새 패턴
- 수정 대상: 변경된 정보

### 9. 변경사항 커밋 (선택)

CLAUDE.md가 변경되었으면 AskUserQuestion으로 커밋 여부 질문:

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md 업데이트 (task $TASK_ID 완료 반영)"
git push origin main
```

---

## 결과 보고

```
[PR 머지 후 정리 완료]

PR 정보:
- PR: #<PR번호>
- 제목: <PR 제목>
- 브랜치: <headRefName> → <baseRefName>

TaskMaster 상태:
- Task ID: task <N>
- 상태: done
- Subtasks: 모두 완료 (1.1, 1.2, 1.3)

정리 작업:
- [x] 로컬 브랜치 삭제: issue-<N>
- [x] TaskMaster 상태 업데이트
- [ ] CLAUDE.md 업데이트 (변경 없음)

다음 작업:
- task-master next → Task <M>
- /tm:resolve-issue <M> 으로 시작
```

---

## 작업 지침

- 한글로 답변
- 코드나 문서 작성 시 이모지 사용 금지
- 불명확한 사항은 추측하지 말고 AskUserQuestion으로 질문
- CLAUDE.md 변경은 반드시 사용자 확인 후 진행
- TaskMaster 상태 변경, 브랜치 삭제 등 되돌리기 어려운 작업은 항상 사용자 확인 필요
- 커밋, PR, 이슈에 'Generated with Claude', 'Co-Authored-By: Claude' 등 Claude attribution 금지

---

## ID 참조 가이드

```
[이 커맨드에서 사용되는 ID들]

GitHub:
- PR 번호: #13, #14
- Issue 번호: #1, #2 (PR과 동일 네임스페이스)
- 브랜치: issue-1, issue-2

TaskMaster:
- 메인 태스크: task 1, task 2
- Subtask: task 1.1, task 1.2

연결:
- PR 본문의 "Task Master 참조: task N"
- PR 본문의 "Closes #N" (GitHub Issue 연결)
```
