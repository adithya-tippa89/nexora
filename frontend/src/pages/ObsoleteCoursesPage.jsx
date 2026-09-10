import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertOctagon, AlertTriangle, ArrowRight, RefreshCw, XCircle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ObsoleteCoursesPage = () => {
  const { showToast } = useAuth();
  const [courses, setCourses] = useState([]);
  const [recommendations, setSunsetRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    api.getObsoleteCourses().then(res => {
      setCourses(res.obsoleteCourses || []);
      setSunsetRecommendations(res.sunsetRecommendations || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecommission = (courseName) => {
    showToast(`Decommission notice initiated for "${courseName}". Intake frozen for next academic session.`, 'warning');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-rose-800/40">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>Curriculum Quality Oversight</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Obsolete Course Detection & Sunset Engine
        </h1>
        <p className="text-xs sm:text-sm text-rose-200 mt-1 max-w-3xl">
          Identifies courses where employer demand has collapsed, graduate placement is under 30%, but student enrollment remains high. Protects candidate employability through automated decommissioning alerts.
        </p>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Alert Courses</span>
            <p className="text-xl font-black text-rose-600">{courses.length} Identified</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sub-Par Placement</span>
            <p className="text-xl font-black text-amber-600">&lt; 25% Placement</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Modernization Path</span>
            <p className="text-xl font-black text-blue-600">Full Stack / Cloud / ERP</p>
          </div>
        </div>
      </div>

      {/* Obsolete Course Cards List */}
      <div className="space-y-4">
        {courses.map((course) => (
          <div 
            key={course.id}
            className="bg-white rounded-2xl border-2 border-rose-200 p-6 shadow-sm hover:shadow-md transition relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
                    ⚠ Critical Course Alert
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{course.district} • {course.institution_name}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">{course.course_name}</h3>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Placement Rate</span>
                  <span className="text-xl font-black text-rose-600">{course.placement_rate}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Industry Demand</span>
                  <span className="text-xl font-black text-rose-600">Low (12%)</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Student Supply</span>
                  <span className="text-xl font-black text-amber-600">{course.enrollment_count} (High)</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
                <span className="font-bold text-rose-900 block mb-1">Outdated Skills Being Taught:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(course.skills_covered || []).map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold">
                      ❌ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <span className="font-bold text-emerald-900 block mb-1">Modern Replacement Competencies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(course.missing_skills || []).map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      ✔ {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700 mb-4">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">DVET Action Directive: </strong>
                {course.recommendation}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500 font-medium">
                Mandatory sunset evaluation required under Maharashtra Skills Policy 2026.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecommission(course.course_name)}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Decommission Intake (Freeze)
                </button>
                <Link
                  to={`/skill-gap?sector=${encodeURIComponent(course.sector)}`}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                >
                  Modernize Syllabus
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
