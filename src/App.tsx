import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Browser } from './components/Browser';
import { useBrowserStore } from './store/browser';

function App() {
  const { addTab } = useBrowserStore();

  useEffect(() => {
    // Add initial tab
    addTab({
      url: 'about:blank',
      title: 'New Tab',
    });

    // Register service worker with proper scope and type
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/uv/sw.js', {
        scope: '/uv/service',
        type: 'classic',
        updateViaCache: 'none'
      }).catch(console.error);
    }
  }, [addTab]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Sidebar />
      <Browser />
    </div>
  );
}

export default App;