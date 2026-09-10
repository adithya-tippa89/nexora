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
  Target, 
  Download, 
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
  Search,
  Filter,
  CheckSquare,
  Square,
  BookmarkCheck,
  Cpu,
  Flame,
  ArrowRight
} from 'lucide-react';

export const CareerGuidancePage = () => {
  const { currentUser, showToast } = useAuth();

  // Student inputs
  const [selectedSkills, setSelectedSkills] = useState(['Python', 'SQL', 'Cloud Computing (AWS/Azure)']);
  const [educationLevel, setEducationLevel] = useState('B.Tech / Polytechnic Diploma');
  const [targetRoleId, setTargetRoleId] = useState('role-ai-engineer');
  const [district, setDistrict] = useState('Pune');
  
  // Selected course IDs (multi-select)
  const [selectedCourses, setSelectedCourses] = useState(['course-ai-foundations']);
  
  // Active Curriculum View: 'roadmap' | 'syllabi'
  const [activeTab, setActiveTab] = useState('roadmap');
  const [roadmapView, setRoadmapView] = useState('detailed'); // 'timeline' | 'detailed'
  
  // Expandable state
  const [expandedSteps, setExpandedSteps] = useState({ 1: true, 2: true, 3: true, 4: true, 5: true });
  const [expandedUnits, setExpandedUnits] = useState({});

  // Course catalog filtering
  const [allCourses, setAllCourses] = useState([]);
  const [courseFilterSector, setCourseFilterSector] = useState('All');
  const [courseSearch, setCourseSearch] = useState('');

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
      api.getSkills(),
      api.getCourses()
    ]).then(([rolesRes, distRes, skillRes, coursesRes]) => {
      setJobRoles(rolesRes.job_roles || []);
      setDistricts(distRes.districts || []);
      const rawSkills = Array.isArray(skillRes) ? skillRes : (skillRes?.skills || []);
      setAvailableSkills(rawSkills.map(s => s.name || s.skill_name || s).filter(Boolean));
      setAllCourses((coursesRes.courses || []).filter(c => c.status !== 'Low Demand / Obsolete'));
    }).catch(err => console.error('Initialization error:', err));
  }, []);

  const runAssessment = (overrideCourses = null) => {
    setLoading(true);
    const coursesToPass = overrideCourses !== null ? overrideCourses : selectedCourses;
    
    api.assessCareerGuidance({
      current_skills: selectedSkills,
      target_role_id: targetRoleId,
      district,
      education_level: educationLevel,
      selected_course_ids: coursesToPass
    }).then(res => {
      setAssessment(res.assessment);
      if (res.assessment?.selected_course_ids && selectedCourses.length === 0) {
        setSelectedCourses(res.assessment.selected_course_ids);
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
  }, [selectedSkills, targetRoleId, district, educationLevel, selectedCourses, jobRoles]);

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleCourseSelection = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      if (selectedCourses.length === 1) {
        showToast("Please keep at least one course selected to generate your roadmap and syllabus.", "warning");
        return;
      }
      const updated = selectedCourses.filter(id => id !== courseId);
      setSelectedCourses(updated);
      showToast("Course removed. Dynamic roadmap & syllabus updated.", "info");
    } else {
      const updated = [...selectedCourses, courseId];
      setSelectedCourses(updated);
      showToast("Course added! Roadmap & unit-by-unit syllabus regenerated.", "success");
    }
  };

  const selectPresetTrack = (courseIds, roleId = null) => {
    setSelectedCourses(courseIds);
    if (roleId) setTargetRoleId(roleId);
    showToast("Specialized Learning Track Loaded!", "success");
  };

  const toggleStepExpand = (stepNum) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  const toggleUnitExpand = (unitKey) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitKey]: !prev[unitKey]
    }));
  };

  const expandAllSteps = () => {
    const all = {};
    (assessment?.roadmap || []).forEach(s => { all[s.step] = true; });
    setExpandedSteps(all);
  };

  const collapseAllSteps = () => {
    setExpandedSteps({});
  };

  // Trigger Print to PDF
  const handleDownloadPdf = () => {
    showToast("Opening Official Maharashtra PDF Roadmap & Syllabus Print Dialog...", "info");
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

  // Filter courses for selection catalog
  const filteredCourses = allCourses.filter(c => {
    const matchesSector = courseFilterSector === 'All' || c.sector === courseFilterSector;
    const matchesQuery = !courseSearch || 
      c.course_name.toLowerCase().includes(courseSearch.toLowerCase()) || 
      c.institution_name.toLowerCase().includes(courseSearch.toLowerCase()) ||
      (c.skills_covered || []).some(sk => sk.toLowerCase().includes(courseSearch.toLowerCase()));
    return matchesSector && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Interactive Screen Layout (Hidden during print) */}
      <div className="no-print space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-3 border border-amber-400/30">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Personalized Candidate Career Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Course-Based Learning Roadmap & Structured Syllabus
            </h1>
            <p className="text-xs sm:text-base text-slate-300 mt-2 max-w-3xl leading-relaxed">
              Select your accredited Maharashtra vocational courses. Our system dynamically generates your step-by-step progression roadmap, unit-by-unit syllabus, hands-on lab practicals, and official PDF download.
            </p>

            {/* Quick Track Presets */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Popular Tracks:
              </span>
              <button
                onClick={() => selectPresetTrack(['course-ai-foundations'], 'role-ai-engineer')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer"
              >
                🤖 AI & Machine Learning Track
              </button>
              <button
                onClick={() => selectPresetTrack(['course-fullstack-cloud'], 'role-cloud-devops')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer"
              >
                🌐 Full Stack & Cloud Track
              </button>
              <button
                onClick={() => selectPresetTrack(['course-data-analytics'], 'role-data-analyst')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer"
              >
                📊 Data Analytics Track
              </button>
              <button
                onClick={() => selectPresetTrack(['course-ev-powertrain'], 'role-ev-tech')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer"
              >
                ⚡ EV Powertrain & Battery Track
              </button>
              <button
                onClick={() => selectPresetTrack(['course-industrial-robotics'], 'role-robotics-eng')}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition cursor-pointer"
              >
                🦾 Industrial Robotics Track
              </button>
            </div>
          </div>
        </div>

        {/* STEP 1: Candidate Profile & Target Aspiration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs">1</span>
              Student Background & Career Goal
            </h3>
            <span className="text-xs font-bold text-slate-400">Maharashtra Vocational Portal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Career Aspirations</label>
              <select
                value={targetRoleId}
                onChange={(e) => setTargetRoleId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
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
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
              >
                {districts.map(d => (
                  <option key={d.district_name} value={d.district_name}>{d.district_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
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
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Skills You Currently Possess: (Click to toggle existing competencies)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
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

        {/* STEP 2: SELECT COURSES TO GENERATE ROADMAP & SYLLABUS */}
        <div className="bg-white p-6 rounded-2xl border-2 border-blue-500/30 shadow-md space-y-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase mb-1">
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Step 2: Course Selection</span>
              </div>
              <h3 className="font-black text-lg text-slate-900 tracking-tight">
                Select Your Course(s) to Generate Roadmap & Detailed Syllabus
              </h3>
              <p className="text-xs text-slate-500">
                Pick 1 or multiple accredited technical programs. The roadmap and topic syllabus update in real time based on your selection.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
                {selectedCourses.length} Course{selectedCourses.length !== 1 ? 's' : ''} Selected
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search courses or skills..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-wrap gap-1 w-full sm:w-auto">
              {['All', 'Information Technology', 'Automotive & EV', 'Manufacturing & Automation'].map(sec => (
                <button
                  key={sec}
                  onClick={() => setCourseFilterSector(sec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    courseFilterSector === sec
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sec === 'All' ? 'All Sectors' : sec}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredCourses.map(c => {
              const isSelected = selectedCourses.includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => toggleCourseSelection(c.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none relative ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="font-black text-sm text-slate-900 leading-snug">
                        {c.course_name}
                      </h4>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium mb-2.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{c.institution_name} ({c.district})</span>
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {(c.skills_covered || []).slice(0, 3).map((sk, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500 text-[11px]">{c.duration}</span>
                    <span className="font-extrabold text-[11px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      {c.placement_rate}% Placement
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 3: DYNAMIC ROADMAP & DETAILED SYLLABUS PRESENTATION */}
        {assessment && (
          <div className="space-y-6">
            
            {/* Readiness Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Readiness Score */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Target Career Readiness
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className={`text-4xl font-black ${
                      assessment.career_match_percentage >= 75 ? 'text-emerald-600' :
                      assessment.career_match_percentage >= 40 ? 'text-amber-500' : 'text-rose-600'
                    }`}>
                      {assessment.career_match_percentage}%
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase">Match Score</span>
                  </div>
                  <h4 className="font-black text-slate-900 mt-1">{assessment.target_role}</h4>
                </div>
                <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  Avg Regional Salary: <strong className="text-slate-800">₹{assessment.average_salary_lpa} LPA</strong> ({assessment.open_vacancies} openings in Maharashtra)
                </p>
              </div>

              {/* Skills Validated */}
              <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Skills You Already Possess ({assessment.skills_you_have?.length || 0})
                  </span>
                  <div className="space-y-1.5 mt-2 max-h-32 overflow-y-auto">
                    {assessment.skills_you_have && assessment.skills_you_have.length > 0 ? (
                      assessment.skills_you_have.map((s, idx) => (
                        <div key={idx} className="text-xs font-bold text-emerald-900 bg-white/90 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No overlapping skills detected yet.</span>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-emerald-700 mt-2 font-medium">Credited towards course prerequisites.</p>
              </div>

              {/* Skills to Acquire */}
              <div className="bg-rose-50/70 p-6 rounded-2xl border border-rose-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Skills to Acquire From Courses ({assessment.skills_you_need?.length || 0})
                  </span>
                  <div className="space-y-1.5 mt-2 max-h-32 overflow-y-auto">
                    {assessment.skills_you_need && assessment.skills_you_need.length > 0 ? (
                      assessment.skills_you_need.map((s, idx) => (
                        <div key={idx} className="text-xs font-bold text-rose-900 bg-white/90 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-2">
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-emerald-700 font-bold bg-white p-2 rounded">
                        🎉 Full course readiness achieved!
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-rose-700 mt-2 font-medium">Covered in the step-by-step syllabus below.</p>
              </div>
            </div>

            {/* CURRICULUM WORKBENCH: ROADMAP vs SYLLABUS TABS */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              
              {/* Main Tab Navigation & Actions */}
              <div className="p-6 pb-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase">
                      Dynamic Course-Driven Output
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Based on {assessment.selected_courses?.length || 1} Selected Course{assessment.selected_courses?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {activeTab === 'roadmap' ? 'Step-by-Step Learning Progression Roadmap' : 'Complete Course Syllabi & Unit Breakdown'}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Tab Switcher */}
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'roadmap'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Progression Roadmap</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('syllabi')}
                      className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                        activeTab === 'syllabi'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Unit-by-Unit Syllabi ({assessment.course_syllabi?.length || 0})</span>
                    </button>
                  </div>

                  {/* PDF Download Button */}
                  <button
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition cursor-pointer"
                    title="Download official formatted roadmap and course syllabi as PDF"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official PDF Dossier</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: LEARNING PROGRESSION ROADMAP */}
              {activeTab === 'roadmap' && (
                <div className="p-6 space-y-6">
                  {/* View Style Switcher & Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">View Mode:</span>
                      <button
                        onClick={() => setRoadmapView('detailed')}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                          roadmapView === 'detailed' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Detailed Stage Breakdown
                      </button>
                      <button
                        onClick={() => setRoadmapView('timeline')}
                        className={`text-xs px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                          roadmapView === 'timeline' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Timeline Stepper
                      </button>
                    </div>

                    {roadmapView === 'detailed' && (
                      <div className="flex gap-2 text-xs">
                        <button onClick={expandAllSteps} className="text-blue-600 hover:underline font-semibold cursor-pointer">Expand All</button>
                        <span className="text-slate-300">•</span>
                        <button onClick={collapseAllSteps} className="text-slate-500 hover:underline font-semibold cursor-pointer">Collapse All</button>
                      </div>
                    )}
                  </div>

                  {/* Timeline Stepper View */}
                  {roadmapView === 'timeline' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {(assessment.roadmap || []).map((step) => (
                          <div 
                            key={step.step} 
                            onClick={() => { setRoadmapView('detailed'); setExpandedSteps(prev => ({ ...prev, [step.step]: true })); }}
                            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/40 hover:border-blue-300 transition cursor-pointer flex flex-col items-center text-center"
                          >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm mb-3 shadow-xs ${
                              step.completed
                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
                            }`}>
                              {step.completed ? <CheckCircle2 className="w-6 h-6" /> : `0${step.step}`}
                            </div>
                            <h4 className="font-bold text-xs text-slate-900 mb-1">{step.title}</h4>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">{step.duration}</span>
                            <p className="text-[11px] text-slate-500 line-clamp-2">{step.focus}</p>
                          </div>
                        ))}
                      </div>

                      <div className="text-center pt-2">
                        <button
                          onClick={() => setRoadmapView('detailed')}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                        >
                          Switch to Detailed Topics & Hands-On Labs View →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Detailed Stage View */}
                  {roadmapView === 'detailed' && (
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
                            {/* Header */}
                            <div 
                              onClick={() => toggleStepExpand(step.step)}
                              className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/60 select-none"
                            >
                              <div className="flex items-start sm:items-center gap-3.5">
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
                                    {step.course_name && (
                                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                                        Course: {step.course_name}
                                      </span>
                                    )}
                                    {step.completed ? (
                                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Prerequisite Met
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                        Active Learning Stage
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

                            {/* Body */}
                            {isExpanded && (
                              <div className="px-5 pb-5 pt-2 border-t border-slate-100/80 space-y-4 bg-slate-50/40">
                                
                                {/* Specific Topics */}
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

                                {/* Practical Lab Milestone */}
                                {step.milestone_project && (
                                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-2.5">
                                    <Trophy className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                                        Hands-On Practical Lab Assignment & Deliverable:
                                      </span>
                                      <p className="text-xs font-bold text-amber-950 mt-0.5">
                                        {step.milestone_project}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Tools & Outcomes */}
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

                                  {step.learning_outcomes && (
                                    <p className="text-[11px] text-slate-500 italic max-w-lg">
                                      Competency: {step.learning_outcomes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DETAILED COURSE SYLLABI (UNIT-BY-UNIT) */}
              {activeTab === 'syllabi' && (
                <div className="p-6 space-y-8">
                  {(!assessment.course_syllabi || assessment.course_syllabi.length === 0) ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      No course syllabi available for current selection. Please select one or more courses above.
                    </div>
                  ) : (
                    assessment.course_syllabi.map((course) => (
                      <div key={course.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-6">
                        {/* Course Overview Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase mb-1">
                              <span>Accredited State Curriculum</span>
                            </div>
                            <h4 className="text-lg font-black text-slate-900">{course.course_name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {course.institution_name} • {course.district}, Maharashtra • Duration: <strong>{course.duration}</strong>
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-500 block">Certification Awarded:</span>
                            <span className="text-xs font-black text-indigo-700">{course.certification}</span>
                          </div>
                        </div>

                        {/* Capstone Project Banner */}
                        {course.capstone_project && (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-transparent border border-amber-300 flex items-start gap-3">
                            <Trophy className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                                Final Industry Capstone Project Requirement:
                              </span>
                              <p className="text-xs font-bold text-slate-900 mt-0.5">
                                {course.capstone_project}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Unit-by-Unit Breakdown */}
                        <div className="space-y-3">
                          <h5 className="text-xs font-black uppercase tracking-wider text-slate-500">
                            Unit-by-Unit Detailed Syllabus Structure ({course.units?.length || 0} Units):
                          </h5>

                          {(course.units || []).map((unit) => {
                            const unitKey = `${course.id}-${unit.unit_number}`;
                            const isUnitOpen = expandedUnits[unitKey] !== false; // Default open
                            return (
                              <div key={unit.unit_number} className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
                                <div 
                                  onClick={() => toggleUnitExpand(unitKey)}
                                  className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 select-none"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                                      U{unit.unit_number}
                                    </div>
                                    <div>
                                      <h6 className="font-extrabold text-xs sm:text-sm text-slate-900">
                                        {unit.title}
                                      </h6>
                                      <span className="text-[11px] text-slate-500">Duration: {unit.duration}</span>
                                    </div>
                                  </div>

                                  <div className="text-slate-400 p-1">
                                    {isUnitOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </div>
                                </div>

                                {isUnitOpen && (
                                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
                                    <p className="text-xs text-slate-600 italic">
                                      Focus: {unit.focus}
                                    </p>

                                    {/* Topics List */}
                                    <div>
                                      <span className="text-[11px] font-bold text-slate-700 uppercase block mb-1.5">
                                        Topics Covered:
                                      </span>
                                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-800">
                                        {(unit.topics || []).map((t, idx) => (
                                          <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <span className="text-blue-600 font-black shrink-0">•</span>
                                            <span className="leading-snug">{t}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* Lab Practical */}
                                    {unit.practical_lab && (
                                      <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 text-xs">
                                        <span className="font-bold text-blue-900 block mb-0.5">Hands-On Lab Practical:</span>
                                        <p className="text-slate-700 font-medium">{unit.practical_lab}</p>
                                      </div>
                                    )}

                                    {/* Tools */}
                                    {unit.key_tools && unit.key_tools.length > 0 && (
                                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Tools:</span>
                                        {unit.key_tools.map((tl, i) => (
                                          <span key={i} className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                            {tl}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* GROQ LLAMA 3 AI CAREER MENTOR */}
            {assessment.ai_mentor && (
              <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white p-6 sm:p-7 rounded-3xl border border-indigo-500/30 shadow-xl space-y-4">
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
                      <p className="text-[11px] text-slate-300">
                        Tailored advice aligned with your selected courses in {assessment.district}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                    Model: {assessment.ai_engine?.model || 'llama-3.3-70b-versatile'}
                  </span>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  “{assessment.ai_mentor.counselor_summary}”
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
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
                            Regional Employers in {assessment.district}:
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
      {/* OFFICIAL PRINTABLE / DOWNLOADABLE PDF ROADMAP & SYLLABUS DOSSIER */}
      {/* ========================================================================= */}
      {assessment && (
        <div className="print-only bg-white text-black p-8 font-serif leading-normal">
          {/* Government Letterhead */}
          <div className="border-b-2 border-black pb-4 mb-5 text-center">
            <div className="flex items-center justify-between mb-2">
              <div className="text-left text-xs font-sans">
                <p className="font-bold text-slate-900 uppercase tracking-wider">Government of Maharashtra</p>
                <p className="text-slate-600 text-[11px]">Skill Development, Employment & Entrepreneurship Department</p>
              </div>
              <div className="text-right text-xs font-sans">
                <p className="font-bold text-slate-900">Doc ID: {documentId}</p>
                <p className="text-slate-600 text-[11px]">Date Issued: {currentDateStr}</p>
              </div>
            </div>
            
            <h1 className="text-xl font-bold uppercase tracking-wider text-black mt-2 font-sans">
              Individualized Career & Course Learning Progression Dossier
            </h1>
            <p className="text-xs text-slate-700 font-sans italic mt-0.5">
              Maharashtra State Skill Development Society (MSSDS) • SkillSync Technical Curriculum
            </p>
          </div>

          {/* Candidate Dossier Summary */}
          <div className="mb-5 p-4 border border-black rounded-lg bg-slate-50 font-sans text-xs">
            <div className="grid grid-cols-2 gap-y-2 gap-x-6">
              <div>
                <span className="font-bold text-slate-700">Candidate Name: </span>
                <span className="font-bold text-black">{candidateName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Target Career Aspiration: </span>
                <span className="font-bold text-blue-950">{assessment.target_role}</span>
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
                <span className="font-bold text-slate-700">Profile Readiness Index: </span>
                <span className="font-bold text-emerald-800">{assessment.career_match_percentage}% Verified Match</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">Regional Average Compensation: </span>
                <span className="font-semibold text-black">₹{assessment.average_salary_lpa} LPA ({assessment.open_vacancies} Openings)</span>
              </div>
            </div>
          </div>

          {/* SECTION 1: SELECTED COURSES */}
          <div className="mb-5 font-sans text-xs">
            <h2 className="font-bold text-sm uppercase tracking-wider border-b border-black pb-1 mb-2">
              1. Enrolled Accredited State Technical Courses ({assessment.selected_courses?.length || 1})
            </h2>
            <table className="w-full text-xs border-collapse border border-black">
              <thead>
                <tr className="bg-slate-200 text-black font-bold text-left border-b border-black">
                  <th className="p-1.5 border border-black">Course Name</th>
                  <th className="p-1.5 border border-black">Affiliated Institution & Location</th>
                  <th className="p-1.5 border border-black text-center">Duration</th>
                  <th className="p-1.5 border border-black text-center">Placement Track</th>
                </tr>
              </thead>
              <tbody>
                {(assessment.selected_courses || []).map(c => (
                  <tr key={c.id} className="border-b border-black">
                    <td className="p-1.5 border border-black font-bold">{c.course_name}</td>
                    <td className="p-1.5 border border-black">{c.institution_name || 'Government Polytechnic'} ({c.district || 'Maharashtra'})</td>
                    <td className="p-1.5 border border-black text-center">{c.duration}</td>
                    <td className="p-1.5 border border-black text-center font-bold text-emerald-800">{c.placement_rate || 85}% Placed</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SECTION 2: SKILL DIAGNOSTIC */}
          <div className="mb-5 font-sans text-xs">
            <h2 className="font-bold text-sm uppercase tracking-wider border-b border-black pb-1 mb-2">
              2. Skill Competency Diagnostic Analysis
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-2.5 border border-emerald-600 bg-emerald-50 rounded">
                <span className="font-bold text-emerald-900 block mb-1">
                  Validated Existing Skills ({assessment.skills_you_have?.length || 0}):
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-800 text-[11px]">
                  {assessment.skills_you_have?.map((sk, i) => (
                    <li key={i}>{sk}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 border border-rose-600 bg-rose-50 rounded">
                <span className="font-bold text-rose-900 block mb-1">
                  Skills to Acquire From Courses ({assessment.skills_you_need?.length || 0}):
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-800 text-[11px]">
                  {assessment.skills_you_need?.map((sk, i) => (
                    <li key={i}>{sk}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION 3: STEP-BY-STEP LEARNING ROADMAP */}
          <div className="mb-5 font-sans">
            <h2 className="font-bold text-sm uppercase tracking-wider border-b border-black pb-1 mb-2">
              3. Step-by-Step Learning Progression Roadmap
            </h2>
            
            <table className="w-full text-xs border-collapse border border-black">
              <thead>
                <tr className="bg-slate-200 text-black font-bold text-left border-b border-black">
                  <th className="p-1.5 border border-black w-12 text-center">Stage</th>
                  <th className="p-1.5 border border-black w-48">Module Title & Duration</th>
                  <th className="p-1.5 border border-black">Structured Topics to Learn</th>
                  <th className="p-1.5 border border-black w-56">Practical Lab & Key Tools</th>
                </tr>
              </thead>
              <tbody>
                {(assessment.roadmap || []).map((st) => (
                  <tr key={st.step} className="border-b border-black">
                    <td className="p-1.5 border border-black font-bold text-center align-top">{st.step}</td>
                    <td className="p-1.5 border border-black align-top font-semibold">
                      <p className="font-bold text-black">{st.title}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Duration: {st.duration}</p>
                      {st.recommended_course_name && (
                        <p className="text-[10px] text-blue-900 mt-0.5 italic">Course: {st.recommended_course_name}</p>
                      )}
                    </td>
                    <td className="p-1.5 border border-black align-top">
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-800">
                        {(st.topics || []).map((t, idx) => (
                          <li key={idx} className="leading-tight">{t}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-1.5 border border-black align-top">
                      <p className="font-bold text-slate-900 text-[11px]">{st.milestone_project}</p>
                      {st.key_tools && (
                        <p className="text-[10px] text-slate-600 mt-0.5">
                          Stack: {st.key_tools.join(', ')}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SECTION 4: DETAILED COURSE SYLLABI (UNIT-BY-UNIT) */}
          <div className="mb-5 font-sans">
            <h2 className="font-bold text-sm uppercase tracking-wider border-b border-black pb-1 mb-3">
              4. Comprehensive Course Syllabi (Unit-by-Unit Detailed Breakdown)
            </h2>
            
            {(assessment.course_syllabi || []).map((course, cIdx) => (
              <div key={course.id} className="mb-4 p-3 border border-black rounded bg-white">
                <div className="border-b border-black pb-1.5 mb-2 flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-xs uppercase text-black">
                      Course {cIdx + 1}: {course.course_name}
                    </h3>
                    <p className="text-[10px] text-slate-600">
                      {course.institution_name} • {course.duration} • Certification: {course.certification}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {(course.units || []).map(u => (
                    <div key={u.unit_number} className="text-[11px] border-b border-slate-200 pb-2 last:border-b-0">
                      <p className="font-bold text-black">
                        Unit {u.unit_number}: {u.title} ({u.duration})
                      </p>
                      <p className="text-[10px] text-slate-600 italic">Focus: {u.focus}</p>
                      
                      <div className="mt-1">
                        <span className="font-bold text-[10px] text-slate-700">Topics: </span>
                        <span className="text-slate-800 text-[10px]">{(u.topics || []).join('; ')}</span>
                      </div>

                      {u.practical_lab && (
                        <div className="mt-0.5">
                          <span className="font-bold text-[10px] text-slate-900">Lab Practical: </span>
                          <span className="text-slate-800 text-[10px]">{u.practical_lab}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {course.capstone_project && (
                  <div className="mt-2 pt-1.5 border-t border-black text-[11px]">
                    <span className="font-bold text-black">Final Course Capstone: </span>
                    <span className="text-slate-800">{course.capstone_project}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* SECTION 5: STRATEGIC AI MENTOR GUIDANCE */}
          {assessment.ai_mentor?.counselor_summary && (
            <div className="mb-5 font-sans text-xs p-3 border border-slate-400 rounded bg-slate-50">
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
              <p className="text-[10px] text-slate-600">MSSDS Government of Maharashtra • Certified Student Dossier</p>
            </div>
            <div className="text-center">
              <div className="h-10 w-36 border-b border-black mb-1 mx-auto"></div>
              <p className="text-[10px] font-bold text-slate-800 uppercase">Authorised Officer Signature & Stamp</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
