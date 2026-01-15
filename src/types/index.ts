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

export enum MemberGrade {
  UNAPPROVED = 0,
  APPROVED = 1,
  ADMIN = 2,
}
