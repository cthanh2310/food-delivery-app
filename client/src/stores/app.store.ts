import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AppState {
    // UI state
    sidebarOpen: boolean;
    theme: "light" | "dark" | "system";

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set) => ({
                // Initial state
                sidebarOpen: true,
                theme: "system",

                // Actions
                toggleSidebar: () =>
                    set(
                        (state) => ({ sidebarOpen: !state.sidebarOpen }),
                        false,
                        "toggleSidebar",
                    ),

                setSidebarOpen: (open) =>
                    set({ sidebarOpen: open }, false, "setSidebarOpen"),

                setTheme: (theme) => set({ theme }, false, "setTheme"),
            }),
            {
                name: "food-delivery-storage",
                partialize: (state) => ({
                    theme: state.theme,
                }),
            },
        ),
        { name: "AppStore" },
    ),
);
