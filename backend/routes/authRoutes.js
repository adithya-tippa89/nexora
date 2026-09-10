const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');

// Login
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;
  const users = store.get('users');
  
  // If role is provided for demo switcher
  let user;
  if (role && !email) {
    user = users.find(u => u.role === role);
  } else {
    user = users.find(u => u.email === email);
  }

  if (!user) {
    // If not found in seed, create a temporary session user
    user = {
      id: "usr-" + Date.now(),
      name: email ? email.split('@')[0] : "Demo User",
      email: email || "user@skillsync.mh.gov.in",
      role: role || "student",
      district: "Pune"
    };
  }

  res.json({
    success: true,
    message: "Authentication successful",
    token: "jwt-mock-" + user.id,
    user
  });
});

// Register
router.post('/register', (req, res) => {
  const { name, email, password, role, district, organization } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const newUser = {
    id: "usr-" + Date.now(),
    name,
    email,
    password: password || "password123",
    role: role || "student",
    district: district || "Pune",
    organization: organization || "Self"
  };

  store.create('users', newUser);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: "jwt-mock-" + newUser.id,
    user: newUser
  });
});

// Demo accounts list for quick switching
router.get('/demo-accounts', (req, res) => {
  const users = store.get('users');
  res.json({
    roles: [
      { role: 'admin', title: 'Government / Admin', description: 'DVET State Administrator', email: 'admin@maharashtra.gov.in' },
      { role: 'institution', title: 'Training Institution', description: 'Polytechnic & ITI Director', email: 'institute@coep.ac.in' },
      { role: 'employer', title: 'Employer', description: 'Industry Talent Head', email: 'recruitment@tatamotors.com' },
      { role: 'student', title: 'Candidate / Student', description: 'Aspiring Technical Candidate', email: 'rohan.shinde@student.ac.in' }
    ]
  });
});

module.exports = router;
