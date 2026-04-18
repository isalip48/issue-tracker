import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: true,
      isSidebarOpen: true,

      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          document.documentElement.classList.toggle("dark", newDarkMode);
          return { isDarkMode: newDarkMode };
        }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    },
  ),
);
