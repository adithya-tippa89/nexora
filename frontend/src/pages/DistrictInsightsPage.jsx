import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { MapPin, Building2, Briefcase, Sparkles, BookOpen, Users, Cpu, FileText, ArrowRight } from 'lucide-react';

export const DistrictInsightsPage = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState('dist-pune');
  const [districtData, setDistrictData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDistricts().then(res => {
      const list = res.districts || [];
      setDistricts(list);
      if (list.length > 0) {
        setSelectedDistrictId(list[0].id);
      }
    }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedDistrictId) return;
    setLoading(true);
    api.getDistrictById(selectedDistrictId).then(res => {
      setDistrictData(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [selectedDistrictId]);

  const current = districtData?.district;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Regional Labour Market Ecosystem</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Maharashtra District Insights</h1>
        <p className="text-xs text-slate-500 mt-1">
          District-level industrial corridors, skill shortages, polytechnic capacity, and tailored technical training interventions.
        </p>

        {/* District Tabs Selector */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
          {districts.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDistrictId(d.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedDistrictId === d.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d.district_name}
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div className="space-y-6">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Industrial Corridor</span>
              <p className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">{current.industrial_zone}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Active Job Openings</span>
              <p className="text-2xl font-black text-blue-600 mt-1">{current.job_openings?.toLocaleString()}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Technical Institutes</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{current.active_institutes}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Avg Placement Rate</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{current.placement_rate}%</p>
            </div>
          </div>

          {/* District Intelligence Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Key Sectors & High-Demand Profiles */}
            <div className="lg:col-span-7 space-y-6">
              {/* Priority Sectors */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Priority Industrial Sectors in {current.district_name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(current.top_sectors || []).map((sec, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold border border-blue-100">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Training Courses available */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Affiliated Training Programs ({districtData.courses?.length || 0})
                  </h3>
                  <Link to="/courses" className="text-xs font-bold text-blue-600 hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-2">
                  {(districtData.courses || []).map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 block">{c.course_name}</strong>
                        <span className="text-slate-500">{c.institution_name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600 block">{c.placement_rate}% Placement</span>
                        <span className="text-[10px] text-slate-400">{c.enrollment_count} Candidates</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 cols: Local Employers & Plan Action */}
            <div className="lg:col-span-5 space-y-6">
              {/* Prominent Employers */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Key Regional Employers
                </h3>
                <div className="space-y-2.5">
                  {(districtData.employers || []).map((emp) => (
                    <div key={emp.id} className="p-3 rounded-xl border border-slate-200/80 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-slate-900 text-xs block">{emp.company_name}</strong>
                          <span className="text-[11px] text-slate-500">{emp.contact_person}</span>
                        </div>
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {emp.active_hiring_count} Hiring
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* District Training Plan Generator Card */}
              <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-blue-800">
                <h3 className="text-sm font-black mb-1 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  District Skill Development Plan (DSDP)
                </h3>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Generate the official Government of Maharashtra training allocation report for {current.district_name} with budget requirements and trainer counts.
                </p>
                <Link
                  to={`/district-plans?district=${encodeURIComponent(current.district_name)}`}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  Generate {current.district_name} Plan
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
