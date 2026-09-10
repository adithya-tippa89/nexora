const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Get all districts
router.get('/', (req, res) => {
  const districts = store.get('districts');
  res.json({
    districts,
    total: districts.length
  });
});

// Get single district intelligence
router.get('/:id', (req, res) => {
  const districts = store.get('districts');
  const d = districts.find(item => item.id === req.params.id || item.district_name.toLowerCase() === req.params.id.toLowerCase());
  if (!d) {
    return res.status(404).json({ error: "District not found" });
  }

  // Related courses and employers in this district
  const courses = store.get('courses').filter(c => c.district.toLowerCase() === d.district_name.toLowerCase());
  const employers = store.get('employers').filter(e => e.district.toLowerCase() === d.district_name.toLowerCase());
  const plan = store.get('district_training_plans').find(p => p.district_name.toLowerCase() === d.district_name.toLowerCase());

  res.json({
    district: d,
    courses,
    employers,
    districtTrainingPlan: plan || null
  });
});

module.exports = router;
