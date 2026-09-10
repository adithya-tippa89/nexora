import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, demoProfiles } from '../context/AuthContext';
import { ShieldCheck, GraduationCap, Building2, User, ArrowRight, Lock, Mail, AlertCircle, Key, CheckCircle2, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithCredentials, showToast } = useAuth();
  const [email, setEmail] = useState('rohan.shinde@student.ac.in');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const roleAccounts = [
    {
      key: 'student',
      title: 'Candidate / Student',
      name: 'Rohan Shinde',
      email: 'rohan.shinde@student.ac.in',
      org: 'B.Tech CS, Pune',
      icon: <User className="w-4 h-4 text-amber-500" />,
      color: 'hover:border-amber-400 hover:bg-amber-50/50',
      activeBorder: 'border-amber-500 bg-amber-50/60'
    },
    {
      key: 'admin',
      title: 'Govt State Admin',
      name: 'Dr. Rajeshwar Patil',
      email: 'admin@maharashtra.gov.in',
      org: 'DVET Maharashtra Lead',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
      color: 'hover:border-purple-400 hover:bg-purple-50/50',
      activeBorder: 'border-purple-500 bg-purple-50/60'
    },
    {
      key: 'trainer',
      title: 'Training Faculty / ITI',
      name: 'Prof. Sunita Deshmukh',
      email: 'institute@coep.ac.in',
      org: 'Polytechnic & Skill Hub',
      icon: <GraduationCap className="w-4 h-4 text-blue-600" />,
      color: 'hover:border-blue-400 hover:bg-blue-50/50',
      activeBorder: 'border-blue-500 bg-blue-50/60'
    },
    {
      key: 'employer',
      title: 'Industry Hiring Partner',
      name: 'Anand Kulkarni',
      email: 'recruitment@tatamotors.com',
      org: 'Tata Motors Innovation Labs',
      icon: <Building2 className="w-4 h-4 text-emerald-600" />,
      color: 'hover:border-emerald-400 hover:bg-emerald-50/50',
      activeBorder: 'border-emerald-500 bg-emerald-50/60'
    }
  ];

  const handleSelectRole = (acc) => {
    setSelectedRole(acc.key);
    setEmail(acc.email);
    setPassword('password123');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await loginWithCredentials(email, password);
      showToast(`Welcome! Signed in successfully.`, "success");
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your credentials.");
      showToast(err.message || "Invalid email or password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/25 ring-1 ring-white/30">
            <svg 
              className="w-6 h-6 text-white" 
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
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-xs"></div>
          </div>
          
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to SkillSync Maharashtra
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Role-Based Access Control & Secure JWT Authentication
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Authentication Failed</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Official Evaluation & Demo Role Selection */}
        <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200/90">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Select Account to Authenticate
            </p>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-100/70 px-2 py-0.5 rounded-full">
              SIH 2026 Evaluation
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {roleAccounts.map((acc) => {
              const isSelected = selectedRole === acc.key;
              return (
                <button
                  key={acc.key}
                  type="button"
                  onClick={() => handleSelectRole(acc)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                    isSelected ? acc.activeBorder + ' shadow-xs ring-1 ring-blue-400/40' : 'bg-white border-slate-200 ' + acc.color
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {acc.icon}
                    <span className="text-xs font-bold text-slate-900 truncate block">
                      {acc.title}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-700 truncate">{acc.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{acc.org}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Credentials Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Registered Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@maharashtra.gov.in"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">Account Password</label>
              <span className="text-[10px] text-slate-400">Default: password123</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Verifying Credentials & Issuing JWT...
              </span>
            ) : (
              <>
                <span>Sign In Securely as {roleAccounts.find(r => r.key === selectedRole)?.title || 'User'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Secure Authentication powered by{' '}
          <span className="font-bold text-slate-700">FastAPI & HS256 JWT RBAC</span>
        </div>
      </div>
    </div>
  );
};
