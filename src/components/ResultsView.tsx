import { MapPin, Star, Clock, ArrowLeft, Navigation, Heart, ExternalLink } from 'lucide-react';

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

// AI-curated organic recommendations
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

// Partner-sponsored places — styled identically to organic cards
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

// Interleave organic and sponsored: 1 organic → 1 sponsored → 1 organic → 1 sponsored → remaining organic
function getInterleavedPlaces(): Place[] {
  const organic = [...mockPlaces];
  const sponsored = [...sponsoredPlaces];
  const result: Place[] = [];

  // Pattern: organic, sponsored, organic, sponsored, organic, organic
  result.push(organic[0]); // Anokhi Cafe
  result.push(sponsored[0]); // The Hidden Terrace
  result.push(organic[1]); // Shri Thali House
  result.push(sponsored[1]); // Haveli Dreams
  result.push(organic[2]); // The Secret Garden
  result.push(organic[3]); // Tattoo Cafe & Books

  return result;
}

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
        {/* Title row with rating for sponsored (organic shows rating in image) */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-teal-900 text-base flex-1">{place.name}</h3>
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
  const allPlaces = getInterleavedPlaces();

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

      {/* Places Cards */}
      <div className="px-4 py-5 space-y-4">
        {allPlaces.map((place, index) => (
          <PlaceCard key={place.id} place={place} index={index} />
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
            {/* Decorative map elements */}
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

            {/* TODO: Replace with actual Razorpay Payment Link for ₹299 */}
            <a
              href="https://razorpay.com/PASTE_YOUR_RAZORPAY_LINK_HERE"
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
            </p>          </div>
        </div>
      </div>

      {/* Bottom spacing for mobile */}
      <div className="h-8"></div>
    </div>
  );
}
