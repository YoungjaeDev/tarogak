---
description: PR 머지 후 브랜치 정리 및 CLAUDE.md 업데이트
---

# PR 머지 후 정리

PR이 머지된 후 브랜치 정리와 CLAUDE.md 업데이트를 수행합니다. `@CLAUDE.md`의 프로젝트 지침을 준수할 것.

## 아규먼트

- PR 번호 (선택): 없으면 대화 맥락에서 파악하거나 최근 머지된 PR 목록에서 선택 요청

## 작업 순서

1. **PR 정보 확인**
   - 아규먼트로 PR 번호가 주어지면 해당 PR 사용
   - 없으면 대화 맥락에서 관련 PR/이슈 번호 파악 시도
   - 파악 불가하면 `gh pr list --state merged --limit 5`로 최근 머지 PR 목록 보여주고 AskUserQuestion으로 선택 요청
   - `gh pr view <PR번호> --json number,title,baseRefName,headRefName,body,state`로 PR 정보 확인
   - `state`가 MERGED인지 확인

2. **로컬 변경사항 확인**
   - `git status --porcelain`으로 uncommitted 변경사항 확인
   - **Untracked 파일 (`??`)**: 브랜치 이동에 영향 없으므로 무시하고 진행
   - **Modified/Staged 파일 (`M`, `A`, `D` 등)**: AskUserQuestion으로 처리 방법 질문:
     - **stash 후 진행**: `git stash push -m "post-merge: 임시 저장"`
     - **변경사항 버리기**: `git checkout -- . && git clean -fd`
     - **작업 중단**: 사용자가 직접 처리하도록 중단
   - **stash 선택 시**: 작업 완료 후 AskUserQuestion으로 stash 복원 여부 질문:
     - **pop**: `git stash pop` (stash 제거하면서 복원)
     - **apply**: `git stash apply` (stash 유지하면서 복원)
     - **나중에**: 사용자가 직접 처리

3. **베이스 브랜치로 이동**
   - `git fetch origin`
   - `git checkout <baseRefName>`
   - `git pull origin <baseRefName>`

4. **이슈 브랜치 정리 (선택)**
   - AskUserQuestion으로 로컬 브랜치 삭제 여부 질문
   - 삭제 원하면: `git branch -d <headRefName>`

5. **GitHub Project 상태 업데이트 (선택)**
   - PR body에서 관련 이슈 번호 파악: `Closes #N`, `Fixes #N`, `Resolves #N` 패턴 검색
   - `gh project list --owner <owner> --format json`으로 프로젝트 확인
   - 프로젝트가 없으면 스킵 (경고 없이 진행)
   - 프로젝트가 있으면:
     - `gh project item-list`로 해당 이슈의 item-id 확인
     - `gh project field-list`로 Status 필드 ID와 "Done" 옵션 ID 획득
     - `gh project item-edit`로 Status를 "Done"으로 변경
     - 이슈가 프로젝트에 없거나 Status 필드가 없으면 스킵

6. **CLAUDE.md 분석 및 업데이트**
   - CLAUDE.md 존재 여부 확인
     - 없으면: AskUserQuestion으로 생성 여부 또는 스킵 여부 질문
   - 기존 내용 분석:
     - 해결된 이슈 관련 임시 지침 찾기 (예: `#<이슈번호>`, `issue-<번호>` 언급)
     - 오래되거나 부정확한 정보 식별
     - 중복되거나 불필요한 내용 식별
   - 업데이트 제안 작성:
     - **삭제 대상**: 해결된 이슈 관련 임시 메모/지침
     - **추가 대상**: 이슈 해결 과정에서 발견한 새로운 패턴/컨벤션
     - **수정 대상**: 오래되거나 부정확한 정보
   - AskUserQuestion으로 제안 내용 확인 후 적용

7. **변경사항 커밋 (선택)**
   - CLAUDE.md가 변경되었으면 AskUserQuestion으로 커밋 여부 질문
   - 커밋 원하면: Conventional Commits 형식으로 커밋

## 작업 지침

- 한글로 답변
- 코드나 문서 작성 시 이모지 사용 금지
- 불명확한 사항은 추측하지 말고 AskUserQuestion 도구로 질문
- CLAUDE.md 변경은 반드시 사용자 확인 후 진행
- 브랜치 삭제, 커밋 등 되돌리기 어려운 작업은 항상 사용자 확인 필요

## CLAUDE.md 업데이트 가이드

### 삭제 대상 예시
- `TODO: #123 해결 후 제거` 형태의 임시 메모
- 특정 이슈 해결을 위한 임시 워크어라운드 설명
- 이미 해결된 알려진 이슈 목록

### 추가 대상 예시
- 이슈 해결 중 발견한 코드 컨벤션
- 자주 발생하는 실수 방지 가이드
- 새로 도입된 패턴이나 아키텍처 결정

### 수정 대상 예시
- 변경된 디렉토리 구조 설명
- 업데이트된 의존성 정보
- 더 이상 유효하지 않은 명령어나 설정
