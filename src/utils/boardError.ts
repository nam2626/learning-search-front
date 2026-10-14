import axios from 'axios';
import type { BoardErrorResponse } from '../types/board';

const STATUS_MESSAGES: Record<number, string> = {
  400: '입력 내용을 확인해 주세요.',
  401: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
  403: '이 작업을 수행할 권한이 없습니다.',
  404: '질문 또는 답변을 찾을 수 없습니다.',
  409: '다른 사용자가 먼저 내용을 변경했습니다. 새로고침 후 다시 시도해 주세요.',
  429: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
};

export function getBoardErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<BoardErrorResponse>(error)) {
    return '요청을 처리하지 못했습니다. 다시 시도해 주세요.';
  }
  const fieldMessage = error.response?.data?.fieldErrors
    ? Object.values(error.response.data.fieldErrors)[0]
    : undefined;
  return fieldMessage
    || error.response?.data?.message
    || (error.response?.status ? STATUS_MESSAGES[error.response.status] : undefined)
    || '서버에 연결하지 못했습니다. 네트워크 상태를 확인해 주세요.';
}
