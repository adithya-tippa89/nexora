const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Get all job roles
router.get('/', (req, res) => {
  const { sector, search } = req.query;
  let roles = store.get('job_roles');

  if (sector && sector !== 'All') {
    roles = roles.filter(r => r.sector.toLowerCase() === sector.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    roles = roles.filter(r => r.role_name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
  }

  const sectors = Array.from(new Set(store.get('job_roles').map(r => r.sector)));

  res.json({
    job_roles: roles,
    sectors,
    total: roles.length
  });
});

// Get single job role with deep dive
router.get('/:id', (req, res) => {
  const role = store.findById('job_roles', req.params.id);
  if (!role) {
    return res.status(404).json({ error: "Job role not found" });
  }

  // Find related courses in system
  const allCourses = store.get('courses');
  const relatedCourses = allCourses.filter(c => c.sector === role.sector);

  res.json({
    role,
    relatedCourses
  });
});

module.exports = router;
