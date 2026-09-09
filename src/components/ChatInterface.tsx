import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Bot, User, Sparkles, AlertCircle, RefreshCw, Lock } from 'lucide-react';

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
  isError?: boolean;
}

const quickSuggestions = [
  { label: 'Best street food', icon: '🍛', prompt: 'What are the best street food spots in Jaipur that locals actually eat at?' },
  { label: 'Hidden rooftop cafes', icon: '☕', prompt: 'Show me hidden rooftop cafes with a view, away from tourists' },
  { label: 'Offbeat heritage spots', icon: '🏛️', prompt: 'Tell me about offbeat heritage spots in Jaipur that most tourists miss' },
];

export default function ChatInterface({ onBack, onGenerate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError(null);
    setIsTyping(true);

    try {
      // Try to call the API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();

      const botResponse: Message = {
        id: Date.now() + 1,
        text: data.message,
        sender: 'bot',
        timestamp: 'Just now',
        isMarkdown: true,
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      // Fallback mock response when API unavailable
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: `Great choice! Here are 3 hidden gems:\n\n**1. Anokhi Cafe** ☕\nA serene rooftop behind Anokhi museum. Order the *rose cardamom chai*.\n🔑 *Local secret:* Go at 4:30 PM for golden hour.\n\n**2. Shri Thali House** 🍛\nNo signboard, just incredible *Dal Bati Churma* by a 4th-gen family.\n🔑 *Local secret:* Arrive by 11:30 AM — they close at 2 PM.\n\n**3. The Secret Garden** 🌿\nAncient stepwell turned meditation spot.\n🔑 *Local secret:* Ask the guard about the hidden lower level.`,
          sender: 'bot',
          timestamp: 'Just now',
          isMarkdown: true,
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      }, 1800);
      return; // Don't set isTyping false here — timeout will handle it
    }

    setIsTyping(false);
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input);
  };

  const handleSuggestionTap = (prompt: string) => {
    setInput(prompt);
    // Auto-send after a brief moment so user sees what they're asking
    setTimeout(() => {
      sendMessage(prompt);
    }, 100);
  };

  const handleRetry = () => {
    setError(null);
    // Retry the last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      sendMessage(lastUserMsg.text);
    }
  };

  const handleGenerate = () => {
    setTimeout(() => {
      onGenerate();
    }, 500);
  };

  const renderMessageText = (text: string, isMarkdown?: boolean) => {
    if (!isMarkdown) {
      return <p className="text-sm leading-relaxed">{text}</p>;
    }

    const lines = text.split('\n');
    return (
      <div className="text-sm leading-relaxed space-y-1.5">
        {lines.map((line, i) => {
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
          if (line.trim() === '') {
            return <div key={i} className="h-1" />;
          }
          return <p key={i}>{line}</p>;
        })}
      </div>
    );
  };

  const isEmpty = messages.length === 0 && !isTyping;

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
          <h2 className="font-semibold text-teal-800 text-sm">Ravi — LocalVibe Guide</h2>
          <p className="text-[11px] text-sand-500">🧠 AI-powered • Groq LLaMA 3.1</p>
        </div>
        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      </header>

      {/* Trust banner */}
      <div className="bg-teal-50/70 border-b border-teal-100 px-4 py-2 flex items-center justify-center gap-1.5">
        <Lock className="w-3 h-3 text-teal-700" />
        <p className="text-[11px] text-teal-800 font-medium">Your conversations are private and never shared</p>
      </div>

      {/* Messages / Empty State */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Empty state welcome */}
        {isEmpty && (
          <div className="flex flex-col items-center text-center py-8 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-teal-200">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-bold text-teal-900 text-xl mb-2">Namaste! 🙏</h2>
            <p className="text-sm text-sand-700 leading-relaxed max-w-[280px]">
              I'm <strong className="text-teal-700">Ravi</strong>, your local Jaipur guide. I'll show you the real Jaipur — the stuff tourists never see.
            </p>
            <p className="text-xs text-sand-500 mt-3 mb-6">Tap a suggestion to get started:</p>

            {/* Suggestion chips */}
            <div className="flex flex-col gap-2 w-full max-w-[280px]">
              {quickSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionTap(suggestion.prompt)}
                  className="bg-white border border-sand-200 text-teal-800 text-sm font-medium px-4 py-3 rounded-2xl hover:bg-sand-50 hover:border-terracotta-200 active:scale-[0.98] transition-all duration-200 flex items-center gap-3 text-left shadow-sm"
                >
                  <span className="text-xl">{suggestion.icon}</span>
                  <span>{suggestion.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 animate-fade-in-up ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
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

        {/* Error message */}
        {error && (
          <div className="bg-terracotta-50 border border-terracotta-200 rounded-2xl p-4 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-terracotta-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-terracotta-900 font-medium mb-1">
                  Oops! Ravi is taking a chai break ☕
                </p>
                <p className="text-xs text-terracotta-700 mb-3">
                  Please try again in a moment.
                </p>
                <button
                  onClick={handleRetry}
                  className="text-xs font-semibold text-white bg-terracotta-500 hover:bg-terracotta-600 rounded-full px-3 py-1.5 flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

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
