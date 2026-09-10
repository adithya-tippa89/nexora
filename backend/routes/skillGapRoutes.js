const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Core Skill Gap Analysis Engine
router.post('/analyze', (req, res) => {
  const { district, sector, job_role_id, course_id } = req.body;

  const jobRoles = store.get('job_roles');
  const courses = store.get('courses');

  // Find job role
  let role = jobRoles.find(r => r.id === job_role_id);
  if (!role && job_role_id) {
    role = jobRoles.find(r => r.role_name.toLowerCase() === job_role_id.toLowerCase());
  }
  if (!role) {
    role = jobRoles[0]; // default to Data Analyst
  }

  // Find course
  let course = courses.find(c => c.id === course_id);
  if (!course && course_id) {
    course = courses.find(c => c.course_name.toLowerCase() === course_id.toLowerCase());
  }
  if (!course) {
    course = courses.find(c => c.sector === role.sector) || courses[0];
  }

  // Required skills for this role
  const requiredSkills = role.skills || [
    { skill_id: "sk-python", skill_name: "Python", proficiency_level: "Advanced", importance_score: 95.0 },
    { skill_id: "sk-sql", skill_name: "SQL", proficiency_level: "Advanced", importance_score: 98.0 },
    { skill_id: "sk-powerbi", skill_name: "Power BI", proficiency_level: "Advanced", importance_score: 92.0 },
    { skill_id: "sk-cloud", skill_name: "Cloud Computing (AWS/Azure)", proficiency_level: "Intermediate", importance_score: 82.0 }
  ];

  // Skills taught in course
  const taughtSkills = (course.skills_covered || []).map(s => s.toLowerCase());

  // Compare skill-by-skill
  let matchingCount = 0;
  let missingCount = 0;
  const missingSkillsList = [];
  const comparisonMatrix = [];

  requiredSkills.forEach(reqSkill => {
    const isCovered = taughtSkills.some(ts => 
      ts.includes(reqSkill.skill_name.toLowerCase()) || 
      reqSkill.skill_name.toLowerCase().includes(ts)
    );

    if (isCovered) {
      matchingCount++;
      comparisonMatrix.push({
        skill_id: reqSkill.skill_id,
        skill_name: reqSkill.skill_name,
        industry_demand: "High",
        importance_score: reqSkill.importance_score,
        proficiency_required: reqSkill.proficiency_level,
        course_coverage: "Yes",
        gap_percentage: 0,
        status: "Aligned"
      });
    } else {
      missingCount++;
      missingSkillsList.push(reqSkill.skill_name);
      comparisonMatrix.push({
        skill_id: reqSkill.skill_id,
        skill_name: reqSkill.skill_name,
        industry_demand: "High",
        importance_score: reqSkill.importance_score,
        proficiency_required: reqSkill.proficiency_level,
        course_coverage: "No",
        gap_percentage: 100,
        status: "Missing Gap"
      });
    }
  });

  const totalRequired = requiredSkills.length;
  const skillMatchPercentage = totalRequired > 0 ? Math.round((matchingCount / totalRequired) * 100) : 0;
  const skillGapPercentage = 100 - skillMatchPercentage;

  // AI-Powered Recommendation generator
  let aiRecommendation = "";
  if (missingSkillsList.length === 0) {
    aiRecommendation = `Curriculum is optimally aligned with industry expectations for ${role.role_name} in ${district || 'Maharashtra'}. Maintain close industry feedback and consider student cohort expansion.`;
  } else {
    aiRecommendation = `Update the curriculum by adding ${missingSkillsList.join(' and ')} modules to improve curriculum alignment from ${skillMatchPercentage}% to 100% with current industry requirements in ${district || 'Maharashtra'}.`;
  }

  // Interventions required
  const interventions = [];
  if (missingSkillsList.some(s => s.includes('Cloud') || s.includes('Docker'))) {
    interventions.push({
      type: "Trainer FDP",
      action: "Enroll institute faculty in AWS / Cloud Practitioner State Certification."
    });
  }
  if (missingSkillsList.some(s => s.includes('Power BI') || s.includes('AI') || s.includes('GPU'))) {
    interventions.push({
      type: "Lab Infrastructure",
      action: "Upgrade computer systems with dedicated graphics cards and enterprise BI tools."
    });
  }

  res.json({
    analysis: {
      district: district || course.district || "Pune",
      sector: sector || role.sector,
      job_role: role.role_name,
      job_role_id: role.id,
      course_name: course.course_name,
      course_id: course.id,
      total_required_skills: totalRequired,
      matching_skills_count: matchingCount,
      missing_skills_count: missingCount,
      skill_match_percentage: skillMatchPercentage,
      skill_gap_percentage: skillGapPercentage,
      missing_skills: missingSkillsList,
      matrix: comparisonMatrix,
      ai_recommendation: aiRecommendation,
      interventions
    }
  });
});

module.exports = router;
