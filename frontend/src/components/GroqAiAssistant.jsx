import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  Check,
  Copy,
  Maximize2,
  Minimize2,
  Flame,
  Briefcase,
  Compass,
  Cpu,
  GraduationCap
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  { label: "🚗 Pune EV & Auto Skills", text: "What are the top 3 in-demand skills in Pune right now for Electric Vehicles and Automotive?" },
  { label: "🏙️ Mumbai Cloud & BFSI", text: "Which cloud computing, data analytics, and tech skills are highest paying in Mumbai & MMR?" },
  { label: "✈️ Nagpur Logistics & Drones", text: "Which industries are expanding fastest around Nagpur and MIHAN SEZ?" },
  { label: "📚 Modernize ITI Syllabus", text: "Provide an actionable step-by-step roadmap to modernize an ITI syllabus for modern industry." },
  { label: "💼 Top Paying Tech Careers", text: "Compare top 3 technical career tracks in Maharashtra with salary ranges and top recruiting companies." }
];

// Rich custom Markdown components for Executive Government / Publication presentation
const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-3 rounded-2xl border border-slate-200/90 shadow-xs bg-white">
            <table className="w-full text-left text-xs border-collapse min-w-[480px]" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white font-extrabold uppercase text-[10px] tracking-wider" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th className="px-3 py-2.5 text-amber-300 font-bold border-b border-white/10 whitespace-nowrap" {...props} />
        ),
        tbody: ({ node, ...props }) => (
          <tbody className="divide-y divide-slate-100" {...props} />
        ),
        tr: ({ node, ...props }) => (
          <tr className="hover:bg-indigo-50/50 transition-colors" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="px-3 py-2 border-b border-slate-100 text-slate-800 font-medium leading-relaxed align-top text-xs" {...props} />
        ),
        h1: ({ node, ...props }) => (
          <h1 className="text-sm sm:text-base font-black text-slate-900 mt-4 mb-2 pb-1 border-b border-slate-200 flex items-center gap-1.5" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xs sm:text-sm font-extrabold text-indigo-950 mt-3.5 mb-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200/80 w-fit flex items-center gap-1.5 shadow-2xs" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mt-3 mb-1.5" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="leading-relaxed mb-2 last:mb-0 text-slate-700 text-xs sm:text-[13px]" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="space-y-1.5 my-2 pl-1" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 space-y-1.5 my-2 text-xs text-slate-700 font-medium" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 leading-relaxed" {...props}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
            <span className="flex-1">{props.children}</span>
          </li>
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-extrabold text-slate-900" {...props} />
        ),
        code: ({ node, inline, ...props }) => (
          inline 
            ? <code className="px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold border border-indigo-200/60" {...props} />
            : <pre className="p-3 my-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner" {...props} />
        ),
        hr: () => <hr className="my-3 border-slate-200/80" />
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export const GroqAiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showKeyDrawer, setShowKeyDrawer] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('skillsync_groq_api_key') || '');
  const [keyFeedback, setKeyFeedback] = useState(null);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Namaste! I am your **SkillSync Executive AI Advisor**, powered by **Groq Cloud High-Speed LPU™ Inference**.\n\nAsk me anything about Maharashtra technical vocational education, regional industrial corridors (**Pune Auto/EV, Mumbai BFSI/IT, Nagpur Logistics, Nashik**), curriculum alignment, or career pathways!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'openai/gpt-oss-120b',
      source: 'Groq Cloud'
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
  }, [messages, isOpen, isMinimized, isExpanded]);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
        setKeyFeedback({ type: 'success', text: `✓ Connected! Live Groq 120B active (${testRes.latencyMs || 640}ms).` });
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
        model: response.model || 'openai/gpt-oss-120b',
        source: response.source || 'Groq Cloud',
        speedMs: response.speedMs,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Note: ${err.message || 'Connection timeout'}. You can connect your free Groq API key by clicking the 🔑 key icon in the header.`,
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
        content: "Conversation cleared. How can I assist your technical skills or curriculum journey today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 🌟 FLOATING ULTRA-PREMIUM ACTION TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 hover:from-slate-900 hover:to-indigo-900 text-white px-5 py-3.5 rounded-full shadow-[0_15px_40px_-5px_rgba(79,70,229,0.45)] transition-all duration-300 transform hover:scale-105 active:scale-95 border border-indigo-400/30 cursor-pointer"
          aria-label="Open Groq AI Advisor"
        >
          {/* Glowing Aura Icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-wide leading-tight text-white flex items-center gap-1.5">
              SkillSync AI Advisor
              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                120B
              </span>
            </span>
            <span className="text-[10px] text-slate-300 font-medium tracking-wide flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              Groq Cloud LPU™ • Ultra Fast
            </span>
          </div>
        </button>
      )}

      {/* 🌟 SLIDE-OUT / FLOATING LUXURY CHAT WINDOW */}
      {isOpen && (
        <div 
          className={`bg-white rounded-3xl shadow-[0_25px_70px_-15px_rgba(15,23,42,0.4)] border border-slate-200/90 flex flex-col transition-all duration-300 overflow-hidden ${
            isMinimized 
              ? 'h-16 w-80 sm:w-96' 
              : isExpanded 
              ? 'h-[85vh] w-[95vw] sm:w-[720px] max-w-4xl' 
              : 'h-[640px] w-[94vw] sm:w-[500px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between shadow-md border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight text-white">SkillSync AI Advisor</h3>
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                    <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    Groq 120B
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full inline-block ${aiStatus?.isConfigured ? 'bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400/50' : 'bg-amber-400'}`}></span>
                  <span className="font-medium text-slate-300">{aiStatus?.activeModel || 'openai/gpt-oss-120b'}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300 text-[10px]">Maharashtra Technical Engine</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* API Key settings button */}
              <button
                onClick={() => setShowKeyDrawer(!showKeyDrawer)}
                title="Configure Groq Cloud API Key"
                className={`p-1.5 rounded-xl transition cursor-pointer ${
                  aiStatus?.isConfigured 
                    ? 'text-emerald-300 hover:bg-emerald-500/20' 
                    : 'text-amber-300 hover:bg-amber-500/20 bg-amber-400/10 animate-pulse'
                }`}
              >
                <Key className="w-4 h-4" />
              </button>

              {/* Clear chat button */}
              <button
                onClick={handleClear}
                title="Clear Conversation"
                className="p-1.5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Maximize / Restore Widescreen toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Standard view" : "Widescreen view (recommended for tables)"}
                className="p-1.5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition cursor-pointer hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Minimize widget */}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                className="p-1.5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMinimized ? 'rotate-180' : ''}`} />
              </button>

              {/* Close widget */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 🔑 INLINE GROQ API KEY CONFIGURATION DRAWER */}
          {showKeyDrawer && (
            <div className="bg-slate-900 border-b border-indigo-500/30 p-4 text-white space-y-2.5 text-xs animate-in slide-in-from-top-2 shrink-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Groq Cloud API Key
                </span>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-300 hover:text-white underline flex items-center gap-1"
                >
                  Get Free Key <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Enter your Groq API key to unlock live, unrestricted 120B AI generation across Netlify & localhost.
              </p>
              <form onSubmit={handleSaveKey} className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="gsk_..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isSavingKey}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:bg-slate-700 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    {isSavingKey ? 'Testing...' : 'Save & Test'}
                  </button>
                </div>
                {keyFeedback && (
                  <div className={`text-[11px] font-medium p-2 rounded-xl ${
                    keyFeedback.type === 'success' 
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40' 
                      : keyFeedback.type === 'error'
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                      : 'bg-blue-950/60 text-blue-300 border border-blue-500/40'
                  }`}>
                    {keyFeedback.text}
                  </div>
                )}
              </form>
            </div>
          )}

          {!isMinimized && (
            <>
              {/* 💬 MESSAGE LIST AREA */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60 text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[94%] rounded-2xl shadow-sm transition-all ${
                        m.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white p-3.5 rounded-br-xs shadow-md shadow-indigo-500/15'
                          : m.isError
                          ? 'bg-rose-50 text-rose-800 border border-rose-200 p-4 rounded-bl-xs'
                          : 'bg-white text-slate-800 border border-slate-200/90 p-4 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      {/* Message Content */}
                      {m.role === 'user' ? (
                        <div className="whitespace-pre-line leading-relaxed font-medium text-xs sm:text-[13px]">
                          {m.content}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <MarkdownRenderer content={m.content} />
                        </div>
                      )}

                      {/* Footer bar for Assistant Messages */}
                      {m.role === 'assistant' && (
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <div className="flex items-center gap-1.5 font-bold text-indigo-700">
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span>{m.model || 'openai/gpt-oss-120b'}</span>
                            {m.speedMs && (
                              <span className="text-slate-400 font-normal">({m.speedMs}ms)</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span>{m.time}</span>
                            <button
                              onClick={() => handleCopy(m.content, idx)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition cursor-pointer flex items-center gap-1"
                              title="Copy response to clipboard"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600 font-bold text-[9px]">Copied</span>
                                </>
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Pulsing loading state */}
                {loading && (
                  <div className="flex items-center gap-3 text-slate-700 text-xs p-3 bg-white rounded-2xl border border-slate-200 shadow-sm w-fit animate-pulse">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-white">
                      <Zap className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Groq Cloud 120B Flagship is synthesizing response...</p>
                      <p className="text-[10px] text-slate-400">Querying live Maharashtra curriculum intelligence</p>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* 💡 CURATED PROMPT CHIPS */}
              {messages.length <= 3 && (
                <div className="px-4 py-2.5 bg-white border-t border-slate-100 shrink-0">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" /> Popular Maharashtra Intelligence Prompts:
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {SUGGESTED_PROMPTS.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(item.text)}
                        className="text-[11px] whitespace-nowrap bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-3 py-1.5 rounded-xl transition border border-slate-200/70 font-semibold cursor-pointer shrink-0 hover:border-indigo-300"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ⌨️ FLOATING LUXURY INPUT BAR */}
              <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 bg-slate-50 focus-within:bg-white border-2 border-slate-200 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/10 rounded-2xl p-1.5 transition-all shadow-xs"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about skills, curricula, job salary packages, or districts..."
                    className="flex-1 text-xs px-2.5 py-1.5 bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputValue.trim()}
                    className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-slate-300 text-white rounded-xl shadow-sm transition-all cursor-pointer transform active:scale-95 disabled:cursor-not-allowed"
                    title="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="mt-1.5 flex items-center justify-between px-1 text-[9px] text-slate-400">
                  <span>Press <kbd className="px-1 py-0.2 bg-slate-100 rounded border font-mono">Enter</kbd> to send</span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-amber-500" /> Powered by Groq Cloud LPU™
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
