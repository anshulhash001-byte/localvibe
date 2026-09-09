/**
 * LocalVibe AI Chat API Route
 *
 * This is the Next.js App Router handler for AI chat requests.
 * It securely proxies requests to the Groq API using the llama-3.1-70b-versatile model.
 *
 * SETUP:
 * 1. Create a `.env.local` file in the project root
 * 2. Add your Groq API key: GROQ_API_KEY=gsk_your_key_here
 * 3. Get a free key at: https://console.groq.com/keys
 */

const SYSTEM_PROMPT = `You are 'Ravi', a 28-year-old local Jaipur resident and hardcore foodie/history nerd. You hate tourist traps. You speak in a friendly, casual, enthusiastic tone. When a user asks for recommendations, ALWAYS provide 3 highly specific, real, hidden local spots in Jaipur. Include the exact name, what to order, and a 'local secret' tip. Format in clean markdown.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
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
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response', details: errorData }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        model: data.model,
        usage: data.usage,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
