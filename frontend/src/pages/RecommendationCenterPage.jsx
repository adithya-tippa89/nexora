import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Lightbulb, CheckCircle2, AlertTriangle, Filter, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const RecommendationCenterPage = () => {
  const { currentUser, showToast } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    api.getRecommendations({ type: typeFilter, priority: priorityFilter })
      .then(res => {
        setRecommendations(res.recommendations || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [typeFilter, priorityFilter]);

  const handleUpdateStatus = (id, newStatus) => {
    api.updateRecommendationStatus(id, newStatus, `Actioned by ${currentUser?.name || 'Administrator'}`)
      .then(() => {
        showToast(`Policy recommendation updated to "${newStatus}"!`, 'success');
        loadData();
      })
      .catch(err => showToast(err.message, 'error'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
          <span>AI Decision-Support Hub</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recommendation Center</h1>
        <p className="text-xs text-slate-500 mt-1">
          Automated rule-based and AI recommendations synthesizing labour demands, curriculum gaps, trainer deficits, and laboratory shortages into actionable policy interventions.
        </p>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">Filter by Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
            >
              <option value="All">All Intervention Types</option>
              <option value="Curriculum Update">Curriculum Update</option>
              <option value="New Training Program">New Training Program</option>
              <option value="Trainer Upskilling">Trainer Upskilling</option>
              <option value="Equipment Upgrade">Equipment Upgrade</option>
              <option value="Intake Reduction">Intake Reduction</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">Filter by Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div 
            key={rec.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">
                  {rec.recommendation_type}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{rec.target_name} ({rec.district})</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={rec.priority} size="small" />
                <StatusBadge status={rec.status} size="small" />
              </div>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 mb-1">{rec.description}</h3>
              <p className="text-xs text-slate-600 leading-relaxed"><strong className="text-slate-800">Analytical Rationale: </strong>{rec.rationale}</p>
            </div>

            {/* Suggested Modules or Actions */}
            {rec.suggested_modules && rec.suggested_modules.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1.5">Actionable Modernization Plan:</span>
                <div className="flex flex-wrap gap-2">
                  {rec.suggested_modules.map((mod, idx) => (
                    <span key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 font-semibold text-[11px]">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Estimate & Approval Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <span className="text-xs font-semibold text-emerald-700">
                ⭐ {rec.impact_estimate}
              </span>

              <div className="flex items-center gap-2">
                {rec.status === 'Pending Review' ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(rec.id, 'Approved')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition"
                    >
                      Approve Intervention
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(rec.id, 'Rejected')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    ✔ Formally Approved by Government
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
