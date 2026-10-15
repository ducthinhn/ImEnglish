import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, User } from '@/types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setAuth: (response: AuthResponse) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (response: AuthResponse) =>
        set({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
        }),

      setTokens: (accessToken: string, refreshToken: string) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      setUser: (user: User) =>
        set({
          user,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'imenglish-auth-storage',
    }
  )
);
