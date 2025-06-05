import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: "forest", // default theme
  setTheme: (theme) => set({ theme }),
}));