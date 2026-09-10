import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  ChevronDown, 
  RotateCcw, 
  Zap 
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "What are the top 3 in-demand skills in Pune right now?",
  "How can an ITI modernize its syllabus for Electric Vehicles?",
  "I know Python and SQL. What should I learn next for Data Analytics?",
  "Which industries are expanding fastest around Nagpur and MIHAN?"
];

export const GroqAiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Namaste! I am your **SkillSync AI Advisor**, powered by **Groq LLaMA 3**.\n\nAsk me anything about Maharashtra technical education, industrial corridors (Pune, MMR, Nagpur, Nashik), curriculum alignment, or career pathways!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    // Fetch AI engine diagnostics
    api.getAiStatus()
      .then(res => setAiStatus(res))
      .catch(err => console.warn('[GroqAiAssistant] Status check:', err));
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text || text.trim() === '' || loading) return;

    const userMsg = {
      role: 'user',
      content: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const history = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
      const response = await api.chatWithAiCopilot({
        message: text.trim(),
        history,
        district: 'Maharashtra'
      });

      const assistantMsg = {
        role: 'assistant',
        content: response.reply,
        model: response.model,
        source: response.source,
        speedMs: response.speedMs,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Sorry, I could not complete your request: ${err.message || 'Unknown network error'}. Please check if the backend server is running.`,
          isError: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Conversation cleared. How can I assist your skills journey today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-600 hover:from-orange-500 hover:to-indigo-500 text-white px-4 py-3 rounded-full shadow-2xl shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/20"
          aria-label="Open Groq AI Advisor"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-wide leading-none">Groq AI Advisor</span>
            <span className="text-[9px] text-amber-200 font-semibold tracking-wider uppercase">Meta LLaMA 3</span>
          </div>
        </button>
      )}

      {/* Slide-out / Floating Chat Window */}
      {isOpen && (
        <div 
          className={`bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col transition-all duration-300 overflow-hidden ${
            isMinimized ? 'h-16 w-80 sm:w-96' : 'h-[580px] w-[90vw] sm:w-[420px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black tracking-tight">SkillSync AI Advisor</h3>
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-400/30">
                    <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    Groq
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Model: {aiStatus?.activeModel || 'llama-3.3-70b-versatile'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Clear Chat"
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-xs ${
                        m.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : m.isError
                          ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed">
                        {m.content}
                      </div>

                      {m.role === 'assistant' && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                          <span className="flex items-center gap-1 font-semibold text-indigo-600">
                            <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                            {m.model || 'Groq LLaMA 3'} {m.speedMs ? `(${m.speedMs}ms)` : ''}
                          </span>
                          <span>{m.time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs p-2 bg-white rounded-xl border border-slate-200 w-fit">
                    <Zap className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                    <span>Groq LLaMA 3 is synthesizing answer...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Prompts (visible if messages length <= 2) */}
              {messages.length <= 2 && (
                <div className="p-3 bg-white border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    💡 Suggested Questions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[11px] text-left bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-lg transition border border-slate-200/60 font-medium"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about skills, curricula, or jobs..."
                  className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-800 placeholder-slate-400 font-medium"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
