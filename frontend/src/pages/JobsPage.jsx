import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api';

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ title: '', state: '', district: '', employment_type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    Promise.all([api.getJobs(params), api.getJobStats()])
      .then(([jobResponse, statsResponse]) => {
        setJobs(jobResponse.items || []);
        setStats(statsResponse);
        setError('');
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [filters]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
          <Briefcase className="w-3.5 h-3.5" /> Collected labour-market postings
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Real Job Postings</h1>
        <p className="text-xs text-slate-500 mt-1">Current records collected from an explicitly public job-data feed and stored in PostgreSQL.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[['Active jobs', stats.active_jobs], ['All records', stats.total_jobs], ['States', stats.states], ['Districts', stats.districts]].map(([label, value]) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-[10px] uppercase font-bold text-slate-400">{label}</p>
              <p className="text-xl font-black text-slate-900 mt-1">{value?.toLocaleString?.() ?? value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-wrap gap-3 items-center">
        <SlidersHorizontal className="w-4 h-4 text-slate-400" />
        <label className="flex items-center gap-2 flex-1 min-w-[210px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={filters.title} onChange={(event) => updateFilter('title', event.target.value)} placeholder="Search title" className="w-full text-xs focus:outline-hidden" />
        </label>
        <input value={filters.state} onChange={(event) => updateFilter('state', event.target.value)} placeholder="State" className="text-xs border border-slate-300 rounded-lg px-3 py-2 w-32" />
        <input value={filters.district} onChange={(event) => updateFilter('district', event.target.value)} placeholder="District" className="text-xs border border-slate-300 rounded-lg px-3 py-2 w-32" />
        <input value={filters.employment_type} onChange={(event) => updateFilter('employment_type', event.target.value)} placeholder="Employment type" className="text-xs border border-slate-300 rounded-lg px-3 py-2 w-36" />
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm">Unable to load collected jobs: {error}</div>}
      {loading && <div className="text-sm text-slate-500">Loading collected postings...</div>}
      {!loading && !error && jobs.length === 0 && <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-sm text-slate-500">No collected postings match these filters. An admin can run the collection job.</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <article key={job.id} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex justify-between gap-3">
              <div>
                <h2 className="font-black text-slate-900">{job.title}</h2>
                <p className="text-sm text-slate-600 mt-1">{job.company || 'Company not provided'}</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 rounded px-2 py-1 h-fit">{job.source}</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-4"><MapPin className="w-3.5 h-3.5" /> {job.location || 'Location not provided'}</p>
            <div className="flex flex-wrap gap-2 mt-4 text-[11px] text-slate-600">
              {job.employment_type && <span className="bg-slate-100 rounded px-2 py-1">{job.employment_type}</span>}
              {job.posted_date && <span className="bg-slate-100 rounded px-2 py-1">Posted {job.posted_date}</span>}
            </div>
            <a href={job.source_url} target="_blank" rel="noreferrer" className="inline-block mt-4 text-xs font-bold text-blue-700 hover:text-blue-900">View source posting</a>
          </article>
        ))}
      </div>
    </div>
  );
};