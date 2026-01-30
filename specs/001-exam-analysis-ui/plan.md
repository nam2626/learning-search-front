# Implementation Plan: Implement Exam Analysis and Search UI

**Branch**: `001-exam-analysis-ui` | **Date**: 2026-01-30 | **Spec**: [specs/001-exam-analysis-ui/spec.md](specs/001-exam-analysis-ui/spec.md)
**Input**: Feature specification from `/specs/001-exam-analysis-ui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

사용자가 시험 문제 이미지와 질문을 업로드하여 AI 분석 결과를 확인하거나, 일반 텍스트 질문을 검색할 수 있는 UI를 구현합니다. 기존 인증 시스템(`AuthContext`)을 활용하며, React Query와 Axios를 사용하여 API 통신을 처리하고 Tailwind CSS로 반응형 UI를 구성합니다.

## Technical Context

**Language/Version**: React 19, TypeScript ~5.9.3
**Primary Dependencies**: @tanstack/react-query ^5.90.17, axios ^1.13.2, react-router-dom ^7.12.0
**Storage**: LocalStorage (via AuthContext logic), No additional persistence required for this feature
**Testing**: Manual testing as per project current state (no test framework setup detected in package.json scripts other than build/lint)
**Target Platform**: Web (Responsive)
**Project Type**: Single Page Application (Vite)
**Performance Goals**: <5s interaction response time
**Constraints**: 1MB image upload limit, Authorization header required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **언어 및 소통**: 문서는 한국어, 코드는 영어 사용 준수.
- [x] **명명 규칙**: PascalCase(컴포넌트/타입), camelCase(함수/변수/훅) 준수 계획.
- [x] **코드 품질**: 비즈니스 로직은 `hooks/` 및 `api/`로 분리. `types/`에 명시적 타입 정의.
- [x] **UX**: 로딩 스피너 및 사용자 친화적 에러 메시지 처리 포함.

## Project Structure

### Documentation (this feature)

```text
specs/001-exam-analysis-ui/
├── plan.md              # This file
├── research.md          # Phase 0 output (Skipped/Minimal)
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── exam.ts                  # [NEW] Exam analysis API endpoints
│   └── search.ts                # [UPDATE] Search API endpoints
├── components/
│   ├── exam/                    # [NEW] Exam analysis components
│   │   ├── AnalysisForm.tsx     # Image & text upload form
│   │   └── AnalysisResult.tsx   # Result card UI
│   └── search/                  # [UPDATE] Search components
│       └── SearchForm.tsx       # Text search form
├── hooks/
│   ├── useExamAnalysis.ts       # [NEW] Custom hook for analysis logic
│   └── useSearch.ts             # [UPDATE] Update return types if needed
├── pages/
│   └── ExamAnalysisPage.tsx     # [NEW] Main page for this feature
└── types/
    └── index.ts                 # [UPDATE] Add AnalysisResult, SearchResult types
```

**Structure Decision**: 기존 `src/` 구조를 따르며 도메인별(exam) 디렉토리를 추가하여 모듈화합니다.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |