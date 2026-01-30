# Data Model: Implement Exam Analysis and Search UI

## Types & Interfaces

### AnalysisResult
API 응답으로 반환되는 분석 결과 데이터 구조입니다.

```typescript
export interface AnalysisResult {
  /** 분석된 정답 텍스트 */
  answer: string;
  /** 신뢰도 점수 (0.0 ~ 1.0) */
  confidence: number;
  /** 분석 과정에서 발생한 경고 메시지 (없을 경우 null 또는 빈 문자열) */
  warning: string | null;
}
```

### SearchResponse (Existing)
일반 검색 API 응답 데이터 구조입니다. (기존 `src/types/index.ts`의 `SearchResponse` 재사용)

```typescript
export interface SearchResponse {
  /** 검색 결과 텍스트 */
  answer: string;
}
```

### ExamAnalysisRequest
분석 요청 시 전송되는 데이터 구조입니다. (Multipart/Form-Data)

```typescript
export interface ExamAnalysisRequest {
  /** 업로드할 이미지 파일 (최대 1MB) */
  image?: File;
  /** 사용자가 입력한 질문 텍스트 (필수) */
  query: string;
}
```
