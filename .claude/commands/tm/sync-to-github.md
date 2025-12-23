# TaskMaster -> GitHub Issue 동기화

TaskMaster의 tasks.json을 읽어 GitHub Issue와 Milestone을 자동 생성합니다.

**중요 - ID 구분:**
- **GitHub Issue**: `#1`, `#2` (GitHub 자동 부여, 순차적)
- **TaskMaster Task ID**: `task 1`, `task 2` (tasks.json 기준)
- **동기화 후**: Issue 본문에 `Task Master 참조: task N` 포함되어 매핑됨

`@CLAUDE.md`의 프로젝트 지침을 준수할 것.

---

## 구조 설계

```
GitHub                          TaskMaster
──────                          ──────────
Milestone: Phase 1 MVP    ←──   PRD Phase 1 (Task 1-4)
├── Issue #1              ←──   task 1 (메인 태스크)
├── Issue #2              ←──   task 2
├── Issue #3              ←──   task 3
└── Issue #4              ←──   task 4

Milestone: Phase 2 Core   ←──   PRD Phase 2 (Task 5-7)
├── Issue #5              ←──   task 5
...
```

**원칙:**
- **Milestone** = PRD Phase 단위 (PRD에 따라 개수 다름)
- **Issue** = 메인 태스크 단위 (pending/in-progress 상태만)
- **Subtask** = Issue 내 체크박스 + TaskMaster 내부 관리
- **done 상태 태스크** = 동기화에서 제외

---

## 작업 순서

### 1. 사전 확인

```bash
# tasks.json 존재 확인
ls .taskmaster/tasks/tasks.json

# 저장소 라벨 확인
gh label list

# 기존 마일스톤 확인
gh milestone list

# 기존 Issue 확인 (번호 예측용)
gh issue list --state all --limit 1 --json number
# 예: [{"number": 5}] → 다음 Issue는 #6부터 시작

# TaskMaster 관련 Issue 이미 있는지 확인
gh issue list --search "in:body \"Task Master 참조\"" --state all --json number,title
```

**Issue 번호 예측:**
```
현재 최대 Issue 번호: #5
→ task 1 = Issue #6
→ task 2 = Issue #7
→ ...
→ task 12 = Issue #17

(주의: PR도 같은 번호 풀 사용하므로 중간에 PR 생성되면 번호 밀림)
```

### 2. tasks.json 및 PRD 분석

```bash
# 태스크 목록 확인
task-master list
```

**PRD Phase 매핑 (동적 확인 필요):**

실행 전 아래 명령으로 동기화 대상 태스크를 확인합니다:

```bash
# pending/in-progress 태스크만 조회 (done 제외)
task-master list --status pending
task-master list --status in-progress

# 또는 전체 목록에서 상태 확인
task-master list
```

**Phase 매핑 작성 방법:**
1. 해당 PRD 파일(`.taskmaster/docs/`)의 Phase 구조 확인
2. `task-master list` 결과에서 실제 Task ID 범위 확인
3. 아래 템플릿에 맞춰 매핑 테이블 작성

| Phase | TaskMaster Task IDs | 설명 |
|-------|---------------------|------|
| [PRD Phase 이름] | task N, N+1, ... | [PRD에서 확인] |
| ... | ... | ... |

**참고 - 버전별 Milestone 접두어:**
- 기존 v1 PRD 태스크: `Phase 1: MVP`, `Phase 2: Core` 등
- v2 이후 PRD 태스크: `V2 Phase 1: ...`, `V3 Phase 1: ...` 등으로 구분 권장

### 3. 변환 계획 수립 및 사용자 확인

아래 형식으로 변환 계획을 출력하고 **반드시 사용자 확인** 요청:

```
[PRD 정보]
- 파일: .taskmaster/docs/<prd-파일명>.md
- 버전: V2 (또는 해당 버전)

[동기화 대상 태스크]
- Task ID 범위: N ~ M (pending/in-progress 상태)
- 총 태스크 수: X개

[Milestone 생성 계획] (Phase 수에 따라)
- [버전] Phase 1: [이름] (task N-M 포함)
- [버전] Phase 2: [이름] (task N-M 포함)
- ...

[Issue 생성 계획] (태스크 수에 따라)
[버전] Phase 1 하위:
  - Issue: [타입] task N - [태스크 제목]
  - Issue: [타입] task N+1 - [태스크 제목]
  ...
```

### 4. Milestone 생성

Phase 단위로 Milestone 생성:

```bash
# Phase 1
gh api repos/:owner/:repo/milestones \
  -f title="Phase 1: MVP" \
  -f description="초기 설정, 디자인 시스템, 레이아웃, 인증 구현 (task 1-4)"

# Phase 2
gh api repos/:owner/:repo/milestones \
  -f title="Phase 2: Core Features" \
  -f description="대시보드, VLM 분석, VLM-CoT 분석 구현 (task 5-7)"

# Phase 3, 4도 동일하게...
```

### 5. Issue 생성

메인 Task를 Issue로 변환:

#### 제목 형식
`[타입] 간결한 작업 설명`

#### 라벨 선택 (실제 저장소 라벨 사용)
**주의**: `gh label list` 결과에서 실제 존재하는 라벨만 사용

예시 (프로젝트에 따라 다름):
- **타입**: `type: feature`, `type: enhancement`, `type: bug`, `type: refactor`
- **영역**: `frontend`, `backend`, `api`, `ai`, `infrastructure`
- **난이도**: `complexity: easy`, `complexity: medium`, `complexity: hard`

#### 본문 템플릿

**중요**: `Task Master 참조` 섹션은 반드시 포함되어야 함 (resolve-issue에서 매핑에 사용)

```markdown
## 목적
[Task description에서 추출]

## 작업 내용
[details 필드를 체크박스로 변환]
- [ ] 구체적 요구사항 1
- [ ] 구체적 요구사항 2
- [ ] 구체적 요구사항 3

## 수정할 파일
[details 필드에서 파일 경로 추출, 없으면 "구현 시 결정"]
- `경로/파일명` - 변경 내용

## 기술 상세
[details 필드의 코드 예시나 상세 내용]

## 완료 조건
[testStrategy 필드에서 추출]
- [ ] 테스트 조건 1
- [ ] 테스트 조건 2

## 의존성
[dependencies 필드 → GitHub Issue 번호로 변환]
- 선행 작업: #N (task M) 또는 "없음"

## 참고 자료 (선택사항)
[관련 PR이나 문서가 있으면 추가, 없으면 섹션 생략]
- 관련 PR: #N - 설명
- 문서: [링크]

---
**Task Master 참조**: task [TASK_ID]
```

**예시 (task 1의 경우):**
```markdown
## 목적
frontend/ 디렉토리에 Next.js 15 App Router 기반 프로젝트를 생성하고 핵심 의존성을 설정합니다.

## 작업 내용
- [ ] create-next-app으로 프로젝트 생성
- [ ] Shadcn/ui 초기화
- [ ] 필수 의존성 설치 (next-themes, framer-motion 등)
- [ ] Pretendard 폰트 설정
- [ ] tailwind.config.ts 커스터마이징
- [ ] ESLint/Prettier 설정

## 수정할 파일
- `frontend/` - 새 디렉토리 생성
- `frontend/tailwind.config.ts` - 커스텀 설정
- `frontend/app/layout.tsx` - Pretendard 폰트 설정

## 완료 조건
- [ ] npm run dev 정상 구동
- [ ] npm run build 성공
- [ ] localhost:3000 접속 확인

## 의존성
- 없음

---
**Task Master 참조**: task 1
```

#### Issue 생성 명령어
```bash
gh issue create \
  --title "[타입] 제목" \
  --body "본문 내용" \
  --label "라벨1,라벨2" \
  --milestone "마일스톤명"
```

### 6. 의존성 연결 및 ID 매핑 기록

**Issue 생성 순서**: 동기화 대상 태스크 중 가장 낮은 ID부터 순서대로 생성

| TaskMaster ID | GitHub Issue | 제목 |
|---------------|--------------|------|
| task N | #X | [태스크 제목] |
| task N+1 | #X+1 | [태스크 제목] |
| ... | ... | ... |

**의존성 변환:**
- 동기화 대상 내 의존성: Issue 본문에 "선행 작업: #X (task N)"
- done 상태 태스크 의존성: Issue 본문에 "선행 작업: task N (완료됨)" - GitHub Issue 없음

### 7. 결과 보고 및 매핑 테이블 출력

**중요**: 실제 생성된 Issue 번호로 매핑 테이블 작성 (사전 확인에서 예측한 번호 기반)

```
[동기화 완료]

PRD: .taskmaster/docs/<파일명>.md
버전: [V1/V2/...]

Milestones ([개수]개):
- [버전] Phase 1: [이름]
- [버전] Phase 2: [이름]
- ...

Issues ([개수]개):
| GitHub Issue | TaskMaster | 제목 | Milestone |
|--------------|------------|------|-----------|
| #X | task N | [태스크 제목] | [버전] Phase 1: [이름] |
| #X+1 | task N+1 | [태스크 제목] | [버전] Phase 1: [이름] |
| ... | ... | ... | ... |

(X = 기존 최대 Issue/PR 번호 + 1, N = 동기화 대상 시작 Task ID)
```

**생성 후 검증:**
```bash
# 실제 생성된 Issue 확인
gh issue list --state open --json number,title --limit 20

# 매핑 확인
gh issue view <번호> --json body | grep "Task Master 참조"
```

**다음 단계 안내:**
```
다음 단계: /tm:resolve-issue <GitHub Issue 번호> 또는 /tm:resolve-issue task 1
```

---

## 옵션 처리

### 아규먼트
- ARGUMENTS 비어있음: 동기화 대상 전체 Task (pending/in-progress 상태)
- ARGUMENTS가 Phase 번호: 해당 Phase만 (예: phase1, 1, v2-phase1)
- ARGUMENTS가 Task ID: 해당 Task만 (예: task 11, 11,12,13)

### 상태 필터
- pending, in-progress 상태만 동기화
- done, cancelled는 건너뜀

---

## 작업 지침

- 한글로 답할 것, Issue 제목/본문도 한글로 작성할 것
- 코드나 문서 작성 시 이모지 사용 금지
- 불명확한 사항은 추측하지 말고 AskUserQuestion 도구로 질문
- 커밋, PR, 이슈에 'Generated with Claude', 'Co-Authored-By: Claude' 등 Claude attribution 금지

### 한글 인코딩 주의사항

**문제**: `gh issue create --title` 명령에서 한글이 가끔 `\uXXXX` 유니코드 이스케이프로 깨짐

**대응 방법**: Issue 생성 완료 후 제목이 깨졌는지 확인하고, 깨진 경우 `gh issue edit`로 수정

```bash
# Issue 생성 후 제목 확인
gh issue list --state open --limit 10 --json number,title

# 제목이 깨진 경우 수정
gh issue edit <번호> --title "[bugfix] 다크모드 비디오 재생 버튼 색상 수정"
```

**체크포인트**: 모든 Issue 생성 완료 후 `gh issue list`로 제목 확인 필수

---

## 주의사항

1. **중복 생성 방지**

   동기화 전 반드시 기존 Issue 확인:

   ```bash
   # 전체 Issue 목록 확인
   gh issue list --state all --limit 100

   # 특정 task가 이미 Issue로 생성되었는지 검색
   gh issue list --search "Task Master 참조: task 1" --state all

   # 또는 본문 내용으로 검색
   gh issue list --search "in:body \"Task Master 참조\"" --state all
   ```

   **이미 존재하면**: 해당 task는 건너뛰고 사용자에게 알림

2. **사용자 확인 필수**
   - Milestone/Issue 생성 전 반드시 계획 확인
   - 라벨이 없으면 라벨 생성 여부 문의

3. **ID 매핑 기록 유지**
   - 동기화 완료 후 매핑 테이블 출력
   - 이후 resolve-issue에서 참조

---

## ID 참조 가이드

```
[ID 형식 구분]

GitHub:
- Issue: #1, #2, #12 (# 접두어)
- PR: #13, #14 (Issue와 동일 네임스페이스)
- Milestone: "Phase 1: MVP" (이름으로 참조)

TaskMaster:
- 메인 태스크: task 1, task 2, task 12
- Subtask: task 1.1, task 1.2, task 2.1
- 상태: pending, in-progress, done

매핑:
- GitHub Issue #N ←→ TaskMaster task N (sync-to-github 실행 후)
- Issue 본문의 "Task Master 참조: task N"으로 연결
```
