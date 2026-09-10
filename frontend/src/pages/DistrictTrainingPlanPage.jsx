import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { FileText, Download, Printer, Building2, Users, Cpu, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';

export const DistrictTrainingPlanPage = () => {
  const location = useLocation();
  const { showToast } = useAuth();

  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDistricts().then(res => {
      setDistricts(res.districts || []);
      const params = new URLSearchParams(location.search);
      const urlDist = params.get('district');
      if (urlDist) setSelectedDistrict(urlDist);
    }).catch(err => console.error(err));
  }, [location.search]);

  useEffect(() => {
    if (!selectedDistrict) return;
    setLoading(true);
    api.getDistrictTrainingPlan(selectedDistrict).then(res => {
      setPlanData(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [selectedDistrict]);

  const handlePrint = () => {
    window.print();
  };

  const plan = planData?.plan;
  const header = planData?.official_header;

  return (
    <div className="space-y-6">
      {/* Action Bar (hidden on print) */}
      <div className="no-print bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>State Skill Planning Module</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            District Skill Development Plan (DSDP)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated workforce and training infrastructure plan aligned with Maharashtra State Skill Mission.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-900"
          >
            {districts.map(d => (
              <option key={d.id} value={d.district_name}>{d.district_name}</option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print / Download PDF Report
          </button>
        </div>
      </div>

      {/* Official Government DSDP Report Document */}
      {plan && (
        <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-sm space-y-8 max-w-5xl mx-auto print:border-none print:shadow-none print:p-0">
          {/* Government Formal Header */}
          <div className="border-b-2 border-slate-900 pb-6 text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xl mx-auto mb-2">
              M
            </div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-600">
              Government of Maharashtra
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Department of Skill Development, Employment and Entrepreneurship
            </p>
            <p className="text-xs text-slate-400">
              Maharashtra State Skill Development Society (MSSDS)
            </p>
            <h2 className="text-2xl font-black text-slate-900 pt-3 tracking-tight uppercase">
              {plan.district_name} District Skill Development Plan (DSDP)
            </h2>
            <div className="flex justify-center items-center gap-4 text-xs font-bold text-slate-600 pt-1">
              <span>Financial Year: {plan.financial_year}</span>
              <span>•</span>
              <span>Approval Status: {plan.status}</span>
              <span>•</span>
              <span>Generated: {plan.generated_date}</span>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Employment Target</span>
              <span className="text-2xl font-black text-blue-700 mt-1 block">
                {plan.expected_employment?.toLocaleString()}+
              </span>
              <span className="text-[10px] text-slate-400">Job Placements</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Required Trainers</span>
              <span className="text-2xl font-black text-indigo-700 mt-1 block">
                {plan.required_trainers}
              </span>
              <span className="text-[10px] text-slate-400">Certified Faculty</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Lab Upgrades</span>
              <span className="text-2xl font-black text-purple-700 mt-1 block">
                {plan.required_infra_labs}
              </span>
              <span className="text-[10px] text-slate-400">Specialized Labs</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">State Budget</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                ₹{plan.budget_allocation_cr} Cr
              </span>
              <span className="text-[10px] text-slate-400">Total Allocation</span>
            </div>
          </div>

          {/* Section 1: Priority Sectors */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              1. Priority Economic & Industrial Sectors
            </h3>
            <p className="text-xs text-slate-600">
              Based on industrial investments in MIDC corridors and formal sector hiring projections for {plan.district_name}:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(plan.priority_sectors || []).map((sec, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <strong className="text-slate-900 block">{sec}</strong>
                    <span className="text-[11px] text-slate-500">Designated High-Impact Growth Sector</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Recommended Courses */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              2. Recommended Training Courses & Capacity Expansion
            </h3>
            <div className="space-y-2">
              {(plan.recommended_courses || []).map((course, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <strong className="text-slate-900">{course}</strong>
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Curriculum Aligned
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Trainer & Infrastructure Requisitions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Required Trainer Capacity ({plan.required_trainers} Total)
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li>• Master faculty with verified industry certifications (AWS/ARAI/NASSCOM)</li>
                <li>• 4-week intensive Faculty Development Programs scheduled via DVET</li>
                <li>• Visiting adjunct industry practitioners for capstone mentorship</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-600" />
                Infrastructure & Laboratories ({plan.required_infra_labs} Labs)
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li>• GPU workstation setups for AI and Data Analytics simulation</li>
                <li>• Dedicated EV cut-section testbeds and battery diagnostic rigs</li>
                <li>• High-speed fiber optic connectivity and cloud workspace grants</li>
              </ul>
            </div>
          </div>

          {/* Formal Sign-off Section */}
          <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-2 text-xs text-slate-600 text-center">
            <div>
              <div className="font-bold text-slate-900 mb-12">Prepared By:</div>
              <div className="border-t border-slate-400 max-w-xs mx-auto pt-1 font-semibold">
                District Skill Development Committee ({plan.district_name})
              </div>
            </div>
            <div>
              <div className="font-bold text-slate-900 mb-12">Approved By:</div>
              <div className="border-t border-slate-400 max-w-xs mx-auto pt-1 font-semibold">
                Directorate of Vocational Education & Training (DVET)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
