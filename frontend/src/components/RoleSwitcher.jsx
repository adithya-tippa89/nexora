import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, GraduationCap, Building2, User, ChevronDown, Check } from 'lucide-react';

export const RoleSwitcher = () => {
  const { currentUser, switchRole, demoProfiles } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roleIcons = {
    admin: <ShieldCheck className="w-4 h-4 text-purple-600" />,
    institution: <GraduationCap className="w-4 h-4 text-blue-600" />,
    employer: <Building2 className="w-4 h-4 text-emerald-600" />,
    student: <User className="w-4 h-4 text-amber-600" />
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 transition shadow-sm"
        title="Quick Role Switcher for Evaluation"
      >
        <span className="flex items-center gap-1.5">
          {roleIcons[currentUser.role]}
          <span className="hidden sm:inline font-bold">Role:</span>
          <span>{currentUser.roleTitle || currentUser.role}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-2xl border border-slate-200 z-50 p-2 animate-in fade-in slide-in-from-top-2">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Switch Active Perspective</p>
              <p className="text-xs text-slate-500">Test role-specific permissions and dashboards</p>
            </div>
            <div className="py-1 space-y-1">
              {Object.keys(demoProfiles).map(key => {
                const p = demoProfiles[key];
                const isActive = currentUser.role === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      switchRole(key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition ${
                      isActive ? 'bg-blue-50/80 border border-blue-200/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">{roleIcons[key]}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                          {p.roleTitle}
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{p.organization}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
