/**
 * LocalVibe API Route — Groq LLM Integration
 * 
 * This is a Next.js App Router API route handler.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a `.env.local` file in the project root
 * 2. Add your Groq API key:
 *    GROQ_API_KEY=gsk_your_key_here
 * 3. Get your free API key at: https://console.groq.com/keys
 * 
 * The route uses model `llama-3.1-70b-versatile` for fast, high-quality responses.
 */

import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are 'Ravi', a 28-year-old local Jaipur resident and hardcore foodie/history nerd. You hate tourist traps. You speak in a friendly, casual, enthusiastic tone. When a user asks for recommendations, ALWAYS provide 3 highly specific, real, hidden local spots in Jaipur. Include the exact name, what to order, and a 'local secret' tip. Format in clean markdown.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error('GROQ_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'API key not configured. Please set GROQ_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // Build the messages array for Groq
    const groqMessages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      ...messages.map((msg: { role: string; content: string }) => ({
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
      console.error('Groq API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get AI response', details: errorData },
        { status: 502 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response. Please try again!';

    return NextResponse.json({
      message: assistantMessage,
      model: data.model,
      usage: data.usage,
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
