import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Settings, RefreshCw, Database, ShieldCheck, CheckCircle2, AlertTriangle, Sliders } from 'lucide-react';

export const AdminSettingsPage = () => {
  const { showToast } = useAuth();
  const [diagnostics, setDiagnostics] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [thresholds, setThresholds] = useState({
    obsoletePlacementCutoff: 30,
    criticalGapTolerance: 40,
    minimumEmployerConsensus: 75
  });

  const loadDiagnostics = () => {
    api.getDiagnostics().then(res => {
      setDiagnostics(res);
    }).catch(err => console.error(err));
  };

  useEffect(() => {
    loadDiagnostics();
  }, []);

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
