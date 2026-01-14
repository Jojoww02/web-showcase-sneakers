import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  token: string | null;
  refreshToken: string | null;
  setUser: (user: UserState['user']) => void;
  setToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);