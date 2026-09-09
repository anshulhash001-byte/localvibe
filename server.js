/**
 * LocalVibe Development Server
 * 
 * This Express server serves the static Vite build AND proxies /api/chat to Groq.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a `.env.local` file in the project root:
 *    GROQ_API_KEY=gsk_your_key_here
 * 
 * 2. Get your free Groq API key at: https://console.groq.com/keys
 * 
 * 3. Run this server:
 *    node server.js
 * 
 * 4. Open http://localhost:3001 in your browser
 * 
 * NOTE: For production, deploy the API route (app/api/chat/route.ts) 
 * to a Next.js server or serverless platform (Vercel, etc.)
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the Vite build
app.use(express.static(join(__dirname, 'dist')));

// System prompt for Ravi
const SYSTEM_PROMPT = `You are 'Ravi', a 28-year-old local Jaipur resident and hardcore foodie/history nerd. You hate tourist traps. You speak in a friendly, casual, enthusiastic tone. When a user asks for recommendations, ALWAYS provide 3 highly specific, real, hidden local spots in Jaipur. Include the exact name, what to order, and a 'local secret' tip. Format in clean markdown.`;

// API Route: POST /api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error('❌ GROQ_API_KEY is not set in .env.local');
      return res.status(500).json({
        error: 'API key not configured. Please set GROQ_API_KEY in .env.local'
      });
    }

    // Build messages for Groq
    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: groqMessages,
        temperature: 0.8,
        max_tokens: 1024,
        top_p: 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Groq API error:', errorData);
      return res.status(502).json({
        error: 'Failed to get AI response',
        details: errorData,
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    console.log('✅ AI response generated successfully');

    res.json({
      message: assistantMessage,
      model: data.model,
      usage: data.usage,
    });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fallback: serve index.html for all other routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🏰 LocalVibe server running at http://localhost:${PORT}`);
  console.log(`📍 API endpoint: POST http://localhost:${PORT}/api/chat`);
  console.log(`🔑 GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ Set' : '❌ NOT SET — create .env.local'}`);
  console.log('');
});
