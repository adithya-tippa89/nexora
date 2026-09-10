import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useAuth();
  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  };

  const bgStyles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
    info: "border-blue-200 bg-blue-50 text-blue-900"
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bgStyles[toastMessage.type] || bgStyles.info} transition-all`}>
        {icons[toastMessage.type] || icons.info}
        <span className="text-sm font-medium">{toastMessage.message}</span>
      </div>
    </div>
  );
};
