import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const demoProfiles = {
  admin: {
    id: "usr-admin-1",
    name: "Dr. Rajeshwar Patil",
    email: "admin@maharashtra.gov.in",
    role: "admin",
    roleTitle: "Government / State Admin",
    district: "Mumbai Suburban",
    organization: "Directorate of Vocational Education and Training (DVET)",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200"
  },
  institution: {
    id: "usr-inst-1",
    name: "Prof. Sunita Deshmukh",
    email: "institute@coep.ac.in",
    role: "institution",
    roleTitle: "Training Institution",
    district: "Pune",
    organization: "Government Polytechnic Pune & Skill Hub",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200"
  },
  employer: {
    id: "usr-emp-1",
    name: "Anand Kulkarni",
    email: "recruitment@tatamotors.com",
    role: "employer",
    roleTitle: "Employer / Industry Partner",
    district: "Pune",
    organization: "Tata Motors Innovation Labs",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
  },
  student: {
    id: "usr-std-1",
    name: "Rohan Shinde",
    email: "rohan.shinde@student.ac.in",
    role: "student",
    roleTitle: "Candidate / Student",
    district: "Pune",
    organization: "B.Tech Computer Science (Final Year)",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200"
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('skillsync_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return demoProfiles.admin; // default to admin for full visibility
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const switchRole = (roleKey) => {
    if (demoProfiles[roleKey]) {
      const newUser = demoProfiles[roleKey];
      setCurrentUser(newUser);
      localStorage.setItem('skillsync_user', JSON.stringify(newUser));
      showToast(`Switched view to ${newUser.roleTitle}`, 'info');
    }
  };

  const loginUser = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('skillsync_user', JSON.stringify(userData));
    showToast(`Welcome back, ${userData.name}!`);
  };

  const logoutUser = () => {
    setCurrentUser(demoProfiles.student);
    localStorage.removeItem('skillsync_user');
    showToast("Switched to public student view", 'info');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      switchRole,
      loginUser,
      logoutUser,
      showToast,
      toastMessage,
      demoProfiles
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
