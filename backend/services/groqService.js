const Groq = require('groq-sdk');

// Available LLaMA 3 models supported on Groq
const SUPPORTED_MODELS = [
  {
    id: 'llama-3.3-70b-versatile',
    name: 'LLaMA 3.3 70B Versatile',
    provider: 'Meta / Groq',
    contextWindow: 131072,
    recommended: true,
    description: 'Flagship Meta LLaMA 3.3 model on Groq. Exceptional reasoning, curriculum design, and market analysis.'
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'LLaMA 3.1 8B Instant',
    provider: 'Meta / Groq',
    contextWindow: 131072,
    recommended: false,
    description: 'Ultra-fast low-latency LLaMA 3.1 model. Ideal for instant chat and quick recommendations.'
  },
  {
    id: 'llama-3.2-3b-preview',
    name: 'LLaMA 3.2 3B Preview',
    provider: 'Meta / Groq',
    contextWindow: 131072,
    recommended: false,
    description: 'Lightweight edge-optimized model for rapid summarization.'
  },
  {
    id: 'llama-3.2-1b-preview',
    name: 'LLaMA 3.2 1B Preview',
    provider: 'Meta / Groq',
    contextWindow: 131072,
    recommended: false,
    description: 'Extremely compact model with ultra-low latency.'
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B 32k',
    provider: 'Mistral / Groq',
    contextWindow: 32768,
    recommended: false,
    description: 'High performance Mixture-of-Experts architecture with 32k context.'
  }
];

class GroqService {
  constructor() {
    this.client = null;
    this.initClient();
  }

  initClient() {
    let apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      apiKey = apiKey.trim().replace(/^["']|["']$/g, '');
    }
    if (apiKey && apiKey !== '' && apiKey !== 'your_groq_api_key_here') {
      try {
        this.client = new Groq({ apiKey, timeout: 8000 });
      } catch (err) {
        console.warn('[GroqService] Initialization error:', err.message);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  setApiKey(newKey, newModel = null) {
    if (newKey !== undefined) {
      process.env.GROQ_API_KEY = newKey ? newKey.trim().replace(/^["']|["']$/g, '') : '';
    }
    if (newModel) {
      process.env.GROQ_MODEL = newModel.trim();
    }
    this.initClient();
    return this.isConfigured();
  }

  getMaskedApiKey() {
    const key = process.env.GROQ_API_KEY;
    if (!key || key.trim() === '' || key === 'your_groq_api_key_here') {
      return null;
    }
    const clean = key.trim().replace(/^["']|["']$/g, '');
    if (clean.length <= 8) return '••••••••';
    return clean.slice(0, 4) + '••••••••' + clean.slice(-4);
  }

  isConfigured() {
    // Re-check in case env var was updated at runtime
    if (!this.client && process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
      this.initClient();
    }
    return Boolean(this.client);
  }

  getActiveModel() {
    return process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  }

  getAvailableModels() {
    return SUPPORTED_MODELS;
  }

  getModelsToTry(preferredModel = null) {
    const primary = preferredModel || this.getActiveModel();
    const fallback = 'llama-3.1-8b-instant';
    return primary === fallback ? [fallback] : [primary, fallback];
  }

  /**
   * Ping/test the Groq connection
   */
  async testConnection() {
    if (!this.isConfigured()) {
      return {
        configured: false,
        status: 'FALLBACK_MODE',
        activeModel: this.getActiveModel(),
        message: 'GROQ_API_KEY not configured. SkillSync is running in resilient Local Heuristic mode. Add GROQ_API_KEY in backend/.env to activate live Groq LLaMA 3 inference.',
        supportedModels: SUPPORTED_MODELS
      };
    }

    try {
      const startTime = Date.now();
      const model = this.getActiveModel();
      const completion = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are the SkillSync Maharashtra AI Engine. Respond with a short confirmation message.'
          },
          {
            role: 'user',
            content: 'Ping test. Confirm Groq LLaMA 3 engine status for SkillSync Maharashtra.'
          }
        ],
        max_tokens: 60,
        temperature: 0.2
      });

      const latencyMs = Date.now() - startTime;
      const reply = completion.choices[0]?.message?.content || 'Operational';

      return {
        configured: true,
        status: 'CONNECTED',
        activeModel: model,
        latencyMs,
        response: reply.trim(),
        message: `Groq LLaMA 3 (${model}) is active and responding in ${latencyMs}ms.`,
        supportedModels: SUPPORTED_MODELS
      };
    } catch (err) {
      console.warn('[GroqService] Ping test notice:', err.message);
      
      // If the specific model has an access/decommission notice, test fallback to available high-speed model
      if (err.message && (err.message.includes('decommissioned') || err.message.includes('not exist') || err.message.includes('model_not_found'))) {
        try {
          const fallbackModel = 'llama-3.1-8b-instant';
          const startTime = Date.now();
          const fallbackRes = await this.client.chat.completions.create({
            model: fallbackModel,
            messages: [{ role: 'user', content: 'Ping test. Confirm Groq engine status.' }],
            max_tokens: 30
          });
          const latencyMs = Date.now() - startTime;
          return {
            configured: true,
            status: 'CONNECTED_FALLBACK',
            activeModel: this.getActiveModel(),
            fallbackModel,
            latencyMs,
            message: `Target model '${this.getActiveModel()}' returned: "${err.error?.message || err.message}". Groq connection verified using fallback model '${fallbackModel}' in ${latencyMs}ms.`,
            supportedModels: SUPPORTED_MODELS
          };
        } catch (fallbackErr) {
          // ignore
        }
      }

      return {
        configured: true,
        status: 'NOTICE',
        activeModel: this.getActiveModel(),
        error: err.message,
        message: `Groq API returned: ${err.message}. Local curriculum reasoning engine is active.`,
        supportedModels: SUPPORTED_MODELS
      };
    }
  }

  /**
   * Generic chat completion using Groq LLaMA 3 with live model fallback
   */
  async createChatCompletion(messages, options = {}) {
    const primaryModel = options.model || this.getActiveModel();
    const temperature = options.temperature !== undefined ? options.temperature : 0.4;
    const maxTokens = options.maxTokens || 1024;

    if (this.isConfigured()) {
      // 1. Try primary configured model
      try {
        const response = await this.client.chat.completions.create({
          model: primaryModel,
          messages,
          temperature,
          max_tokens: maxTokens,
          ...(options.responseFormat ? { response_format: options.responseFormat } : {})
        });
        return {
          success: true,
          source: 'groq:llama-3',
          model: primaryModel,
          content: response.choices[0]?.message?.content || ''
        };
      } catch (err) {
        console.warn(`[GroqService] Primary model '${primaryModel}' failed (${err.message}). Trying active Groq fallback model.`);
        
        // 2. Try active model on Groq if model_not_found / decommissioned
        try {
          const fallbackModel = 'llama-3.1-8b-instant';
          const fallbackRes = await this.client.chat.completions.create({
            model: fallbackModel,
            messages,
            temperature,
            max_tokens: maxTokens,
            ...(options.responseFormat ? { response_format: options.responseFormat } : {})
          });
          return {
            success: true,
            source: 'groq:live',
            model: fallbackModel,
            content: fallbackRes.choices[0]?.message?.content || ''
          };
        } catch (fbErr) {
          console.warn(`[GroqService] Fallback Groq model failed: ${fbErr.message}`);
        }
      }
    }

    return {
      success: false,
      source: 'local:fallback',
      model: primaryModel,
      content: null
    };
  }

  /**
   * Deep Skill Gap Analysis & Curriculum Modernization
   */
  async generateSkillGapInsights({ role, course, district, missingSkills, matchPercentage }) {
    const districtName = district || 'Maharashtra';
    const missing = missingSkills && missingSkills.length > 0 ? missingSkills : ['Advanced Industry Tooling'];
    
    const systemPrompt = `You are an expert Technical Vocational Curriculum Architect and Labour Market Analyst advising the Government of Maharashtra (DVET & MSSDS).
Analyze the skill gap between institutional curriculum and industry needs. 
Return your recommendation as clean JSON with these exact keys:
{
  "strategic_overview": "Summary of gap and industrial implication",
  "curriculum_units_to_add": ["Unit 1 title and detail", "Unit 2 title and detail"],
  "lab_equipment_requirements": ["Equipment / software required with specs"],
  "faculty_fdp_action": "Specific Faculty Development Program recommendation",
  "district_industry_alignment": "Explanation of how this connects to local industries in ${districtName}",
  "estimated_readiness_boost": "+XX% placement improvement",
  "implementation_timeline": "Estimated weeks"
}`;

    const userPrompt = `Job Role: ${role?.role_name || 'Technical Specialist'} (Sector: ${role?.sector || 'Industrial'})
Course: ${course?.course_name || 'Standard Diploma'}
Current Curriculum Alignment: ${matchPercentage}%
Missing Competencies: ${missing.join(', ')}
Location: ${districtName} District, Maharashtra

Provide an actionable, authoritative curriculum upgrade plan.`;

    if (this.isConfigured()) {
      const modelsToTry = this.getModelsToTry();
      for (const model of modelsToTry) {
        try {
          const res = await this.client.chat.completions.create({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 1000,
            response_format: { type: 'json_object' }
          });

          const parsed = JSON.parse(res.choices[0].message.content);
          return {
            ...parsed,
            source: model === this.getActiveModel() ? 'groq:llama-3' : 'groq:live',
            model
          };
        } catch (err) {
          console.warn(`[GroqService] Skill Gap API failed for ${model}:`, err.message);
        }
      }
    }

    // High quality deterministic fallback
    return {
      source: 'local:fallback',
      model: this.getActiveModel(),
      strategic_overview: `Curriculum currently achieves ${matchPercentage}% match with live industry mandates in ${districtName}. Adding ${missing.join(', ')} is critical to ensure graduates meet tier-1 manufacturer hiring benchmarks.`,
      curriculum_units_to_add: missing.map(skill => 
        `Module: Applied ${skill} & Industry Standards (30 Hours lecture + 20 Hours lab practicals)`
      ),
      lab_equipment_requirements: missing.some(s => s.toLowerCase().includes('cloud') || s.toLowerCase().includes('sql') || s.toLowerCase().includes('python'))
        ? ['High-throughput computing lab with dual-monitor developer workstations', 'Dedicated Docker container sandbox and cloud access credentials']
        : ['Modern calibration testing benches and industrial grade PLC simulation racks', 'Digital simulation workstation with licensed diagnostic software'],
      faculty_fdp_action: `Depute 2 master trainers per ITI cluster to a 14-day Faculty Development Program on ${missing.slice(0, 2).join(' & ')} at COEP / VJTI.`,
      district_industry_alignment: `Directly feeds the talent pipeline for regional manufacturing and tech parks operating across ${districtName}.`,
      estimated_readiness_boost: `+${Math.max(15, 100 - matchPercentage)}% placement increase`,
      implementation_timeline: '6 to 8 Weeks'
    };
  }

  /**
   * Personalized Student Career Guidance & Mentorship
   */
  async generateCareerAdvice({ userSkills, targetRole, district, educationLevel, selectedCourses }) {
    const current = userSkills && userSkills.length > 0 ? userSkills.join(', ') : 'Basic technical foundations';
    const roleName = targetRole?.role_name || 'Data Analyst';
    const districtName = district || 'Pune';
    const coursesStr = selectedCourses || 'State Accredited Technical Programs';

    const systemPrompt = `You are the SkillSync Maharashtra AI Career Counselor powered by Groq LLaMA 3.
Provide inspiring, highly practical, and localized career mentoring for an aspiring student in Maharashtra.
Take into account the specific courses they have selected and link the advice directly to those course topics and industry demands.
Return clean JSON with these exact keys:
{
  "counselor_summary": "Encouraging personalized summary of candidate standing and chosen courses",
  "fast_track_milestones": ["Milestone 1 (Weeks 1-4)", "Milestone 2 (Weeks 5-8)", "Milestone 3 (Weeks 9-12)"],
  "high_impact_portfolio_project": "A real-world project idea directly combining the selected courses and relevant to Maharashtra industries",
  "interview_mastery_tips": ["Tip 1", "Tip 2"],
  "local_employer_targets": ["Company 1", "Company 2"]
}`;

    const userPrompt = `Candidate Profile:
- Education: ${educationLevel || 'Diploma / Graduate'}
- Selected Course(s): ${coursesStr}
- Current Skills: ${current}
- Target Goal: ${roleName}
- Target Region: ${districtName}, Maharashtra

Generate tailored guidance directly addressing their selected course path.`;

    if (this.isConfigured()) {
      const modelsToTry = this.getModelsToTry();
      for (const model of modelsToTry) {
        try {
          const res = await this.client.chat.completions.create({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.4,
            max_tokens: 1000,
            response_format: { type: 'json_object' }
          });

          const parsed = JSON.parse(res.choices[0].message.content);
          return {
            ...parsed,
            source: model === this.getActiveModel() ? 'groq:llama-3' : 'groq:live',
            model
          };
        } catch (err) {
          console.warn(`[GroqService] Career Advice API failed for ${model}:`, err.message);
        }
      }
    }

    // Heuristic fallback
    return {
      source: 'local:fallback',
      model: this.getActiveModel(),
      counselor_summary: `You have an encouraging starting foundation. To secure high-demand roles as a ${roleName} in ${districtName}, bridge your core competency gaps with demonstrable projects.`,
      fast_track_milestones: [
        `Weeks 1-4: Master fundamental syntax, core data structures, and industry-standard workflows.`,
        `Weeks 5-8: Build modular projects addressing real-time telemetry or automation challenges.`,
        `Weeks 9-12: Complete capstone portfolio project and participate in MSSDS state apprenticeship drives.`
      ],
      high_impact_portfolio_project: `Build an End-to-End Analytics & Diagnostic Dashboard analyzing manufacturing throughput or supply chain logistics in the ${districtName} MIDC corridor.`,
      interview_mastery_tips: [
        'Prepare 2 deep-dive case studies explaining how you solved technical roadblocks.',
        'Demonstrate proficiency in modern toolchains and automated testing.'
      ],
      local_employer_targets: [
        `Major industrial & tech firms in ${districtName} MIDC`,
        `State technical infrastructure partners and GCC centers`
      ]
    };
  }

  /**
   * Interactive SkillSync Maharashtra AI Copilot Chat
   */
  async chatWithCopilot({ message, history = [], userRole = 'candidate', district = 'Maharashtra' }) {
    const systemPrompt = `You are the "SkillSync Maharashtra AI Advisor", an elite labour market intelligence assistant powered by Meta LLaMA 3 on Groq Cloud.
Your purpose:
1. Provide precise, actionable intelligence regarding technical vocational education (ITI & Polytechnics) in Maharashtra.
2. Analyze skill demands across 36 districts (Pune Auto/Tech, Mumbai BFSI/IT, Nagpur Logistics/EV, Nashik Auto/Aerospace, Aurangabad Engineering, etc.).
3. Assist government directors, institutional principals, employers, and candidates in bridging skill gaps.
4. Keep your responses structured, professional, empowering, and concise with bullet points where appropriate.
Mention the speed and analytical depth provided by Groq LLaMA 3 when relevant.`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map(h => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.content
      })),
      {
        role: 'user',
        content: `[Context: User Role=${userRole}, Location=${district}]\n${message}`
      }
    ];

    if (this.isConfigured()) {
      const modelsToTry = this.getModelsToTry();
      for (const model of modelsToTry) {
        try {
          const startTime = Date.now();
          const res = await this.client.chat.completions.create({
            model,
            messages: formattedMessages,
            temperature: 0.5,
            max_tokens: 800
          });
          const durationMs = Date.now() - startTime;

          return {
            reply: res.choices[0].message.content,
            source: model === this.getActiveModel() ? 'groq:llama-3' : 'groq:live',
            model,
            speedMs: durationMs
          };
        } catch (err) {
          console.warn(`[GroqService] Copilot chat API failed for ${model}:`, err.message);
        }
      }
    }

    // Heuristic fallback response
    let fallbackReply = `Hello! I am your SkillSync Maharashtra AI Advisor. `;
    if (message.toLowerCase().includes('pune') || message.toLowerCase().includes('auto')) {
      fallbackReply += `In Pune and Pimpri-Chinchwad, top in-demand skills currently include Electric Vehicle (EV) Powertrain Diagnostics, Industrial IoT, Python for Automation, and Embedded Systems. ITIs in Pune are actively modernizing syllabi to support Tata Motors, Bajaj Auto, and tech GCCs.`;
    } else if (message.toLowerCase().includes('mumbai') || message.toLowerCase().includes('finance')) {
      fallbackReply += `In Mumbai and MMR, premier demands focus on Cloud Infrastructure (AWS/Azure), Data Engineering, FinTech compliance, and Full-Stack development.`;
    } else if (message.toLowerCase().includes('nagpur') || message.toLowerCase().includes('logistics')) {
      fallbackReply += `In Nagpur (MIHAN SEZ), key employment growth is in Supply Chain Analytics, Multi-modal Cargo Management, and Drone Surveying.`;
    } else if (message.toLowerCase().includes('curriculum') || message.toLowerCase().includes('syllabus')) {
      fallbackReply += `To modernize curricula under DVET guidelines, technical institutions should map student outcomes to national qualification frameworks (NSQF Level 5/6) and integrate industry-endorsed practical lab units.`;
    } else {
      fallbackReply += `SkillSync tracks live labour market demands across all 36 districts of Maharashtra. You can analyze skill gaps, generate automated syllabus revisions, or explore district-level training plans in the platform.`;
    }

    return {
      reply: fallbackReply,
      source: 'local:fallback',
      model: this.getActiveModel(),
      speedMs: 15
    };
  }
}

// Singleton instance
const groqService = new GroqService();

module.exports = groqService;
