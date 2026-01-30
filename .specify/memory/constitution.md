# learning-search-front Constitution

## Core Principles

### I. 언어 및 소통 (Language & Communication)
모든 커뮤니케이션(대화, 문서, 주석, 커밋 본문)은 **한국어**로 작성합니다. 단, 코드(변수명, 함수명, 클래스명 등)와 기술적인 식별자, 커밋 메시지의 type/scope는 **영어**를 사용합니다. 이는 명확한 의사소통과 기술적 표준 준수를 동시에 달성하기 위함입니다.

### II. 명명 및 스타일 규칙 (Naming & Style Conventions)
기존 코드베이스의 패턴을 엄격히 따릅니다.
- **Components/Pages**: PascalCase (e.g., `LoginForm.tsx`, `AdminDashboardPage.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useSearch.ts`)
- **Functions/Variables**: camelCase (e.g., `handleSubmit`, `isLoading`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `LoginRequest`)
- **Constants**: PascalCase Object 내의 UPPER_SNAKE_CASE 키 (e.g., `MemberGrade.ADMIN`) 또는 최상위 상수일 경우 UPPER_SNAKE_CASE

### III. 코드 품질 및 구조 (Code Quality & Structure)
유지보수성과 가독성을 최우선으로 합니다.
- **로직 분리**: 비즈니스 로직은 UI 컴포넌트에서 분리하여 Custom Hook(`src/hooks/`)이나 API 모듈(`src/api/`)로 추출합니다.
- **타입 안전성**: `any` 사용을 지양하고, `src/types/index.ts`에 정의된 명시적인 타입을 사용합니다.
- **컴포넌트 단일 책임**: 하나의 컴포넌트는 한 가지 역할만 수행하도록 설계하며, 복잡해질 경우 하위 컴포넌트로 분리합니다.

### IV. 사용자 경험 및 성능 (UX & Performance)
사용자에게 끊김 없는 경험을 제공합니다.
- **반응성**: 모든 비동기 작업(API 호출 등)에는 적절한 로딩 상태(`isLoading`)와 에러 처리(`error`) UI를 제공해야 합니다.
- **낙관적 업데이트**: 데이터 변경 시 가능하면 UI를 즉시 갱신하여 체감 속도를 높입니다.
- **피드백**: 성공/실패에 대한 명확한 피드백 메시지를 사용자에게 노출합니다.

## Governance

모든 기술적 결정과 구현은 위 원칙을 따릅니다. 단, **기존 레거시 코드의 작동을 방해하지 않는 것을 원칙**으로 합니다. 새로운 기능 추가나 리팩토링 시에만 이 헌장을 적용하며, 기존 코드를 무리하게 수정하여 리스크를 발생시키지 않습니다. 모든 변경 사항(PR)은 이 원칙에 부합하는지 검토되어야 합니다.

**Version**: 1.0.0 | **Ratified**: 2026-01-30 | **Last Amended**: 2026-01-30