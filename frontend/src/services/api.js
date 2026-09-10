const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API Error on ${url}:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (data) => fetchJson(`${API_BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => fetchJson(`${API_BASE_URL}/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
  getDemoAccounts: () => fetchJson(`${API_BASE_URL}/auth/demo-accounts`),

  // Dashboard
  getDashboardStats: () => fetchJson(`${API_BASE_URL}/dashboard/stats`),

  // Skills
  getSkills: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`${API_BASE_URL}/skills${query ? `?${query}` : ''}`);
  },
  addSkill: (data) => fetchJson(`${API_BASE_URL}/skills`, { method: 'POST', body: JSON.stringify(data) }),

  // Job Roles
  getJobRoles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`${API_BASE_URL}/job-roles${query ? `?${query}` : ''}`);
  },
  getJobRoleById: (id) => fetchJson(`${API_BASE_URL}/job-roles/${id}`),

  // Courses
  getCourses: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`${API_BASE_URL}/courses${query ? `?${query}` : ''}`);
  },
  getObsoleteCourses: () => fetchJson(`${API_BASE_URL}/courses/obsolete`),
  addCourse: (data) => fetchJson(`${API_BASE_URL}/courses`, { method: 'POST', body: JSON.stringify(data) }),
  updateCourseCurriculum: (id, data) => fetchJson(`${API_BASE_URL}/courses/${id}/update-curriculum`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Districts
  getDistricts: () => fetchJson(`${API_BASE_URL}/districts`),
  getDistrictById: (id) => fetchJson(`${API_BASE_URL}/districts/${id}`),

  // Skill Gap Analysis Engine
  analyzeSkillGap: (data) => fetchJson(`${API_BASE_URL}/skill-gap/analyze`, { method: 'POST', body: JSON.stringify(data) }),

  // Recommendations
  getRecommendations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`${API_BASE_URL}/recommendations${query ? `?${query}` : ''}`);
  },
  updateRecommendationStatus: (id, status, remarks) => fetchJson(`${API_BASE_URL}/recommendations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, remarks }) }),

  // Student Career Guidance
  assessCareerGuidance: (data) => fetchJson(`${API_BASE_URL}/career-guidance/assess`, { method: 'POST', body: JSON.stringify(data) }),

  // Employer Validation
  getEmployerValidations: () => fetchJson(`${API_BASE_URL}/employer-validation`),
  voteEmployerSkill: (data) => fetchJson(`${API_BASE_URL}/employer-validation/vote`, { method: 'POST', body: JSON.stringify(data) }),
  suggestMissingSkill: (data) => fetchJson(`${API_BASE_URL}/employer-validation/suggest-skill`, { method: 'POST', body: JSON.stringify(data) }),

  // Trainer Upskilling
  getTrainerProfiles: () => fetchJson(`${API_BASE_URL}/trainer-upskilling`),
  enrollTrainerFDP: (id, fdp_name) => fetchJson(`${API_BASE_URL}/trainer-upskilling/${id}/enroll`, { method: 'PATCH', body: JSON.stringify({ fdp_name }) }),

  // Equipment Planning
  getEquipmentPlanning: () => fetchJson(`${API_BASE_URL}/equipment-planning`),
  approveEquipmentBudget: (id) => fetchJson(`${API_BASE_URL}/equipment-planning/${id}/approve-budget`, { method: 'PATCH' }),

  // Emerging Tech
  getEmergingTech: () => fetchJson(`${API_BASE_URL}/emerging-tech`),

  // District Training Plans
  getDistrictTrainingPlans: () => fetchJson(`${API_BASE_URL}/district-plans`),
  getDistrictTrainingPlan: (district) => fetchJson(`${API_BASE_URL}/district-plans/${encodeURIComponent(district)}`),

  // Admin
  resetPlatformData: () => fetchJson(`${API_BASE_URL}/admin/reset-data`, { method: 'POST' }),
  getDiagnostics: () => fetchJson(`${API_BASE_URL}/admin/diagnostics`),

  // Groq LLaMA 3 AI Intelligence
  getAiStatus: () => fetchJson(`${API_BASE_URL}/ai/status`),
  testAiConnection: () => fetchJson(`${API_BASE_URL}/ai/test`, { method: 'POST' }),
  chatWithAiCopilot: (data) => fetchJson(`${API_BASE_URL}/ai/chat`, { method: 'POST', body: JSON.stringify(data) }),
  getAiSkillGapInsights: (data) => fetchJson(`${API_BASE_URL}/ai/skill-gap-insights`, { method: 'POST', body: JSON.stringify(data) }),
  getAiCareerAdvice: (data) => fetchJson(`${API_BASE_URL}/ai/career-advice`, { method: 'POST', body: JSON.stringify(data) }),
  generateAiSyllabus: (data) => fetchJson(`${API_BASE_URL}/ai/generate-syllabus`, { method: 'POST', body: JSON.stringify(data) })
};
