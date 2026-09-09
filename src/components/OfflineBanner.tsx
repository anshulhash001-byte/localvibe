import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-fade-in-up">
      <div className="max-w-md mx-auto px-4 pt-2">
        <div className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 rounded-2xl shadow-lg p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <WifiOff className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white">You're offline</p>
            <p className="text-[10px] text-white/80">Some features may be limited. Check your connection.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
            aria-label="Retry"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
