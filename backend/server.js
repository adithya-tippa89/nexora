require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const groqService = require('./services/groqService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    platform: 'SkillSync Maharashtra',
    version: '1.0.0',
    tagline: 'Aligning Skills with Industry. Building Careers for Tomorrow.',
    ai_engine: {
      provider: 'Groq Cloud',
      model: groqService.getActiveModel(),
      configured: groqService.isConfigured()
    },
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/skills', require('./routes/skillsRoutes'));
app.use('/api/job-roles', require('./routes/jobRolesRoutes'));
app.use('/api/courses', require('./routes/coursesRoutes'));
app.use('/api/districts', require('./routes/districtsRoutes'));
app.use('/api/skill-gap', require('./routes/skillGapRoutes'));
app.use('/api/recommendations', require('./routes/recommendationsRoutes'));
app.use('/api/career-guidance', require('./routes/careerGuidanceRoutes'));
app.use('/api/employer-validation', require('./routes/employerValidationRoutes'));
app.use('/api/trainer-upskilling', require('./routes/trainerUpskillingRoutes'));
app.use('/api/equipment-planning', require('./routes/equipmentPlanningRoutes'));
app.use('/api/emerging-tech', require('./routes/emergingTechRoutes'));
app.use('/api/district-plans', require('./routes/districtPlansRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Root endpoint info
app.get('/', (req, res) => {
  res.send('SkillSync Maharashtra REST API Server Running. Navigate to /api/health or frontend client.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start listening
app.listen(PORT, () => {
  console.log(`SkillSync Maharashtra API Server listening on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`AI Engine: Groq LLaMA 3 [Model: ${groqService.getActiveModel()}] [Configured: ${groqService.isConfigured() ? 'YES' : 'NO (Fallback Active)'}]`);
});
