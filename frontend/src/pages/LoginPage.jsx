import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, demoProfiles } from '../context/AuthContext';
import { ShieldCheck, GraduationCap, Building2, User, ArrowRight, Lock, Mail, AlertCircle, Key } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { switchRole, loginWithCredentials, showToast } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      await loginWithCredentials(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your credentials.");
      showToast(err.message || "Invalid email or password", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRole = async (roleKey) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await switchRole(roleKey);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage("Could not sign in with demo profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("password123");
    setErrorMessage('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md shadow-blue-500/30">
            S
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to SkillSync Maharashtra
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Labour Market Intelligence & RBAC Authentication (FastAPI & JWT)
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

        {/* Instant Evaluation Quick Switcher */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              ⚡ One-Click Instant Evaluation Login
            </p>
            <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
              <Key className="w-3 h-3" /> Pwd: password123
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickRole('admin')}
              className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition text-xs font-semibold text-slate-800"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <div className="font-bold">Govt / Admin</div>
                <div className="text-[10px] text-slate-500">DVET State Lead</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('trainer')}
              className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition text-xs font-semibold text-slate-800"
            >
              <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="font-bold">Trainer / Faculty</div>
                <div className="text-[10px] text-slate-500">Polytechnic Dean</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('employer')}
              className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-left transition text-xs font-semibold text-slate-800"
            >
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold">Employer</div>
                <div className="text-[10px] text-slate-500">Tata Motors VP</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('student')}
              className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition text-xs font-semibold text-slate-800"
            >
              <User className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <div className="font-bold">Candidate</div>
                <div className="text-[10px] text-slate-500">Technical Student</div>
              </div>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Or enter credentials</span></div>
        </div>

        {/* Credentials Form */}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-700">Email Address</label>
              <button
                type="button"
                onClick={() => handleFillDemo('admin@maharashtra.gov.in')}
                className="text-[10px] text-blue-600 hover:underline font-semibold"
              >
                Autofill Admin
              </button>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@maharashtra.gov.in"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? "Authenticating via FastAPI..." : "Sign In with Credentials"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register for Maharashtra Skill Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
