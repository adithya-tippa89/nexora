import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  ChevronDown, 
  RotateCcw, 
  Zap,
  Key,
  ExternalLink,
  CheckCircle,
  AlertCircle
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
  const [showKeyDrawer, setShowKeyDrawer] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('skillsync_groq_api_key') || '');
  const [keyFeedback, setKeyFeedback] = useState(null);
  const [isSavingKey, setIsSavingKey] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Namaste! I am your **SkillSync AI Advisor**, powered by **Meta LLaMA 3 on Groq**.\n\nAsk me anything about Maharashtra technical education, regional industrial corridors (Pune Auto/EV, Mumbai BFSI/IT, Nagpur Logistics, Nashik), curriculum alignment, or career pathways!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'llama-3.3-70b-versatile',
      source: 'Groq LLaMA 3'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);
  const chatBottomRef = useRef(null);

  const refreshStatus = () => {
    api.getAiStatus()
      .then(res => setAiStatus(res))
      .catch(err => console.warn('[GroqAiAssistant] Status check:', err));
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSaveKey = async (e) => {
    e.preventDefault();
    const key = customApiKey.trim();
    if (!key) {
      localStorage.removeItem('skillsync_groq_api_key');
      setKeyFeedback({ type: 'info', text: 'API Key cleared. Running in Standalone Knowledge Mode.' });
      refreshStatus();
      setTimeout(() => setKeyFeedback(null), 3000);
      return;
    }

    setIsSavingKey(true);
    setKeyFeedback({ type: 'loading', text: 'Connecting & validating key with Groq Cloud...' });

    try {
      const testRes = await api.testAiConnection(key);
      if (testRes.status === 'CONNECTED' || testRes.configured) {
        localStorage.setItem('skillsync_groq_api_key', key);
        setKeyFeedback({ type: 'success', text: `✓ Connected! Live Meta LLaMA 3.3 active (${testRes.latencyMs || 250}ms).` });
        refreshStatus();
        setTimeout(() => {
          setShowKeyDrawer(false);
          setKeyFeedback(null);
        }, 1800);
      } else {
        setKeyFeedback({ type: 'error', text: `⚠️ ${testRes.message || 'Validation failed. Check your key format (gsk_...)'}` });
      }
    } catch (err) {
      setKeyFeedback({ type: 'error', text: `⚠️ ${err.message}` });
    } finally {
      setIsSavingKey(false);
    }
  };

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
        model: response.model || 'llama-3.3-70b-versatile',
        source: response.source || 'Groq LLaMA 3',
        speedMs: response.speedMs,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Note: ${err.message || 'Connection timeout'}. You can connect your free Groq API key by clicking the 🔑 key icon in the top header.`,
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
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-600 hover:from-orange-500 hover:to-indigo-500 text-white px-4 py-3 rounded-full shadow-2xl shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
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
            isMinimized ? 'h-16 w-80 sm:w-96' : 'h-[600px] w-[92vw] sm:w-[430px]'
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
                  <span className={`w-1.5 h-1.5 rounded-full inline-block ${aiStatus?.isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  Model: {aiStatus?.activeModel || 'llama-3.3-70b-versatile'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyDrawer(!showKeyDrawer)}
                title="Configure Groq Cloud API Key"
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  aiStatus?.isConfigured 
                    ? 'text-emerald-300 hover:bg-emerald-500/20' 
                    : 'text-amber-300 hover:bg-amber-500/20 bg-amber-400/10 animate-pulse'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClear}
                title="Clear Chat"
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Inline Groq API Key Configuration Drawer */}
          {showKeyDrawer && (
            <div className="bg-slate-900 border-b border-indigo-500/30 p-3.5 text-white space-y-2 text-xs animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Groq Cloud API Key
                </span>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-indigo-300 hover:text-white underline flex items-center gap-1"
                >
                  Get Free Key <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Enter your free Groq API key to unlock live, high-speed Meta LLaMA 3.3 generation across Netlify & localhost.
              </p>
              <form onSubmit={handleSaveKey} className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="gsk_..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isSavingKey}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    {isSavingKey ? 'Verifying...' : 'Save & Test'}
                  </button>
                </div>
                {keyFeedback && (
                  <div className={`text-[11px] font-medium p-1.5 rounded-lg ${
                    keyFeedback.type === 'success' 
                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30' 
                      : keyFeedback.type === 'error'
                      ? 'bg-rose-900/40 text-rose-300 border border-rose-500/30'
                      : 'bg-blue-900/40 text-blue-300'
                  }`}>
                    {keyFeedback.text}
                  </div>
                )}
              </form>
            </div>
          )}

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
                      className={`max-w-[88%] rounded-2xl p-3 shadow-xs ${
                        m.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none'
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
                    <span>Meta LLaMA 3 on Groq is synthesizing response...</span>
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
                        className="text-[11px] text-left bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-lg transition border border-slate-200/60 font-medium cursor-pointer"
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
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl shadow-xs transition cursor-pointer"
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
