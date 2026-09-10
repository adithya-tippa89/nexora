const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Get all emerging technologies
router.get('/', (req, res) => {
  const tech = store.get('emerging_tech');
  res.json({
    emerging_technologies: tech,
    total: tech.length
  });
});

module.exports = router;
