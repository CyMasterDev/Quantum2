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

  const selectClass = `w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4
                      text-sm appearance-none cursor-pointer
                      focus:outline-none focus:ring-2 focus:ring-white/20
                      bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] 
                      bg-[length:12px_8px] bg-[right_16px_center] bg-no-repeat`;

  return (
    <div className="frame w-full h-full mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-white/60">Customize your browsing experience</p>
      </div>

      <div className="space-y-12">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-6">Appearance</h3>
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

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-6">Proxy Transport</h3>
          <select
            value={proxyType}
            onChange={(e) => setProxyType(e.target.value)}
            className={selectClass}
          >
            <option value="ultraviolet">Ultraviolet</option>
            <option value="bare">Bare</option>
            <option value="epoxy">Epoxy</option>
            <option value="libcurl">LibCurl</option>
          </select>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-6">Search Engine</h3>
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