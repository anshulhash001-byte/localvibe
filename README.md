# 🏰 LocalVibe

**Experience Jaipur Like a Local. Skip the Tourist Traps.**

A mobile-first Progressive Web App that helps tourists discover hidden, authentic, non-touristy places in Jaipur through AI-powered conversations with "Ravi" — a local guide who knows the real gems.

## ✨ Features

### Core Experience
- **AI-Powered Chat** — Talk to Ravi, your local Jaipur guide (powered by Groq LLaMA 3.1)
- **Smart Recommendations** — Get 3 specific, real hidden spots with local secrets
- **Beautiful Results** — Card-based layout with ratings, tips, and distances
- **Route Map** — Visual representation of your personalized journey

### Monetization (V1.0)
- **Sponsored Cards** — Premium local partners featured organically in results
- **"Featured Local Picks"** — Editorial divider for sponsored content
- **"Book Now" Buttons** — Affiliate links on every place card
- **Paywall** — Unlock full map route & offline access for ₹299
- **Ad Space** — Reserved Google AdSense container in chat loading state

## 🎨 Design

- **Color Palette**: Terracotta, sand, deep teal, cream
- **Typography**: Inter (clean, modern, fast-loading)
- **Mobile-First**: Optimized for phone screens, responsive for tablets/desktop
- **Premium Feel**: Subtle gradients, smooth animations, clean spacing

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Groq API key:
```
GROQ_API_KEY=gsk_your_key_here
```

Get a free key at: https://console.groq.com/keys

### 3. Build & Run
```bash
npm run build
node server.js
```

Open http://localhost:3001

## 📱 Payment Integration

### Razorpay (₹299)
The paywall button links to Razorpay for INR payments.

**To activate:**
1. Create a Razorpay Payment Link for ₹299
2. Update the link in `src/components/ResultsView.tsx` line ~315:
   ```typescript
   href="https://razorpay.com/YOUR_ACTUAL_LINK"
   ```

### Booking.com Affiliate
"Book Now" buttons currently link to `https://booking.com`.

**To activate:**
1. Join the Booking.com Affiliate Partner program
2. Replace the placeholder in `src/components/ResultsView.tsx` line ~191:
   ```typescript
   href="YOUR_AFFILIATE_LINK"
   ```

### Google AdSense
Ad space container is reserved in the chat loading state.

**To activate:**
1. Sign up for Google AdSense
2. Insert your ad code in `src/components/ChatInterface.tsx` line ~356

## 🏗️ Project Structure

```
localvibe/
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx      # Hero section with CTA
│   │   ├── ChatInterface.tsx    # AI chat with ad space
│   │   └── ResultsView.tsx      # Places, map, paywall
│   ├── App.tsx                  # Main app router
│   ├── index.css                # Theme colors & animations
│   └── main.tsx                 # Entry point
├── app/
│   └── api/
│       └── chat/
│           └── route.ts         # Next.js API route (Groq)
├── server.js                    # Express dev server
├── .env.local.example           # Environment template
└── README.md                    # This file
```

## 🎯 Monetization Strategy

### 1. Sponsored Places
- 2 sponsored cards interleaved naturally with organic recommendations
- Pattern: Organic → Sponsored → Organic → Organic → Sponsored → Organic
- Premium gold/amber "✨ Sponsored" badge (subtle, not spammy)
- Identical card design to organic places

### 2. Affiliate Links
- "Book Now" button on every place card
- Outline style, non-aggressive
- Placeholder: `https://booking.com`

### 3. Paywall (₹299)
- Blurred "Unlock Full Map Route" section
- Razorpay payment link
- Trust indicators: "🔒 Secure payment via Razorpay. Accepts UPI, Cards & Wallets."

### 4. Display Ads
- Reserved ad space in chat loading state
- Clean, non-intrusive design
- Google AdSense placeholder

## 🔧 Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **AI**: Groq API (LLaMA 3.1 70B)
- **Server**: Express.js (dev) / Next.js API routes (prod)
- **Payments**: Razorpay (₹299)

## 📝 System Prompt

The AI uses this system prompt for all responses:

```
You are 'Ravi', a 28-year-old local Jaipur resident and hardcore foodie/history nerd. You hate tourist traps. You speak in a friendly, casual, enthusiastic tone. When a user asks for recommendations, ALWAYS provide 3 highly specific, real, hidden local spots in Jaipur. Include the exact name, what to order, and a 'local secret' tip. Format in clean markdown.
```

## 🌐 Deployment

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Self-Hosted
```bash
npm run build
node server.js
```

### Option 3: Separate API + Frontend
- Deploy frontend to Vercel/Netlify
- Deploy API to Railway/Render/Fly.io

## 🔒 Security Notes

- Never commit `.env.local` to git
- API key is server-side only (never exposed to client)
- Use HTTPS in production
- Validate all user inputs

## 📊 Mock Data

The app includes realistic mock data for:
- 4 organic places (Anokhi Cafe, Shri Thali House, The Secret Garden, Tattoo Cafe)
- 2 sponsored places (The Hidden Terrace, Haveli Dreams)
- AI responses (when API is not configured)

## 🎨 Design System

### Colors
- **Cream**: `#FDF8F3` (background)
- **Terracotta**: `#C75B39` (primary accent)
- **Teal**: `#1A5653` (text, buttons)
- **Sand**: `#E8DFD1` (borders, subtle elements)
- **Amber**: `#D4A017` (sponsored badges)

### Typography
- **Font**: Inter (400, 500, 600, 700, 800)
- **Headings**: Bold, tight tracking
- **Body**: Regular, relaxed line-height

### Spacing
- **Mobile**: 16px padding
- **Cards**: 16px padding, 16px gap
- **Sections**: 20px vertical spacing

## 🐛 Troubleshooting

### AI Chat Not Working
- Check `.env.local` exists and has `GROQ_API_KEY`
- Verify API key is valid at https://console.groq.com/keys
- Check server logs for errors

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Already in Use
```bash
PORT=3002 node server.js
```

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙏 Credits

- **AI**: Groq (https://groq.com)
- **Icons**: Lucide (https://lucide.dev)
- **Design Inspiration**: Airbnb, Google Travel, TripAdvisor

---

**Built with ❤️ for travelers who want the real Jaipur experience.**
