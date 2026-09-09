import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import ResultsView from './components/ResultsView';

type View = 'landing' | 'chat' | 'results';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');

  const handleGetStarted = () => {
    setCurrentView('chat');
  };

  const handleGenerate = () => {
    setCurrentView('results');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-cream">
      {currentView === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      {currentView === 'chat' && (
        <ChatInterface onBack={handleBackToLanding} onGenerate={handleGenerate} />
      )}
      {currentView === 'results' && (
        <ResultsView onBack={handleBackToChat} />
      )}
    </div>
  );
}
