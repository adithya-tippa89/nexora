import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend 
} from 'recharts';
import { Sparkles, TrendingUp, Filter, Plus, Search, ArrowUpRight, Flame } from 'lucide-react';

export const SkillDemandPage = () => {
  const { showToast } = useAuth();
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // New Skill Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    skill_name: '',
    category: 'Programming & Data',
    demand_score: 85,
    growth_rate: 25,
    velocity_status: 'Rising',
    description: ''
  });

  const loadSkills = () => {
    setLoading(true);
    api.getSkills({ category: selectedCategory, status: selectedStatus, search: searchTerm })
      .then(res => {
        setSkills(res.skills || []);
        if (res.categories) setCategories(res.categories);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSkills();
  }, [selectedCategory, selectedStatus, searchTerm]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    api.addSkill(newSkill).then(res => {
      showToast(`Skill "${newSkill.skill_name}" added to intelligence stream!`);
      setShowAddModal(false);
      setNewSkill({ skill_name: '', category: 'Programming & Data', demand_score: 85, growth_rate: 25, velocity_status: 'Rising', description: '' });
      loadSkills();
    }).catch(err => showToast(err.message, 'error'));
  };

  // Top 8 skills for chart
  const chartData = skills.slice(0, 8).map(s => ({
    name: s.skill_name,
    demand: s.demand_score,
    growth: s.growth_rate
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <Flame className="w-3.5 h-3.5 text-blue-600" />
            <span>State Labour Signal Analysis</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Skill Demand Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time demand scoring, historical velocity, and growth projections for technical and industrial competencies.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Ingest New Skill Signal
        </button>
      </div>

      {/* Analytics Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: In-Demand Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Top Skills by Demand Score (0-100)</h3>
              <p className="text-[11px] text-slate-500">Industry requirement frequency index</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Current Quarter</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="demand" name="Demand Score" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Growth Projections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Annual YoY Growth Rate (%)</h3>
              <p className="text-[11px] text-slate-500">Fastest accelerating employer requirements</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">YoY Momentum</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="growth" name="Growth Rate %" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search skill by name or description (e.g. Python, SQL, EV, Docker)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
          >
            <option value="All">All Velocities</option>
            <option value="High-Velocity">High-Velocity</option>
            <option value="Rising">Rising</option>
            <option value="Stable">Stable</option>
            <option value="Declining">Declining</option>
          </select>
        </div>
      </div>

      {/* Skills Table List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Skill Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Demand Score</th>
                <th className="px-4 py-3.5">YoY Growth</th>
                <th className="px-4 py-3.5">Trend Status</th>
                <th className="px-5 py-3.5">Labour Market Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {skills.map((skill) => (
                <tr key={skill.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3 font-bold text-slate-900">
                    {skill.skill_name}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">
                    {skill.category}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{skill.demand_score}</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${skill.demand_score > 80 ? 'bg-blue-600' : skill.demand_score > 50 ? 'bg-amber-500' : 'bg-slate-400'}`}
                          style={{ width: `${skill.demand_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold">
                    <span className={skill.growth_rate >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {skill.growth_rate > 0 ? `+${skill.growth_rate}%` : `${skill.growth_rate}%`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={skill.velocity_status} size="small" />
                  </td>
                  <td className="px-5 py-3 text-slate-500 line-clamp-1 max-w-xs">
                    {skill.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Ingest New Skill Signal</h3>
            <p className="text-xs text-slate-500 mb-4">Add emerging technological or trade requirement to the state registry.</p>
            
            <form onSubmit={handleAddSkill} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prompt Engineering / CAN-Bus Telemetry"
                  value={newSkill.skill_name}
                  onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Velocity Status</label>
                  <select
                    value={newSkill.velocity_status}
                    onChange={(e) => setNewSkill({ ...newSkill, velocity_status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="High-Velocity">High-Velocity</option>
                    <option value="Rising">Rising</option>
                    <option value="Stable">Stable</option>
                    <option value="Declining">Declining</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Demand Score (0-100)</label>
                  <input
                    type="number"
                    value={newSkill.demand_score}
                    onChange={(e) => setNewSkill({ ...newSkill, demand_score: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Growth Rate %</label>
                  <input
                    type="number"
                    value={newSkill.growth_rate}
                    onChange={(e) => setNewSkill({ ...newSkill, growth_rate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Market Signal</label>
                <textarea
                  rows={2}
                  value={newSkill.description}
                  onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                  placeholder="Industry adoption rationale..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                >
                  Add Skill Signal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
