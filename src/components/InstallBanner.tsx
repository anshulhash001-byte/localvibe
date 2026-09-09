import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

export default function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already dismissed or already installed
    const dismissed = localStorage.getItem('install-banner-dismissed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (dismissed || isStandalone) {
      return;
    }

    // Check if on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Listen for beforeinstallprompt event (Chrome, Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS Safari, show banner after a delay (no beforeinstallprompt event)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Chrome/Edge: trigger the install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[InstallBanner] User response: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      // iOS: show instructions
      alert('To install LocalVibe:\n\n1. Tap the Share button (⬆️)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"');
    }
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('install-banner-dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in-up">
      <div className="max-w-md mx-auto px-4 pb-4">
        <div className="bg-white rounded-2xl shadow-xl border border-sand-200 p-4 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-terracotta-400 via-terracotta-500 to-teal-600" />
          
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-sand-100 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-sand-500" />
          </button>

          {/* Content */}
          <div className="flex items-start gap-3 pr-6">
            <div className="w-10 h-10 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-teal-900 text-sm mb-0.5">Install LocalVibe</h3>
              <p className="text-xs text-sand-600 leading-relaxed">
                📱 Add to home screen for offline access to your itineraries
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleDismiss}
              className="flex-1 py-2.5 px-4 text-xs font-medium text-sand-600 bg-sand-50 rounded-xl hover:bg-sand-100 transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl hover:shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
