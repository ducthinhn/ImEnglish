import { axiosClient } from './axiosClient';
import type { ApiResponse } from '@/types/auth';
import type { Scenario, PageResponse, ScenarioQueryParams } from '@/types/scenario';

export const scenarioApi = {
  getScenarios: (params?: ScenarioQueryParams): Promise<ApiResponse<PageResponse<Scenario>>> => {
    return axiosClient.get('/ai/scenarios', { params });
  },

  getScenarioById: (id: string): Promise<ApiResponse<Scenario>> => {
    return axiosClient.get(`/ai/scenarios/${id}`);
  },

  getTopics: (): Promise<ApiResponse<string[]>> => {
    return axiosClient.get('/ai/scenarios/topics');
  },

  getFeaturedScenarios: (level?: string, limit: number = 4): Promise<ApiResponse<Scenario[]>> => {
    return axiosClient.get('/ai/scenarios/featured', {
      params: { level, limit },
    });
  },
};
