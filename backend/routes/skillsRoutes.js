const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Get all skills with optional filters
router.get('/', (req, res) => {
  const { category, search, status } = req.query;
  let skills = store.get('skills');

  if (category && category !== 'All') {
    skills = skills.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (status && status !== 'All') {
    skills = skills.filter(s => s.velocity_status === status);
  }
  if (search) {
    const q = search.toLowerCase();
    skills = skills.filter(s => s.skill_name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }

  // Categories list for filter dropdown
  const categories = Array.from(new Set(store.get('skills').map(s => s.category)));

  res.json({
    skills,
    categories,
    total: skills.length
  });
});

// Add new skill signal
router.post('/', (req, res) => {
  const { skill_name, category, demand_score, growth_rate, velocity_status, description } = req.body;
  if (!skill_name) {
    return res.status(400).json({ error: "Skill name is required" });
  }

  const newSkill = {
    id: "sk-" + Date.now(),
    skill_name,
    category: category || "Emerging Tech",
    demand_score: parseFloat(demand_score) || 75.0,
    growth_rate: parseFloat(growth_rate) || 15.0,
    velocity_status: velocity_status || "Rising",
    description: description || "Identified from real-time Maharashtra labour market signals."
  };

  store.create('skills', newSkill);
  res.status(201).json({ success: true, skill: newSkill });
});

module.exports = router;
