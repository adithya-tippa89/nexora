const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Get all district training plans
router.get('/', (req, res) => {
  const plans = store.get('district_training_plans');
  res.json({
    plans,
    total: plans.length
  });
});

// Generate or get plan for specific district
router.get('/:district', (req, res) => {
  const districtName = req.params.district;
  const plans = store.get('district_training_plans');
  let plan = plans.find(p => p.district_name.toLowerCase() === districtName.toLowerCase());

  if (!plan) {
    // Generate dynamically for any Maharashtra district
    const districts = store.get('districts');
    const d = districts.find(item => item.district_name.toLowerCase() === districtName.toLowerCase()) || {
      district_name: districtName,
      top_sectors: ["Information Technology", "Agro Industries", "Manufacturing"],
      job_openings: 6500
    };

    plan = {
      id: "dtp-" + districtName.toLowerCase().replace(/\s+/g, '-'),
      district_name: d.district_name,
      financial_year: "2026-2027",
      priority_sectors: d.top_sectors || ["Information Technology", "Manufacturing"],
      recommended_courses: [
        `Diploma in Applied ${d.top_sectors ? d.top_sectors[0] : 'Technology'} Systems`,
        "Industrial Automation & Digital Controls",
        "Python & Cloud Computing for Enterprise"
      ],
      required_trainers: 20,
      required_infra_labs: 6,
      expected_employment: Math.round(d.job_openings * 0.85) || 5500,
      budget_allocation_cr: 7.2,
      status: "State Approved",
      generated_date: new Date().toISOString().split('T')[0]
    };
    store.create('district_training_plans', plan);
  }

  res.json({
    plan,
    official_header: {
      state: "Government of Maharashtra",
      department: "Department of Skill Development, Employment and Entrepreneurship",
      council: "Maharashtra State Skill Development Society (MSSDS)",
      document_title: `${plan.district_name} District Skill Development Plan (DSDP) 2026-27`
    }
  });
});

module.exports = router;
