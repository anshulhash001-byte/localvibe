import { MapPin, Sparkles, Star, Compass } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-teal-800 text-lg tracking-tight">LocalVibe</span>
        </div>
        <div className="flex items-center gap-1 text-sand-600">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Jaipur</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        {/* Decorative element */}
        <div className="mb-8 relative">
          <div className="w-20 h-20 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-2xl flex items-center justify-center shadow-lg shadow-terracotta-200 rotate-3">
            <Sparkles className="w-9 h-9 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-sand-300 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-terracotta-500 fill-terracotta-500" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-teal-900 text-center leading-tight mb-4">
          Experience Jaipur Like a{' '}
          <span className="text-terracotta-500">Local.</span>
        </h1>
        <p className="text-lg sm:text-xl text-teal-700 text-center font-medium mb-3">
          Skip the Tourist Traps.
        </p>

        {/* Subheadline */}
        <p className="text-sm sm:text-base text-sand-700 text-center max-w-sm leading-relaxed mb-10">
          AI-powered itineraries for hidden cafes, secret rooftop views, and authentic food that locals actually love.
        </p>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="w-full max-w-sm bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-terracotta-200 hover:shadow-xl hover:shadow-terracotta-300 active:scale-[0.98] transition-all duration-200 animate-pulse-glow"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate My Jaipur Vibe
          </span>
        </button>

        {/* Social proof */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-2">
            {['bg-terracotta-300', 'bg-teal-400', 'bg-sand-400', 'bg-terracotta-500'].map((color, i) => (
              <div key={i} className={`w-7 h-7 ${color} rounded-full border-2 border-cream flex items-center justify-center`}>
                <span className="text-[10px] text-white font-bold">{['R', 'A', 'M', 'S'][i]}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-sand-600">
            <span className="font-semibold text-teal-700">2,400+</span> travelers explored Jaipur this month
          </p>
        </div>
      </main>

      {/* Features strip */}
      <div className="px-6 pb-8">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-sand-200">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-[11px] text-sand-700 font-medium leading-tight">Hidden Gems</p>
            </div>
            <div className="text-center">
              <div className="w-9 h-9 bg-terracotta-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-4 h-4 text-terracotta-500" />
              </div>
              <p className="text-[11px] text-sand-700 font-medium leading-tight">AI Curated</p>
            </div>
            <div className="text-center">
              <div className="w-9 h-9 bg-sand-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Star className="w-4 h-4 text-sand-600" />
              </div>
              <p className="text-[11px] text-sand-700 font-medium leading-tight">Local Rated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
