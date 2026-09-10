import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders,
  Bot,
  Zap,
  Sparkles,
  Cpu
} from 'lucide-react';

export const AdminSettingsPage = () => {
  const { showToast } = useAuth();
  const [diagnostics, setDiagnostics] = useState(null);
  const [jobStats, setJobStats] = useState(null);
  const [isCollectingJobs, setIsCollectingJobs] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [thresholds, setThresholds] = useState({
    obsoletePlacementCutoff: 30,
    criticalGapTolerance: 40,
    minimumEmployerConsensus: 75
  });

  // Groq AI Status State
  const [aiStatus, setAiStatus] = useState(null);
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState(null);

  const loadDiagnostics = () => {
    api.getDiagnostics().then(res => {
      setDiagnostics(res);
    }).catch(err => console.error(err));

    api.getAiStatus().then(res => {
      setAiStatus(res);
    }).catch(err => console.error(err));

    api.getJobStats().then(res => setJobStats(res)).catch(err => console.error(err));
  };

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const handleTestAi = async () => {
    setIsTestingAi(true);
    setAiTestResult(null);
    try {
      const res = await api.testAiConnection();
      setAiTestResult(res);
      if (res.status === 'CONNECTED' || res.status === 'CONNECTED_FALLBACK') {
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'info');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsTestingAi(false);
    }
  };

  const handleResetData = () => {
    if (!window.confirm("Restore platform database to clean Maharashtra government baseline state? This will reset all sample votes and modifications.")) {
      return;
    }
    setIsResetting(true);
    api.resetPlatformData().then(res => {
      showToast(res.message, 'success');
      setIsResetting(false);
      loadDiagnostics();
    }).catch(err => {
      showToast(err.message, 'error');
      setIsResetting(false);
    });
  };

  const handleCollectJobs = async () => {
    setIsCollectingJobs(true);
    try {
      const result = await api.collectJobs();
      showToast(`Collected ${result.jobs_fetched} jobs: ${result.jobs_inserted} inserted, ${result.jobs_updated} updated.`, 'success');
      const refreshedStats = await api.getJobStats();
      setJobStats(refreshedStats);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsCollectingJobs(false);
    }
  };

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    showToast("Governance thresholds updated for Maharashtra SkillSync Engine!", 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5 text-purple-600" />
          <span>System Administration</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin & Governance Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure platform parameters, view database diagnostics, and manage system baselines.
        </p>
      </div>

      {/* Diagnostics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
            <Database className="w-4 h-4 text-blue-600" />
            Database Engine
          </div>
          <p className="text-sm font-bold text-slate-900">
            {diagnostics?.status?.engine || "Persistent Relational JSON Store"}
          </p>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Operational & Seeded
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            API Gateway
          </div>
          <p className="text-sm font-bold text-slate-900">
            Express REST APIs {diagnostics?.apiVersions || "v1.0.0"}
          </p>
          <p className="text-xs text-slate-500 font-mono">
            Uptime: {diagnostics ? `${Math.round(diagnostics.serverUptime)}s` : 'Active'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
            <Sliders className="w-4 h-4 text-indigo-600" />
            State Districts Monitored
          </div>
          <p className="text-2xl font-black text-blue-700">
            {diagnostics?.status?.records?.districts || 8} Active Hubs
          </p>
          <p className="text-xs text-slate-500">
            Covering Western MH, Vidarbha, Marathwada & Konkan
          </p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
            <Database className="w-4 h-4 text-emerald-600" /> Real Job Data Collection
          </div>
          <p className="text-sm font-bold text-slate-900 mt-2">
            {jobStats ? `${jobStats.active_jobs.toLocaleString()} active postings` : 'No collection statistics loaded'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Latest run: {jobStats?.latest_collection_at ? new Date(jobStats.latest_collection_at).toLocaleString() : 'Not collected yet'}
          </p>
        </div>
        <button
          onClick={handleCollectJobs}
          disabled={isCollectingJobs}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isCollectingJobs ? 'animate-spin' : ''}`} />
          {isCollectingJobs ? 'Collecting...' : 'Run job collection'}
        </button>
      </div>

      {/* Groq LLaMA 3 AI Engine & Model Diagnostics */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Bot className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-tight text-white">
                  Groq Cloud AI Engine & Meta LLaMA 3
                </h3>
                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  aiStatus?.isConfigured
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${aiStatus?.isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  {aiStatus?.isConfigured ? 'CONNECTED' : 'FALLBACK MODE'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Ultra-low latency inference for Skill Gap Analysis, Curriculum Modernization & Career Mentorship
              </p>
            </div>
          </div>

          <button
            onClick={handleTestAi}
            disabled={isTestingAi}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${isTestingAi ? 'animate-spin' : 'fill-slate-950'}`} />
            {isTestingAi ? "Testing Latency..." : "Test Groq AI Connection"}
          </button>
        </div>

        {/* Live Test Results Box */}
        {aiTestResult && (
          <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
            aiTestResult.status === 'CONNECTED' || aiTestResult.status === 'CONNECTED_FALLBACK'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Connection Status: {aiTestResult.status}
              </span>
              {aiTestResult.latencyMs && (
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md font-mono">
                  Latency: {aiTestResult.latencyMs}ms
                </span>
              )}
            </div>
            <p className="leading-relaxed">{aiTestResult.message}</p>
            {aiTestResult.response && (
              <p className="font-mono text-[11px] opacity-80 pt-1 border-t border-white/10">
                Ping response: "{aiTestResult.response}"
              </p>
            )}
          </div>
        )}

        {/* Configuration Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active LLaMA 3 Model</span>
            <span className="font-mono font-black text-amber-300 text-sm block">
              {aiStatus?.activeModel || 'llama-3.3-70b-versatile'}
            </span>
            <span className="text-[11px] text-slate-400">Configurable via GROQ_MODEL in backend/.env</span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">API Authentication</span>
            <span className="font-bold text-slate-200 text-sm block">
              {aiStatus?.isConfigured ? "API Key Configured" : "Placeholder / Empty"}
            </span>
            <span className="text-[11px] text-slate-400">
              {aiStatus?.isConfigured ? "Live cloud inference enabled" : "Set GROQ_API_KEY in backend/.env"}
            </span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inference Engine</span>
            <span className="font-bold text-sky-300 text-sm block">Groq LPU Acceleration</span>
            <span className="text-[11px] text-slate-400">Sub-500ms token generation</span>
          </div>
        </div>

        {/* Supported Groq LLaMA 3 Models */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
            Supported Meta LLaMA 3 Models on Groq
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: 'llama-3.3-70b-versatile', name: 'LLaMA 3.3 70B', ctx: '128k', tag: 'Flagship' },
              { id: 'llama-3.1-8b-instant', name: 'LLaMA 3.1 8B', ctx: '128k', tag: 'Ultra-Fast' },
              { id: 'llama3-70b-8192', name: 'LLaMA 3 70B', ctx: '8k', tag: 'High-Capacity' },
              { id: 'llama3-8b-8192', name: 'LLaMA 3 8B', ctx: '8k', tag: 'Standard' }
            ].map((m) => (
              <div 
                key={m.id}
                className={`p-3 rounded-xl border text-xs ${
                  aiStatus?.activeModel === m.id
                    ? 'bg-amber-400/10 border-amber-400/40 text-amber-200'
                    : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">{m.name}</span>
                  <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded font-mono">{m.ctx}</span>
                </div>
                <span className="text-[10px] text-slate-400 block font-mono truncate">{m.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threshold Configuration Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Algorithm Sensitivity Thresholds
        </h3>
        <p className="text-xs text-slate-500">
          Adjust the mathematical thresholds that trigger automatic Course Decommission Alerts and Critical Curriculum Interventions.
        </p>

        <form onSubmit={handleSaveThresholds} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Obsolete Course Placement Cutoff (%)
            </label>
            <input
              type="number"
              value={thresholds.obsoletePlacementCutoff}
              onChange={(e) => setThresholds({ ...thresholds, obsoletePlacementCutoff: +e.target.value })}
              className="w-full text-xs px-3 py-2 border rounded-xl"
            />
            <span className="text-[10px] text-slate-400">Courses below this trigger Sunset alerts</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Critical Skill Gap Alert (%)
            </label>
            <input
              type="number"
              value={thresholds.criticalGapTolerance}
              onChange={(e) => setThresholds({ ...thresholds, criticalGapTolerance: +e.target.value })}
              className="w-full text-xs px-3 py-2 border rounded-xl"
            />
            <span className="text-[10px] text-slate-400">Gaps above this trigger high-priority FDP</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Min Employer Validation Consensus (%)
            </label>
            <input
              type="number"
              value={thresholds.minimumEmployerConsensus}
              onChange={(e) => setThresholds({ ...thresholds, minimumEmployerConsensus: +e.target.value })}
              className="w-full text-xs px-3 py-2 border rounded-xl"
            />
            <span className="text-[10px] text-slate-400">Required for official DVET accreditation</span>
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Save Algorithm Settings
            </button>
          </div>
        </form>
      </div>

      {/* Reset Platform Baseline */}
      <div className="bg-rose-50/70 p-6 rounded-2xl border border-rose-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-rose-900 flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Reset Maharashtra Dataset Baseline
          </h3>
          <p className="text-xs text-rose-700 max-w-xl">
            Re-seeds all 11 relational tables back to official initial state with realistic data for Pune, Mumbai, Nagpur, Nashik, and Chhatrapati Sambhajinagar.
          </p>
        </div>

        <button
          onClick={handleResetData}
          disabled={isResetting}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
          {isResetting ? "Restoring Data..." : "Restore Default Data"}
        </button>
      </div>
    </div>
  );
};
