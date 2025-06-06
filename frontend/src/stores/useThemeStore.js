import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("stremify-theme") || "coffee", // default theme
  setTheme: (theme) => {
    localStorage.setItem("stremify-theme", theme);
    set({ theme });
  },
}));