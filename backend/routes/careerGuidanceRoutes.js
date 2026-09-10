const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');
const groqService = require('../services/groqService');

// Student Career Guidance Assessment
router.post('/assess', async (req, res) => {
  const { current_skills, target_role_id, district, education_level } = req.body;
  const userSkills = (current_skills || []).map(s => s.toLowerCase());

  const jobRoles = store.get('job_roles');
  const targetRole = jobRoles.find(r => r.id === target_role_id) || jobRoles[0]; // defaults to Data Analyst

  const requiredRoleSkills = targetRole.skills || [];
  const skillsUserHas = [];
  const skillsUserNeeds = [];

  requiredRoleSkills.forEach(reqSkill => {
    const hasSkill = userSkills.some(us => 
      us.includes(reqSkill.skill_name.toLowerCase()) || 
      reqSkill.skill_name.toLowerCase().includes(us)
    );
    if (hasSkill) {
      skillsUserHas.push(reqSkill.skill_name);
    } else {
      skillsUserNeeds.push(reqSkill.skill_name);
    }
  });

  const total = requiredRoleSkills.length || 1;
  const careerMatch = Math.round((skillsUserHas.length / total) * 100);

  // Generate personalized learning roadmap
  const roadmapSteps = [
    {
      step: 1,
      title: "Foundational Analytics & Excel",
      duration: "3-4 Weeks",
      focus: "Advanced Excel, Formulas, Statistical Modeling",
      completed: userSkills.some(s => s.includes('excel'))
    },
    {
      step: 2,
      title: "Relational Querying with SQL",
      duration: "4 Weeks",
      focus: "JOINs, Grouping, Window Functions, Schema Design",
      completed: userSkills.some(s => s.includes('sql'))
    },
    {
      step: 3,
      title: "Interactive Dashboarding with Power BI",
      duration: "4-5 Weeks",
      focus: "DAX Measures, Data Modeling, Drill-down Visuals",
      completed: userSkills.some(s => s.includes('power bi'))
    },
    {
      step: 4,
      title: "Python Data Science Stack",
      duration: "6 Weeks",
      focus: "Pandas, NumPy, Matplotlib, Data Cleaning Pipelines",
      completed: userSkills.some(s => s.includes('python'))
    },
    {
      step: 5,
      title: "Industry Capstone & Cloud Deploy",
      duration: "3 Weeks",
      focus: "AWS Athena Cloud Querying & Portfolio Projects",
      completed: false
    }
  ];

  // Recommended courses
  const allCourses = store.get('courses');
  const recommendedCourses = allCourses.filter(c => 
    c.sector === targetRole.sector && c.status === 'High Demand'
  );

  // Fetch Groq LLaMA 3 personalized mentor advice
  let mentorAdvice = null;
  try {
    mentorAdvice = await groqService.generateCareerAdvice({
      userSkills: current_skills || [],
      targetRole,
      district: district || "Pune",
      educationLevel: education_level || "Diploma"
    });
  } catch (err) {
    console.warn('[CareerGuidanceRoutes] Groq mentor advice warning:', err.message);
  }

  res.json({
    assessment: {
      target_role: targetRole.role_name,
      sector: targetRole.sector,
      district: district || "Pune",
      career_match_percentage: careerMatch,
      skills_you_have: skillsUserHas,
      skills_you_need: skillsUserNeeds,
      average_salary_lpa: targetRole.avg_salary_lpa,
      open_vacancies: targetRole.open_vacancies,
      roadmap: roadmapSteps,
      recommended_courses: recommendedCourses,
      ai_mentor: mentorAdvice,
      ai_engine: {
        provider: 'Groq Cloud',
        model: groqService.getActiveModel(),
        source: mentorAdvice?.source || 'local:fallback'
      }
    }
  });
});

module.exports = router;
