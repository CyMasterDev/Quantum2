import { useBrowserStore } from '../store/browser';
import { AddressBar } from './AddressBar';
import { Settings } from './Settings';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { useSettingsStore } from '../store/settings';
import { Search } from 'lucide-react';

export function Browser() {
  const { tabs, activeTabId, updateTab, setLoading, addTab } = useBrowserStore();
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  const { searchEngine } = useSettingsStore();

  // State for the input per tab
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});

  // Set initial value for active tab's input field
  const handleInputChange = (tabId: string, value: string) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [tabId]: value,
    }));
  };

  const handleBrowserUrl = (url: string) => {
    const browserUrl = url.toLowerCase();

    switch (browserUrl) {
      case 'browser://settings':
        updateTab(activeTabId!, {
          url: browserUrl,
          title: 'Settings',
          favicon: 'data:image/svg+xml,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          `),
        });
        return true;

      case 'browser://newtab':
        addTab({
          url: 'about:blank',
          title: 'New Tab'
        });
        return true;

      default:
        if (browserUrl.startsWith('browser://')) {
          return true;
        }
        return false;
    }
  };

  const normalizeUrl = (url: string): string => {
    if (url.toLowerCase().startsWith('browser://')) {
      return url.toLowerCase();
    }

    url = url.trim();

    if (url.includes(' ')) return url;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      const testUrl = new URL(url);
      return testUrl.toString();
    } catch {
      console.error('Invalid URL:', url);
      return url;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTabId || !inputs[activeTabId]) return;

    let url = inputs[activeTabId];

    if (url.toLowerCase().startsWith('browser://')) {
      if (handleBrowserUrl(url)) return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = normalizeUrl(url);
      } else {
        const searchUrls = {
          google: 'https://www.google.com/search?q=',
          duckduckgo: 'https://duckduckgo.com/?q=',
          bing: 'https://www.bing.com/search?q=',
        };
        url = `${searchUrls[searchEngine]}${encodeURIComponent(url)}`;
      }
    }

    setLoading(activeTabId, true);

    try {
      const encodedUrl = btoa(url);
      const proxyUrl = `/uv/service/${encodedUrl}`;

      // Attempt to fetch favicon
      const favicon = `https://www.google.com/s2/favicons?domain=${url}&sz=128`;

      updateTab(activeTabId, {
        url: proxyUrl,
        title: url,
        favicon,
      });

    } finally {
      setLoading(activeTabId, false);
    }
  };

  const renderContent = () => {
    if (!activeTab) return null;

    if (activeTab.url === 'about:blank') {
      return (
        <div className="w-full h-full flex items-center justify-center rounded-2xl">
          <div className="scale-up-animation w-full max-w-lg p-12 flex-col items-center">
            <h1 className="h1-bold text-center mb-5">
              Zen
            </h1>
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="relative group active:scale-[0.98]">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                  <Search className="h-4 w-4 text-white group-focus-within:text-white" />
                </div>
                <input
                  type="text"
                  value={inputs[activeTabId || ''] || ''}
                  onChange={(e) => handleInputChange(activeTabId || '', e.target.value)}
                  className="max-w-465 w-full h-10 bg-dark-3 rounded-full pl-12 pr-4 py-6
                 text-sm text-light-1 placeholder-white/40 
                 focus:outline-none focus:ring-2 focus:ring-white/20 
                 focus:bg-white/20 transition-all shadow-lg shadow-white/5 backdrop-blur-lg focus:shadow-white/10"
                  placeholder="Search the web or enter URL"
                />
              </div>
            </form>
          </div>
        </div>
      );
    }

    if (activeTab.url === 'browser://settings') {
      return (
        <Settings />
      );
    }

    return (
      <iframe
        key={activeTab.id}
        src={activeTab.url}
        id="iframe"
        className={cn(
          "w-full h-full border-none transition-opacity duration-300 z-50",
          !activeTab.loading && "animate-pulse"
        )}
        title={activeTab.title}
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="h-20 flex items-center bg-black/30 backdrop-blur-2xl">
        <AddressBar />
      </div>
      <div className="w-full h-full relative rounded-2xl">
        {renderContent()}
      </div>
    </div>
  );
}