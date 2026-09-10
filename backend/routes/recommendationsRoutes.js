const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Get all recommendations
router.get('/', (req, res) => {
  const { type, priority, status } = req.query;
  let recs = store.get('recommendations');

  if (type && type !== 'All') {
    recs = recs.filter(r => r.recommendation_type === type);
  }
  if (priority && priority !== 'All') {
    recs = recs.filter(r => r.priority === priority);
  }
  if (status && status !== 'All') {
    recs = recs.filter(r => r.status === status);
  }

  res.json({
    recommendations: recs,
    total: recs.length
  });
});

// Update recommendation status (e.g. Approve / Implement)
router.patch('/:id/status', (req, res) => {
  const { status, remarks } = req.body;
  const updated = store.update('recommendations', req.params.id, {
    status: status || 'Approved',
    approved_at: new Date().toISOString(),
    remarks: remarks || "Approved by DVET State Directorate"
  });

  if (!updated) {
    return res.status(404).json({ error: "Recommendation not found" });
  }

  res.json({
    success: true,
    message: `Recommendation status changed to ${status}`,
    recommendation: updated
  });
});

module.exports = router;
