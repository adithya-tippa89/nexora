import React, { useState, useEffect, useRef } from 'react';
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
  Target, 
  Download, 
  Printer, 
  BookOpen, 
  Clock, 
  Code, 
  Award, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Briefcase,
  Layers,
  MapPin,
  GraduationCap,
  ExternalLink
} from 'lucide-react';

export const CareerGuidancePage = () => {
  const { currentUser, showToast } = useAuth();

  // Student inputs
  const [selectedSkills, setSelectedSkills] = useState(['Python', 'SQL', 'Cloud Computing (AWS/Azure)']);
  const [educationLevel, setEducationLevel] = useState('B.Tech / Polytechnic Diploma');
  const [targetRoleId, setTargetRoleId] = useState('role-ai-engineer');
  const [district, setDistrict] = useState('Pune');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [roadmapView, setRoadmapView] = useState('detailed'); // 'timeline' | 'detailed'
  const [expandedSteps, setExpandedSteps] = useState({ 1: true, 2: true, 3: true, 4: true, 5: true });

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
      // Pre-select first recommended course
      if (res.assessment?.recommended_courses?.length > 0 && selectedCourses.length === 0) {
        setSelectedCourses([res.assessment.recommended_courses[0].id]);
      }
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

  const toggleCourseSelection = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
      showToast("Course selected! Roadmap updated with aligned coursework.", "success");
    }
  };

  const toggleStepExpand = (stepNum) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  const expandAllSteps = () => {
    setExpandedSteps({ 1: true, 2: true, 3: true, 4: true, 5: true });
  };

  const collapseAllSteps = () => {
    setExpandedSteps({ 1: false, 2: false, 3: false, 4: false, 5: false });
  };

  // Trigger Print to PDF
  const handleDownloadPdf = () => {
    showToast("Opening Official Maharashtra PDF Roadmap Print Dialog...", "info");
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const candidateName = currentUser?.name || 'Rohan Shinde';
  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const documentId = `MAH-SS-CR-${(targetRoleId || 'GEN').toUpperCase().replace('ROLE-', '')}-${Date.now().toString().slice(-6)}`;

  return (
    <div className="space-y-6">
      {/* Interactive Screen Layout (Hidden during print) */}
      <div className="no-print space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Personalized Candidate Career Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Student Career Guidance & Structured Roadmap</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Diagnose your career match, select your target courses, and follow an in-depth, topic-by-topic structured curriculum with printable PDF export.
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
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
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
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {districts.map(d => (
                  <option key={d.district_name} value={d.district_name}>{d.district_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option>Polytechnic Diploma</option>
                <option>B.Tech / B.E. (Computer / IT / Mech / Electrical)</option>
                <option>B.Sc / BCA</option>
                <option>ITI Certificate Holder</option>
                <option>Vocational 12th Standard (HSC)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Skills You Currently Possess: (Click to toggle)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200/80">
              {availableSkills.map((sk) => {
                const isSelected = selectedSkills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleSkill(sk)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
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

            {/* Course-Based Step-by-Step Learning Progression Roadmap */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              {/* Roadmap Header & Action Bar */}
              <div className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Personalized Curriculum Roadmap</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
                    Step-by-Step Learning Progression for {assessment.target_role}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Structured topic-by-topic roadmap aligned with Maharashtra industry requirements.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
                    <button
                      onClick={() => setRoadmapView('detailed')}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        roadmapView === 'detailed'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Detailed Syllabus
                    </button>
                    <button
                      onClick={() => setRoadmapView('timeline')}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        roadmapView === 'timeline'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Timeline Stepper
                    </button>
                  </div>

                  {/* PDF Download Button */}
                  <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
                    title="Download official formatted roadmap as PDF"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official PDF Roadmap</span>
                  </button>
                </div>
              </div>

              {/* Timeline Stepper View */}
              {roadmapView === 'timeline' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                    {(assessment.roadmap || []).map((step) => (
                      <div 
                        key={step.step} 
                        onClick={() => { setRoadmapView('detailed'); setExpandedSteps(prev => ({ ...prev, [step.step]: true })); }}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/40 hover:border-blue-300 transition cursor-pointer flex flex-col items-center text-center"
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm mb-3 shadow-sm ${
                          step.completed
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-blue-600 text-white shadow-blue-500/20'
                        }`}>
                          {step.completed ? <CheckCircle2 className="w-6 h-6" /> : step.step}
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 mb-1">{step.title}</h4>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-2">{step.duration}</span>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{step.focus}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setRoadmapView('detailed')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                    >
                      Click here to switch to Detailed Topic-by-Topic Syllabus →
                    </button>
                  </div>
                </div>
              )}

              {/* Detailed Topic-by-Topic Syllabus View */}
              {roadmapView === 'detailed' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>Click any module to expand/collapse topics</span>
                    <div className="flex gap-2">
                      <button onClick={expandAllSteps} className="text-blue-600 hover:underline font-semibold">Expand All</button>
                      <span>•</span>
                      <button onClick={collapseAllSteps} className="text-slate-500 hover:underline font-semibold">Collapse All</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(assessment.roadmap || []).map((step) => {
                      const isExpanded = expandedSteps[step.step];
                      return (
                        <div 
                          key={step.step}
                          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                            step.completed
                              ? 'border-emerald-200 bg-emerald-50/20'
                              : 'border-slate-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          {/* Step Header */}
                          <div 
                            onClick={() => toggleStepExpand(step.step)}
                            className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/60 select-none"
                          >
                            <div className="flex items-start sm:items-center gap-3.5">
                              {/* Step Badge */}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                                step.completed
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                              }`}>
                                {step.completed ? <CheckCircle2 className="w-5 h-5" /> : `0${step.step}`}
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                                    {step.title}
                                  </h4>
                                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 border border-blue-200 px-2 py-0.5 rounded-full">
                                    {step.duration}
                                  </span>
                                  {step.completed ? (
                                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      <Check className="w-3 h-3" /> Prerequisite Met
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                      Required Module
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{step.focus}</p>
                              </div>
                            </div>

                            <div className="shrink-0 text-slate-400 p-1">
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                          </div>

                          {/* Expanded Step Details (Topics, Milestone Project, Tools, Recommended Courses) */}
                          {isExpanded && (
                            <div className="px-5 pb-5 pt-1 border-t border-slate-100/80 space-y-4 bg-slate-50/40">
                              
                              {/* Topics to Learn */}
                              <div>
                                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                                  Specific Topics to Learn & Master:
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {(step.topics || []).map((topic, i) => (
                                    <div key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/70 text-xs text-slate-800">
                                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                        {i + 1}
                                      </span>
                                      <span className="font-medium leading-tight">{topic}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Practical Milestone Project */}
                              {step.milestone_project && (
                                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-2.5">
                                  <Trophy className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                                      Stage Capstone Project / Industry Deliverable:
                                    </span>
                                    <p className="text-xs font-bold text-amber-950 mt-0.5">
                                      {step.milestone_project}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Key Tools & Aligned Course */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
                                {step.key_tools && step.key_tools.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                      <Code className="w-3 h-3" /> Tech Stack:
                                    </span>
                                    {step.key_tools.map((tool, idx) => (
                                      <span key={idx} className="text-[10px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {step.recommended_course_name && (
                                  <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Aligned State Program: {step.recommended_course_name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Verified Technical Courses (Directly selectable by student) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Recommended State Technical Courses for {assessment.target_role}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select the accredited training programs you wish to enroll in to link with your learning roadmap.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {selectedCourses.length} Course{selectedCourses.length !== 1 ? 's' : ''} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(assessment.recommended_courses || []).map(c => {
                  const isSelected = selectedCourses.includes(c.id);
                  return (
                    <div 
                      key={c.id} 
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/30'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <strong className="text-xs font-extrabold text-slate-900">{c.course_name}</strong>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
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

                      <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">{c.duration}</span>
                        
                        <button
                          type="button"
                          onClick={() => toggleCourseSelection(c.id)}
                          className={`px-3.5 py-1.5 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Enrolled in Roadmap</span>
                            </>
                          ) : (
                            <>
                              <span>Select for Roadmap</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* OFFICIAL PRINTABLE PDF ROADMAP VIEW (Only rendered when downloading/printing PDF) */}
      {/* ========================================================================= */}
      {assessment && (
        <div className="print-only bg-white text-black p-8 font-serif leading-normal">
          {/* Letterhead Header */}
          <div className="border-b-2 border-black pb-4 mb-6 text-center">
            <div className="flex items-center justify-between mb-2">
              <div className="text-left text-xs font-sans">
                <p className="font-bold text-slate-800 uppercase tracking-wider">Government of Maharashtra</p>
                <p className="text-slate-600 text-[11px]">Dept. of Skill Development, Employment & Entrepreneurship</p>
              </div>
              <div className="text-right text-xs font-sans">
                <p className="font-bold text-slate-800">Doc ID: {documentId}</p>
                <p className="text-slate-600 text-[11px]">Date: {currentDateStr}</p>
              </div>
            </div>
            
            <h1 className="text-xl font-bold uppercase tracking-wider text-black mt-2 font-sans">
              Individualized Career & Learning Progression Roadmap
            </h1>
            <p className="text-xs text-slate-700 font-sans italic mt-0.5">
              Maharashtra State Labour Market Intelligence & Skill Development Mission
            </p>
          </div>

          {/* Candidate Dossier Summary */}
          <div className="mb-6 p-4 border border-black rounded-lg bg-slate-50 font-sans text-xs">
            <div className="grid grid-cols-2 gap-y-2 gap-x-6">
              <div>
                <span className="font-bold text-slate-700">Candidate Name: </span>
                <span className="font-bold text-black">{candidateName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Target Career Aspiration: </span>
                <span className="font-bold text-blue-900">{assessment.target_role}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Target Region / District: </span>
                <span className="font-semibold text-black">{assessment.district}, Maharashtra</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Education Background: </span>
                <span className="font-semibold text-black">{educationLevel}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Verified Profile Match: </span>
                <span className="font-bold text-emerald-800">{assessment.career_match_percentage}% Job Readiness</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Regional Average Compensation: </span>
                <span className="font-semibold text-black">₹{assessment.average_salary_lpa} LPA ({assessment.open_vacancies} Openings)</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Skill Evaluation */}
          <div className="mb-6 font-sans text-xs">
            <h2 className="font-bold text-sm uppercase tracking-wider border-b border-black pb-1 mb-3">
              1. Skill Competency Diagnostic
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-emerald-600 bg-emerald-50 rounded">
                <span className="font-bold text-emerald-900 block mb-1">
                  Validated Existing Skills ({assessment.skills_you_have?.length || 0}):
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-800 text-[11px]">
                  {assessment.skills_you_have?.map((sk, i) => (
                    <li key={i}>{sk}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 border border-rose-600 bg-rose-50 rounded">
                <span className="font-bold text-rose-900 block mb-1">
                  Priority Skills to Acquire ({assessment.skills_you_need?.length || 0}):
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-800 text-[11px]">
                  {assessment.skills_you_need?.map((sk, i) => (
                    <li key={i}>{sk}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 5-Stage Step-by-Step Curriculum Syllabus Table */}
          <div className="mb-6 font-sans">
            <h2 className="font-bold text-sm uppercase tracking-wider border-b border-black pb-1 mb-3">
              2. Step-by-Step Structured Curriculum Roadmap
            </h2>
            
            <table className="w-full text-xs border-collapse border border-black">
              <thead>
                <tr className="bg-slate-200 text-black font-bold text-left border-b border-black">
                  <th className="p-2 border border-black w-12 text-center">Stage</th>
                  <th className="p-2 border border-black w-48">Module Name & Duration</th>
                  <th className="p-2 border border-black">Structured Topics to Learn</th>
                  <th className="p-2 border border-black w-56">Practical Capstone & Tools</th>
                </tr>
              </thead>
              <tbody>
                {(assessment.roadmap || []).map((st) => (
                  <tr key={st.step} className="border-b border-black">
                    <td className="p-2 border border-black font-bold text-center align-top">{st.step}</td>
                    <td className="p-2 border border-black align-top font-semibold">
                      <p className="font-bold text-black">{st.title}</p>
                      <p className="text-[10px] text-slate-600 mt-1">Duration: {st.duration}</p>
                      {st.recommended_course_name && (
                        <p className="text-[10px] text-blue-900 mt-1 italic">Course: {st.recommended_course_name}</p>
                      )}
                    </td>
                    <td className="p-2 border border-black align-top">
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-800">
                        {(st.topics || []).map((t, idx) => (
                          <li key={idx} className="leading-tight">{t}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2 border border-black align-top">
                      <p className="font-bold text-slate-900 text-[11px]">{st.milestone_project}</p>
                      {st.key_tools && (
                        <p className="text-[10px] text-slate-600 mt-1">
                          Stack: {st.key_tools.join(', ')}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Aligned Maharashtra State Technical Courses */}
          {assessment.recommended_courses && assessment.recommended_courses.length > 0 && (
            <div className="mb-6 font-sans text-xs">
              <h2 className="font-bold text-sm uppercase tracking-wider border-b border-black pb-1 mb-2">
                3. Affiliated Training Institutions in Maharashtra
              </h2>
              <table className="w-full text-xs border-collapse border border-black">
                <thead>
                  <tr className="bg-slate-200 text-black font-bold text-left border-b border-black">
                    <th className="p-1.5 border border-black">Course Name</th>
                    <th className="p-1.5 border border-black">Institution & Location</th>
                    <th className="p-1.5 border border-black text-center">Duration</th>
                    <th className="p-1.5 border border-black text-center">Placement Track</th>
                  </tr>
                </thead>
                <tbody>
                  {assessment.recommended_courses.slice(0, 4).map(c => (
                    <tr key={c.id} className="border-b border-black">
                      <td className="p-1.5 border border-black font-bold">{c.course_name}</td>
                      <td className="p-1.5 border border-black">{c.institution_name} ({c.district})</td>
                      <td className="p-1.5 border border-black text-center">{c.duration}</td>
                      <td className="p-1.5 border border-black text-center font-bold text-emerald-800">{c.placement_rate}% Placed</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Strategic Mentor Guidance */}
          {assessment.ai_mentor?.counselor_summary && (
            <div className="mb-6 font-sans text-xs p-3 border border-slate-400 rounded bg-slate-50">
              <h3 className="font-bold uppercase tracking-wider text-slate-900 mb-1">
                Strategic Career Counselor Note (Meta LLaMA 3 Powered):
              </h3>
              <p className="text-slate-800 italic leading-relaxed text-[11px]">
                "{assessment.ai_mentor.counselor_summary}"
              </p>
            </div>
          )}

          {/* Official Sign-Off Footer */}
          <div className="mt-8 pt-4 border-t-2 border-black flex items-end justify-between font-sans text-xs">
            <div>
              <p className="font-bold text-slate-800">State Directorate of Vocational Education & Training</p>
              <p className="text-[10px] text-slate-600">MSSDS Government of Maharashtra • SkillSync Certified Dossier</p>
            </div>
            <div className="text-center">
              <div className="h-10 w-32 border-b border-black mb-1 mx-auto"></div>
              <p className="text-[10px] font-bold text-slate-800 uppercase">Authorised Officer Signature</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
