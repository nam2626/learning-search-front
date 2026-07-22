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
  termsAccepted: boolean;
}

export interface UpdateProfileRequest {
  nickname?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface EmailCheckResponse {
  available: boolean;
  message: string;
}

export interface SearchResponse {
  answer: string;
}

export interface AnalysisResult {
  answer: string;
  confidence: number;
  warning: string | null;
}

export interface UploadResponse {
  message: string;
}

export interface Member {
  uid: string;
  email: string;
  nickname: string;
  grade: number;
  createdAt: string | null;
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
  uid: string;
  dailyCredits: number;
  theoryCredits: number;
  examCredits: number;
  lastActiveDate: string;
  totalUsage: number;
}

export interface SearchLog {
  uid: string;
  query: string;
  timestamp: string;
  answerSummary: string | null;
}

export interface UserDashboard {
  credit: CreditInfo;
  logs: SearchLog[];
}

export interface UserCreditInfo {
  uid: string;
  username?: string | null;
  dailyCredits: number;
  theoryCredits: number;
  examCredits: number;
  lastActiveDate: string;
  totalUsage: number;
}

export interface AdminSearchLog {
  uid?: string;
  username?: string;
  question?: string;
  timestamp?: string;
  answerSummary?: string | null;
}
