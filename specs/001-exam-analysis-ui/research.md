# Research: Implement Exam Analysis and Search UI

**Feature**: `001-exam-analysis-ui`
**Status**: Complete

## Decision Log

### 1. API Communication Strategy
- **Decision**: Use `axios` with `react-query` (`useMutation`).
- **Rationale**: Existing project standard. `useMutation` handles loading/error states efficiently for POST requests.
- **Alternatives**: Native `fetch` (rejected due to lack of interceptors already configured in `client.ts`).

### 2. State Management
- **Decision**: Local state (`useState`) for form inputs, Server state (`react-query`) for API responses.
- **Rationale**: Form data is ephemeral; API data requires caching and status tracking provided by React Query.

### 3. UI/UX Components
- **Decision**: Tailwind CSS for styling. Custom components for "Result Card".
- **Rationale**: No external UI library (like MUI/Chakra) detected in `package.json`. Consistent with `src/index.css`.
