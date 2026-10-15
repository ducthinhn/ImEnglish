export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LearningGoal = 'CONVERSATION' | 'IELTS' | 'BUSINESS' | 'TRAVEL';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  englishLevel: EnglishLevel;
  learningGoal?: LearningGoal;
  nativeLanguage?: string;
  timezone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  roles: string[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  timestamp?: string;
}

export interface AuthResponse {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  fullName?: string;
  englishLevel?: EnglishLevel;
  learningGoal?: LearningGoal;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}
