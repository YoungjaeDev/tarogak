# PRD Codex 검토 (review-prd-with-codex)

생성된 PRD를 Codex MCP로 검토하고 Claude가 cross-check하여 합의된 결론을 전달합니다.
합의가 도달할 때까지 최대 3회 핑퐁합니다.

**핵심 원칙:**
- Codex는 context/도구가 제한적이므로 Claude가 반드시 검증
- 불일치 시 Codex에 재질문 (컨텍스트 재전달 방식)
- 이모지 사용 금지
- 범용적 표현 사용 (특정 프로젝트 용어 지양)

---

## 아규먼트

`$ARGUMENTS`로 PRD 파일 경로를 받습니다.
- 예: `/tm:review-prd-with-codex .taskmaster/docs/prd.md`
- 없으면 AskUserQuestion으로 경로 입력 요청

---

## Codex 컨텍스트 구성 원칙

### 1. 이번 워크플로우의 Codex 사용 범위
- 이번 명령은 **Codex MCP 도구**를 사용 (`mcp__codex__codex`)
- sandbox는 `read-only` 설정
- **네트워크/웹서치는 사용하지 않음** (재현성과 안전을 위해)
- 재현성을 위해 PRD/컨텍스트를 프롬프트에 직접 포함 (파일 탐색에 의존하지 않음)
- git history 접근 불가 (Claude가 cross-check로 보완)

### 2. 필수 포함 정보 (풍부한 컨텍스트)
- PRD 전문 (라인 번호 포함 - `nl -ba` 형식)
- **CLAUDE.md 전문** (제한 없이 전체 포함)
- **프로젝트 기술 스택 상세** (package.json, requirements.txt 내용)
- **디렉토리 구조** (주요 폴더 구조)
- **PRD 관련 코드 요약** (선택: PRD에 언급된 파일의 심볼 개요)
- 검토 기준 명시
- 출력 형식 강제

### 3. 포함하지 말아야 할 정보
- Claude 전용 도구 언급 (AskUserQuestion, TodoWrite 등)
- 내부 워크플로우 세부사항

### 4. 프롬프트 구성 원칙
- **CLAUDE.md 전체 포함** (1000자 제한 제거)
- PRD 전체를 한 번에 검토 (분할하지 않음)
- 기술 스택과 디렉토리 구조로 프로젝트 맥락 제공
- 타임아웃 발생 시에만 프롬프트 축소 고려

### 5. 출력 형식 강제
- 구조화된 형식 명시 (테이블, 리스트)
- "반드시 이 형식으로" 명시
- 라인 번호 참조 요구

---

## 작업 순서

### Step 1: 사전 정보 수집 (풍부한 컨텍스트)

#### 1.1 PRD 파일 읽기 (라인 번호 포함)
```bash
nl -ba $ARGUMENTS
```
- `nl -ba`: 빈 줄 포함 모든 줄에 번호 부여 (cat -n보다 일관적)
- 파일이 없으면 오류 메시지 출력 후 종료

#### 1.2 PRD 파일 존재 확인
```bash
test -f $ARGUMENTS && echo "파일 존재" || echo "파일 없음"
```

#### 1.3 CLAUDE.md 전문 읽기
- 프로젝트 루트의 CLAUDE.md 확인
- **전체 내용을 프롬프트에 포함** (1000자 제한 없음)
- 프로젝트 컨벤션, 기술 스택, 주의사항 모두 전달

#### 1.4 프로젝트 기술 스택 상세 수집
Claude가 다음 파일들을 읽고 요약:
- `package.json` (프론트엔드 의존성)
- `requirements.txt` (백엔드 의존성)
- `go.mod`, `Cargo.toml` 등 (해당 시)
- 주요 프레임워크/라이브러리 버전 명시

#### 1.5 디렉토리 구조 수집
```bash
# 주요 디렉토리 구조 (깊이 2-3)
tree -L 3 --dirsfirst -I 'node_modules|__pycache__|.git|dist|build|.next'
```
또는 `ls -la` 조합으로 구조 파악

#### 1.6 PRD 관련 코드 파일 요약 (선택)
- PRD에 언급된 주요 파일/모듈이 있으면 해당 파일의 심볼 개요 수집
- 예: "인증 시스템 개선" PRD라면 `routes/auth.py`, `middleware.ts` 등 확인
- 기존 구현과 PRD 설계의 관계 파악에 도움

#### 1.7 TaskMaster PRD 템플릿 참조
`.taskmaster/templates/example_prd.txt` 구조:
```
<context>
# Overview
# Core Features
# User Experience
</context>
<PRD>
# Technical Architecture
# Development Roadmap
# Logical Dependency Chain
# Risks and Mitigations
# Appendix
</PRD>
```

### Step 2: Codex 프롬프트 구성 (풍부한 컨텍스트)

다음 템플릿을 사용하여 프롬프트 작성:

```
## 역할
당신은 PRD(Product Requirements Document) 검토 전문가입니다.

## 프로젝트 컨텍스트

### 기술 스택
[package.json / requirements.txt 내용 요약]
예시:
- Frontend: Next.js 15, React 19, Tailwind CSS v4, shadcn/ui
- Backend: FastAPI, Google Gemini API, Decord
- 배포: Docker + Cloudflare Tunnel

### 프로젝트 구조
[tree 또는 ls 출력 결과]
```
frontend/
├── src/app/          # App Router
├── src/components/   # UI 컴포넌트
└── src/hooks/        # Custom hooks

services/
├── base_video_processor.py
├── video_processor.py
└── child_safety_processor.py
```

### 프로젝트 지침 (CLAUDE.md)
[CLAUDE.md 전문 - 제한 없이 전체 포함]

### PRD 관련 기존 코드 (선택)
[PRD에 언급된 주요 파일이 있다면 심볼 개요]

## 검토 대상
파일: [PRD 파일 경로]

### PRD 내용 (라인 번호 포함)
[PRD 전문 - nl -ba 형식으로]

## TaskMaster PRD 형식 기준
<context>: Overview, Core Features, User Experience
<PRD>: Technical Architecture, Development Roadmap (Phase 단위),
       Logical Dependency Chain, Risks and Mitigations, Appendix

## 검토 기준
1. 구조: TaskMaster PRD 형식 준수 여부
2. 명확성: 모호한 표현, 정의되지 않은 용어, 측정 불가능한 목표
3. 실행가능성: 구현 가능한 수준의 구체성, 기술적 현실성
4. 완전성: 누락된 섹션 (User Stories, Acceptance Criteria,
   Success Metrics, Risk/Dependencies 등)
5. 일관성: 내부 모순, 중복 정의, 버전 불일치

## 출력 형식 (반드시 이 형식으로)

### 타당한 점 (Strengths)
- [항목]: [설명] (라인 번호)

### 개선 필요 사항 (Issues)
| 항목 | 위치(라인) | 문제점 | 권장 수정 |
|------|-----------|--------|----------|

### 개방 질문 (Open Questions)
- [질문 1]
- [질문 2]

### 종합 평가
[1-2문장 요약]
```

### Step 3: Codex MCP 첫 실행

**mcp__codex__codex 도구 호출:**

파라미터:
- `prompt`: Step 2에서 구성한 전체 프롬프트
- `sandbox`: "read-only"
- `cwd`: 프로젝트 루트 경로 (선택)

**호출 예시:**
```
mcp__codex__codex 도구 호출:
- prompt: [구성한 프롬프트]
- sandbox: "read-only"
```

**참고:**
- MCP 도구 응답에서 텍스트 결과를 파싱
- 타임아웃 발생 시 프롬프트 길이 줄이기

### Step 4: Codex 피드백 수신 및 파싱

Codex 응답을 다음 구조로 정리:
- Strengths: 타당한 점 목록
- Issues: 개선 필요 사항 테이블
- Open Questions: 개방 질문 목록
- Summary: 종합 평가

### Step 5: Claude Cross-check

**Codex가 놓칠 수 있는 항목 검증:**

1. **이미 해결된 이슈 확인**
   ```bash
   git log --oneline -20
   ```
   - PRD에 언급된 이슈가 이미 커밋으로 해결되었는지 확인

2. **패키지/의존성 존재 여부 검증**
   - npm: `npm view [패키지명]`
   - pip: `pip show [패키지명]` 또는 PyPI 검색
   - 실제로 존재하지 않는 패키지 언급 여부

3. **코드베이스-PRD 동기화 확인**
   - PRD에 언급된 파일/모듈이 실제 존재하는지
   - 기존 구현과 PRD 설계 일치 여부

4. **CLAUDE.md 지침 준수 확인**
   - 프로젝트 컨벤션 준수 여부
   - TaskMaster 워크플로우 적합성

5. **Codex 틀린 부분 식별**
   - 검증 결과 틀린 내용 목록화
   - 근거 준비 (git commit, 실제 파일 등)

### Step 6: 불일치 확인 및 재검토 (컨텍스트 재전달 방식)

**불일치 항목이 있으면:**

`mcp__codex__codex` 새 세션으로 호출하되, **이전 대화 맥락을 프롬프트에 포함**:

#### 재검토 프롬프트 템플릿:
```
## 역할
당신은 PRD 검토 전문가입니다.

## 이전 검토 맥락

### 1차 검토 결과 요약
[Codex 1차 응답 핵심 내용 - Strengths, Issues, Questions, Summary]

### Claude Cross-check 결과
[불일치 항목 및 근거]

## 재검토 요청
위 Cross-check 결과를 반영하여 다음 항목만 재검토해주세요:
1. [불일치 항목 1]
2. [불일치 항목 2]

기존 평가 중 변경이 필요한 부분만 수정된 형식으로 답변해주세요.

## 참고 정보
[필요시 추가 컨텍스트 - 관련 코드, git log 등]
```

**MCP 호출:**
```
mcp__codex__codex 도구 호출:
- prompt: [재검토 프롬프트]
- sandbox: "read-only"
```

**핑퐁 종료 조건:**
- 합의 도달 (불일치 항목 없음)
- 최대 3회 도달
- Codex가 Claude의 근거를 수용

**반복 횟수 추적:**
- 1회차: 초기 검토
- 2회차: 1차 재검토 (이전 맥락 포함)
- 3회차: 2차 재검토 (마지막)

### Step 7: 합의 도출 및 전달

**출력 형식:**

```markdown
## PRD 검토 결과 (Codex + Claude 합의)

### 검토 과정
- 핑퐁 횟수: [N]회
- 합의 상태: [완전 합의 / 부분 합의 / Claude 판단]

### [VALID] 타당한 피드백
| 항목 | 설명 | 출처 |
|------|------|------|

### [ISSUE] 개선 필요 사항
| 항목 | 문제점 | 권장 수정 | 출처 |
|------|--------|----------|------|

### [CORRECTION] Codex 오류 교정
| Codex 주장 | 실제 상황 | 근거 |
|-----------|----------|------|

### [DECISION] 결정 필요 사항
(선택지가 있으면 AskUserQuestion으로 질문)

### [SUMMARY] 종합 결론
[최종 요약]
```

---

## 작업 지침

- 한글로 답변
- 코드나 문서 작성 시 이모지 사용 금지
- **불명확한 사항은 추측하지 말고 AskUserQuestion으로 질문**
- PRD 수정 제안은 사용자 확인 후 진행
- Codex와 Claude 의견 불일치 시 근거를 명확히 제시
- 검토 기준이 애매하면 사용자에게 우선순위 질문

---

## 오류 처리

- **PRD 파일 없음**: "파일을 찾을 수 없습니다. 경로를 확인해주세요."
- **Codex MCP 호출 실패**: "Codex MCP 도구 호출에 실패했습니다. MCP 서버 상태를 확인해주세요."
- **타임아웃**: "Codex 응답 시간 초과. 프롬프트 길이를 줄이거나 다시 시도해주세요."
- **재검토 필요**: "이전 맥락을 포함하여 새 세션으로 재검토를 진행합니다."

---

## Codex MCP 도구 참조

### Claude가 사용하는 MCP 도구
| 도구 | 파라미터 | 설명 |
|------|----------|------|
| `mcp__codex__codex` | `prompt`, `sandbox`, `cwd`, `model` 등 | 새 Codex 세션 시작 |

**주요 파라미터:**
- `prompt` (필수): 초기 프롬프트
- `sandbox`: "read-only" (파일 읽기만 허용, 안전)
- `cwd`: 작업 디렉토리 (선택)
- `model`: 모델 지정 (선택, 예: "o3", "o4-mini")

**참고:**
- 핑퐁 시에는 새 세션에 이전 맥락을 프롬프트에 포함하여 호출
- CLI의 `codex resume`과 달리 MCP에서는 컨텍스트 재전달 방식 사용

---

## Cross-check 체크리스트

| 검증 항목 | 방법 | 예시 |
|----------|------|------|
| 이미 해결된 이슈 | `git log --grep="이슈번호"` | 특정 이슈가 이미 커밋으로 해결됨 |
| 패키지 존재 여부 | `npm view` / `pip show` | 존재하지 않는 SDK 언급 |
| 파일/모듈 존재 | `ls`, `find`, `grep` | 특정 어댑터 파일 위치 확인 |
| 버전 일치 | `package.json`, `requirements.txt` | 명시된 버전과 실제 버전 |

---

## 사용 예시

```bash
# PRD 생성 후 검토
/tm:convert-prd .taskmaster/docs/my-idea.md
# prd.md 생성됨

/tm:review-prd-with-codex .taskmaster/docs/prd.md
# Codex MCP 검토 + Claude cross-check + 핑퐁 + 합의 결과 출력
```

---

## 워크플로우 다이어그램

```
[Step 1: 풍부한 컨텍스트 수집]
    |
    v
[Step 2: 프롬프트 구성]
    |
    v
[Step 3: Codex MCP 1차 검토] ─────────────────────────┐
    |     (mcp__codex__codex)                         |
    v                                                  |
[Step 4: 피드백 파싱]                                  |
    |                                                  |
    v                                                  |
[Step 5: Claude Cross-check]                           |
    |                                                  |
    v                                                  |
[Step 6: 불일치 있음?]                                 |
    |                                                  |
    ├─ YES & 반복 < 3 ─> [새 MCP 호출 + 컨텍스트 재전달]┘
    |                     (이전 대화 요약 포함)
    |
    └─ NO 또는 반복 >= 3 ─> [Step 7: 합의 결과 전달]
```

**핵심 플로우:**
1. Codex MCP 검토 실행
2. Claude가 cross-check로 검증
3. 불일치 발견 시 새 MCP 호출 (이전 맥락을 프롬프트에 포함)
4. 합의 도달 또는 최대 3회까지 반복
5. 최종 결과 전달

---

## 예상 결과물 예시

```markdown
## PRD 검토 결과 (Codex + Claude 합의)

### 검토 과정
- 핑퐁 횟수: 2회
- 합의 상태: 완전 합의

### [VALID] 타당한 피드백
| 항목 | 설명 | 출처 |
|------|------|------|
| 성공 지표 없음 | Goals에 기능 목표만 있음, 성능/비용 기준 미정의 | Codex |
| 에러 처리 누락 | API 호출 코드에 예외 처리 없음 | Codex + Claude |
| 테스트 시나리오 | happy-path만 있고 실패 케이스 없음 | Codex |

### [ISSUE] 개선 필요 사항
| 항목 | 문제점 | 권장 수정 | 출처 |
|------|--------|----------|------|
| 의존성 목록 | 존재하지 않는 패키지 언급 | 실제 패키지로 수정 | Claude 검증 |
| Milestone 상태 | 이미 해결된 이슈 포함 | 완료 표시 또는 제거 | Claude 검증 |

### [CORRECTION] Codex 오류 교정
| Codex 주장 | 실제 상황 | 근거 |
|-----------|----------|------|
| 특정 기능 미구현 | 해당 기능 이미 존재 | src/modules/ 폴더 확인 |

### [SUMMARY] 종합 결론
PRD는 구조적으로 양호하나, 비기능 요구사항(성능, 보안, 에러 처리)과
의존성 정보 업데이트가 필요함. 이미 해결된 이슈는 Milestone에서 제거 권장.
```
