
# 깃허브 이슈 해결하기

깃허브 이슈를 체계적으로 분석하고 해결하는 전문 개발자 역할을 수행합니다. 아규먼트로 깃허브 이슈 번호를 받아 해당 이슈를 해결합니다. `@CLAUDE.md`의 프로젝트 지침을 준수할 것.

## 작업 순서

1. **이슈 분석**: 
   - `gh issue view $ISSUE_NUMBER --json title,body,comments,milestone`로 이슈의 제목, 본문, 레이블, 마일스톤을 확인
   - 마일스톤이 있다면 `gh issue list --milestone "<milestone-name>" --json number,title,state`로 관련 이슈들을 확인하여 전체 맥락 파악
   - 요구사항을 정확히 파악

2. **브랜치 생성**: `main` 또는 `master` 브랜치에서 `issue-$ISSUE_NUMBER` 형태로 새 브랜치를 생성하고 체크아웃합니다.
   - **서브모듈 초기화**: Worktree 사용 시 `git submodule update --init --recursive` 실행 필요

3. **GitHub Project 상태 업데이트 (선택)**
   - `gh project list --owner <owner> --format json`으로 프로젝트 확인
   - 프로젝트가 없으면 스킵 (경고 없이 진행)
   - 프로젝트가 있으면:
     - `gh project item-list <project-number> --owner <owner> --format json`으로 이슈가 프로젝트에 있는지 확인
     - 없으면 `gh project item-add`로 추가
     - `gh project field-list <project-number> --owner <owner> --format json`으로 Status 필드 ID와 "In Progress" 옵션 ID 획득
     - Status 필드를 "In Progress"로 변경:
       ```bash
       gh project item-edit --project-id <project-id> --id <item-id> --field-id <status-field-id> --single-select-option-id <in-progress-option-id>
       ```
     - Status 필드가 없으면 스킵

4. **코드베이스 분석**: 이슈 해결에 필요한 관련 파일과 구조를 파악하기 위해 서브에이전트를 활용하여 코드베이스를 병렬로 분석합니다.

5. **해결 계획 수립**: 분석 결과를 바탕으로 구체적인 해결 방안을 계획하고 작업 단계를 정의합니다.

6. **이슈 해결**: 서브에이전트를 생성하여 계획에 따라 코드를 수정하고 기능을 구현합니다.
   - **실행 검증 필수**: Python 스크립트, 실행 파일, 또는 동작 가능한 코드의 경우 반드시 실제 실행하여 정상 동작을 확인합니다. 단순히 파일 존재나 이전 결과만으로 판단하지 않습니다.

7. **테스트 작성**: 파일별로 독립적인 서브에이전트를 생성하여 병렬로 단위 테스트를 작성하고 80% 이상의 커버리지를 확보합니다.

8. **검증**: 테스트 실행, 린트 검사, 빌드 확인을 각각 독립적인 서브에이전트로 병렬 실행하여 코드 품질을 검증합니다.

9. **PR 생성**: 해결된 이슈에 대한 풀 리퀘스트를 생성합니다.

10. **이슈 체크박스 업데이트**: 해당 이슈의 체크박스 항목들을 완료된 것으로 체크하여 업데이트합니다.

## 작업 지침
- 불명확한 요구사항이나 구현 방향이 여러 가지일 경우 AskUserQuestion 도구로 사용자에게 확인
- 마일스톤이 있다면 마일스톤 description을 읽어 전체 맥락과 이슈 순서를 파악
- 한글로 답할 것, 주석 및 마크다운도 한글로 작성할 것
- 코드나 문서 작성 시 이모지 사용 금지
- PR 설명은 한글로 작성
- 컴포넌트가 데모 페이지에 추가되는 경우, Playwright MCP를 사용해 해당 컴포넌트를 E2E 테스트로 검증합니다.
- 일회성 테스트 스크립트나 임시 헬퍼 파일은 작업 완료 후 반드시 삭제합니다.
- 커밋, PR, 이슈에 'Generated with Claude', 'Co-Authored-By: Claude' 등 Claude attribution 금지

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