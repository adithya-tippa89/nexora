import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Cpu, CheckCircle2, AlertTriangle, ArrowRight, IndianRupee, Sparkles } from 'lucide-react';

export const EquipmentPlanningPage = () => {
  const { showToast } = useAuth();
  const [labs, setLabs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    api.getEquipmentPlanning().then(res => {
      setLabs(res.equipment || []);
      setStats(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveBudget = (id, labName) => {
    api.approveEquipmentBudget(id).then(() => {
      showToast(`Modernization grant for "${labName}" approved by DVET!`, 'success');
      loadData();
    }).catch(err => showToast(err.message, 'error'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Cpu className="w-3.5 h-3.5 text-blue-600" />
          <span>Laboratory & Infrastructure Modernization</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Equipment Planning Module</h1>
        <p className="text-xs text-slate-500 mt-1">
          Surveys laboratory hardware, computing machinery, and specialized simulators across polytechnics against modern industry course requirements.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Labs Monitored</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalLabsMonitored || 18}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Average Lab Readiness</span>
          <p className="text-2xl font-black text-amber-500 mt-1">{stats?.averageReadinessScore || 35}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Grant Required</span>
          <p className="text-2xl font-black text-blue-600 mt-1">₹{stats?.totalBudgetNeededInCrores || "1.65"} Cr</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Urgent Upgrades</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{stats?.actionRequiredCount || 1}</p>
        </div>
      </div>

      {/* Laboratory Infrastructure Cards */}
      <div className="space-y-4">
        {labs.map((lab) => (
          <div 
            key={lab.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">{lab.lab_name}</h3>
                  <StatusBadge status={lab.status} size="small" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{lab.institution} • {lab.district} ({lab.sector})</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Readiness Score</span>
                  <span className={`text-xl font-black ${lab.readiness_score >= 60 ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {lab.readiness_score}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Estimated Budget</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{(lab.estimated_budget_inr / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
              </div>
            </div>

            {/* Inventory Gap Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900 block mb-2">Required Modern Equipment & Tools:</span>
                <ul className="space-y-1.5 text-blue-800 font-medium">
                  {(lab.required_equipment || []).map((eq, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-2">Currently Available Baseline Hardware:</span>
                <ul className="space-y-1.5 text-slate-600">
                  {(lab.available_equipment || []).map((eq, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5"></span>
                      <span>{eq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Plan & Approval */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">System Modernization Roadmap: </strong>
                {lab.action_plan}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Eligible under Maharashtra State Skill Development Scheme 2026.
              </span>
              {lab.status !== 'Budget Approved' && lab.status !== 'Ready' ? (
                <button
                  onClick={() => handleApproveBudget(lab.id, lab.lab_name)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Approve Modernization Grant
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Grant Disbursed & Monitored
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
