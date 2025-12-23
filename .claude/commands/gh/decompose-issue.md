## 작업 세분화하기

큰 작업을 관리 가능한 독립적인 이슈들로 분해합니다. `@CLAUDE.md`의 프로젝트 지침을 준수할 것.

## 작업 순서
1. 이슈 번호 확인: `gh issue list`로 현재 이슈 번호 확인하기.
2. 작업 분석: 작업의 핵심 요구사항과 목표를 이해하기.
3. 작업 분해: 주요 작업을 더 작고 관리하기 쉬운 하위 작업 또는 이슈로 나누기. **너무 많은 이슈보다 최적의 개수로 분해 (관리 가능한 수준)**할 것.
4. 의존성 분석: 다른 작업이 선행돼야 하는 의존성 파악하기
5. 마일스톤 이름 제안: 분해된 작업들을 묶을 마일스톤명 제안하기
6. 관련 PR 확인 (선택): `gh pr list --state closed --limit 20`로 참고할 만한 유사 작업 찾기 (없으면 생략)
7. 분해된 이슈 출력: 분해된 이슈들을 마일스톤명과 함께 출력하기.
8. 깃허브에 마일스톤과 이슈를 생성할지 묻기: AskUserQuestion 도구로 사용자가 결정하도록 요청하기.
   - 마일스톤 생성: `gh api repos/:owner/:repo/milestones -f title="마일스톤명" -f description="설명"`
   - 이슈 생성 시 `--milestone` 옵션으로 할당
9. **GitHub Project에 이슈 추가 (선택)**
   - `gh project list --owner <owner> --format json`으로 프로젝트 존재 여부 확인
   - 프로젝트가 없으면: "프로젝트가 없습니다. `/gh:init-project`로 생성할 수 있습니다." 안내 후 스킵
   - 프로젝트가 있으면: AskUserQuestion으로 추가 여부 질문
   - 추가 원하면: 각 이슈에 대해 `gh project item-add <project-number> --owner <owner> --url <issue-url>`

## 마일스톤 description 작성 가이드

마일스톤 description에 반드시 포함할 내용:
- 전체 작업의 목표와 범위
- 이슈 처리 순서 (의존성 그래프)
- 예: "이슈 순서: #1 -> #2 -> #3 -> #4"

## 이슈 템플릿

### 제목
`[타입] 간결한 작업 설명`

### 라벨 (실제 저장소 라벨 사용)
**주의**: 라벨을 지정하기 전에 `gh label list` 명령어로 저장소의 실제 라벨을 확인하세요.

예시 (프로젝트에 따라 다름, 참고용으로만 이해하고 사용하지 말 것):
- **타입**: `type: feature`, `type: documentation`, `type: enhancement`, `type: bug`
- **영역**: `area: model/inference`, `area: model/training`, `area: dataset`, `area: detection`
- **난이도**: `complexity: easy`, `complexity: medium`, `complexity: hard`
- **우선순위**: `priority: high`, `priority: medium`, `priority: low`

### 설명
**목적**: [왜 필요한지]

**작업 내용**:
- [ ] 구체적 요구사항 1
- [ ] 구체적 요구사항 2

**수정할 파일**:
- `경로/파일명` - 변경 내용

**완료 조건**:
- [ ] 기능 구현 완료
- [ ] 데모 페이지에 추가 (UI 컴포넌트인 경우)

**의존성**:
- [ ] 없음 또는 선행 이슈 #번호

**권장 에이전트** (해당되는 경우):
- 아규먼트에 에이전트 사용이 명시된 경우 여기에 포함

**참고 자료** (선택사항):
- 관련 PR이 있으면 추가 (예: PR #36 - 간단한 설명)
- 없으면 이 섹션 생략 가능