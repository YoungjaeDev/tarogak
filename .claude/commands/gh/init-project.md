---
description: GitHub Project 보드 초기화 및 설정
---

# GitHub Project 초기화

GitHub Project 보드를 생성하고 기본 필드를 설정합니다. `@CLAUDE.md`의 프로젝트 지침을 준수할 것.

## 사전 요구사항

`gh` CLI에 project 스코프가 필요합니다. 없으면 다음 명령어로 추가:
```bash
gh auth refresh -s project --hostname github.com
```

## 아규먼트

- 프로젝트 이름 (선택): 없으면 저장소 이름을 기본값으로 사용

## 작업 순서

1. **사전 확인**
   - `gh auth status`로 project 스코프 확인
   - 없으면 사용자에게 `gh auth refresh -s project --hostname github.com` 실행 안내
   - `gh repo view --json nameWithOwner,owner -q ".owner.login"`로 owner 확인

2. **기존 프로젝트 확인**
   - `gh project list --owner <owner> --format json`으로 기존 프로젝트 목록 확인
   - 동일한 이름의 프로젝트가 있으면 AskUserQuestion으로 처리 방법 질문:
     - 기존 프로젝트 사용
     - 새 프로젝트 생성 (다른 이름으로)
     - 작업 취소

3. **프로젝트 생성**
   - `gh project create --owner <owner> --title "<프로젝트명>" --format json`
   - 생성된 프로젝트 번호(number) 저장

4. **Status 필드 확인**
   - `gh project field-list <project-number> --owner <owner> --format json`으로 필드 확인
   - GitHub Project는 기본적으로 Status 필드 제공 (Todo, In Progress, Done)
   - 기본 필드가 있으면 그대로 사용

5. **Priority 필드 생성 (선택)**
   - AskUserQuestion으로 Priority 필드 생성 여부 질문
   - 원하면 생성:
     ```bash
     gh project field-create <project-number> --owner <owner> \
       --name "Priority" \
       --data-type "SINGLE_SELECT" \
       --single-select-options "High,Medium,Low"
     ```

6. **저장소에 프로젝트 링크**
   - `gh repo view --json name -q .name`로 현재 저장소 이름 확인
   - `gh project link <project-number> --owner <owner> --repo <repo>`로 연결
   - 주의: `--repo`에는 저장소 이름만 지정 (owner/repo 형식 아님)

7. **결과 출력**
   - 생성된 프로젝트 정보 요약
   - 웹에서 확인할 수 있는 URL 제공: `gh project view <project-number> --owner <owner> --web`

## 출력 예시

```
GitHub Project 초기화 완료!

프로젝트: my-project
번호: 5
URL: https://github.com/users/<username>/projects/5

기본 필드:
- Status: Todo, In Progress, Done
- Priority: High, Medium, Low (선택적으로 추가됨)

연결된 저장소: owner/repo

다음 단계:
- 이슈 추가: gh project item-add 5 --owner <owner> --url <issue-url>
- 보드 확인: gh project view 5 --owner <owner> --web
```

## 작업 지침

- 한글로 답변
- 코드나 문서 작성 시 이모지 사용 금지
- 오류 발생 시 명확한 해결 방법 제시
- 프로젝트 번호는 이후 명령어에서 사용되므로 사용자에게 안내
- `@me`는 일부 명령어에서 동작하지 않으므로 실제 owner를 사용
