import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, GraduationCap, Building2, User, ChevronDown, Check, Sparkles } from 'lucide-react';

export const RoleSwitcher = () => {
  const { currentUser, switchRole, demoProfiles } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const roleConfigs = {
    admin: {
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
      avatarBg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      label: 'State Admin (DVET)'
    },
    trainer: {
      icon: <GraduationCap className="w-4 h-4 text-blue-600" />,
      avatarBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      label: 'Training Institute'
    },
    institution: {
      icon: <GraduationCap className="w-4 h-4 text-blue-600" />,
      avatarBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      label: 'Training Institute'
    },
    employer: {
      icon: <Building2 className="w-4 h-4 text-emerald-600" />,
      avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      label: 'Industry Partner'
    },
    student: {
      icon: <User className="w-4 h-4 text-amber-600" />,
      avatarBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      label: 'Candidate / Student'
    }
  };

  const visibleRoles = ['admin', 'trainer', 'employer', 'student'];
  const currentCfg = roleConfigs[currentUser?.role] || roleConfigs.student;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 transition-all shadow-xs group cursor-pointer"
        title="Quick Role Switcher for Evaluation"
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          {currentCfg.icon}
          <span className="font-bold text-slate-700">Role:</span>
          <span className="text-slate-900 font-extrabold">{currentUser.roleTitle || currentCfg.label}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white/98 backdrop-blur-xl shadow-2xl border border-slate-200/90 z-50 p-2.5 animate-in fade-in slide-in-from-top-2">
            <div className="px-3 py-2 border-b border-slate-100 mb-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Evaluation Perspective</p>
                <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Instant Switch
                </span>
              </div>
              <p className="text-xs text-slate-500">Test role-specific permissions and dashboards</p>
            </div>
            <div className="space-y-1">
              {visibleRoles.map(key => {
                const p = demoProfiles[key];
                if (!p) return null;
                const isActive = currentUser.role === key || (key === 'trainer' && currentUser.role === 'institution');
                const cfg = roleConfigs[key];

                return (
                  <button
                    key={key}
                    onClick={() => {
                      switchRole(key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition cursor-pointer border ${
                      isActive
                        ? 'bg-blue-50/90 border-blue-200/80 shadow-xs'
                        : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{cfg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold truncate ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                          {p.name}
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </div>
                      <p className="text-[11px] font-semibold text-slate-600">{p.roleTitle}</p>
                      <p className="text-[10px] text-slate-400 truncate">{p.organization}</p>
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
