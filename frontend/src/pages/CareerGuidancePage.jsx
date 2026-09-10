import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Bot, 
  Zap, 
  Trophy, 
  Target 
} from 'lucide-react';

export const CareerGuidancePage = () => {
  const { showToast } = useAuth();

  // Student inputs
  const [selectedSkills, setSelectedSkills] = useState(['SQL', 'Advanced Excel & Financial Modeling']);
  const [educationLevel, setEducationLevel] = useState('B.Tech / Polytechnic Diploma');
  const [targetRoleId, setTargetRoleId] = useState('role-data-analyst');
  const [district, setDistrict] = useState('Pune');

  // Options
  const [jobRoles, setJobRoles] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);

  // Result Assessment
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getJobRoles(),
      api.getDistricts(),
      api.getSkills()
    ]).then(([rolesRes, distRes, skillRes]) => {
      setJobRoles(rolesRes.job_roles || []);
      setDistricts(distRes.districts || []);
      const rawSkills = Array.isArray(skillRes) ? skillRes : (skillRes?.skills || []);
      setAvailableSkills(rawSkills.map(s => s.name || s.skill_name || s).filter(Boolean));
    }).catch(err => console.error(err));
  }, []);

  const runAssessment = () => {
    setLoading(true);
    api.assessCareerGuidance({
      current_skills: selectedSkills,
      target_role_id: targetRoleId,
      district,
      education_level: educationLevel
    }).then(res => {
      setAssessment(res.assessment);
      setLoading(false);
    }).catch(err => {
      showToast(err.message, 'error');
      setLoading(false);
    });
  };

  useEffect(() => {
    if (jobRoles.length > 0) {
      runAssessment();
    }
  }, [selectedSkills, targetRoleId, district, educationLevel, jobRoles]);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>Personalized Candidate Career Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Student Career Guidance & Roadmap</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Diagnose your career match, uncover exactly which industry skills you are missing, and follow a step-by-step visual learning path to employment.
        </p>
      </div>

      {/* Student Profile Configurator */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Step 1: Your Profile & Career Aspirations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Career Aspirations</label>
            <select
              value={targetRoleId}
              onChange={(e) => setTargetRoleId(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-900"
            >
              {jobRoles.map(r => (
                <option key={r.id} value={r.id}>{r.role_name} ({r.sector})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target District in Maharashtra</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-900"
            >
              {districts.map(d => (
                <option key={d.id} value={d.district_name}>{d.district_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Education Level</label>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-900"
            >
              <option value="Polytechnic Diploma">Polytechnic Diploma</option>
              <option value="ITI Certificate">ITI Certificate</option>
              <option value="B.Tech / B.E. Degree">B.Tech / B.E. Degree</option>
              <option value="B.Sc / BCA / BCS">B.Sc / BCA / BCS</option>
            </select>
          </div>
        </div>

        {/* Current Skills Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Select Skills You Currently Possess: (Click to toggle)
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
            {availableSkills.map((sk) => {
              const isSelected = selectedSkills.includes(sk);
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleSkill(sk)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3 h-3" />}
                  <span>{sk}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assessment Output */}
      {assessment && (
        <div className="space-y-6">
          {/* Match Score & Gap Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Career Match Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Career Readiness</span>
              <div className="my-2">
                <h3 className="text-xl font-black text-slate-900">{assessment.target_role}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-4xl font-black ${
                    assessment.career_match_percentage >= 75 ? 'text-emerald-600' :
                    assessment.career_match_percentage >= 40 ? 'text-amber-500' : 'text-rose-600'
                  }`}>
                    {assessment.career_match_percentage}%
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Profile Match</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Avg Industry Compensation: <strong className="text-slate-800">₹{assessment.average_salary_lpa} LPA</strong> ({assessment.open_vacancies} openings)
              </p>
            </div>

            {/* Skills You Have */}
            <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Skills You Already Have ({assessment.skills_you_have?.length || 0})
                </span>
                <div className="space-y-1 mt-2">
                  {assessment.skills_you_have && assessment.skills_you_have.length > 0 ? (
                    assessment.skills_you_have.map((s, idx) => (
                      <div key={idx} className="text-xs font-bold text-emerald-900 bg-white/90 px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No matching skills selected yet.</span>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-emerald-700 mt-2">Validated strengths on candidate record.</p>
            </div>

            {/* Skills You Need */}
            <div className="bg-rose-50/70 p-6 rounded-2xl border border-rose-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Skills You Need to Acquire ({assessment.skills_you_need?.length || 0})
                </span>
                <div className="space-y-1 mt-2">
                  {assessment.skills_you_need && assessment.skills_you_need.length > 0 ? (
                    assessment.skills_you_need.map((s, idx) => (
                      <div key={idx} className="text-xs font-bold text-rose-900 bg-white/90 px-2.5 py-1.5 rounded-lg border border-rose-200 flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-emerald-700 font-bold bg-white p-2 rounded">
                      🎉 Full skill readiness achieved!
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[10px] text-rose-700 mt-2">Master these to reach 100% job readiness.</p>
            </div>
          </div>

          {/* Visual Learning Roadmap - Section 13 Feature */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="pb-4 border-b border-slate-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Step-by-Step Learning Progression Roadmap
                </h3>
                <p className="text-xs text-slate-500">Clear structured pathway from beginner foundations to industry employment</p>
              </div>
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                Estimated: 16-20 Weeks
              </span>
            </div>

            {/* Vertical/Horizontal Step Progression */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              {assessment.roadmap.map((step) => (
                <div key={step.step} className="flex flex-col items-center text-center relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm mb-3 shadow-sm ${
                    step.completed
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-blue-600 text-white shadow-blue-500/20'
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-6 h-6" /> : step.step}
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mb-1">{step.title}</h4>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2">{step.duration}</span>
                  <p className="text-[11px] text-slate-500">{step.focus}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Groq LLaMA 3 AI Career Mentor Card */}
          {assessment.ai_mentor && (
            <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    <Bot className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-base tracking-tight text-white">
                        Groq AI Career Mentor & Placement Blueprint
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                        <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        Meta LLaMA 3
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">Personalized strategic career roadmap tailored for {assessment.district} industrial demand</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  Model: {assessment.ai_engine?.model || 'llama-3.3-70b-versatile'}
                </span>
              </div>

              {/* Counselor Summary */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                “{assessment.ai_mentor.counselor_summary}”
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Fast-Track Milestones */}
                {assessment.ai_mentor.fast_track_milestones && (
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-400" />
                      Candidate Action Milestones
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {assessment.ai_mentor.fast_track_milestones.map((milestone, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* High Impact Portfolio Project */}
                {assessment.ai_mentor.high_impact_portfolio_project && (
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/10 space-y-2 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-sky-400" />
                        Maharashtra High-Impact Capstone Project
                      </span>
                      <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                        {assessment.ai_mentor.high_impact_portfolio_project}
                      </p>
                    </div>

                    {assessment.ai_mentor.local_employer_targets && (
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Key Regional Employers in {assessment.district}:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {assessment.ai_mentor.local_employer_targets.map((emp, i) => (
                            <span key={i} className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-md border border-white/10 font-medium">
                              {emp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommended Verified Courses */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Recommended Technical Courses for {assessment.target_role}
                </h3>
                <p className="text-xs text-slate-500">Directly affiliated with Maharashtra State Skill Development Society</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(assessment.recommended_courses || []).map(c => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <strong className="text-xs font-bold text-slate-900">{c.course_name}</strong>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {c.placement_rate}% Placed
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2">{c.institution_name} ({c.district})</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(c.skills_covered || []).map((sk, i) => (
                        <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 font-semibold text-slate-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-500">{c.duration}</span>
                    <button
                      onClick={() => showToast(`Enrollment interest registered for ${c.course_name}!`, 'success')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
                    >
                      Enroll in Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
