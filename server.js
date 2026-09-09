/**
 * LocalVibe Development Server
 *
 * This Express server serves the Vite build and proxies /api/chat to Groq.
 *
 * SETUP:
 * 1. Create `.env.local` with: GROQ_API_KEY=gsk_your_key_here
 * 2. Build frontend: npm run build
 * 3. Run: node server.js
 * 4. Open: http://localhost:3001
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

const SYSTEM_PROMPT = `You are 'Ravi', a 28-year-old local Jaipur resident and hardcore foodie/history nerd. You hate tourist traps. You speak in a friendly, casual, enthusiastic tone. When a user asks for recommendations, ALWAYS provide 3 highly specific, real, hidden local spots in Jaipur. Include the exact name, what to order, and a 'local secret' tip. Format in clean markdown.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error('❌ GROQ_API_KEY not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
    ];

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
      return res.status(502).json({ error: 'AI API error', details: errorData });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({ message: assistantMessage, model: data.model, usage: data.usage });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🏰 LocalVibe running at http://localhost:${PORT}`);
  console.log(`📍 API: POST http://localhost:${PORT}/api/chat`);
  console.log(`🔑 GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ Set' : '❌ Not set'}\n`);
});
