const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Get all employer validation lists
router.get('/', (req, res) => {
  const validations = store.get('employer_validations');
  res.json({
    validations,
    total: validations.length
  });
});

// Vote or validate skill
router.post('/vote', (req, res) => {
  const { job_role_id, skill_id, action, employer_name } = req.body;
  const validations = store.get('employer_validations');
  const record = validations.find(v => v.job_role_id === job_role_id) || validations[0];

  const targetSkill = record.skills.find(s => s.skill_id === skill_id);
  if (targetSkill) {
    if (action === 'approve') {
      targetSkill.approved_count = (targetSkill.approved_count || 0) + 1;
    } else if (action === 'not_required') {
      targetSkill.not_required_count = (targetSkill.not_required_count || 0) + 1;
    }
    const totalVotes = targetSkill.approved_count + targetSkill.not_required_count;
    targetSkill.validation_score = Math.round((targetSkill.approved_count / totalVotes) * 100);
  }

  // Recalculate overall score
  const avg = Math.round(record.skills.reduce((acc, s) => acc + s.validation_score, 0) / record.skills.length);
  record.overall_validation_score = avg;
  record.total_employer_responses += 1;

  store.update('employer_validations', record.id, record);

  res.json({
    success: true,
    message: `Validation recorded by ${employer_name || 'Employer'}`,
    record
  });
});

// Add missing skill suggestion
router.post('/suggest-skill', (req, res) => {
  const { job_role_id, skill_name, suggested_by } = req.body;
  if (!skill_name) {
    return res.status(400).json({ error: "Skill name is required" });
  }

  const validations = store.get('employer_validations');
  const record = validations.find(v => v.job_role_id === job_role_id) || validations[0];

  record.added_missing_skills = record.added_missing_skills || [];
  record.added_missing_skills.push({
    skill_name,
    suggested_by: suggested_by || "Verified Maharashtra Employer",
    votes: 1
  });

  store.update('employer_validations', record.id, record);

  res.status(201).json({
    success: true,
    message: "Missing skill recommendation submitted for curriculum review",
    record
  });
});

module.exports = router;
