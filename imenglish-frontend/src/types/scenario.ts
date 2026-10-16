import type { EnglishLevel } from './auth';

export interface Scenario {
  id: string;
  code: string;
  title: string;
  topic: string;
  cefrLevel: EnglishLevel;
  difficulty: string;
  estimatedDurationMinutes: number;
  description: string;
  aiRole: string;
  userRole: string;
  initialGreeting: string;
  suggestedVocabulary: string[];
  conversationGoals: string[];
  icon: string;
  orderIndex: number;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  isLast: boolean;
}

export interface ScenarioQueryParams {
  topic?: string;
  level?: EnglishLevel;
  keyword?: string;
  page?: number;
  size?: number;
}
