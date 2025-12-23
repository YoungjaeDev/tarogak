# PRD 초안 -> TaskMaster PRD 변환

초안 파일을 TaskMaster PRD 포맷으로 변환합니다.

**템플릿:** `.claude/guideline/tm/prd-guide.md` 복사해서 초안 작성

**원칙:**
- 원본 내용 유지 (임의로 늘리거나 줄이지 않음)
- 한글로 작성
- `.taskmaster/templates/example_prd.txt` 포맷 준수

---

## 아규먼트

`$ARGUMENTS`로 초안 파일 경로를 받습니다:
- 예: `/tm:convert-prd .taskmaster/docs/my-idea.md`
- 없으면 AskUserQuestion으로 경로 입력 요청

---

## 작업 순서

### 1. 초안 읽기

```bash
cat $ARGUMENTS
```

파일이 없거나 내용이 비어있으면 작성 요청.

### 2. 타겟 포맷 확인

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

### 3. 변환

초안 내용을 위 포맷에 맞게 재배치:

| 초안 섹션 | PRD 섹션 |
|----------|----------|
| 뭘 만들고 싶은지 | Overview |
| 주요 기능 | Core Features |
| (UX 관련 내용) | User Experience |
| 기술 스택 | Technical Architecture |
| 만드는 순서 | Development Roadmap, Logical Dependency Chain |
| 기타 (걱정) | Risks and Mitigations |
| 기타 (참고) | Appendix |

**변환 규칙:**
- 원본에 없는 내용 추가 금지
- 섹션 내용이 없으면 "[추후 작성]" 표시
- 한글로 작성
- Development Roadmap은 Phase 단위로 구분

### 4. 결과 출력

변환된 PRD 전체 출력.

### 5. 저장

AskUserQuestion으로 확인 후 저장:
- 기본: `.taskmaster/docs/prd.md`
- 다른 경로 가능

### 6. 다음 단계 안내

```
[변환 완료]

다음 단계:
task-master parse-prd .taskmaster/docs/prd.md
```

---

## 출력 포맷

```markdown
<context>
# Overview
[뭘 만들고 싶은지 내용]

# Core Features
[주요 기능 내용]

# User Experience
[UX 관련 내용 또는 추후 작성]
</context>

<PRD>
# Technical Architecture
[기술 스택 내용]

# Development Roadmap
## Phase 1: [이름]
- [기능]

## Phase 2: [이름]
- [기능]

# Logical Dependency Chain
[만드는 순서 기반 의존성]

# Risks and Mitigations
[걱정되는 점]

# Appendix
[참고사항]
</PRD>
```
