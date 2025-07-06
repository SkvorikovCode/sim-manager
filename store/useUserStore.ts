import { create } from 'zustand';
import { User } from '@/types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateBalance: (balance: number) => void;
  updateStatus: (isActive: boolean) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  updateBalance: (balance) => set((state) => ({
    user: state.user ? { ...state.user, balance } : null
  })),
  updateStatus: (isActive) => set((state) => ({
    user: state.user ? { ...state.user, isActive } : null
  })),
  logout: () => set({ user: null, error: null }),
}));

export default useUserStore;