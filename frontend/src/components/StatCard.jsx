import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ title, value, change, isPositive = true, icon: Icon, color = 'blue', subtitle }) => {
  const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', hover: 'hover:border-blue-300' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', hover: 'hover:border-indigo-300' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', hover: 'hover:border-emerald-300' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', hover: 'hover:border-rose-300' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', hover: 'hover:border-amber-300' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100', hover: 'hover:border-cyan-300' }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-md ${scheme.hover} relative overflow-hidden group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} transition-transform duration-300 group-hover:scale-110`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
        {change && (
          <span className={`inline-flex items-center font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {change}
          </span>
        )}
        <span className="text-slate-500 font-normal truncate">{subtitle || 'Updated today'}</span>
      </div>
    </div>
  );
};
