# 🏰 LocalVibe — Experience Jaipur Like a Local

> AI-powered itineraries for hidden cafes, secret rooftop views, and authentic food in Jaipur.

## 🚀 Quick Start

### 1. Set Up Your Groq API Key

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your Groq API key:

```
GROQ_API_KEY=gsk_your_actual_key_here
```

**Get your FREE API key:**
1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up / Log in (free tier available)
3. Click "Create API Key"
4. Copy the key (starts with `gsk_...`)
5. Paste it in `.env.local`

### 2. Build the Frontend

```bash
npm run build
```

### 3. Start the Server

```bash
node server.js
```

The app will be available at **http://localhost:3001**

---

## 🧠 AI Configuration

- **Model:** `llama-3.1-70b-versatile` (via Groq API)
- **Provider:** [Groq](https://groq.com/) — ultra-fast inference
- **System Prompt:** "Ravi" — a 28-year-old local Jaipur foodie & history nerd

### System Prompt

```
You are 'Ravi', a 28-year-old local Jaipur resident and hardcore foodie/history nerd. 
You hate tourist traps. You speak in a friendly, casual, enthusiastic tone. When a user 
asks for recommendations, ALWAYS provide 3 highly specific, real, hidden local spots in 
Jaipur. Include the exact name, what to order, and a 'local secret' tip. Format in clean markdown.
```

---

## 📁 Project Structure

```
├── app/
│   └── api/
│       └── chat/
│           └── route.ts          # Next.js API route (for Next.js deployment)
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx       # Hero section + CTA
│   │   ├── ChatInterface.tsx     # AI chat with Groq integration
│   │   └── ResultsView.tsx       # Place cards + map + paywall
│   ├── App.tsx                   # Main app with view routing
│   ├── index.css                 # Tailwind + custom theme
│   └── main.tsx                  # Entry point
├── server.js                     # Express server for API + static files
├── .env.local.example            # Environment template
└── README.md                     # This file
```

---

## 💰 Monetization

- **Price:** ₹299 (one-time)
- **Features behind paywall:**
  - Full interactive map route
  - Turn-by-turn navigation
  - Offline access
  - Local audio guides

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Terracotta | `#C75B39` | CTAs, accents, warm highlights |
| Sand | `#E8D5B7` | Backgrounds, borders |
| Deep Teal | `#1A5653` | Text, headers, primary |
| Cream | `#FFF8F0` | Page background |
| White | `#FFFFFF` | Cards, surfaces |

---

## 🌐 Deployment Options

### Option A: Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add `GROQ_API_KEY` in Vercel environment variables
4. The `app/api/chat/route.ts` will be auto-deployed as a serverless function

### Option B: Self-hosted
1. Build frontend: `npm run build`
2. Run server: `node server.js`
3. Use a reverse proxy (nginx) for production

### Option C: Separate API
1. Deploy `app/api/chat/route.ts` to a Next.js app on Vercel
2. Update the frontend API URL to point to your deployed API

---

## 🔒 Security Notes

- **Never** commit `.env.local` to git
- The API key is only used server-side
- All AI requests go through your server, not the client
- Add rate limiting in production (recommended: 10 requests/minute per IP)

---

## 📱 PWA Features

- Mobile-first responsive design
- Installable on iOS/Android
- Offline-capable UI shell
- Fast loading with optimized assets
