export type QuestionStatus = 'WAITING' | 'ANSWERED' | 'RESOLVED';
export type QuestionSort = 'LATEST' | 'ANSWERS_ASC' | 'ANSWERS_DESC';

export interface QuestionSummary {
  id: string;
  title: string;
  authorNickname: string;
  status: QuestionStatus;
  answerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  content: string;
  authorNickname: string;
  accepted: boolean;
  createdAt: string;
  updatedAt: string;
  canEdit: boolean;
  canDelete: boolean;
  canAccept: boolean;
}

export interface QuestionDetail extends QuestionSummary {
  content: string;
  acceptedAnswerId: string | null;
  canEdit: boolean;
  canDelete: boolean;
  answers: Answer[];
}

export interface QuestionPage {
  items: QuestionSummary[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface QuestionListParams {
  limit?: number;
  cursor?: string;
  query?: string;
  status?: QuestionStatus;
  sort?: QuestionSort;
}

export interface QuestionInput {
  title: string;
  content: string;
}

export interface QuestionUpdateInput extends QuestionInput {
  expectedUpdatedAt: string;
}

export interface AnswerInput {
  content: string;
}

export interface AnswerUpdateInput extends AnswerInput {
  expectedUpdatedAt: string;
}

export interface BoardErrorResponse {
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}
