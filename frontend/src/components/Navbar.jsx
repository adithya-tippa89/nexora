import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  ShieldCheck,
  GraduationCap,
  Building2,
  User,
  ChevronDown,
  Check,
  Settings,
  ArrowRight,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logoutUser, switchRole, demoProfiles } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Skill Intelligence', path: '/skills', icon: BarChart3 },
    { name: 'Skill Gap Engine', path: '/skill-gap', icon: Target, isCore: true },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'District Insights', path: '/districts', icon: MapPin },
    { name: 'Career Guidance', path: '/career-guidance', icon: Compass }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getRoleConfig = (role) => {
    switch (role) {
      case 'admin':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />,
          avatarBg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/80',
          dot: 'bg-purple-500',
          label: 'State Admin (DVET)'
        };
      case 'trainer':
      case 'institution':
        return {
          icon: <GraduationCap className="w-3.5 h-3.5 text-blue-600" />,
          avatarBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
          dot: 'bg-blue-500',
          label: 'Training Institute'
        };
      case 'employer':
        return {
          icon: <Building2 className="w-3.5 h-3.5 text-emerald-600" />,
          avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
          label: 'Industry Partner'
        };
      case 'student':
      default:
        return {
          icon: <User className="w-3.5 h-3.5 text-amber-600" />,
          avatarBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
          label: 'Candidate / Student'
        };
    }
  };

  const userRoleConfig = getRoleConfig(currentUser?.role || 'student');
  const visibleRoles = ['admin', 'trainer', 'employer', 'student'];

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s+/i, '').trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)]">
      {/* Tricolor Micro-Line Accent (National & Maharashtra Gov Pride) */}
      <div className="h-[2px] w-full bg-gradient-to-r from-amber-500 via-orange-400 via-white/80 to-emerald-500 opacity-90"></div>

      {/* Top Government Official Ribbon */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0B1528] to-slate-950 text-slate-300 text-[11px] py-1 px-4 sm:px-8 border-b border-slate-800/80 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          {/* Official Emblem Icon / Seal Motif */}
          <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
          </div>
          <div className="flex items-center gap-1.5 tracking-tight text-slate-200 font-medium text-[11px]">
            <span className="font-bold text-white tracking-normal">महाराष्ट्र शासन</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Government of Maharashtra</span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="hidden md:inline text-slate-400 font-normal">
              Department of Skill Development, Employment & Entrepreneurship
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Live Innovation Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>SIH 2026 Innovation Platform</span>
          </div>

          <Link 
            to="/admin" 
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors duration-150"
            title="Groq AI Engine & System Configuration"
          >
            <Settings className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Admin Settings</span>
          </Link>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            {/* High-Tech Geometric Crest Emblem */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 ring-1 ring-white/30 group-hover:scale-105 transition-all duration-200">
              <svg 
                className="w-5 h-5 text-white drop-shadow-sm" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow-xs"></div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                  Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sync</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/80 px-2 py-0.5 rounded-full shadow-2xs">
                  Maharashtra
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 tracking-tight leading-none mt-0.5 hidden sm:block">
                Labour Market Intelligence & Career Alignment
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150 flex items-center gap-1.5 relative ${
                    active
                      ? 'text-blue-700 bg-blue-50/90 font-bold border border-blue-200/60 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.isCore && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-2xs">
                      <Sparkles className="w-2.5 h-2.5" />
                      AI Core
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Condensed Nav for Mid-Sized Laptops (lg but not xl) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1">
            {[
              { name: 'Dashboard', path: '/dashboard' },
              { name: 'Skills', path: '/skills' },
              { name: 'Skill Gap', path: '/skill-gap', isCore: true },
              { name: 'Courses', path: '/courses' },
              { name: 'Districts', path: '/districts' },
              { name: 'Careers', path: '/career-guidance' }
            ].map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    active
                      ? 'text-blue-700 bg-blue-50/90 font-bold border border-blue-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.isCore && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Hub: Unified Persona & Profile Card */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                {/* Executive User Pill Button */}
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/90 rounded-xl transition-all duration-200 shadow-xs group cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                  aria-expanded={profileDropdownOpen}
                  title="Evaluation Persona & Account Controls"
                >
                  {/* Persona Avatar */}
                  <div className={`w-8 h-8 rounded-lg ${userRoleConfig.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0 ring-1 ring-white/50`}>
                    {getInitials(currentUser.name)}
                  </div>

                  {/* Persona Info */}
                  <div className="text-left hidden sm:block max-w-[130px] md:max-w-[160px]">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900 truncate block leading-tight">
                        {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1] ? currentUser.name.split(' ')[1][0] + '.' : ''}
                      </span>
                      <span className={`w-1.5 h-1.5 rounded-full ${userRoleConfig.dot} shrink-0`}></span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 truncate block leading-none mt-0.5">
                      {currentUser.roleTitle || userRoleConfig.label}
                    </span>
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Floating Luxury Glass Profile & Persona Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-3 duration-150">
                    
                    {/* Active Profile Header */}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/60 mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl ${userRoleConfig.avatarBg} text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-500/15 shrink-0`}>
                          {getInitials(currentUser.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</h4>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full shrink-0">
                              Active
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                            <span className="truncate">{currentUser.organization || 'Maharashtra Skill Ecosystem'}</span>
                          </div>
                          {currentUser.district && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{currentUser.district}, Maharashtra</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Persona Switcher (For Evaluation & Demo) */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between px-1 mb-2">
                        <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                          Switch Evaluation Persona
                        </span>
                        <span className="text-[10px] text-blue-600 font-medium">Instant RBAC Preview</span>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
                        {visibleRoles.map(key => {
                          const p = demoProfiles[key];
                          if (!p) return null;
                          const isCurrent = currentUser.role === key || (key === 'trainer' && currentUser.role === 'institution');
                          const cfg = getRoleConfig(key);

                          return (
                            <button
                              key={key}
                              onClick={() => {
                                switchRole(key);
                                setProfileDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2 rounded-xl transition-all duration-150 flex items-center gap-2.5 border cursor-pointer ${
                                isCurrent
                                  ? 'bg-blue-50/90 border-blue-300/80 shadow-xs'
                                  : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg ${cfg.avatarBg} text-white flex items-center justify-center text-xs shrink-0 shadow-2xs`}>
                                {cfg.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-bold truncate ${isCurrent ? 'text-blue-900' : 'text-slate-800'}`}>
                                    {p.name}
                                  </span>
                                  {isCurrent ? (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 shrink-0">
                                      <Check className="w-3 h-3 stroke-[2.5]" />
                                      Current
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-medium group-hover:text-slate-600">
                                      Switch
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] font-semibold text-slate-600 truncate">
                                    {p.roleTitle}
                                  </span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-[10px] text-slate-400 truncate">
                                    {p.district}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Access Actions */}
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                      >
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>Open Role Dashboard</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                          <span>Groq AI & Model Settings</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-medium">Online</span>
                      </Link>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logoutUser();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Public Visitor Auth Controls */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/25 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 shadow-xl">
          {currentUser && (
            <div className="mb-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${userRoleConfig.avatarBg} text-white font-bold text-xs flex items-center justify-center`}>
                  {getInitials(currentUser.name)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.roleTitle}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logoutUser();
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    active
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{link.name}</span>
                    {link.isCore && (
                      <span className="text-[10px] bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-2 py-0.5 rounded-full">
                        AI Core
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20"
            >
              Open Active Dashboard
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
