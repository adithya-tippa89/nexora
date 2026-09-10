const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Get all trainer profiles
router.get('/', (req, res) => {
  const trainers = store.get('trainer_profiles');
  const avgGap = +(trainers.reduce((acc, t) => acc + (t.trainer_skill_gap || 0), 0) / (trainers.length || 1)).toFixed(1);

  res.json({
    trainers,
    totalTrainers: trainers.length,
    averageTrainerGap: avgGap,
    enrolledInFDP: trainers.filter(t => t.upskilling_status === 'Enrolled in FDP').length,
    certifiedCount: trainers.filter(t => t.upskilling_status === 'Certified').length
  });
});

// Enroll trainer in FDP program
router.patch('/:id/enroll', (req, res) => {
  const { fdp_name } = req.body;
  const updated = store.update('trainer_profiles', req.params.id, {
    upskilling_status: 'Enrolled in FDP',
    assigned_fdp: fdp_name || "State Master Faculty Modernization Cohort"
  });

  if (!updated) {
    return res.status(404).json({ error: "Trainer not found" });
  }

  res.json({
    success: true,
    message: "Trainer successfully enrolled into State Faculty Development Program",
    trainer: updated
  });
});

module.exports = router;
