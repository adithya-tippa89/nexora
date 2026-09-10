import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Flame, TrendingUp, Cpu, Briefcase, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmergingTechPage = () => {
  const [techList, setTechList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEmergingTech().then(res => {
      setTechList(res.emerging_technologies || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 text-white p-6 rounded-2xl shadow-lg border border-indigo-900/40">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2">
          <Flame className="w-3.5 h-3.5 text-indigo-400" />
          <span>Frontier Technology Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Emerging Technology Tracker</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Monitors accelerated industry adoption of transformative technologies across Maharashtra's industrial belts. Enables proactive curriculum creation before labor shortages peak.
        </p>
      </div>

      {/* Tech Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techList.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{item.growth_rate}% Growth
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 mb-2">{item.tech_name}</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">{item.summary}</p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl mb-4 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Adoption Rate</span>
                  <span className="text-sm font-black text-blue-700">{item.adoption_rate}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Maharashtra Jobs</span>
                  <span className="text-sm font-black text-emerald-600">{item.maharashtra_job_volume?.toLocaleString()}</span>
                </div>
              </div>

              {/* Required Skills */}
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Required Competencies:
                </span>
                <div className="flex flex-wrap gap-1">
                  {(item.required_skills || []).map((sk, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Courses */}
              <div className="space-y-1 mb-4 text-xs">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Recommended Course Pathways:
                </span>
                {(item.recommended_courses || []).map((c, idx) => (
                  <div key={idx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Link
                to="/skill-gap"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1"
              >
                Assess Curriculum Gaps
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
