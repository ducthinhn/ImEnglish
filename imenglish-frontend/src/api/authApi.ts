import { axiosClient } from './axiosClient';
import type {
  ApiResponse,
  AuthResponse,
  LoginPayload,
  RefreshTokenPayload,
  RegisterPayload,
} from '@/types/auth';

export const authApi = {
  register: (payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post('/auth/register', payload);
  },

  login: (payload: LoginPayload): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post('/auth/login', payload);
  },

  refreshToken: (payload: RefreshTokenPayload): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post('/auth/refresh', payload);
  },

  logout: (payload: RefreshTokenPayload): Promise<ApiResponse<void>> => {
    return axiosClient.post('/auth/logout', payload);
  },
};
