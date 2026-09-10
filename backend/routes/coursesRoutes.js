const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Get all courses with status and filtering
router.get('/', (req, res) => {
  const { sector, district, status, search } = req.query;
  let courses = store.get('courses');

  if (sector && sector !== 'All') {
    courses = courses.filter(c => c.sector === sector);
  }
  if (district && district !== 'All') {
    courses = courses.filter(c => c.district === district);
  }
  if (status && status !== 'All') {
    courses = courses.filter(c => c.status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    courses = courses.filter(c => c.course_name.toLowerCase().includes(q) || c.institution_name.toLowerCase().includes(q));
  }

  const sectors = Array.from(new Set(store.get('courses').map(c => c.sector)));
  const districts = Array.from(new Set(store.get('courses').map(c => c.district)));

  res.json({
    courses,
    sectors,
    districts,
    total: courses.length
  });
});

// Get obsolete courses specifically
router.get('/obsolete', (req, res) => {
  const courses = store.get('courses');
  // Obsolete criteria: status is Low Demand / Obsolete OR placement rate < 30% OR match < 25%
  const obsoleteCourses = courses.filter(c => 
    c.status === 'Low Demand / Obsolete' || c.placement_rate < 30.0 || c.industry_match_score < 25.0
  );

  res.json({
    obsoleteCourses,
    total: obsoleteCourses.length,
    sunsetRecommendations: [
      "Decommission syllabus across DVET affiliated institutions",
      "Retrain faculty members in modern stacks (MERN / Cloud / AI)",
      "Reallocate state training budget to high-demand technical trades"
    ]
  });
});

// Add new course
router.post('/', (req, res) => {
  const { course_name, institution_name, sector, district, duration, skills_covered } = req.body;
  if (!course_name || !institution_name) {
    return res.status(400).json({ error: "Course name and institution are required" });
  }

  const skillsArr = Array.isArray(skills_covered) ? skills_covered : (skills_covered ? skills_covered.split(',').map(s => s.trim()) : []);

  const newCourse = {
    id: "course-" + Date.now(),
    course_name,
    institution_name,
    sector: sector || "Information Technology",
    district: district || "Pune",
    duration: duration || "6 Months",
    placement_rate: 75.0,
    enrollment_count: 120,
    industry_match_score: 80.0,
    status: "High Demand",
    skills_covered: skillsArr,
    missing_skills: [],
    recommendation: "Course created with aligned syllabus."
  };

  store.create('courses', newCourse);
  res.status(201).json({ success: true, course: newCourse });
});

// Update course curriculum (e.g., adding missing skills)
router.patch('/:id/update-curriculum', (req, res) => {
  const { added_skills } = req.body;
  const course = store.findById('courses', req.params.id);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  const existingSkills = new Set(course.skills_covered || []);
  (added_skills || []).forEach(s => existingSkills.add(s));

  // Recalculate match and update status
  const updatedSkills = Array.from(existingSkills);
  const remainingMissing = (course.missing_skills || []).filter(s => !added_skills.includes(s));
  const newMatchScore = Math.min(95.0, (course.industry_match_score || 60) + (added_skills.length * 15));

  const updatedCourse = store.update('courses', req.params.id, {
    skills_covered: updatedSkills,
    missing_skills: remainingMissing,
    industry_match_score: newMatchScore,
    status: newMatchScore >= 80 ? 'High Demand' : 'Needs Update',
    recommendation: `Curriculum updated on ${new Date().toLocaleDateString()}. Added: ${added_skills.join(', ')}.`
  });

  res.json({
    success: true,
    message: "Curriculum successfully upgraded with modern industry modules",
    course: updatedCourse
  });
});

module.exports = router;
