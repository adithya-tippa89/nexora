const PRIORITIES = new Set(['High', 'Medium', 'Low']);

function normalize(value) {
  return String(value || '').trim().toLowerCase().replace(/[._-]+/g, ' ').replace(/\s+/g, ' ');
}

function priorityFor(weight) {
  if (weight >= 1) return 'High';
  if (weight >= 0.75) return 'Medium';
  return 'Low';
}

function learningDirection(skill, category) {
  if (category === 'Programming Language') return `Build ${skill} fundamentals, then complete a role-focused coding project.`;
  if (category === 'Database') return `Learn core ${skill} querying and data modeling, then apply it to a production-style dataset.`;
  if (category === 'Cloud' || category === 'DevOps') return `Learn ${skill} deployment fundamentals and practice them in a reproducible project environment.`;
  if (category === 'Framework') return `Learn ${skill} through a small end-to-end application that demonstrates the target role workflow.`;
  return `Study ${skill} concepts and demonstrate them in a portfolio project aligned with the target role.`;
}

function missingRows(analysis) {
  const matrix = Array.isArray(analysis?.matrix) ? analysis.matrix : [];
  const names = Array.isArray(analysis?.missing_skills) ? analysis.missing_skills : [];
  return names.map((name) => matrix.find((row) => normalize(row.skill_name) === normalize(name)) || {
    skill_name: name,
    category: 'Other',
    importance: 'mentioned',
    weight: 1
  });
}

function buildFallbackRecommendations({ analysis, courses = [], roles = [] }) {
  const rows = missingRows(analysis).sort((left, right) => (right.weight || 1) - (left.weight || 1));
  const recommendations = rows.map((row, index) => ({
    skill: row.skill_name,
    priority: priorityFor(row.weight || 1),
    reason: `${row.skill_name} is ${row.importance || 'mentioned'} for ${analysis.job_role} and is not covered by ${analysis.course_name}.`,
    learning_order: index + 1,
    learning_direction: learningDirection(row.skill_name, row.category)
  }));
  const missing = new Set(rows.map((row) => normalize(row.skill_name)));
  const relatedCourses = courses.filter((course) => (course.skills_covered || []).some((skill) => missing.has(normalize(skill)))).slice(0, 5).map((course) => ({
    id: course.id,
    name: course.course_name,
    matched_missing_skills: (course.skills_covered || []).filter((skill) => missing.has(normalize(skill)))
  }));
  const relatedRoles = roles.filter((role) => (role.skills || []).some((skill) => missing.has(normalize(skill.skill_name || skill)))).slice(0, 5).map((role) => ({ id: role.id, name: role.role_name, sector: role.sector }));
  return { recommendations, related_courses: relatedCourses, related_roles: relatedRoles, emerging_skills: analysis.emerging_skills || [] };
}

function validateRecommendations(payload, missingSkills) {
  if (!payload || !Array.isArray(payload.recommendations)) return null;
  const missing = new Set(missingSkills.map(normalize));
  const seen = new Set();
  const recommendations = payload.recommendations.map((item) => ({
    skill: String(item.skill || '').trim(),
    priority: item.priority,
    reason: String(item.reason || '').trim(),
    learning_order: Number(item.learning_order),
    learning_direction: String(item.learning_direction || '').trim()
  }));
  if (recommendations.length !== missing.size) return null;
  if (recommendations.some((item) => !missing.has(normalize(item.skill)) || seen.has(normalize(item.skill)) || !PRIORITIES.has(item.priority) || !item.reason || !item.learning_direction || !Number.isInteger(item.learning_order) || item.learning_order < 1)) return null;
  recommendations.forEach((item) => seen.add(normalize(item.skill)));
  return {
    recommendations: recommendations.sort((left, right) => left.learning_order - right.learning_order),
    related_courses: Array.isArray(payload.related_courses) ? payload.related_courses : [],
    related_roles: Array.isArray(payload.related_roles) ? payload.related_roles : [],
    emerging_skills: Array.isArray(payload.emerging_skills) ? payload.emerging_skills : []
  };
}

module.exports = { buildFallbackRecommendations, validateRecommendations, normalize };