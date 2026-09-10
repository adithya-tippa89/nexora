import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RoleSwitcher } from './RoleSwitcher';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, 
  LayoutDashboard, 
  BarChart3, 
  BookOpen, 
  MapPin, 
  Target, 
  Menu, 
  X, 
  Sparkles, 
  LogOut,
  Layers
} from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const { currentUser, logoutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Skill Intelligence', path: '/skills', icon: BarChart3 },
    { name: 'Skill Gap Engine', path: '/skill-gap', icon: Target, badge: 'Core' },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'District Insights', path: '/districts', icon: MapPin },
    { name: 'Career Guidance', path: '/career-guidance', icon: Compass }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Government Info Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-8 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">Government of Maharashtra</span>
          <span className="text-slate-500">|</span>
          <span className="hidden md:inline">Department of Skill Development, Employment & Entrepreneurship</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline font-mono text-emerald-400">SIH 2026 Innovation Edition</span>
          <Link to="/admin" className="text-slate-400 hover:text-white transition">Admin Settings</Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Skill<span className="text-blue-600">Sync</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                  Maharashtra
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 hidden sm:block tracking-tight">
                Aligning Skills with Industry
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 relative ${
                    active
                      ? 'text-blue-700 bg-blue-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-600 text-white shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

            {/* Right Action Hub */}
            <div className="flex items-center gap-2 sm:gap-3">
              <RoleSwitcher />

              {currentUser ? (
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                  <Link
                    to="/dashboard"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/login"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                    title="Sign In with Credentials"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={logoutUser}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition"
                  >
                    Get Started
                  </Link>
                </div>
              )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4">
          <div className="mb-3 pb-2 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400">ACTIVE ROLE</p>
            <p className="text-xs font-bold text-slate-800">{currentUser?.name} ({currentUser?.roleTitle})</p>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                isActive(link.path)
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 rounded-lg bg-blue-600 text-white text-xs font-bold"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
