const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');
const db = require('../database/db');

// Reset sample dataset
router.post('/reset-data', (req, res) => {
  const fresh = store.reset();
  res.json({
    success: true,
    message: "Platform database successfully restored to fresh Maharashtra government baseline state.",
    recordsCount: {
      districts: fresh.districts.length,
      skills: fresh.skills.length,
      courses: fresh.courses.length,
      recommendations: fresh.recommendations.length
    }
  });
});

// System diagnostics
router.get('/diagnostics', (req, res) => {
  const status = db.status();
  res.json({
    status,
    serverUptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    apiVersions: "v1.0.0 (Production Stable)"
  });
});

module.exports = router;
