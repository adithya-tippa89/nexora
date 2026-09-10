import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Layers, 
  ChevronRight,
  Database,
  BarChart2,
  MapPin,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';

export const LandingPage = () => {
  const [stats, setStats] = useState({
    totalJobDemand: 52400,
    activeSkills: 500,
    districts: 36,
    candidates: 1000000
  });

  useEffect(() => {
    api.getDashboardStats().then(data => {
      if (data?.stats) {
        setStats(prev => ({
          ...prev,
          totalJobDemand: data.stats.totalJobDemand || 52400
        }));
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Next-Gen Labour Market Intelligence for Maharashtra</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Aligning Skills with Industry. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  Building Careers for Tomorrow.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                SkillSync Maharashtra bridges the critical mismatch between employer requirements and training curriculums. 
                Using real-time labour signals across 36 districts, we diagnose skill gaps, modernize technical courses, and direct students into high-growth jobs.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/dashboard"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center gap-2 group"
                >
                  Explore Dashboard
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/skill-gap"
                  className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm shadow-sm transition flex items-center gap-2"
                >
                  <Target className="w-4 h-4 text-sky-400" />
                  Analyze Skill Gaps
                </Link>
              </div>

              {/* Tagline Motto */}
              <div className="pt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="text-emerald-400 font-bold">Motto:</span>
                <span>“Right Skills. Right Training. Right Jobs.”</span>
              </div>
            </div>

            {/* Right Futuristic Analytics Preview UI */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-950 p-1 border border-blue-500/30 shadow-2xl shadow-blue-900/40">
                <div className="rounded-xl bg-slate-900/90 p-5 space-y-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                    <span className="text-[11px] font-mono text-sky-400 font-semibold">SKILL-GAP-ENGINE // PUNE</span>
                  </div>

                  {/* Sample Live Card */}
                  <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/60">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-slate-300 font-medium">Job Role: Data Analyst</span>
                      <span className="text-blue-400 font-bold">Pune IT Sector</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>Curriculum Match</span>
                          <span className="text-amber-400 font-bold">60%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div className="text-[11px] bg-rose-950/40 border border-rose-800/60 rounded p-2 text-rose-300">
                        <span className="font-bold">❌ Missing Skills Detected:</span> Power BI, Cloud Computing (AWS/Azure)
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation Simulation */}
                  <div className="bg-blue-950/50 rounded-lg p-3 border border-blue-800/40 text-xs">
                    <div className="flex items-center gap-1.5 text-blue-300 font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>AI Intervention Recommendation</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Inject Power BI & AWS S3 Querying modules into Maharashtra State Skill Institute diploma. Upgrade lab with 30 GPU nodes.
                    </p>
                  </div>

                  {/* Quick District Metric */}
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-slate-800/50 p-2.5 rounded border border-slate-700/40">
                      <div className="text-lg font-bold text-white">24,500+</div>
                      <div className="text-[10px] text-slate-400">Open Jobs (Pune)</div>
                    </div>
                    <div className="bg-slate-800/50 p-2.5 rounded border border-slate-700/40">
                      <div className="text-lg font-bold text-emerald-400">76.5%</div>
                      <div className="text-[10px] text-slate-400">Placement Target</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Hero Live Animated Stats Section */}
      <section className="bg-slate-900 text-white py-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-blue-400">50K+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 mt-1">Live Job Signals Tracked</div>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">500+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 mt-1">Skills Profiled & Mapped</div>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">36</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 mt-1">Districts of Maharashtra</div>
            </div>
            <div className="p-3">
              <div className="text-3xl sm:text-4xl font-black text-indigo-400">1M+</div>
              <div className="text-xs sm:text-sm font-medium text-slate-400 mt-1">Candidates Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Core System Flow */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Evidence-Based Architecture</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              The Closed-Loop Skill Intelligence Ecosystem
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Transforming fragmented training initiatives into a synchronized pipeline of market demand, curriculum calibration, and guaranteed student employability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">Collect Labour Data</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingest job postings, employer surveys, sector growth trends, and placement metrics across Maharashtra.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">Analyze Demand</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identify high-demand roles, required proficiencies, emerging technologies, and declining skill areas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">Audit Training Supply</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assess existing polytechnic & ITI curriculums, faculty proficiencies, and laboratory equipment availability.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl border-2 border-blue-600 shadow-md relative">
              <span className="absolute -top-3 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                Core Engine
              </span>
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm mb-4">
                4
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">Perform Gap Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Execute mathematical comparison between required industry skills and course coverage, calculating precise Match %.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                5
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">Deliver Interventions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trigger curriculum updates, trainer upskilling FDPs, lab equipment grants, and student career roadmaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target User Roles Showcase */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Empowering 4 Key Stakeholders</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for Government, Institutions, Industry & Students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Role 1: Government */}
            <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200 hover:border-purple-300 transition duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Government / Admin</h3>
              <ul className="text-xs text-slate-600 space-y-2 mb-6">
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" /> Monitor statewide & district demand</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" /> Approve curriculum recommendations</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" /> Generate District Training Plans (DSDP)</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" /> Sunset obsolete or low-demand courses</li>
              </ul>
              <Link to="/dashboard" className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1">
                Explore Admin View <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Role 2: Training Institution */}
            <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200 hover:border-blue-300 transition duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Training Institution</h3>
              <ul className="text-xs text-slate-600 space-y-2 mb-6">
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> Compare curriculum with market demand</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> Identify missing skills in courses</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> Enroll faculty in trainer upskilling</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /> Request laboratory equipment upgrades</li>
              </ul>
              <Link to="/courses" className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1">
                Explore Institution View <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Role 3: Employer */}
            <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200 hover:border-emerald-300 transition duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Employer</h3>
              <ul className="text-xs text-slate-600 space-y-2 mb-6">
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> Post skill & job vacancy requirements</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> Validate curriculum & recommended skills</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> Add missing industry-standard skills</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> Access candidate skill availability</li>
              </ul>
              <Link to="/employer-validation" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                Explore Employer View <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Role 4: Student */}
            <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200 hover:border-amber-300 transition duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Candidate / Student</h3>
              <ul className="text-xs text-slate-600 space-y-2 mb-6">
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Discover in-demand skills in your district</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Diagnose personal skill match percentage</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Follow a structured career roadmap</li>
                <li className="flex items-start gap-1.5"><CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> Enroll in verified high-placement courses</li>
              </ul>
              <Link to="/career-guidance" className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                Explore Student View <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-blue-900 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Align Maharashtra's Workforce with Industry Demand?
          </h2>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto">
            Experience the full-stack Labour Market Intelligence and Curriculum Alignment Platform built for Maharashtra.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/skill-gap"
              className="px-8 py-3.5 rounded-xl bg-white text-blue-900 font-extrabold text-sm shadow-xl hover:bg-slate-100 transition"
            >
              Launch Skill Gap Engine
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-sm border border-blue-600 transition"
            >
              Open State Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
