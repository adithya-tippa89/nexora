import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Building2, BookOpen, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base">
                S
              </div>
              <span className="text-white font-extrabold text-base tracking-tight">
                SkillSync <span className="text-blue-400">Maharashtra</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Statewide Labour Market Intelligence & Curriculum Alignment Platform.
              Bridging industry requirements and technical training across 36 districts of Maharashtra.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              Department of Skill Development, Employment and Entrepreneurship, Govt. of Maharashtra
            </div>
          </div>

          {/* Quick Modules */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">Core Modules</h4>
            <ul className="space-y-2">
              <li><Link to="/skill-gap" className="hover:text-white transition">Skill Gap Analysis Engine</Link></li>
              <li><Link to="/skills" className="hover:text-white transition">Skill Demand Analytics</Link></li>
              <li><Link to="/job-roles" className="hover:text-white transition">Job Role Analysis</Link></li>
              <li><Link to="/courses" className="hover:text-white transition">Course Intelligence</Link></li>
              <li><Link to="/obsolete-courses" className="hover:text-white transition">Obsolete Course Alerts</Link></li>
            </ul>
          </div>

          {/* Institutional Planning */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">Capacity & Governance</h4>
            <ul className="space-y-2">
              <li><Link to="/districts" className="hover:text-white transition">Maharashtra District Insights</Link></li>
              <li><Link to="/district-plans" className="hover:text-white transition">District Training Plans (DSDP)</Link></li>
              <li><Link to="/trainer-upskilling" className="hover:text-white transition">Trainer Upskilling (FDP)</Link></li>
              <li><Link to="/equipment-planning" className="hover:text-white transition">Lab Equipment Planning</Link></li>
              <li><Link to="/employer-validation" className="hover:text-white transition">Employer Skill Validation</Link></li>
            </ul>
          </div>

          {/* Student & Policy */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">Student & Emerging Tech</h4>
            <ul className="space-y-2">
              <li><Link to="/career-guidance" className="hover:text-white transition">Personalized Career Guidance</Link></li>
              <li><Link to="/emerging-tech" className="hover:text-white transition">Emerging Tech Tracker (AI & EV)</Link></li>
              <li><Link to="/recommendations" className="hover:text-white transition">AI Recommendation Center</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Platform Settings & Data Sync</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} SkillSync Maharashtra. Built for Smart India Hackathon 2026.
          </div>
          <div className="flex items-center gap-4">
            <span>“Right Skills. Right Training. Right Jobs.”</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Government of Maharashtra Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
