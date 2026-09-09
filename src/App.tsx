import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import ResultsView from './components/ResultsView';
import SavedView from './components/SavedView';
import InstallBanner from './components/InstallBanner';
import OfflineBanner from './components/OfflineBanner';
import BottomNav from './components/BottomNav';
import { registerServiceWorker } from './utils/registerSW';

type View = 'landing' | 'chat' | 'results';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'saved'>('home');

  useEffect(() => {
    // Register service worker for offline support
    registerServiceWorker();
  }, []);

  const handleGetStarted = () => {
    setCurrentView('chat');
    setActiveTab('chat');
  };

  const handleGenerate = () => {
    setCurrentView('results');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setActiveTab('home');
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
    setActiveTab('chat');
  };

  const handleTabChange = (tab: 'home' | 'chat' | 'saved') => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentView('landing');
    } else if (tab === 'chat') {
      setCurrentView('chat');
    } else if (tab === 'saved') {
      setCurrentView('landing'); // Will show saved view below
    }
  };

  // Show bottom nav on all views except results (results has its own nav)
  const showBottomNav = currentView !== 'results';

  return (
    <div className="max-w-md mx-auto min-h-screen bg-cream">
      {/* Offline Banner */}
      <OfflineBanner />

      {/* Main Content */}
      {currentView === 'landing' && activeTab !== 'saved' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      {currentView === 'landing' && activeTab === 'saved' && (
        <SavedView onExplore={handleGetStarted} />
      )}
      {currentView === 'chat' && (
        <ChatInterface onBack={handleBackToLanding} onGenerate={handleGenerate} />
      )}
      {currentView === 'results' && (
        <ResultsView onBack={handleBackToChat} />
      )}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <div className="pb-16">
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}

      {/* Install Banner */}
      <InstallBanner />
    </div>
  );
}
