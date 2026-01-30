# Feature Specification: Implement Exam Analysis and Search UI

**Feature Branch**: `001-exam-analysis-ui`  
**Created**: 2026-01-30  
**Status**: Draft  
**Input**: User description: "요청: 기존 백엔드(Spring Boot 3.3/Java 21)에서 이미지 기반 시험 질문 분석 API와 일반 질문 검색이 정상 동작함. 프론트엔드에서 해당 기능을 사용할 UI를 구현해라..."

## Clarifications

### Session 2026-01-30
- Q: API 응답 데이터 구조 (`confidence` 및 `ragContext`) 확인 → A: `confidence`는 0.0 ~ 1.0 실수형, `ragContext`는 문자열 배열(`string[]`) 형태.
- Q: Search API 응답 포맷 (`POST /api/search`) → A: JSON 객체 `{ "answer": "결과 텍스트..." }` 형태.
- Q: 결과 UI에서 빈 필드 처리 방식 → A: `warning`이나 `imageAnalysisSummary` 등 값이 없는 섹션은 UI에서 제외(숨김) 처리.
- Q: 기존 인증 시스템 활용 여부 → A: 수동 토큰 입력 UI를 생성하지 않고, 기존 `AuthContext`에서 관리되는 토큰을 API 호출 헤더에 자동 포함하여 사용함.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 이미지 기반 시험 문제 분석 (Priority: P1)

사용자는 시험 문제 이미지와 텍스트 질문을 업로드하여 AI 분석 결과를 확인하고 싶어 합니다.

**Why this priority**: 이 프로젝트의 핵심 기능인 이미지 분석 기능을 제공하기 위함입니다.

**Independent Test**: 백엔드 `/api/exam/analyze` 엔드포인트를 모킹하거나 실제 서버를 사용하여, 이미지와 텍스트 전송 후 분석 결과(답변, 신뢰도 등)가 올바르게 표시되는지 확인합니다.

**Acceptance Scenarios**:

1. **Given** '이미지 분석' 탭이 선택된 상태에서, **When** 유효한 이미지(PNG/JPG, 1MB 이하)와 질문을 입력하고 제출하면, **Then** 로딩 스피너가 표시된 후 분석 결과(답변, 신뢰도, RAG 문맥 등)가 화면에 나타난다.
2. **Given** 이미지가 없거나 질문이 비어있는 상태에서, **When** 제출 버튼을 누르면, **Then** 적절한 유효성 검사 에러 메시지가 표시된다.
3. **Given** 1MB를 초과하는 이미지를 선택하면, **When** 파일 선택 시점에, **Then** 파일 크기 제한 경고가 표시된다.

---

### User Story 2 - 일반 텍스트 질문 검색 (Priority: P1)

사용자는 이미지가 없는 일반 텍스트 질문을 검색하여 빠른 답변을 얻고 싶어 합니다.

**Why this priority**: 이미지 없이 텍스트만으로 검색하는 기본적인 유즈케이스를 지원해야 합니다.

**Independent Test**: 백엔드 `/api/search` 엔드포인트를 호출하여 텍스트 질의에 대한 응답이 화면에 렌더링되는지 확인합니다.

**Acceptance Scenarios**:

1. **Given** '일반 검색' 탭이 선택된 상태에서, **When** 질문을 입력하고 제출하면, **Then** 답변이 결과 영역에 표시된다.
2. **Given** 빈 검색어를 입력하면, **When** 제출 시도 시, **Then** 입력을 요구하는 메시지가 표시된다.

---

### User Story 3 - 인증 상태 기반 API 접근 (Priority: P2)

사용자는 로그인된 상태에서만 분석 및 검색 기능을 사용하며, 인증이 만료된 경우 적절한 안내를 받고 싶어 합니다.

**Why this priority**: 보안 및 백엔드 API 요구사항 준수를 위해 인증 상태 관리가 필요합니다.

**Independent Test**: 로그아웃 상태에서 페이지 접근 시 로그인 페이지로 리다이렉트되거나, API 호출 시 401 에러가 발생했을 때 로그인 유도 메시지가 뜨는지 확인합니다.

**Acceptance Scenarios**:

1. **Given** 로그인하지 않은 사용자가 페이지에 접근하면, **When** 페이지 로드 시, **Then** 로그인 페이지로 리다이렉트되거나 기능이 비활성화된다.
2. **Given** 인증 토큰이 만료된 상태에서 분석/검색 요청을 시도하면, **When** API가 401 에러를 반환할 때, **Then** 세션 만료 안내와 함께 로그인 페이지로 이동을 권유한다.

---

### Edge Cases

- **네트워크/서버 오류**: API 호출 중 429(Too Many Requests), 500(Server Error) 발생 시 사용자에게 재시도 안내 메시지를 표시한다.
- **권한 오류**: 401/403 응답 시 `AuthContext`를 통해 세션 상태를 갱신하거나 로그인 유도 메시지를 표시한다.
- **대용량 응답**: RAG 문맥(Context)이 매우 길 경우, 초기에는 접혀있고 사용자가 펼쳐볼 수 있게 한다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 '이미지 분석'과 '일반 검색' 기능을 별도의 탭 또는 섹션으로 분리하여 제공해야 한다.
- **FR-002**: '이미지 분석' 기능은 이미지 파일(PNG/JPG/JPEG, 1MB 제한)과 텍스트 질문(최대 2000자)을 입력받아 `POST /api/exam/analyze` (multipart/form-data)를 호출해야 한다.
- **FR-003**: '일반 검색' 기능은 텍스트 질문을 입력받아 `POST /api/search` (JSON)를 호출해야 한다.
- **FR-004**: 시스템은 **기존 `AuthContext`에서 제공하는 인증 토큰(ID Token)**을 사용하여 모든 API 요청 헤더(`Authorization: Bearer <token>`)에 포함해야 한다. 별도의 수동 토큰 입력 UI는 제공하지 않는다.
- **FR-005**: API 응답 대기 중에는 로딩 스피너를 표시하여 사용자에게 진행 상황을 알려야 한다.
- [x] FR-006: 이미지 분석 결과에는 답변(answer), 신뢰도(confidence, 0.0~1.0), 경고(warning)가 포함되어야 하며, 이를 카드 형태의 UI로 시각화해야 한다. **단, 값이 없는(`null` 또는 빈 값) 필드는 해당 섹션을 화면에서 숨겨야 한다.**
- [x] FR-007: 일반 검색 결과는 응답 객체의 `answer` 필드 텍스트를 사용자에게 표시해야 한다.
- [x] FR-009: API 에러(401, 403, 429, 500 등) 발생 시 원시 에러 메시지 대신 사용자 친화적인 메시지를 표시해야 한다.

### Key Entities

- **AnalysisResult**: 분석 API 응답 객체
  - `answer` (string): 분석 답변
  - `confidence` (number): 0.0 ~ 1.0 사이의 신뢰도 점수
  - `warning` (string | null): 분석 시 발생한 경고 메시지
- **SearchResult**: 검색 API 응답 객체
  - `answer` (string): 검색 결과 텍스트
- **AuthToken**: `AuthContext`를 통해 관리되는 사용자 인증 문자열

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 사용자는 이미지와 질문을 업로드하고 5초 이내(네트워크 지연 제외)에 UI 반응(로딩 시작)을 확인할 수 있다.
- **SC-002**: 사용자는 로그인이 유지되는 동안 별도의 인증 절차 없이 분석 및 검색 기능을 즉시 사용할 수 있다.
- **SC-003**: API 에러 발생 시, 사용자는 빈 화면이 아닌 명확한 에러 메시지를 통해 원인을 인지할 수 있다.
- **SC-004**: RAG 문맥이 500자를 넘는 경우, 기본적으로 축약되어 표시된다.