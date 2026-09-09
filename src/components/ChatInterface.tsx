import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ArrowLeft, Bot, User, AlertCircle } from 'lucide-react';

interface ChatInterfaceProps {
  onBack: () => void;
  onGenerate: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isMarkdown?: boolean;
}

// Conversation history for the API
interface ApiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Fallback response when API is unavailable
const FALLBACK_RESPONSE = `Hey! Great taste! 🙌 Here are my top 3 picks for you:

**1. Anokhi Cafe** ☕
A hidden rooftop behind the Anokhi museum in C-Scheme. Order the *rose cardamom chai* and the avocado toast — trust me on this.
🔑 *Local secret:* Go at 4:30 PM when the golden hour light hits the pink buildings. Most tourists are at Hawa Mahal by then.

**2. Shri Thali House** 🍛
No signboard, no English menu. Just the most incredible *Dal Bati Churma* served on leaf plates by a family cooking for 4 generations. Located near Sindhi Camp.
🔑 *Local secret:* They close by 2 PM sharp. Arrive at 11:30 — locals line up early. Ask for extra ghee on the bati!

**3. The Secret Garden at Panna Meena Ka Kund** 🌿
An ancient stepwell turned meditation spot. Locals come here at sunrise for yoga. The geometry is mind-blowing.
🔑 *Local secret:* Ask the old guard about the hidden lower level — most people never find it. He'll show you if you buy him a cutting chai.

Want me to plan a full walking route connecting these spots? 🗺️`;

export default function ChatInterface({ onBack, onGenerate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Namaste! 🙏 I'm Ravi, your local Jaipur guide. I'm 28, born and raised here, and I absolutely HATE tourist traps. Tell me what kind of experience you're looking for — hidden cafes, secret viewpoints, authentic food spots, or something else entirely?",
      sender: 'bot',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<ApiMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Check if API is available on mount
  useEffect(() => {
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [] }) })
      .then(res => {
        // Even a 400 response means the server is running
        setApiAvailable(true);
      })
      .catch(() => {
        setApiAvailable(false);
      });
  }, []);

  const callGroqAPI = async (userMessage: string): Promise<string> => {
    // Build conversation history
    const newHistory: ApiMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.message;

      // Update conversation history
      setConversationHistory([
        ...newHistory,
        { role: 'assistant', content: aiResponse },
      ]);

      return aiResponse;
    } catch (error) {
      console.error('API call failed:', error);
      setApiAvailable(false);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Try the real API
      const aiResponse = await callGroqAPI(currentInput);

      const botResponse: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'bot',
        timestamp: 'Just now',
        isMarkdown: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch {
      // Fallback to mock response
      const botResponse: Message = {
        id: messages.length + 2,
        text: FALLBACK_RESPONSE,
        sender: 'bot',
        timestamp: 'Just now',
        isMarkdown: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerate = async () => {
    const promptText = input.trim() || "I want a quiet rooftop cafe and the best local Dal Bati Churma";

    // Add user message if not already added
    if (!input.trim()) {
      const quickMsg: Message = {
        id: messages.length + 1,
        text: promptText,
        sender: 'user',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, quickMsg]);
    }

    setIsTyping(true);

    try {
      const aiResponse = await callGroqAPI(promptText);

      const botResponse: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'bot',
        timestamp: 'Just now',
        isMarkdown: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch {
      const botResponse: Message = {
        id: messages.length + 2,
        text: FALLBACK_RESPONSE,
        sender: 'bot',
        timestamp: 'Just now',
        isMarkdown: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
      // Navigate to results after a brief pause
      setTimeout(() => {
        onGenerate();
      }, 1500);
    }
  };

  const suggestions = [
    "Quiet rooftop cafe with a view",
    "Best Dal Bati Churma in town",
    "Hidden art galleries",
    "Local street food walk",
  ];

  // Simple markdown-like rendering
  const renderMessageText = (text: string, isMarkdown?: boolean) => {
    if (!isMarkdown) {
      return <p className="text-sm leading-relaxed">{text}</p>;
    }

    // Parse basic markdown: **bold**, *italic*, line breaks
    const lines = text.split('\n');
    return (
      <div className="text-sm leading-relaxed space-y-1.5">
        {lines.map((line, i) => {
          // Bold headers (lines starting with ** and ending with **)
          if (line.startsWith('**') && line.includes('**')) {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
              <p key={i} className="font-semibold">
                {parts.map((part, j) =>
                  j % 2 === 1 ? (
                    <span key={j} className="text-teal-700">{part}</span>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </p>
            );
          }
          // Lines with inline bold/italic
          if (line.includes('**') || line.includes('*')) {
            const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
            return (
              <p key={i}>
                {parts.map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
                  }
                  if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={j} className="italic text-teal-700">{part.slice(1, -1)}</em>;
                  }
                  return <span key={j}>{part}</span>;
                })}
              </p>
            );
          }
          // Empty lines
          if (line.trim() === '') {
            return <div key={i} className="h-1" />;
          }
          // Regular lines
          return <p key={i}>{line}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-sand-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-sand-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-teal-700" />
        </button>
        <div className="flex-1">
          <h2 className="font-semibold text-teal-800 text-sm flex items-center gap-1.5">
            Ravi — LocalVibe Guide
            {!apiAvailable && (
              <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                <AlertCircle className="w-2.5 h-2.5" />
                Demo
              </span>
            )}
          </h2>
          <p className="text-[11px] text-sand-500">
            {apiAvailable ? '🧠 AI-powered • Groq LLaMA 3.1' : '📱 Demo mode • Connect API for live responses'}
          </p>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 animate-fade-in-up ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'bot'
                  ? 'bg-gradient-to-br from-teal-500 to-teal-700'
                  : 'bg-gradient-to-br from-terracotta-400 to-terracotta-600'
              }`}
            >
              {message.sender === 'bot' ? (
                <Bot className="w-3.5 h-3.5 text-white" />
              ) : (
                <User className="w-3.5 h-3.5 text-white" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-teal-600 text-white rounded-tr-md'
                  : 'bg-white text-teal-800 rounded-tl-md shadow-sm border border-sand-100'
              }`}
            >
              {renderMessageText(message.text, message.isMarkdown)}
              <p
                className={`text-[10px] mt-1.5 ${
                  message.sender === 'user' ? 'text-teal-200' : 'text-sand-400'
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5 animate-fade-in-up">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-md px-5 py-3.5 shadow-sm border border-sand-100">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-sand-400 rounded-full animate-typing-1"></div>
                  <div className="w-2 h-2 bg-sand-400 rounded-full animate-typing-2"></div>
                  <div className="w-2 h-2 bg-sand-400 rounded-full animate-typing-3"></div>
                </div>
                <span className="text-[10px] text-sand-400 italic">Ravi is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Reserved ad space — shown while waiting for AI response */}
        {isTyping && (
          <div className="px-9 animate-fade-in-up">
            {/* TODO: Insert Google AdSense code here */}
            <div className="bg-sand-50/80 border border-sand-200/60 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-sand-200">
                  <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-teal-800 leading-tight">Finding hidden gems for you...</p>
                  <p className="text-[9px] text-sand-400 mt-0.5">Ad Space — Google AdSense</p>
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-sand-100 to-sand-200 rounded-lg border border-sand-200/60 flex items-center justify-center">
                <span className="text-[8px] text-sand-500 font-medium text-center leading-tight">300<br/>×<br/>100</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && !isTyping && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setInput(suggestion)}
                className="flex-shrink-0 bg-white border border-sand-200 text-sand-700 text-xs font-medium px-3 py-2 rounded-full hover:bg-sand-50 hover:border-terracotta-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-sand-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tell me what you're looking for..."
              className="w-full bg-sand-50 border border-sand-200 rounded-2xl px-4 py-3 text-sm text-teal-800 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center shadow-md shadow-teal-200 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Generate Itinerary Button */}
        <button
          onClick={handleGenerate}
          disabled={isTyping}
          className="w-full mt-2.5 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white font-semibold py-3 px-4 rounded-2xl shadow-lg shadow-terracotta-200/50 hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          Generate Itinerary
        </button>
      </div>
    </div>
  );
}
