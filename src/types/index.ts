export interface User {
  email: string;
  nickname: string;
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
