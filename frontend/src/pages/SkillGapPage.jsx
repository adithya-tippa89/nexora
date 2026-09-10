import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Target, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  MapPin, 
  Layers, 
  Download,
  RefreshCw,
  Cpu,
  GraduationCap,
  Zap,
  Bot
} from 'lucide-react';

export const SkillGapPage = () => {
  const location = useLocation();
  const { showToast } = useAuth();

  // Selector Options
  const [districts, setDistricts] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [courses, setCourses] = useState([]);

  // Selected State
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedJobRoleId, setSelectedJobRoleId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');

  // Analysis Result
  const [analysis, setAnalysis] = useState(null);
  const [recommendationPlan, setRecommendationPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingCurriculum, setUpdatingCurriculum] = useState(false);

  // Initial load
  useEffect(() => {
    Promise.all([
      api.getDistricts(),
      api.getJobRoles(),
      api.getGapCourses()
    ]).then(([distRes, roleRes, courseRes]) => {
      setDistricts(distRes.districts || []);
      setJobRoles(roleRes.job_roles || []);
      setCourses(courseRes.courses || []);
      if (roleRes.job_roles?.length) {
        setSelectedJobRoleId(current => current || String(roleRes.job_roles[0].id));
        setSelectedSector(current => current === 'All' ? roleRes.job_roles[0].sector : current);
      }
      if (courseRes.courses?.length) setSelectedCourseId(current => current || courseRes.courses[0].id);

      // Check URL search params for deep linking
      const params = new URLSearchParams(location.search);
      const paramRole = params.get('role');
      const paramSector = params.get('sector');
      if (paramRole) setSelectedJobRoleId(paramRole);
      if (paramSector) setSelectedSector(paramSector);
    }).catch(err => console.error(err));
  }, [location.search]);

  // Run Gap Engine
  const runAnalysis = () => {
    if (!selectedJobRoleId || !selectedCourseId) return;
    setLoading(true);
    api.analyzeSkillGapLive(selectedJobRoleId, selectedCourseId).then(res => {
      setAnalysis(res.analysis);
      api.getSkillRecommendations({
        analysis: res.analysis,
        courses,
        roles: jobRoles
      }).then(setRecommendationPlan).catch(err => {
        console.error(err);
        setRecommendationPlan(null);
      });
      setLoading(false);
    }).catch(err => {
      showToast(err.message, 'error');
      setLoading(false);
    });
  };

  // Trigger analysis when selections change
  useEffect(() => {
    if (jobRoles.length > 0 && courses.length > 0 && selectedJobRoleId && selectedCourseId) {
      runAnalysis();
    }
  }, [selectedDistrict, selectedSector, selectedJobRoleId, selectedCourseId, districts, jobRoles, courses]);

  // One-click AI curriculum update implementation
  const handleApplyCurriculumUpdate = () => {
    if (!analysis || !analysis.missing_skills || analysis.missing_skills.length === 0) {
      showToast("No missing skills to add. Curriculum is already fully aligned!", 'info');
      return;
    }

    setUpdatingCurriculum(true);
    api.updateGapCourseCurriculum(analysis.course_id, {
      added_skills: analysis.missing_skills
    }).then(_res => {
      showToast(`Successfully added ${analysis.missing_skills.join(', ')} to course curriculum!`, 'success');
      setUpdatingCurriculum(false);
      // Refresh course list and re-run analysis
      api.getGapCourses().then(cRes => setCourses(cRes.courses || []));
      runAnalysis();
    }).catch(err => {
      showToast(err.message, 'error');
      setUpdatingCurriculum(false);
    });
  };

  const [generatingSyllabus, setGeneratingSyllabus] = useState(false);
  const [syllabusBlueprint, setSyllabusBlueprint] = useState(null);

  const handleGenerateSyllabusAddendum = async () => {
    if (!analysis) return;
    setGeneratingSyllabus(true);
    try {
      const res = await api.generateAiSyllabus({
        course_id: analysis.course_id,
        missing_skills: analysis.missing_skills,
        sector: selectedSector,
        target_role: analysis.job_role
      });
      setSyllabusBlueprint(res);
      showToast("Groq LLaMA 3 syllabus addendum generated successfully!", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setGeneratingSyllabus(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    selectedSector === 'All' || c.sector.toLowerCase() === selectedSector.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold mb-2">
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span>Core Mathematical Gap Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Skill Gap Analysis Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Compares live industry required competencies with institutional training curriculums. Computes exact gap percentages and triggers automated AI modernization interventions.
          </p>
        </div>
      </div>

      {/* Selectors Configuration Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Step 1: Configure Comparison Scope
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. District */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              1. District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              {districts.map(d => (
                <option key={d.id} value={d.district_name}>{d.district_name}</option>
              ))}
            </select>
          </div>

          {/* 2. Sector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              2. Industry Sector
            </label>
            <select
              value={selectedSector}
              onChange={(e) => {
                setSelectedSector(e.target.value);
                const firstRole = jobRoles.find(r => r.sector === e.target.value);
                if (firstRole) setSelectedJobRoleId(firstRole.id);
              }}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Sectors</option>
              {Array.from(new Set(jobRoles.map(role => role.sector))).sort().map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          {/* 3. Job Role */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              3. Target Job Role
            </label>
            <select
              value={selectedJobRoleId}
              onChange={(e) => setSelectedJobRoleId(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              {jobRoles
                .filter(r => selectedSector === 'All' || r.sector === selectedSector)
                .map(r => (
                  <option key={r.id} value={r.id}>{r.role_name}</option>
                ))}
            </select>
          </div>

          {/* 4. Course */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              4. Existing Course Curriculum
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full text-xs font-semibold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              {filteredCourses.map(c => (
                <option key={c.id} value={c.id}>{c.course_name} ({c.district || 'Statewide'})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6">
          {/* Top Score Cards Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Match Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Skill Match</span>
              <div className="my-3 flex items-baseline gap-2">
                <span className={`text-5xl font-black ${
                  analysis.skill_match_percentage >= 80 ? 'text-emerald-600' :
                  analysis.skill_match_percentage >= 50 ? 'text-amber-500' : 'text-rose-600'
                }`}>
                  {analysis.skill_match_percentage}%
                </span>
                <span className="text-sm font-bold text-slate-400 uppercase">MATCH</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    analysis.skill_match_percentage >= 80 ? 'bg-emerald-500' :
                    analysis.skill_match_percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${analysis.skill_match_percentage}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {analysis.matching_skills_count} of {analysis.total_required_skills} industry required competencies covered.
              </p>
            </div>

            {/* Overall Skill Gap Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identified Skill Gap</span>
              <div className="my-3 flex items-baseline gap-2">
                <span className={`text-5xl font-black ${analysis.skill_gap_percentage > 30 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {analysis.skill_gap_percentage}%
                </span>
                <span className="text-sm font-bold text-slate-400 uppercase">DEFICIT</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.skill_gap_percentage}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {analysis.missing_skills_count} critical skills currently omitted from course syllabus.
              </p>
            </div>

            {/* Missing Skills Warning Card */}
            <div className="bg-rose-50/80 p-6 rounded-2xl border border-rose-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Missing Skills Warning</span>
                </div>
                {analysis.missing_skills.length > 0 ? (
                  <div className="space-y-1.5 mt-2">
                    {analysis.missing_skills.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-rose-900 bg-white/80 px-2.5 py-1.5 rounded-lg border border-rose-200">
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{s} <span className="font-normal text-rose-700">(required by industry, absent from curriculum)</span></span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-2 rounded-lg mt-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Zero skill gaps! Full curriculum alignment.</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-rose-700 mt-3">
                Industry hiring managers expect these skills for job readiness.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Personalized Learning Recommendations</h3>
                <p className="text-xs text-slate-500 mt-1">Priorities are derived from this role's missing skills and curriculum coverage.</p>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {recommendationPlan?.source?.startsWith('local:') ? 'Verified data fallback' : 'AI structured plan'}
              </span>
            </div>
            {recommendationPlan?.recommendations?.length ? (
              <div className="p-5 space-y-3">
                {recommendationPlan.recommendations.map(item => (
                  <div key={item.skill} className="grid grid-cols-[auto_1fr] gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">{item.learning_order}</div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{item.skill}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.priority === 'High' ? 'bg-rose-100 text-rose-700' : item.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'}`}>{item.priority} priority</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{item.reason}</p>
                      <p className="text-[11px] text-blue-700 font-medium mt-1">Next: {item.learning_direction}</p>
                    </div>
                  </div>
                ))}
                {(recommendationPlan.related_courses?.length > 0 || recommendationPlan.related_roles?.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {recommendationPlan.related_courses?.length > 0 && <div className="p-3 rounded-xl border border-slate-200"><span className="text-[10px] font-bold uppercase text-slate-500">Relevant courses</span>{recommendationPlan.related_courses.map(course => <p key={course.id} className="text-xs font-semibold text-slate-800 mt-1">{course.name}</p>)}</div>}
                    {recommendationPlan.related_roles?.length > 0 && <div className="p-3 rounded-xl border border-slate-200"><span className="text-[10px] font-bold uppercase text-slate-500">Relevant job roles</span>{recommendationPlan.related_roles.map(role => <p key={role.id} className="text-xs font-semibold text-slate-800 mt-1">{role.name}</p>)}</div>}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50"><CheckCircle2 className="w-5 h-5" />No missing skills. No additional learning recommendation is needed.</div>
            )}
          </div>

          {/* Comparison Matrix Table - Section 6 Example */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Detailed Competency Matrix
                </h3>
                <p className="text-[11px] text-slate-500">
                  {analysis.course_name} vs Industry Requirements for {analysis.job_role}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded border text-slate-600">
                Weighted coverage: covered weight / required weight
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/60 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Skill</th>
                    <th className="px-4 py-3.5">Industry Demand</th>
                    <th className="px-4 py-3.5">Required Proficiency</th>
                    <th className="px-4 py-3.5">Course Coverage</th>
                    <th className="px-4 py-3.5">Gap %</th>
                    <th className="px-4 py-3.5">Alignment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analysis.matrix.map((row, idx) => (
                    <tr key={idx} className={row.course_coverage === 'No' ? 'bg-rose-50/40' : 'hover:bg-slate-50'}>
                      <td className="px-5 py-3 font-bold text-slate-900">
                        {row.skill_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {row.industry_demand}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {row.proficiency_required}
                      </td>
                      <td className="px-4 py-3">
                        {row.course_coverage === 'Yes' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold">
                        <span className={row.gap_percentage === 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          {row.gap_percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {row.gap_percentage === 0 ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Aligned
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            Missing Deficit
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI-Powered Recommendation Box */}
          <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-indigo-500/30 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm">
                  <Bot className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base sm:text-lg tracking-tight text-white">
                      AI Curriculum Modernization Intelligence
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      Groq LLaMA 3
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Synthesized live by Groq AI Engine • Model: {analysis.ai_engine?.model || 'llama-3.3-70b-versatile'}
                  </p>
                </div>
              </div>

              {analysis.ai_insights?.estimated_readiness_boost && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-right">
                  <span className="text-[10px] font-bold text-emerald-300 block uppercase">Placement Impact</span>
                  <span className="text-sm font-black text-emerald-400">{analysis.ai_insights.estimated_readiness_boost}</span>
                </div>
              )}
            </div>

            {/* Strategic Overview */}
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 text-sm leading-relaxed text-slate-100 shadow-inner">
              <p className="font-medium text-slate-100">
                “{analysis.ai_insights?.strategic_overview || analysis.ai_recommendation}”
              </p>
            </div>

            {/* Deep Pedagogical Units (if provided by Groq) */}
            {analysis.ai_insights?.curriculum_units_to_add && analysis.ai_insights.curriculum_units_to_add.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  Recommended Curriculum Units to Add
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {analysis.ai_insights.curriculum_units_to_add.map((unit, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2 text-xs">
                      <div className="w-5 h-5 rounded-md bg-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-slate-200">{unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lab Equipment & District Alignment */}
            {analysis.ai_insights?.lab_equipment_requirements && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-sky-300 uppercase tracking-wide">
                    <Cpu className="w-4 h-4 text-sky-400" />
                    <span>Lab Equipment & Specifications</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {analysis.ai_insights.lab_equipment_requirements.map((eq, i) => (
                      <li key={i}>{eq}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 uppercase tracking-wide">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>District Labour Market Alignment</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {analysis.ai_insights.district_industry_alignment || `Aligned with industrial clusters in ${analysis.district}.`}
                  </p>
                  {analysis.ai_insights.faculty_fdp_action && (
                    <div className="pt-2 border-t border-white/10 flex items-start gap-1.5 text-emerald-300">
                      <GraduationCap className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>FDP Directive:</strong> {analysis.ai_insights.faculty_fdp_action}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interventions Hub */}
            {analysis.interventions && analysis.interventions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {analysis.interventions.map((item, idx) => (
                  <div key={idx} className="bg-slate-900/40 p-3 rounded-xl border border-white/10 flex items-start gap-2.5 text-xs">
                    <div className="mt-0.5 text-sky-400">
                      {item.type.includes('Trainer') ? <GraduationCap className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="font-bold text-sky-300 block">{item.type}</span>
                      <span className="text-slate-300">{item.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Generated Syllabus Blueprint Preview */}
            {syllabusBlueprint && (
              <div className="bg-slate-900/90 border border-amber-400/40 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Groq LLaMA 3 Syllabus Addendum Blueprint
                  </span>
                  <span className="text-[10px] text-slate-400">{syllabusBlueprint.model || 'Groq'}</span>
                </div>
                <div className="whitespace-pre-line text-slate-200 leading-relaxed max-h-60 overflow-y-auto pr-2">
                  {syllabusBlueprint.syllabus}
                </div>
              </div>
            )}

            {/* Actions Toolbar */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
              <div className="text-xs text-slate-300">
                Action will update course state across DVET and polytechnic portal.
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleGenerateSyllabusAddendum}
                  disabled={generatingSyllabus}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${generatingSyllabus ? 'animate-spin' : ''}`} />
                  {generatingSyllabus ? "Generating Blueprint..." : "Generate LLaMA 3 Syllabus Addendum"}
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Print / Export Gap Report
                </button>

                {analysis.missing_skills.length > 0 && (
                  <button
                    onClick={handleApplyCurriculumUpdate}
                    disabled={updatingCurriculum}
                    className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-4 h-4 ${updatingCurriculum ? 'animate-spin' : ''}`} />
                    {updatingCurriculum ? "Applying Update..." : "Apply AI Curriculum Update"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
