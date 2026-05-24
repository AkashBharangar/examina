import { create } from 'zustand';

interface AppStore {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  user: {
    id?: string;
    name?: string;
  } | null;
  setUser: (user: { id?: string; name?: string } | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
  user: null,
  setUser: (user) => set({ user }),
}));
