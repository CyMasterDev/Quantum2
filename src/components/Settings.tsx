import React from 'react';
import { useSettingsStore } from '../store/settings';

export function Settings() {
  const {
    theme,
    setTheme,
    proxyType,
    setProxyType,
    searchEngine,
    setSearchEngine
  } = useSettingsStore();

  const selectClass = `w-full h-12 bg-white/5 rounded-xl px-4
                      text-sm appearance-none cursor-pointer
                      focus:outline-none active:ring-2 active:ring-white/20
                      bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] 
                      bg-[length:12px_8px] bg-[right_16px_center] bg-no-repeat`;

  return (
    <div className="frame max-w-5xl h-full mx-auto py-12 px-6 overflow-y-auto">
        <h1 className="h1-bold">Settings</h1>
        <p className="base-medium text-light-3">Customize your browsing experience</p>

      <div className="space-y-12 py-6">
        <div className="bg-white/5 rounded-2xl p-6">
          <h3 className="h3-bold mb-2">Appearance</h3>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={selectClass}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="bg-white/5 rounded-2xl p-6">
          <h3 className="h3-bold mb-2">Proxy</h3>
          <select
            value={proxyType}
            onChange={(e) => setProxyType(e.target.value)}
            className={selectClass}
          >
            <option value="ultraviolet">Ultraviolet</option>
          </select>
        </div>

        <div className="bg-white/5 rounded-2xl p-6">
          <h3 className="h3-bold mb-2">Search Engine</h3>
          <select
            value={searchEngine}
            onChange={(e) => setSearchEngine(e.target.value)}
            className={selectClass}
          >
            <option value="google">Google</option>
            <option value="duckduckgo">DuckDuckGo</option>
            <option value="bing">Bing</option>
          </select>
        </div>
      </div>
    </div>
  );
}