---

description: "Task list for Implement Exam Analysis and Search UI"
---

# Tasks: Implement Exam Analysis and Search UI

**Input**: Design documents from `/specs/001-exam-analysis-ui/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/

**Tests**: Manual testing (as per plan). No automated tests requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: [US1] (Analysis), [US2] (Search), [US3] (Auth)
- Paths relative to repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create component directories in src/components/exam/ and src/pages/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and types

- [x] T002 [P] Update types in src/types/index.ts (Add AnalysisResult interface, Reuse SearchResponse)
- [x] T003 Implement exam API client in src/api/exam.ts (multipart/form-data support)
- [x] T004 Update search API client in src/api/search.ts (match new JSON response format)

**Checkpoint**: API clients and types ready for use

---

## Phase 3: User Story 1 - 이미지 기반 시험 문제 분석 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 이미지와 질문을 업로드하여 AI 분석 결과를 확인

**Independent Test**: Mock/Real API를 통해 이미지+텍스트 전송 후 결과 카드 렌더링 확인

### Implementation for User Story 1

- [x] T005 [US1] Implement useExamAnalysis hook in src/hooks/useExamAnalysis.ts
- [x] T006 [P] [US1] Create AnalysisResult component in src/components/exam/AnalysisResult.tsx (Conditional rendering)
- [x] T007 [P] [US1] Create AnalysisForm component in src/components/exam/AnalysisForm.tsx (File upload & validation)
- [x] T008 [US1] Create ExamAnalysisPage in src/pages/ExamAnalysisPage.tsx (Integrate Form & Result)
- [x] T009 [US1] Add route for ExamAnalysisPage in src/App.tsx (or main router file)

**Checkpoint**: '이미지 분석' 탭 기능 완벽 동작 확인

---

## Phase 4: User Story 2 - 일반 텍스트 질문 검색 (Priority: P1)

**Goal**: 이미지 없이 텍스트만으로 검색하여 결과 확인

**Independent Test**: 검색어 입력 후 텍스트 결과 렌더링 확인

### Implementation for User Story 2

- [x] T010 [US2] Update useSearch hook in src/hooks/useSearch.ts (Handle object response)
- [x] T011 [P] [US2] Update/Create SearchForm component in src/components/search/SearchForm.tsx (if needed distinct from existing)
- [x] T012 [US2] Integrate Search functionality into ExamAnalysisPage (Tab UI) or separate page

**Checkpoint**: '일반 검색' 탭 기능 완벽 동작 확인

---

## Phase 5: User Story 3 - 인증 상태 기반 API 접근 (Priority: P2)

**Goal**: 로그인 상태 유지 및 만료 시 적절한 안내

**Independent Test**: 로그아웃 상태에서 접근 차단, 401 응답 시 로그인 유도 확인

### Implementation for User Story 3

- [x] T013 [US3] Verify apiClient interceptors in src/api/client.ts (Ensure 401 handling)
- [x] T014 [US3] Wrap ExamAnalysisPage with ProtectedRoute/AdminRoute in src/App.tsx (if applicable)

**Checkpoint**: 보안 및 세션 관리 로직 검증 완료

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: UI refinement and documentation

- [x] T015 [P] Update README.md or docs with feature usage
- [x] T016 Polish UI styles (Tailwind classes for responsive cards)
- [x] T017 Verify error messages are user-friendly (FR-009)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup
- **User Stories (Phase 3+)**: All depend on Foundational types & API clients

### User Story Dependencies

- **US1 & US2**: Can run in parallel after Foundational phase (different hooks/components)
- **US3**: Can be done anytime, but best verified after US1/US2 implementation

### Parallel Opportunities

- T006 (Result UI) and T007 (Form UI) can be built in parallel
- US1 and US2 can be developed by separate developers if needed

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Setup & Types (T001-T004)
2. Implement Image Analysis (US1) -> **Validate MVP**
3. Implement Text Search (US2) -> **Validate Full Feature**
4. Verify Auth (US3) & Polish
