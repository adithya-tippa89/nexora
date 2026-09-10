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
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Building2,
  User,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'student';

  const getSectionsForRole = (userRole) => {
    switch (userRole) {
      case 'student':
        return [
          {
            title: "Career Pathway",
            items: [
              { name: "My Career Dashboard", path: "/dashboard", icon: LayoutDashboard },
              { name: "AI Career Roadmap", path: "/career-guidance", icon: Compass, featured: true, badge: "AI Guide" }
            ]
          },
          {
            title: "Market & Jobs",
            items: [
              { name: "In-Demand Skills", path: "/skills", icon: BarChart3 },
              { name: "Job Role Profiles", path: "/job-roles", icon: Briefcase },
              { name: "Active Job Openings", path: "/jobs", icon: Briefcase }
            ]
          },
          {
            title: "Upskilling",
            items: [
              { name: "Available Courses", path: "/courses", icon: BookOpen }
            ]
          }
        ];

      case 'trainer':
      case 'institution':
        return [
          {
            title: "Institutional Core",
            items: [
              { name: "Faculty Dashboard", path: "/dashboard", icon: LayoutDashboard },
              { name: "Skill Gap Engine", path: "/skill-gap", icon: Target, featured: true, badge: "AI Core" }
            ]
          },
          {
            title: "Curriculum Modernization",
            items: [
              { name: "Course Intelligence", path: "/courses", icon: BookOpen },
              { name: "Obsolete Course Alerts", path: "/obsolete-courses", icon: AlertOctagon, alertCount: 2 },
              { name: "AI Recommendations", path: "/recommendations", icon: Lightbulb }
            ]
          },
          {
            title: "Capacity Building",
            items: [
              { name: "Lab Equipment Planning", path: "/equipment-planning", icon: Cpu },
              { name: "Faculty Upskilling", path: "/trainer-upskilling", icon: Users },
              { name: "Employer Validations", path: "/employer-validation", icon: CheckCircle2 }
            ]
          }
        ];

      case 'employer':
        return [
          {
            title: "Industry Portal",
            items: [
              { name: "Employer Dashboard", path: "/dashboard", icon: LayoutDashboard },
              { name: "Post & Manage Jobs", path: "/jobs", icon: Briefcase, featured: true, badge: "Hiring" }
            ]
          },
          {
            title: "Talent & Market Intelligence",
            items: [
              { name: "Real-Time Skill Demand", path: "/skills", icon: BarChart3 },
              { name: "Job Role Specifications", path: "/job-roles", icon: Briefcase },
              { name: "Emerging Tech Radar", path: "/emerging-tech", icon: Flame }
            ]
          },
          {
            title: "Academic Alignment",
            items: [
              { name: "Curriculum Skill Validation", path: "/employer-validation", icon: CheckCircle2 },
              { name: "District Talent Pools", path: "/districts", icon: MapPin }
            ]
          }
        ];

      case 'admin':
      default:
        return [
          {
            title: "State Skill Governance",
            items: [
              { name: "State Lead Dashboard", path: "/dashboard", icon: LayoutDashboard },
              { name: "District Plans (DSDP)", path: "/district-plans", icon: FileSpreadsheet, featured: true, badge: "DSDP" },
              { name: "36 District Insights", path: "/districts", icon: MapPin }
            ]
          },
          {
            title: "Market & AI Diagnostics",
            items: [
              { name: "Skill Gap Analysis Engine", path: "/skill-gap", icon: Target },
              { name: "Skill Demand Analytics", path: "/skills", icon: BarChart3 },
              { name: "Job Role Analysis", path: "/job-roles", icon: Briefcase },
              { name: "Collected Job Postings", path: "/jobs", icon: Briefcase },
              { name: "Emerging Tech Tracker", path: "/emerging-tech", icon: Flame }
            ]
          },
          {
            title: "Curriculum Oversight",
            items: [
              { name: "Course Intelligence", path: "/courses", icon: BookOpen },
              { name: "Obsolete Course Decommission", path: "/obsolete-courses", icon: AlertOctagon, alertCount: 2 },
              { name: "Recommendation Center", path: "/recommendations", icon: Lightbulb },
              { name: "Equipment Planning Approvals", path: "/equipment-planning", icon: Cpu }
            ]
          },
          {
            title: "System Administration",
            items: [
              { name: "Admin Settings & Groq AI", path: "/admin", icon: Settings }
            ]
          }
        ];
    }
  };

  const navSections = getSectionsForRole(role);

  const getRoleHeader = () => {
    switch (role) {
      case 'admin':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
          pill: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
          desc: 'DVET State Governance'
        };
      case 'trainer':
      case 'institution':
        return {
          icon: <GraduationCap className="w-4 h-4 text-blue-400" />,
          pill: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
          desc: 'Polytechnic & ITI Faculty'
        };
      case 'employer':
        return {
          icon: <Building2 className="w-4 h-4 text-emerald-400" />,
          pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
          desc: 'Industry Hiring Partner'
        };
      case 'student':
      default:
        return {
          icon: <User className="w-4 h-4 text-amber-400" />,
          pill: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
          desc: 'Candidate Career Portal'
        };
    }
  };

  const roleHeader = getRoleHeader();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col border-r border-slate-800 shrink-0 hidden md:flex">
      {/* Role Pill Card */}
      <div className="p-3.5 mx-3 my-3 rounded-xl bg-slate-800/90 border border-slate-700/60 shadow-xs">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${roleHeader.pill}`}>
            {roleHeader.icon}
            <span>{currentUser?.roleTitle || role}</span>
          </span>
        </div>
        <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
        <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser?.organization || roleHeader.desc}</p>
        {currentUser?.district && (
          <p className="text-[10px] text-slate-500 truncate mt-0.5">📍 {currentUser.district}</p>
        )}
      </div>

      {/* Role-Specific Navigation Groups */}
      <div className="flex-1 px-3 py-1 space-y-5 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h4 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              {section.title}
            </h4>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? item.featured
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-bold'
                          : 'bg-slate-800 text-white border-l-4 border-blue-500 pl-2 font-bold'
                        : item.featured
                        ? 'text-blue-300 hover:bg-blue-950/40 hover:text-blue-100 font-bold'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${item.featured ? 'text-blue-400' : ''}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-blue-500/30 text-blue-300 border border-blue-400/40 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                      {item.badge}
                    </span>
                  )}
                  {item.alertCount && (
                    <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full shadow-2xs">
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
      <div className="p-3.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between bg-slate-950/40">
        <span className="font-mono text-[10px]">SkillSync • RBAC Active</span>
        <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Secure Session
        </span>
      </div>
    </aside>
  );
};
