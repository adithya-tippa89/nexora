import React from 'react';

export const StatusBadge = ({ status, size = 'normal' }) => {
  const sizeClasses = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';
  
  const statusConfig = {
    'High Demand': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    'Needs Update': { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    'Low Demand / Obsolete': { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
    'Critical': { bg: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-600' },
    'High': { bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
    'Medium': { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    'Low': { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
    'Approved': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    'State Approved': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    'Pending Review': { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    'High-Velocity': { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
    'Rising': { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    'Stable': { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500' },
    'Declining': { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
    'Action Required': { bg: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
    'Budget Approved': { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    'Enrolled in FDP': { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
    'Certified': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    'Identified': { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' }
  };

  const current = statusConfig[status] || { bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      {status}
    </span>
  );
};
