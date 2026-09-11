import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const demoProfiles = {
  admin: {
    id: 1,
    name: "Dr. Rajeshwar Patil",
    email: "admin@maharashtra.gov.in",
    role: "admin",
    roleTitle: "Government / State Admin",
    district: "Mumbai Suburban",
    organization: "Directorate of Vocational Education and Training (DVET)",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200"
  },
  trainer: {
    id: 2,
    name: "Prof. Sunita Deshmukh",
    email: "institute@coep.ac.in",
    role: "trainer",
    roleTitle: "Training Institution / Faculty",
    district: "Pune",
    organization: "Government Polytechnic Pune & Skill Hub",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200"
  },
  institution: {
    id: 2,
    name: "Prof. Sunita Deshmukh",
    email: "institute@coep.ac.in",
    role: "trainer",
    roleTitle: "Training Institution / Faculty",
    district: "Pune",
    organization: "Government Polytechnic Pune & Skill Hub",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200"
  },
  employer: {
    id: 3,
    name: "Anand Kulkarni",
    email: "recruitment@tatamotors.com",
    role: "employer",
    roleTitle: "Employer / Industry Partner",
    district: "Pune",
    organization: "Tata Motors Innovation Labs",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  student: {
    id: 4,
    name: "Rohan Shinde",
    email: "rohan.shinde@student.ac.in",
    role: "student",
    roleTitle: "Candidate / Student",
    district: "Pune",
    organization: "B.Tech Computer Science (Final Year)",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200"
  }
};

const roleMeta = {
  admin: {
    roleTitle: "Government / State Admin",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200"
  },
  trainer: {
    roleTitle: "Training Institution / Faculty",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200"
  },
  institution: {
    roleTitle: "Training Institution / Faculty",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200"
  },
  employer: {
    roleTitle: "Employer / Industry Partner",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  student: {
    roleTitle: "Candidate / Student",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200"
  }
};

const enrichUser = (user) => {
  if (!user) return null;
  const meta = roleMeta[user.role] || {};
  return {
    ...user,
    roleTitle: user.roleTitle || meta.roleTitle || (user.role ? user.role.toUpperCase() : "User"),
    badgeColor: user.badgeColor || meta.badgeColor || "bg-slate-100 text-slate-800 border-slate-200"
  };
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('skillsync_user');
    if (saved) {
      try { return enrichUser(JSON.parse(saved)); } catch (e) {}
    }
    return demoProfiles.admin; // default to admin for full visibility
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  // On mount, verify existing JWT session with FastAPI /users/me
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('skillsync_token');
      if (token) {
        try {
          const user = await api.getCurrentUser();
          const enriched = enrichUser(user);
          setCurrentUser(enriched);
          localStorage.setItem('skillsync_user', JSON.stringify(enriched));
        } catch (err) {
          console.warn("Stored JWT session invalid or expired:", err.message);
          localStorage.removeItem('skillsync_token');
        }
      }
      setAuthLoading(false);
    };
    verifySession();
  }, []);

  const switchRole = async (roleKey) => {
    const target = demoProfiles[roleKey];
    if (target) {
      try {
        // Attempt login with seeded demo account to get real JWT
        const res = await api.login({ email: target.email, password: "password123" });
        if (res?.access_token) {
          localStorage.setItem('skillsync_token', res.access_token);
          const enriched = enrichUser(res.user);
          setCurrentUser(enriched);
          localStorage.setItem('skillsync_user', JSON.stringify(enriched));
          showToast(`Switched view to ${enriched.roleTitle}`, 'info');
          return;
        }
      } catch (err) {
        // Fallback to local profile switch
      }
      const enriched = enrichUser(target);
      setCurrentUser(enriched);
      localStorage.setItem('skillsync_user', JSON.stringify(enriched));
      showToast(`Switched view to ${enriched.roleTitle}`, 'info');
    }
  };

  const loginUser = (userData, token = null) => {
    const enriched = enrichUser(userData);
    setCurrentUser(enriched);
    localStorage.setItem('skillsync_user', JSON.stringify(enriched));
    if (token) {
      localStorage.setItem('skillsync_token', token);
    }
    showToast(`Welcome back, ${enriched.name}!`);
  };

  const loginWithCredentials = async (email, password) => {
    const res = await api.login({ email, password });
    if (res?.access_token) {
      localStorage.setItem('skillsync_token', res.access_token);
      const user = enrichUser(res.user);
      setCurrentUser(user);
      localStorage.setItem('skillsync_user', JSON.stringify(user));
      showToast(`Welcome back, ${user.name}!`);
      return user;
    }
    throw new Error("Login failed: Access token missing.");
  };

  const registerUser = async (formData) => {
    const res = await api.register(formData);
    // After registration, log user in immediately
    try {
      const loginRes = await api.login({ email: formData.email, password: formData.password });
      if (loginRes?.access_token) {
        localStorage.setItem('skillsync_token', loginRes.access_token);
        const user = enrichUser(loginRes.user);
        setCurrentUser(user);
        localStorage.setItem('skillsync_user', JSON.stringify(user));
        showToast(`Registration completed! Welcome, ${user.name}!`);
        return user;
      }
    } catch (e) {
      // Return user if auto-login encountered issue
    }
    const user = enrichUser(res);
    setCurrentUser(user);
    showToast(`Registration completed as ${user.role}!`);
    return user;
  };

  const logoutUser = () => {
    setCurrentUser(demoProfiles.student);
    localStorage.removeItem('skillsync_user');
    localStorage.removeItem('skillsync_token');
    showToast("Signed out successfully", 'info');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      authLoading,
      switchRole,
      loginUser,
      loginWithCredentials,
      registerUser,
      logoutUser,
      showToast,
      clearToast,
      toastMessage,
      demoProfiles
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
