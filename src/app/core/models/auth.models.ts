export type RoleEnum = 'PROFESSOR' | 'ACADEMIA';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  role: RoleEnum;
}
