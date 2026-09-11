import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage, clearToast } = useAuth();
  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
  };

  const bgStyles = {
    success: "border-emerald-200 bg-emerald-50/95 text-emerald-900 shadow-emerald-500/10",
    warning: "border-amber-200 bg-amber-50/95 text-amber-900 shadow-amber-500/10",
    error: "border-rose-200 bg-rose-50/95 text-rose-900 shadow-rose-500/10",
    info: "border-blue-200 bg-blue-50/95 text-blue-900 shadow-blue-500/10"
  };

  return (
    <div className="fixed top-20 right-6 z-[9999] max-w-sm pointer-events-auto transition-all duration-300">
      <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-xl ${bgStyles[toastMessage.type] || bgStyles.info}`}>
        <div className="flex items-center gap-2.5">
          {icons[toastMessage.type] || icons.info}
          <span className="text-xs font-bold leading-snug">{toastMessage.message}</span>
        </div>
        {clearToast && (
          <button
            onClick={clearToast}
            className="p-1 rounded-lg hover:bg-black/5 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
