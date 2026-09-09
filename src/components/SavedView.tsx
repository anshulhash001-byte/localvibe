import { Bookmark, Sparkles } from 'lucide-react';

interface SavedViewProps {
  onExplore: () => void;
}

export default function SavedView({ onExplore }: SavedViewProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-sand-200 to-sand-300 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
        <Bookmark className="w-10 h-10 text-sand-500" />
      </div>
      <h2 className="font-bold text-teal-900 text-xl mb-2">Your Saved Places</h2>
      <p className="text-sm text-sand-600 leading-relaxed max-w-[280px] mb-6">
        Save your favorite hidden gems from LocalVibe to access them offline anytime.
      </p>
      <button
        onClick={onExplore}
        className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-md shadow-terracotta-200 hover:shadow-lg active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Start Exploring
      </button>
      <p className="text-[10px] text-sand-400 mt-4">Coming soon: Offline access & trip planning</p>
    </div>
  );
}
