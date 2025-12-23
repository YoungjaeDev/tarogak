## 이슈 라벨 생성하기

프로젝트 구조를 분석하여 적절한 GitHub 이슈 라벨을 생성합니다. `@CLAUDE.md`의 프로젝트 지침을 준수할 것.

## 작업 순서
1. 프로젝트 분석: `package.json`, `README.md`, 코드 구조 파악
2. 기술 스택 확인: 사용된 프레임워크, 라이브러리, 도구 식별
3. 프로젝트 영역 분류: 프론트엔드, 백엔드, API, 인프라 등
4. 라벨 생성: 타입, 영역, 난이도 기반으로 핵심 라벨만 생성

## 라벨 생성 기준

**아래는 예시이며, 프로젝트에 맞게 조정해서 생성해주세요.**

### 타입 (Type)
- `type: feature`, `type: bug`, `type: enhancement`, `type: documentation`, `type: refactor`

### 영역 (Area)
- `frontend` `backend` `api` `devops`, `crawling` `ai` `database` `infrastructure`

### 난이도 (Complexity)
- `complexity: easy` `complexity: medium` `complexity: hard`

## 생성 명령어 예시
```bash
gh label create "type: feature" --color "0e8a16" --description "새로운 기능 추가"
gh label create "frontend" --color "1d76db" --description "프론트엔드 관련 작업"
gh label create "complexity: easy" --color "7057ff" --description "간단한 작업"
```