export interface User {
  email: string;
  nickname: string;
  grade?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface SearchResponse {
  answer: string;
}

export interface UploadResponse {
  message: string;
}

export interface Member {
  uid: string;
  email: string;
  nickname: string;
  grade: number;
  createdAt?: string;
}

export interface MemberListResponse {
  members: Member[];
  nextPageToken?: string;
}

export const MemberGrade = {
  UNAPPROVED: 0,
  APPROVED: 1,
  ADMIN: 2,
} as const;

export interface CreditInfo {
  remaining: number;
  max: number;
  lastResetDate: string;
}

export interface SearchLog {
  id: string;
  query: string;
  answer: string;
  createdAt: string;
}

export interface UserDashboard {
  credit: CreditInfo;
  recentQueries: SearchLog[];
}

export interface UserCreditInfo {
  uid: string;
  email: string;
  nickname: string;
  remainingCredits: number;
  maxCredits: number;
  lastResetDate: string;
}

export interface AdminSearchLog {
  id: string;
  uid: string;
  email: string;
  nickname: string;
  query: string;
  createdAt: string;
}
