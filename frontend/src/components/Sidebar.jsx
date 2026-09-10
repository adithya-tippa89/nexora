import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Briefcase, 
  Target, 
  BookOpen, 
  AlertOctagon, 
  MapPin, 
  Users, 
  Cpu, 
  CheckCircle2, 
  Compass, 
  Flame, 
  Lightbulb, 
  FileSpreadsheet, 
  Settings,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { currentUser } = useAuth();

  const navSections = [
    {
      title: "Core Platform",
      items: [
        { name: "Main Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { name: "Skill Gap Analysis", path: "/skill-gap", icon: Target, featured: true }
      ]
    },
    {
      title: "Market Intelligence",
      items: [
        { name: "Skill Demand Analytics", path: "/skills", icon: BarChart3 },
        { name: "Job Role Analysis", path: "/job-roles", icon: Briefcase },
        { name: "Collected Job Postings", path: "/jobs", icon: Briefcase },
        { name: "Emerging Tech Tracker", path: "/emerging-tech", icon: Flame }
      ]
    },
    {
      title: "Curriculum & Quality",
      items: [
        { name: "Course Intelligence", path: "/courses", icon: BookOpen },
        { name: "Obsolete Course Alerts", path: "/obsolete-courses", icon: AlertOctagon, alertCount: 2 },
        { name: "Recommendation Center", path: "/recommendations", icon: Lightbulb }
      ]
    },
    {
      title: "Institutional Capacity",
      items: [
        { name: "District Insights", path: "/districts", icon: MapPin },
        { name: "District Training Plan", path: "/district-plans", icon: FileSpreadsheet },
        { name: "Trainer Upskilling", path: "/trainer-upskilling", icon: Users },
        { name: "Equipment Planning", path: "/equipment-planning", icon: Cpu },
        { name: "Employer Validation", path: "/employer-validation", icon: CheckCircle2 }
      ]
    },
    {
      title: "Student Success",
      items: [
        { name: "Career Guidance & Roadmap", path: "/career-guidance", icon: Compass }
      ]
    },
    {
      title: "Administration",
      items: [
        { name: "Admin Settings", path: "/admin", icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
      {/* Role Pill Card */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Current Persona</span>
        </div>
        <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
        <p className="text-[11px] text-slate-400 truncate">{currentUser?.roleTitle}</p>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </h4>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? item.featured
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-800 text-white border-l-4 border-blue-500 pl-2'
                        : item.featured
                        ? 'text-blue-300 hover:bg-blue-950/40 hover:text-blue-100 font-bold'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${item.featured ? 'text-blue-400' : ''}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.featured && (
                    <span className="text-[9px] bg-blue-500 text-white font-extrabold px-1.5 py-0.5 rounded uppercase">
                      Core
                    </span>
                  )}
                  {item.alertCount && (
                    <span className="text-[10px] bg-rose-500/80 text-white font-bold px-1.5 py-0.2 rounded-full">
                      {item.alertCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* System Footer Tag */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>SkillSync v1.0.0</span>
        <span className="text-emerald-400 font-medium">● Online</span>
      </div>
    </aside>
  );
};
