const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const groqService = require('../services/groqService');
const store = require('../database/dataStore');
const { buildFallbackRecommendations, validateRecommendations } = require('../services/recommendationEngine');

// 1. AI Engine Status & Diagnostics
router.get('/status', async (req, res) => {
  const isConfigured = groqService.isConfigured();
  const activeModel = groqService.getActiveModel();
  const supportedModels = groqService.getAvailableModels();
  const maskedKey = groqService.getMaskedApiKey();

  res.json({
    engine: 'Groq Cloud AI',
    status: isConfigured ? 'CONNECTED' : 'FALLBACK_MODE',
    isConfigured,
    activeModel,
    maskedKey,
    supportedModels,
    features: [
      'Skill Gap Deep Pedagogical Analysis',
      'Personalized Student Career Roadmap Mentoring',
      'Dynamic ITI/Polytechnic Syllabus Modernization',
      'Interactive SkillSync Copilot Chatbot'
    ],
    info: isConfigured 
      ? `Groq LLaMA 3 engine (${activeModel}) is active with ultra-low latency.`
      : 'GROQ_API_KEY is not configured in backend/.env. Using local deterministic fallback model.'
  });
});

// Configure Groq API Key and Model at runtime and persist to .env
router.post('/configure', async (req, res) => {
  const { apiKey, model } = req.body;
  
  if (apiKey !== undefined) {
    groqService.setApiKey(apiKey, model);
    
    try {
      const envPath = path.resolve(__dirname, '../.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        const cleanKey = apiKey ? apiKey.trim().replace(/^["']|["']$/g, '') : '';
        if (envContent.includes('GROQ_API_KEY=')) {
          envContent = envContent.replace(/GROQ_API_KEY=.*/, `GROQ_API_KEY=${cleanKey}`);
        } else {
          envContent += `\nGROQ_API_KEY=${cleanKey}\n`;
        }
        if (model) {
          const cleanModel = model.trim();
          if (envContent.includes('GROQ_MODEL=')) {
            envContent = envContent.replace(/GROQ_MODEL=.*/, `GROQ_MODEL=${cleanModel}`);
          } else {
            envContent += `\nGROQ_MODEL=${cleanModel}\n`;
          }
        }
        fs.writeFileSync(envPath, envContent, 'utf8');
      }
    } catch (err) {
      console.warn('[aiRoutes] Could not write to .env:', err.message);
    }
  }

  const testResult = await groqService.testConnection();
  res.json({
    success: true,
    isConfigured: groqService.isConfigured(),
    activeModel: groqService.getActiveModel(),
    maskedKey: groqService.getMaskedApiKey(),
    testResult
  });
});

// 2. Ping / Test Connection
router.post('/test', async (req, res) => {
  try {
    const result = await groqService.testConnection();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Interactive SkillSync AI Copilot Chat
router.post('/chat', async (req, res) => {
  const { message, history, userRole, district } = req.body;
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  try {
    const response = await groqService.chatWithCopilot({
      message,
      history: history || [],
      userRole: userRole || 'guest',
      district: district || 'Maharashtra'
    });
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Deep Skill Gap Analysis
router.post('/skill-gap-insights', async (req, res) => {
  const { role_id, course_id, district, missing_skills, match_percentage } = req.body;

  const jobRoles = store.get('job_roles') || [];
  const courses = store.get('courses') || [];

  const role = jobRoles.find(r => r.id === role_id) || { role_name: req.body.role_name || 'Data Analyst', sector: 'Information Technology' };
  const course = courses.find(c => c.id === course_id) || { course_name: req.body.course_name || 'Diploma in Computer Tech' };

  try {
    const insights = await groqService.generateSkillGapInsights({
      role,
      course,
      district: district || 'Maharashtra',
      missingSkills: missing_skills || [],
      matchPercentage: match_percentage !== undefined ? match_percentage : 65
    });

    res.json({
      success: true,
      insights
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Personalized Career Advice
router.post('/career-advice', async (req, res) => {
  const { current_skills, target_role_id, district, education_level } = req.body;

  const jobRoles = store.get('job_roles') || [];
  const targetRole = jobRoles.find(r => r.id === target_role_id) || { role_name: 'Data Analyst', sector: 'Information Technology' };

  try {
    const advice = await groqService.generateCareerAdvice({
      userSkills: current_skills || [],
      targetRole,
      district: district || 'Pune',
      educationLevel: education_level || 'Diploma'
    });

    res.json({
      success: true,
      advice
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Generate Course Syllabus Modernization Blueprint
router.post('/generate-syllabus', async (req, res) => {
  const { course_id, missing_skills, sector, target_role } = req.body;
  const courses = store.get('courses') || [];
  const course = courses.find(c => c.id === course_id) || { course_name: 'Advanced Technical Trade' };

  const prompt = `Generate a 4-week modernization syllabus addendum for the technical course "${course.course_name}" in the "${sector || 'Technical'}" sector.
Target Industry Competencies: ${(missing_skills || ['Cloud Toolchains', 'Automated Testing']).join(', ')}.
Provide weekly learning topics, required software/lab tools, and hands-on capstone project specifications.`;

  try {
    const completion = await groqService.createChatCompletion([
      {
        role: 'system',
        content: 'You are an expert technical vocational curriculum designer for the Maharashtra State Directorate of Vocational Education & Training (DVET).'
      },
      {
        role: 'user',
        content: prompt
      }
    ], { temperature: 0.3, maxTokens: 1000 });

    res.json({
      success: true,
      syllabus: completion.content,
      source: completion.source,
      model: completion.model
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Structured, data-grounded learning recommendations
router.post('/skill-recommendations', async (req, res) => {
  const { analysis, courses, roles } = req.body;
  if (!analysis || !analysis.job_role || !analysis.course_name || !Array.isArray(analysis.missing_skills)) {
    return res.status(422).json({ error: 'analysis with job_role, course_name, and missing_skills is required.' });
  }

  const fallback = buildFallbackRecommendations({ analysis, courses: courses || [], roles: roles || [] });
  if (fallback.recommendations.length === 0) {
    return res.json({ success: true, source: 'local:data-gap', model: null, ...fallback, message: 'No missing skills were found. The selected curriculum covers the role requirements.' });
  }

  const missingSkills = fallback.recommendations.map((item) => item.skill);
  const systemPrompt = `You are the SkillSync AI learning planner. Return only valid JSON with this shape: {"recommendations":[{"skill":"...","priority":"High|Medium|Low","reason":"...","learning_order":1,"learning_direction":"..."}],"related_courses":[],"related_roles":[],"emerging_skills":[]}. Cover every missing skill exactly once. Use only the supplied missing skills. Do not invent skills, courses, roles, percentages, or credentials.`;
  const userPrompt = JSON.stringify({
    job_role: analysis.job_role,
    course_name: analysis.course_name,
    missing_skills: missingSkills,
    gap_matrix: analysis.matrix,
    related_courses: courses || [],
    related_roles: roles || []
  });

  try {
    const completion = await groqService.createChatCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.2, maxTokens: 1200, responseFormat: { type: 'json_object' } });
    if (completion.success && completion.content) {
      const parsed = JSON.parse(completion.content);
      const validated = validateRecommendations(parsed, missingSkills);
      if (validated) return res.json({ success: true, source: completion.source, model: completion.model, ...validated });
      console.warn('[AIRecommendations] Invalid structured response; using data fallback.');
    }
  } catch (error) {
    console.warn('[AIRecommendations] AI request failed; using data fallback:', error.message);
  }
  return res.json({ success: true, source: 'local:data-gap', model: null, ...fallback });
});

module.exports = router;
