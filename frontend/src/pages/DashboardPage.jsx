import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Sparkles, 
  BookOpen, 
  AlertTriangle, 
  Building2, 
  Award, 
  TrendingUp, 
  ArrowRight,
  Target,
  FileText,
  Users,
  Cpu
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [skillDemand, setSkillDemand] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats().then(res => {
      setData(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
    api.getSkillDemand().then(setSkillDemand).catch(err => console.error(err));
  }, []);

  const COLORS = ['#2563EB', '#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Persona Context */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Maharashtra Labour Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Currently viewing as <span className="font-bold text-white underline decoration-blue-400">{currentUser?.roleTitle}</span> for {currentUser?.district || 'Maharashtra'}.
              Real-time matching of employer demands, courses, and district workforce readiness.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/skill-gap"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Target className="w-4 h-4" />
              Launch Gap Engine
            </Link>
            <Link
              to="/district-plans"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              District Plan (DSDP)
            </Link>
          </div>
        </div>
      </div>

      {/* Top Statistics Cards - Section 5 Feature 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Job Demand"
          value={data?.stats?.totalJobDemand?.toLocaleString() || "52,400"}
          change="+18.4% YoY"
          isPositive={true}
          icon={Briefcase}
          color="blue"
          subtitle="Across Maharashtra"
        />
        <StatCard
          title="Active Skills"
          value={data?.stats?.activeSkills || "500+"}
          change="+34 New"
          isPositive={true}
          icon={Sparkles}
          color="indigo"
          subtitle="Profiles monitored"
        />
        <StatCard
          title="Training Programs"
          value={data?.stats?.trainingPrograms || "142"}
          change="89% Validated"
          isPositive={true}
          icon={BookOpen}
          color="cyan"
          subtitle="Polytechnics & ITIs"
        />
        <StatCard
          title="Identified Skill Gaps"
          value={data?.stats?.identifiedSkillGaps || "24"}
          change="Action Required"
          isPositive={false}
          icon={AlertTriangle}
          color="rose"
          subtitle="Curriculum deficits"
        />
        <StatCard
          title="Employer Survey"
          value={data?.stats?.employerParticipation || "160+"}
          change="+28 this month"
          isPositive={true}
          icon={Building2}
          color="emerald"
          subtitle="Tata, Infosys, etc."
        />
        <StatCard
          title="Avg Placement Rate"
          value={`${data?.stats?.averagePlacementRate || "74.8"}%`}
          change="+6.2% vs 2025"
          isPositive={true}
          icon={Award}
          color="amber"
          subtitle="Statewide cohort"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sector Demand vs Supply Comparison */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Industry Demand vs Training Supply by Sector</h3>
              <p className="text-xs text-slate-500">Compares employer hiring volumes against polytechnic graduate outputs</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
              Maharashtra 2026-27
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.sectorDemand || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="sector" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} tickFormatter={(v) => v.split(' ')[0]} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="demand" name="Industry Vacancies" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="supply" name="Training Capacity" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Demand Share */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">District Job Share</h3>
              <p className="text-xs text-slate-500">Concentration of current industrial openings</p>
            </div>
            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.districtDemand || []}
                    dataKey="openings"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {(data?.districtDemand || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Top Hub</span>
              <p className="font-bold text-slate-900 truncate">Mumbai (31.2K)</p>
            </div>
            <div className="p-2 rounded bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Tech Capital</span>
              <p className="font-bold text-slate-900 truncate">Pune (24.5K)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Industry Skill Demand</h3>
            <p className="text-xs text-slate-500">Skills extracted from collected employer job descriptions</p>
          </div>
          <TrendingUp className="w-5 h-5 text-emerald-500" />
        </div>
        {skillDemand.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {skillDemand.slice(0, 10).map((item, index) => (
              <div key={item.skill} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">{index + 1}. {item.skill}</span>
                  <span className="text-xs font-black text-blue-700">{item.demand_percentage}%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{item.job_count} jobs · {item.category}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-xs text-slate-500">No processed job descriptions yet.</p>}
      </div>

      {/* Role-Aware Quick Workflows */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Action Center for {currentUser?.roleTitle}</h3>
            <p className="text-xs text-slate-500">Frequently used actions tailored to your authorized privileges</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Persona Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/skill-gap"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Skill Gap Diagnosis</h4>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Select district, sector, and course to run mathematical gap matching and AI curriculum recommendations.
            </p>
          </Link>

          <Link
            to="/courses"
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Course Intelligence</h4>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Audit course alignment, inspect missing modules, and modernize curriculums with one-click additions.
            </p>
          </Link>

          <Link
            to="/district-plans"
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">District Training Plan</h4>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Generate and download official PDF District Skill Development Plans (DSDP) for state allocations.
            </p>
          </Link>

          <Link
            to="/career-guidance"
            className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Career Roadmap Wizard</h4>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Assess candidate skill deficits, visualize step-by-step career path, and view high-placement training.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
