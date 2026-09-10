import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Users, GraduationCap, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';

export const TrainerUpskillingPage = () => {
  const { showToast } = useAuth();
  const [trainers, setTrainers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    api.getTrainerProfiles().then(res => {
      setTrainers(res.trainers || []);
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

  const handleEnroll = (id, fdpName) => {
    api.enrollTrainerFDP(id, fdpName).then(() => {
      showToast("Trainer successfully assigned to Faculty Development Program (FDP)!", 'success');
      loadData();
    }).catch(err => showToast(err.message, 'error'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          <span>Faculty Modernization & FDP Track</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Trainer Upskilling Module</h1>
        <p className="text-xs text-slate-500 mt-1">
          Audits the instructional competency gap between course syllabus requirements and existing polytechnic faculty, driving targeted Faculty Development Programs (FDPs).
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Faculty Monitored</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalTrainers || 32}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Average Trainer Gap</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{stats?.averageTrainerGap || 60}%</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Active in State FDP</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{stats?.enrolledInFDP || 18}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Industry Certified</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats?.certifiedCount || 14}</p>
        </div>
      </div>

      {/* Trainer Profiles List */}
      <div className="space-y-4">
        {trainers.map((tr) => (
          <div 
            key={tr.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">{tr.trainer_name}</h3>
                  <StatusBadge status={tr.upskilling_status} size="small" />
                </div>
                <p className="text-xs text-slate-500">{tr.institution} • {tr.district} ({tr.sector})</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Trainer Skill Gap</span>
                  <span className="text-xl font-black text-rose-600">{tr.trainer_skill_gap}%</span>
                </div>
              </div>
            </div>

            {/* Comparison of Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1.5">Current Trainer Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(tr.current_skills || []).map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900 block mb-1.5">Required for Target Course ({tr.target_course}):</span>
                <div className="flex flex-wrap gap-1.5">
                  {(tr.required_skills || []).map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Assigned FDP info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Assigned Training Pathway:</strong> {tr.assigned_fdp || "Awaiting State FDP Allocation"}
                </span>
              </div>

              {tr.upskilling_status !== 'Certified' && (
                <button
                  onClick={() => handleEnroll(tr.id, "AWS Certified Solutions Architect + Docker Bootcamp (State Cohort 4)")}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                >
                  Enroll in State FDP Cohort
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
