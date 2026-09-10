import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Briefcase, TrendingUp, MapPin, Target, CheckCircle2, Search, Filter } from 'lucide-react';

export const JobRoleAnalysisPage = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getJobRoles({ sector: selectedSector, search: searchTerm })
      .then(res => {
        setJobRoles(res.job_roles || []);
        if (res.sectors) setSectors(res.sectors);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedSector, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          <span>Industry Labour Demand Analysis</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job Role Analysis</h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed breakdown of high-demand occupational profiles, requisite proficiencies, candidate deficit rates, and salary benchmarks across Maharashtra.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search job roles (e.g. Data Analyst, Cloud Engineer, EV Technician)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
          >
            <option value="All">All Sectors</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Job Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobRoles.map((role) => (
          <div 
            key={role.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  {role.sector}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${role.trend === 'declining' ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>
                  <TrendingUp className="w-3 h-3" />
                  {role.trend} {role.growth_rate > 0 ? `+${role.growth_rate}%` : `${role.growth_rate}%`}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1">{role.role_name}</h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{role.description}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl mb-4 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Demand Score</span>
                  <span className="text-sm font-black text-blue-700">{role.demand_score}/100</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Open Jobs</span>
                  <span className="text-sm font-black text-slate-800">{role.open_vacancies?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Skill Gap</span>
                  <span className="text-sm font-black text-rose-600">{role.skill_gap_percentage}%</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-4">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{role.locations?.slice(0, 2).map(location => location.district || location.state).filter(Boolean).join(', ') || 'Location data pending'}</span>
                <span className="ml-auto font-semibold text-slate-700">{role.demand_percentage}% of jobs</span>
              </div>

              {/* Required Skills with Proficiency Levels */}
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Mandatory Skills & Proficiencies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(role.skills || []).map((sk, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-slate-100 text-slate-800 font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      <span>{sk.skill_name}</span>
                      <span className="text-[9px] font-bold text-slate-400">({sk.proficiency_level})</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500">
                Avg: <strong className="text-slate-800">₹{role.avg_salary_lpa} LPA</strong>
              </div>

              <Link
                to={`/skill-gap?role=${role.id}&sector=${encodeURIComponent(role.sector)}`}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1"
              >
                <Target className="w-3.5 h-3.5" />
                Analyze Gap
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
