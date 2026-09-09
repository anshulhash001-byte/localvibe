import { Home, MessageCircle, Bookmark } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'chat' | 'saved';
  onTabChange: (tab: 'home' | 'chat' | 'saved') => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'chat' as const, label: 'Chat', icon: MessageCircle },
    { id: 'saved' as const, label: 'Saved', icon: Bookmark },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sand-200 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-teal-600'
                    : 'text-sand-400 hover:text-sand-600'
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-all ${
                    isActive ? 'bg-teal-50' : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-teal-600' : 'text-sand-500'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
