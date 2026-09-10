import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

// 18 Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { SkillDemandPage } from './pages/SkillDemandPage';
import { JobRoleAnalysisPage } from './pages/JobRoleAnalysisPage';
import { JobsPage } from './pages/JobsPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { CourseIntelligencePage } from './pages/CourseIntelligencePage';
import { ObsoleteCoursesPage } from './pages/ObsoleteCoursesPage';
import { DistrictInsightsPage } from './pages/DistrictInsightsPage';
import { TrainerUpskillingPage } from './pages/TrainerUpskillingPage';
import { EquipmentPlanningPage } from './pages/EquipmentPlanningPage';
import { EmployerValidationPage } from './pages/EmployerValidationPage';
import { CareerGuidancePage } from './pages/CareerGuidancePage';
import { EmergingTechPage } from './pages/EmergingTechPage';
import { RecommendationCenterPage } from './pages/RecommendationCenterPage';
import { DistrictTrainingPlanPage } from './pages/DistrictTrainingPlanPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { GroqAiAssistant } from './components/GroqAiAssistant';

const AppLayout = () => {
  const location = useLocation();
  // Pages that don't need internal sidebar
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <Toast />

      {isPublicPage ? (
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/skills" element={<SkillDemandPage />} />
              <Route path="/job-roles" element={<JobRoleAnalysisPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/skill-gap" element={<SkillGapPage />} />
              <Route path="/courses" element={<CourseIntelligencePage />} />
              <Route path="/obsolete-courses" element={<ObsoleteCoursesPage />} />
              <Route path="/districts" element={<DistrictInsightsPage />} />
              <Route path="/trainer-upskilling" element={<TrainerUpskillingPage />} />
              <Route path="/equipment-planning" element={<EquipmentPlanningPage />} />
              <Route path="/employer-validation" element={<EmployerValidationPage />} />
              <Route path="/career-guidance" element={<CareerGuidancePage />} />
              <Route path="/emerging-tech" element={<EmergingTechPage />} />
              <Route path="/recommendations" element={<RecommendationCenterPage />} />
              <Route path="/district-plans" element={<DistrictTrainingPlanPage />} />
              <Route path="/admin" element={<AdminSettingsPage />} />
            </Routes>
          </main>
        </div>
      )}

      {/* Groq LLaMA 3 AI Advisor Floating Copilot */}
      <GroqAiAssistant />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}
