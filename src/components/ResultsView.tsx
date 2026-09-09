import { MapPin, Star, Clock, ArrowLeft, Navigation, Heart, ExternalLink, X, KeyRound, CheckCircle2, Share2, Check, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import Footer from './Footer';

interface ResultsViewProps {
  onBack: () => void;
}

interface Place {
  id: number;
  name: string;
  category: string;
  rating: number;
  description: string;
  localTip: string;
  distance: string;
  time: string;
  gradient: string;
  emoji: string;
  sponsored?: boolean;
}

// Organic places — AI-recommended hidden gems
const mockPlaces: Place[] = [
  {
    id: 1,
    name: "Anokhi Cafe",
    category: "Hidden Rooftop Cafe",
    rating: 9.5,
    description: "A serene rooftop tucked behind the Anokhi museum. Hand-block printed cushions, organic lassi, and views of the pink city at golden hour.",
    localTip: "Go at 4:30 PM for the best light and order the rose cardamom chai.",
    distance: "1.2 km",
    time: "15 min walk",
    gradient: "from-terracotta-300 to-terracotta-500",
    emoji: "☕",
  },
  {
    id: 2,
    name: "Shri Thali House",
    category: "Authentic Local Food",
    rating: 9.7,
    description: "No signboard, no English menu. Just the most incredible Dal Bati Churma served on leaf plates by a family that's been cooking for 4 generations.",
    localTip: "They close by 2 PM. Arrive early — locals line up at 11:30.",
    distance: "2.8 km",
    time: "8 min by auto",
    gradient: "from-sand-300 to-sand-500",
    emoji: "🍛",
  },
  {
    id: 3,
    name: "The Secret Garden",
    category: "Hidden Courtyard",
    rating: 9.3,
    description: "A forgotten Mughal-era courtyard turned into a quiet reading spot. Locals come here for morning walks and evening poetry sessions.",
    localTip: "Ask the guard about the hidden stepwell — most tourists never find it.",
    distance: "0.8 km",
    time: "10 min walk",
    gradient: "from-teal-300 to-teal-500",
    emoji: "🌿",
  },
  {
    id: 4,
    name: "Tattoo Cafe & Books",
    category: "Bohemian Hangout",
    rating: 9.1,
    description: "Wall-to-wall books, resident cats, and the best blueberry cheesecake in Jaipur. A favorite among local artists and writers.",
    localTip: "Thursday nights have open mic poetry. The owner Raju will share his stories if you buy him a chai.",
    distance: "1.5 km",
    time: "18 min walk",
    gradient: "from-terracotta-400 to-sand-400",
    emoji: "📚",
  },
];

// Sponsored places — curated by local partners
const sponsoredPlaces: Place[] = [
  {
    id: 101,
    name: "The Hidden Terrace",
    category: "Premium Rooftop Cafe",
    rating: 9.4,
    description: "A stunning rooftop lounge overlooking the Nahargarh Fort. Craft cocktails, artisanal pizzas, and live acoustic sets every weekend evening.",
    localTip: "Book the corner table for the best sunset view — mention LocalVibe for a complimentary welcome drink.",
    distance: "2.1 km",
    time: "10 min by auto",
    gradient: "from-amber-300 to-orange-400",
    emoji: "🌅",
    sponsored: true,
  },
  {
    id: 102,
    name: "Haveli Dreams",
    category: "Boutique Heritage Hotel",
    rating: 9.6,
    description: "A lovingly restored 200-year-old haveli in the heart of the old city. Hand-painted frescoes, courtyard pool, and rooftop breakfast with fort views.",
    localTip: "Ask for the 'Royal Suite' — it has the original Mughal-era mirror work still intact. Breakfast included.",
    distance: "1.8 km",
    time: "7 min by auto",
    gradient: "from-rose-300 to-amber-300",
    emoji: "🏛️",
    sponsored: true,
  },
];

// Interleave organic and sponsored: 1 organic → 1 sponsored → 2 organic → 1 sponsored → 1 organic
function getInterleavedPlaces(): Place[] {
  const organic = [...mockPlaces];
  const sponsored = [...sponsoredPlaces];
  const result: Place[] = [];

  result.push(organic[0]); // Anokhi Cafe
  result.push(sponsored[0]); // The Hidden Terrace
  result.push(organic[1]); // Shri Thali House
  result.push(organic[2]); // The Secret Garden
  result.push(sponsored[1]); // Haveli Dreams
  result.push(organic[3]); // Tattoo Cafe & Books

  return result;
}

// PlaceCard component — used for both organic and sponsored places
function PlaceCard({ place, index }: { place: Place; index: number }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-100 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image placeholder */}
      <div className={`h-36 bg-gradient-to-br ${place.gradient} relative flex items-center justify-center`}>
        <span className="text-5xl">{place.emoji}</span>

        {/* Category badge — top left */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
          <span className="text-[11px] font-semibold text-teal-700">{place.category}</span>
        </div>

        {/* Rating badge — top right (or Sponsored badge) */}
        {place.sponsored ? (
          <div className="absolute top-3 right-3 bg-amber-100/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 border border-amber-200/60">
            <span className="text-[11px] font-semibold text-amber-700">✨ Sponsored</span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-terracotta-500 fill-terracotta-500" />
            <span className="text-[11px] font-bold text-teal-800">{place.rating}/10</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-teal-900 text-base flex-1">{place.name}</h3>
          {/* Show rating next to name for sponsored cards (since badge is on image) */}
          {place.sponsored && (
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              <Star className="w-3 h-3 text-terracotta-500 fill-terracotta-500" />
              <span className="text-[11px] font-bold text-teal-800">{place.rating}/10</span>
            </div>
          )}
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sand-50 transition-colors ml-1">
            <ExternalLink className="w-4 h-4 text-sand-400" />
          </button>
        </div>

        <p className="text-sm text-sand-700 leading-relaxed mb-3">
          {place.description}
        </p>

        {/* Local tip */}
        <div className="bg-sand-50 rounded-xl p-3 mb-3 border border-sand-100">
          <p className="text-xs text-teal-700 font-medium flex items-start gap-1.5">
            <span className="text-terracotta-500 flex-shrink-0">💡</span>
            <span><strong>Local Tip:</strong> {place.localTip}</span>
          </p>
        </div>

        {/* Meta info + Book Now button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-sand-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {place.distance}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {place.time}
            </span>
          </div>

          {/* TODO: Replace with actual affiliate link */}
          <a
            href="https://booking.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-teal-700 border border-teal-200 rounded-full px-3 py-1.5 hover:bg-teal-50 hover:border-teal-300 active:scale-95 transition-all duration-200 flex-shrink-0"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResultsView({ onBack }: ResultsViewProps) {
  const interleavedPlaces = getInterleavedPlaces();

  // Find the index where the first sponsored card appears
  const firstSponsoredIndex = interleavedPlaces.findIndex(p => p.sponsored);

  // Access code modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [codeError, setCodeError] = useState('');

  // Share toast state
  const [showShareToast, setShowShareToast] = useState(false);

  // Payment error state
  const [showPaymentError, setShowPaymentError] = useState(false);

  useEffect(() => {
    // Check for payment cancellation/error in URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'cancelled') {
      setShowPaymentError(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'LocalVibe - My Jaipur Itinerary',
      text: 'Check out these hidden gems in Jaipur I found with LocalVibe! 🏰✨ Skip the tourist traps and experience the real city.',
      url: 'https://localvibe.app',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2500);
      }
    } catch (err) {
      // User cancelled share — no action needed
      console.log('Share cancelled');
    }
  };

  const handleCodeSubmit = () => {
    // TODO: Replace with actual backend validation
    if (accessCode.trim().length >= 6) {
      setIsUnlocked(true);
      setCodeError('');
      setTimeout(() => setIsModalOpen(false), 1500);
    } else {
      setCodeError('Invalid code. Please check and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-sand-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-sand-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-teal-700" />
        </button>
        <div className="flex-1">
          <h2 className="font-semibold text-teal-800 text-sm">Your Jaipur Vibe</h2>
          <p className="text-[11px] text-sand-500">6 places found • Curated by AI</p>
        </div>
        <button
          onClick={handleShare}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-sand-100 transition-colors"
          aria-label="Share itinerary"
        >
          <Share2 className="w-5 h-5 text-teal-600" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-sand-100 transition-colors">
          <Heart className="w-5 h-5 text-sand-400" />
        </button>
      </header>

      {/* Summary banner */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-terracotta-300 fill-terracotta-300" />
          <span className="text-xs font-medium text-teal-100">Your Personalized Route</span>
        </div>
        <p className="text-sm font-medium leading-relaxed">
          A 6-stop journey through Jaipur's best-kept secrets. Total walking distance: ~9.4 km. Best explored over 2 afternoons.
        </p>
      </div>

      {/* Places Cards with editorial divider */}
      <div className="px-4 py-5 space-y-4">
        {interleavedPlaces.map((place, index) => (
          <div key={place.id}>
            {/* "Featured Local Picks" editorial divider — appears before the first sponsored card */}
            {index === firstSponsoredIndex && (
              <div className="flex items-center gap-3 mb-4 pt-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-sand-200">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-[11px] font-semibold text-sand-600 tracking-wide uppercase">Featured Local Picks</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sand-300 to-transparent" />
              </div>
            )}

            <PlaceCard place={place} index={index} />
          </div>
        ))}
      </div>

      {/* Map Section */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-100">
          <div className="p-4 border-b border-sand-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-teal-600" />
                <h3 className="font-semibold text-teal-800 text-sm">Route Map</h3>
              </div>
              <span className="text-[11px] text-sand-500 font-medium">6 stops</span>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="h-52 bg-gradient-to-br from-teal-50 to-sand-50 relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-30">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                <path d="M30,160 Q80,90 150,110 T260,70 T350,50" stroke="#1A5653" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                <circle cx="30" cy="160" r="5" fill="#C75B39" />
                <circle cx="100" cy="120" r="5" fill="#D4A017" />
                <circle cx="150" cy="110" r="5" fill="#C75B39" />
                <circle cx="220" cy="80" r="5" fill="#D4A017" />
                <circle cx="260" cy="70" r="5" fill="#C75B39" />
                <circle cx="350" cy="50" r="5" fill="#C75B39" />
              </svg>
            </div>
            <div className="text-center z-10">
              <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center mx-auto mb-2">
                <Navigation className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-xs text-sand-600 font-medium">Interactive Map</p>
              <p className="text-[10px] text-sand-400">Tap to explore route</p>
            </div>
          </div>
        </div>
      </div>

      {/* Paywall Section */}
      <div className="px-4 pb-8">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sand-100 relative">
          {/* Blurred content */}
          <div className="p-4 relative">
            <div className="absolute inset-0 backdrop-blur-md bg-white/60 z-10 rounded-2xl" />
            <div className="relative z-0 opacity-50">
              <div className="h-8 bg-sand-200 rounded-lg mb-3 w-3/4"></div>
              <div className="h-6 bg-sand-100 rounded-lg mb-2 w-full"></div>
              <div className="h-6 bg-sand-100 rounded-lg mb-2 w-5/6"></div>
              <div className="h-6 bg-sand-100 rounded-lg mb-4 w-2/3"></div>
              <div className="h-24 bg-sand-200 rounded-xl mb-3"></div>
              <div className="h-6 bg-sand-100 rounded-lg mb-2 w-full"></div>
              <div className="h-6 bg-sand-100 rounded-lg w-4/5"></div>
            </div>
          </div>

          {/* Paywall overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/90 to-transparent p-6 z-20">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-teal-900 text-base mb-1">Unlock Full Map Route</h3>
              <p className="text-xs text-sand-600 max-w-[240px]">
                Get turn-by-turn navigation, offline access, and local audio guides for all 6 stops.
              </p>
            </div>

            {/* TODO: Replace with actual Razorpay live link once approved */}
            <a
              href="https://rzp.io/YOUR_LINK_HERE"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[260px] bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-lg shadow-terracotta-200 hover:shadow-xl active:scale-[0.98] transition-all duration-200 inline-block text-center"
            >
              <span className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4 fill-white" />
                Unlock Full Trip for ₹299
              </span>
            </a>

            <p className="text-[10px] text-sand-400 mt-2">One-time payment • Works offline</p>
            <p className="text-[10px] text-sand-500 mt-1.5 flex items-center justify-center gap-1">
              <span>🔒</span>
              <span>Secure payment via Razorpay. Accepts UPI, Cards & Wallets. Instant access.</span>
            </p>

            {/* Trust signal */}
            <div className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-sand-100">
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-terracotta-300 to-terracotta-500 border-2 border-white"></div>
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-300 to-teal-500 border-2 border-white"></div>
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-white"></div>
              </div>
              <span className="text-[10px] text-sand-600 font-medium flex items-center gap-1">
                <Users className="w-3 h-3" />
                Trusted by 1000+ travelers
              </span>
            </div>

            {/* Already purchased? link */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 text-[11px] text-teal-600 hover:text-teal-700 font-medium underline underline-offset-2 decoration-teal-300 transition-colors"
            >
              Already purchased? Enter access code
            </button>
          </div>
        </div>
      </div>

      {/* Payment Error Banner */}
      {showPaymentError && (
        <div className="mx-4 mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💳</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-900 font-medium mb-1">
                Payment was cancelled
              </p>
              <p className="text-xs text-amber-700 mb-3">
                No worries! Whenever you're ready, you can try again. Your itinerary is saved.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPaymentError(false)}
                  className="text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Dismiss
                </button>
                <span className="text-amber-300">•</span>
                <button
                  onClick={() => {
                    setShowPaymentError(false);
                    window.open('https://rzp.io/YOUR_LINK_HERE', '_blank');
                  }}
                  className="text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-full px-3 py-1.5 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="bg-teal-800 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            <Check className="w-3.5 h-3.5" />
            Link copied to clipboard!
          </div>
        </div>
      )}

      {/* Bottom spacing for mobile */}
      <div className="h-8"></div>

      {/* Access Code Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in-up">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-teal-900/40 backdrop-blur-sm"
            onClick={() => {
              setIsModalOpen(false);
              setAccessCode('');
              setCodeError('');
            }}
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
            {/* Close button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setAccessCode('');
                setCodeError('');
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-sand-50 hover:bg-sand-100 transition-colors z-10"
            >
              <X className="w-4 h-4 text-sand-600" />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-br from-teal-50 to-sand-50 px-6 pt-8 pb-6 text-center border-b border-sand-100">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-teal-200">
                <KeyRound className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-teal-900 text-lg mb-1">Enter Access Code</h3>
              <p className="text-xs text-sand-600 max-w-[260px] mx-auto">
                Paste the code you received after your Razorpay payment to unlock the full map route.
              </p>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              {isUnlocked ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-semibold text-teal-900 text-sm mb-1">Access Granted!</p>
                  <p className="text-xs text-sand-500">Your full map route is now unlocked.</p>
                </div>
              ) : (
                <>
                  <label className="text-[11px] font-medium text-teal-800 uppercase tracking-wide mb-2 block">
                    Access Code
                  </label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      setCodeError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                    placeholder="e.g. LV-XXXX-XXXX"
                    className="w-full bg-sand-50 border border-sand-200 rounded-xl px-4 py-3 text-sm text-teal-800 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all tracking-wider font-mono"
                    autoFocus
                  />

                  {codeError && (
                    <p className="text-[11px] text-red-500 mt-2 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>{codeError}</span>
                    </p>
                  )}

                  <button
                    onClick={handleCodeSubmit}
                    disabled={!accessCode.trim()}
                    className="w-full mt-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-teal-200 hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Unlock My Trip
                  </button>

                  <p className="text-[10px] text-sand-400 mt-3 text-center">
                    Didn't receive a code? Check your email or{' '}
                    <a href="mailto:support@localvibe.app" className="text-teal-600 underline">
                      contact support
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
