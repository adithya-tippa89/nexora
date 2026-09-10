const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Get all lab equipment planning records
router.get('/', (req, res) => {
  const equipment = store.get('equipment_planning');
  const totalBudgetNeeded = equipment.reduce((sum, e) => sum + (e.estimated_budget_inr || 0), 0);
  const avgReadiness = +(equipment.reduce((sum, e) => sum + (e.readiness_score || 0), 0) / (equipment.length || 1)).toFixed(1);

  res.json({
    equipment,
    totalLabsMonitored: equipment.length,
    averageReadinessScore: avgReadiness,
    totalBudgetNeededInCrores: +(totalBudgetNeeded / 10000000).toFixed(2),
    actionRequiredCount: equipment.filter(e => e.status === 'Action Required').length
  });
});

// Update equipment budget / status
router.patch('/:id/approve-budget', (req, res) => {
  const updated = store.update('equipment_planning', req.params.id, {
    status: 'Budget Approved',
    approved_date: new Date().toISOString()
  });

  if (!updated) {
    return res.status(404).json({ error: "Equipment record not found" });
  }

  res.json({
    success: true,
    message: "Laboratory modernization grant approved by DVET Infrastructure Division",
    equipment: updated
  });
});

module.exports = router;
