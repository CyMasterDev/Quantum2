import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isOpen: boolean;
  theme: 'system' | 'light' | 'dark';
  proxyType: 'ultraviolet' | 'bare' | 'epoxy' | 'libcurl';
  searchEngine: 'google' | 'duckduckgo' | 'bing';
  setSettingsOpen: (isOpen: boolean) => void;
  setTheme: (theme: 'system' | 'light' | 'dark') => void;
  setProxyType: (type: 'ultraviolet' | 'bare' | 'epoxy' | 'libcurl') => void;
  setSearchEngine: (engine: 'google' | 'duckduckgo' | 'bing') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isOpen: false,
      theme: 'system',
      proxyType: 'ultraviolet',
      searchEngine: 'google',
      setSettingsOpen: (isOpen) => set({ isOpen }),
      setTheme: (theme) => set({ theme }),
      setProxyType: (proxyType) => set({ proxyType }),
      setSearchEngine: (searchEngine) => set({ searchEngine }),
    }),
    {
      name: 'browser-settings',
    }
  )
);