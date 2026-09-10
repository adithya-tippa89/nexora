import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Building2, ThumbsUp, ThumbsDown, Plus, CheckCircle2, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

export const EmployerValidationPage = () => {
  const { currentUser, showToast } = useAuth();
  const [validations, setValidations] = useState([]);
  const [selectedRoleIdx, setSelectedRoleIdx] = useState(0);
  const [missingSkillInput, setMissingSkillInput] = useState('');
  const [loading, setLoading] = useState(true);

  const loadValidations = () => {
    setLoading(true);
    api.getEmployerValidations().then(res => {
      setValidations(res.validations || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadValidations();
  }, []);

  const current = validations[selectedRoleIdx] || validations[0];

  const handleVote = (skillId, action) => {
    api.voteEmployerSkill({
      job_role_id: current.job_role_id,
      skill_id: skillId,
      action,
      employer_name: currentUser?.name || 'Verified Employer'
    }).then(res => {
      showToast(`Vote recorded: ${action === 'approve' ? 'Approved 👍' : 'Marked Not Required 👎'}`, 'success');
      loadValidations();
    }).catch(err => showToast(err.message, 'error'));
  };

  const handleAddMissingSkill = (e) => {
    e.preventDefault();
    if (!missingSkillInput.trim()) return;
    api.suggestMissingSkill({
      job_role_id: current.job_role_id,
      skill_name: missingSkillInput,
      suggested_by: currentUser?.organization || 'Tata Motors / Persistent Labs'
    }).then(res => {
      showToast(`Skill suggestion "${missingSkillInput}" submitted for curriculum review!`, 'success');
      setMissingSkillInput('');
      loadValidations();
    }).catch(err => showToast(err.message, 'error'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Industry Consensus Portal</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employer Skill Validation Module</h1>
        <p className="text-xs text-slate-500 mt-1">
          Industry partners review, vote, and validate job competency profiles to ensure state training programs reflect live shop floor expectations.
        </p>

        {/* Role Tabs */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {validations.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => setSelectedRoleIdx(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedRoleIdx === idx
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {v.role_name}
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div className="space-y-6">
          {/* Validation Score Hero Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Industry Validation Consensus
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                {current.role_name} Competency Profile
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Based on <strong className="text-white">{current.total_employer_responses} employer submissions</strong> from Pune, Mumbai, Nashik, and Nagpur.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10 shrink-0">
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">Consensus Score</span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                  {current.overall_validation_score}%
                </span>
              </div>
            </div>
          </div>

          {/* Skill Validation Voting Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Recommended Skills for {current.role_name}
                </h3>
                <p className="text-[11px] text-slate-500">Vote on each skill to endorse or reject inclusion in state diploma courses</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded border text-slate-600">
                Participate as: {currentUser?.organization || 'Employer'}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {current.skills.map((sk) => (
                <div key={sk.skill_id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-slate-900">{sk.skill_name}</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sk.validation_score}% Endorsed
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>👍 {sk.approved_count} Approved</span>
                      <span>•</span>
                      <span>👎 {sk.not_required_count} Not Required</span>
                    </div>
                  </div>

                  {/* Actions: Approve / Not Required */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(sk.skill_id, 'approve')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleVote(sk.skill_id, 'not_required')}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      Not Required
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Missing Skill Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                Add Missing Industry Skill
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Notice a tool or framework missing from this curriculum profile? Submit it directly for curriculum committee review.
              </p>

              <form onSubmit={handleAddMissingSkill} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. Snowflake Data Warehousing, dbt, Grafana..."
                  value={missingSkillInput}
                  onChange={(e) => setMissingSkillInput(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Submit Missing Skill Endorsement
                </button>
              </form>
            </div>

            {/* Existing Employer Suggested Skills */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">
                Employer Proposed Additions ({current.added_missing_skills?.length || 0})
              </h3>
              <div className="space-y-2">
                {(current.added_missing_skills || []).map((ms, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-slate-900 block">{ms.skill_name}</strong>
                      <span className="text-[11px] text-slate-500">Proposed by {ms.suggested_by}</span>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {ms.votes} Votes
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
