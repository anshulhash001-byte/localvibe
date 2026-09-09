import { Sparkles, MapPin, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-xl flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-teal-800 text-lg">LocalVibe</span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Decorative element */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-gradient-to-br from-terracotta-300 via-terracotta-400 to-terracotta-500 rounded-3xl rotate-6 shadow-xl"></div>
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl -rotate-6 shadow-xl opacity-80"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">🏰</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-teal-900 leading-tight mb-4">
          Experience Jaipur
          <br />
          <span className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 bg-clip-text text-transparent">
            Like a Local.
          </span>
          <br />
          Skip the Tourist Traps.
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-lg text-sand-600 leading-relaxed mb-8 max-w-md">
          AI-powered itineraries for hidden cafes, secret rooftop views, and authentic food.
        </p>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="group bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-terracotta-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Generate My Jaipur Vibe</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Trust indicators */}
        <div className="mt-12 flex items-center gap-6 text-xs text-sand-500">
          <div className="flex items-center gap-1.5">
            <span className="text-terracotta-500">★★★★★</span>
            <span>4.9/5 rating</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🏰</span>
            <span>500+ hidden gems</span>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="px-4 pb-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-sand-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🤖</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-teal-800">Powered by AI</p>
              <p className="text-[10px] text-sand-500">Curated by locals, verified by travelers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
