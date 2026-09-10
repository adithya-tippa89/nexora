require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const net = require('net');
const fs = require('fs');
const { spawn } = require('child_process');
const groqService = require('./services/groqService');

const app = express();
const PORT = process.env.PORT || 5000;
const FASTAPI_PORT = parseInt(process.env.FASTAPI_PORT || '8000', 10);

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

// FastAPI auto-launcher supervisor
function checkPortListening(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const s = new net.Socket();
    s.setTimeout(500);
    s.on('connect', () => {
      s.destroy();
      resolve(true);
    });
    s.on('timeout', () => {
      s.destroy();
      resolve(false);
    });
    s.on('error', () => {
      resolve(false);
    });
    s.connect(port, host);
  });
}

function getPythonExecutable() {
  const venvWin = path.join(__dirname, 'venv', 'Scripts', 'python.exe');
  const venvUnix = path.join(__dirname, 'venv', 'bin', 'python');
  if (fs.existsSync(venvWin)) return venvWin;
  if (fs.existsSync(venvUnix)) return venvUnix;
  return 'python';
}

let fastApiChild = null;

async function ensureFastApiRunning() {
  const isRunning = await checkPortListening(FASTAPI_PORT);
  if (isRunning) {
    console.log(`[FastAPI] Service detected active on port ${FASTAPI_PORT}`);
    return;
  }

  const pythonExe = getPythonExecutable();
  console.log(`[FastAPI] Port ${FASTAPI_PORT} inactive. Auto-launching FastAPI via ${pythonExe}...`);

  try {
    fastApiChild = spawn(
      pythonExe,
      ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', String(FASTAPI_PORT)],
      { cwd: __dirname, stdio: ['ignore', 'pipe', 'pipe'] }
    );

    fastApiChild.stdout.on('data', (d) => {
      const msg = d.toString().trim();
      if (msg) console.log(`[FastAPI] ${msg}`);
    });

    fastApiChild.stderr.on('data', (d) => {
      const msg = d.toString().trim();
      if (msg) console.warn(`[FastAPI] ${msg}`);
    });

    fastApiChild.on('error', (err) => {
      console.error('[FastAPI] Failed to spawn FastAPI child process:', err.message);
    });

    fastApiChild.on('exit', (code, sig) => {
      if (code !== 0 && code !== null) {
        console.warn(`[FastAPI] Process exited with code ${code} signal ${sig}`);
      }
    });

    const cleanup = () => {
      if (fastApiChild && !fastApiChild.killed) {
        try { fastApiChild.kill(); } catch (e) {}
      }
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('exit', cleanup);
  } catch (err) {
    console.error('[FastAPI] Error starting FastAPI:', err.message);
  }
}

// Start listening
app.listen(PORT, async () => {
  console.log(`SkillSync Maharashtra API Server listening on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`AI Engine: Groq LLaMA 3 [Model: ${groqService.getActiveModel()}] [Configured: ${groqService.isConfigured() ? 'YES' : 'NO (Fallback Active)'}]`);
  await ensureFastApiRunning();
});

