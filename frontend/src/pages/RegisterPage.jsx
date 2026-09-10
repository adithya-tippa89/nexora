import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, GraduationCap, Building2, User, AlertCircle, Info } from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser, showToast } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    district: 'Pune',
    organization: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const districtsList = [
    "Pune", "Mumbai Suburban", "Mumbai City", "Nagpur", "Nashik", 
    "Chhatrapati Sambhajinagar", "Thane", "Kolhapur", "Solapur", 
    "Amravati", "Nanded", "Satara", "Sangli", "Jalgaon", "Ahmednagar"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        district: formData.district,
        organization: formData.organization.trim() || (formData.role === 'student' ? 'Technical Student' : 'Maharashtra Organization'),
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || "Registration failed. Please check your inputs.");
      showToast(err.message || "Registration failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-md">
            S
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight">
            Register for SkillSync Maharashtra
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Join the integrated state skill development and curriculum alignment network
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Registration Error</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Role selector buttons - 3 Public Roles, Admin prohibited */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Select Your Role</label>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <Info className="w-3 h-3 text-blue-500" /> Admin accounts provisioned internally
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'student', title: 'Student', subtitle: 'Candidate', icon: User },
                { id: 'trainer', title: 'Trainer', subtitle: 'Faculty / Institute', icon: GraduationCap },
                { id: 'employer', title: 'Employer', subtitle: 'Industry Partner', icon: Building2 }
              ].map(r => {
                const Icon = r.icon;
                const isSelected = formData.role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r.id })}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 text-xs font-bold cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{r.title}</span>
                    <span className="text-[10px] font-normal text-slate-400">{r.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Anand Shinde"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@domain.com"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District in Maharashtra</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {districtsList.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {formData.role === 'student' ? 'College / University' : formData.role === 'trainer' ? 'Institution / Polytechnic Name' : 'Company Name'}
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder={formData.role === 'student' ? 'e.g. Pune Institute of Computer Technology' : formData.role === 'trainer' ? 'e.g. Government Polytechnic Pune' : 'e.g. Tata Motors / Mahindra'}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create strong password (min 6 characters)"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? "Registering via FastAPI..." : "Complete Registration"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
