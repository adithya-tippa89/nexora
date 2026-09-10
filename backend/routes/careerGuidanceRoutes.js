const express = require('express');
const router = express.Router();
const store = require('../database/dataStore');
const groqService = require('../services/groqService');
const { COURSE_CURRICULA, getSyllabusForCourses, generateRoadmapFromCourses } = require('../services/courseCurriculum');

// Dynamic roadmap curriculum catalog by role
function getStructuredRoadmapForRole(roleId, roleName, userSkills = []) {
  const normalizedRoleId = (roleId || '').toLowerCase();
  const normalizedRoleName = (roleName || '').toLowerCase();
  const hasSkill = (sub) => userSkills.some(s => s.toLowerCase().includes(sub.toLowerCase()));

  if (normalizedRoleId.includes('ai') || normalizedRoleName.includes('ai') || normalizedRoleName.includes('machine learning')) {
    return [
      {
        step: 1,
        title: "Mathematical Foundations & Advanced Python",
        duration: "3-4 Weeks",
        focus: "Vectors, Matrix operations, Probability, and high-performance computing in Python",
        topics: [
          "Linear Algebra: Matrices, Eigenvalues, Vector Spaces & Dot Products",
          "Multivariate Calculus: Gradients, Partial Derivatives, Chain Rule",
          "NumPy Vectorization & Performance Optimization",
          "Data Wrangling with Pandas & Exploratory Data Analysis"
        ],
        milestone_project: "Build an End-to-End Multivariable Gradient Descent Optimizer from Scratch",
        key_tools: ["Python 3.12", "NumPy", "Pandas", "Matplotlib", "JupyterLab"],
        recommended_course_name: "Applied AI & Generative Language Models",
        completed: hasSkill('python')
      },
      {
        step: 2,
        title: "Classical Machine Learning & Statistical Modeling",
        duration: "4 Weeks",
        focus: "Supervised and unsupervised learning, feature engineering, and model validation",
        topics: [
          "Regression & Classification: Decision Trees, Random Forests, XGBoost",
          "Unsupervised Clustering: K-Means, DBSCAN, Dimensionality Reduction (PCA)",
          "Feature Engineering: One-Hot Encoding, Normalization, Missing Value Imputation",
          "Hyperparameter Tuning (GridSearchCV, Optuna) & Cross-Validation"
        ],
        milestone_project: "Maharashtra Industrial Energy Demand Predictive Modeling with XGBoost",
        key_tools: ["Scikit-Learn", "XGBoost", "Optuna", "Seaborn"],
        recommended_course_name: "Advanced Data Science with Python",
        completed: hasSkill('machine learning') || hasSkill('artificial intelligence')
      },
      {
        step: 3,
        title: "Deep Learning & Neural Networks with PyTorch",
        duration: "4-5 Weeks",
        focus: "Feedforward architectures, Computer Vision CNNs, and sequence processing",
        topics: [
          "Artificial Neural Networks: Activation Functions, Backpropagation, Loss Optimization",
          "Convolutional Neural Networks (CNNs): Feature Maps, Pooling, Transfer Learning (ResNet)",
          "PyTorch Fundamentals: Tensor Operations, Autograd, Custom Datasets & DataLoader",
          "Recurrent Architectures: LSTMs, GRUs, and Self-Attention Mechanisms"
        ],
        milestone_project: "Automated Industrial Defect Classifier for Pune Auto Components (PyTorch)",
        key_tools: ["PyTorch", "Torchvision", "CUDA", "TensorBoard"],
        recommended_course_name: "Applied AI & Generative Language Models",
        completed: false
      },
      {
        step: 4,
        title: "Generative AI, Large Language Models & Prompt Engineering",
        duration: "5 Weeks",
        focus: "Transformer architectures, Retrieval Augmented Generation (RAG), and LangChain",
        topics: [
          "Transformer Deep Dive: Scaled Dot-Product Attention, Positional Encoding",
          "HuggingFace Transformers: Model Loading, Tokenization, Fine-Tuning LoRA/QLoRA",
          "Retrieval-Augmented Generation (RAG): Vector Databases (ChromaDB, Pinecone)",
          "LangChain & LlamaIndex: Agentic Workflows, Tool Calling & Prompt Engineering"
        ],
        milestone_project: "AI Legal & Scheme Assistant for Maharashtra Labour Regulations (RAG with LLaMA 3)",
        key_tools: ["LangChain", "HuggingFace", "ChromaDB", "Groq Cloud API", "Ollama"],
        recommended_course_name: "Applied AI & Generative Language Models",
        completed: hasSkill('generative ai') || hasSkill('prompt engineering')
      },
      {
        step: 5,
        title: "MLOps, Model Serving & Cloud Inference Deployment",
        duration: "3-4 Weeks",
        focus: "Productionizing ML pipelines, containerization, and REST API deployment",
        topics: [
          "FastAPI Model Serving: Asynchronous Batch Inference & Schema Validation",
          "Containerization: Dockerizing PyTorch/ONNX Runtime inference servers",
          "CI/CD for ML: Automated Model Evaluation & Registry (MLflow)",
          "Cloud Deployment: AWS EC2/SageMaker or Azure ML Serverless Endpoints"
        ],
        milestone_project: "Production-Grade High-Throughput AI Inference Microservice with Docker & FastAPI",
        key_tools: ["FastAPI", "Docker", "MLflow", "ONNX Runtime", "AWS/Azure"],
        recommended_course_name: "Cloud Infrastructure & DevOps Engineering",
        completed: hasSkill('docker') && hasSkill('cloud')
      }
    ];
  }

  if (normalizedRoleId.includes('data') || normalizedRoleName.includes('data') || normalizedRoleName.includes('analyst')) {
    return [
      {
        step: 1,
        title: "Foundational Analytics, Excel & Financial Modeling",
        duration: "3-4 Weeks",
        focus: "Data preparation, advanced spreadsheet formulas, and statistical modeling",
        topics: [
          "Advanced Formulas: XLOOKUP, INDEX/MATCH, Dynamic Array Formulas",
          "Pivot Tables, Slicers, and Executive Dashboard Formatting",
          "Descriptive Statistics: Mean, Median, Variance, Skewness, Standard Deviation",
          "Financial Modeling & What-If Scenario Analysis (Goal Seek, Data Tables)"
        ],
        milestone_project: "Executive Budget & Revenue Forecasting Model for Maharashtra MSMEs",
        key_tools: ["Microsoft Excel", "Power Query", "Google Sheets"],
        recommended_course_name: "Advanced Data Science with Python",
        completed: hasSkill('excel')
      },
      {
        step: 2,
        title: "Relational Querying & Database Architecture with SQL",
        duration: "4 Weeks",
        focus: "Complex SQL querying, multi-table joins, aggregations, and window functions",
        topics: [
          "Database Normalization (1NF, 2NF, 3NF) & Relational Schema Design",
          "Advanced Filtering, Multi-Table INNER/LEFT/FULL OUTER JOINs",
          "Common Table Expressions (CTEs) & Subqueries",
          "Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD()",
          "Index Tuning & Execution Plan Performance Optimization"
        ],
        milestone_project: "Statewide Polytechnic Admission & Placement Data Warehouse Schema Design",
        key_tools: ["PostgreSQL", "MySQL", "DBeaver", "pgAdmin"],
        recommended_course_name: "Advanced Data Science with Python",
        completed: hasSkill('sql')
      },
      {
        step: 3,
        title: "Interactive Business Intelligence Dashboards with Power BI",
        duration: "4-5 Weeks",
        focus: "ETL data extraction, star-schema data modeling, and DAX calculations",
        topics: [
          "Power Query M-Code: Data Ingestion, Cleaning & Transformation",
          "Star Schema Modeling, Relationships, Cardinality & Cross-Filtering",
          "DAX Mastery: CALCULATE(), FILTER(), ALL(), Time Intelligence Functions",
          "Interactive Visualizations: Drill-down Charts, Bookmarks, and KPI Cards"
        ],
        milestone_project: "Live Maharashtra District Labour Demand & Placement KPI Dashboard",
        key_tools: ["Power BI Desktop", "DAX Studio", "Tableau Public"],
        recommended_course_name: "Advanced Data Science with Python",
        completed: hasSkill('power bi')
      },
      {
        step: 4,
        title: "Python for Data Analysis, Cleaning & EDA",
        duration: "5 Weeks",
        focus: "Automating data workflows, statistical exploration, and visual storytelling",
        topics: [
          "Pandas DataFrames: Filtering, GroupBy, Merging, Pivot Tables & Aggregations",
          "Data Cleaning: Handling Nulls, Deduplication, String Manipulation, Regex",
          "Exploratory Data Analysis (EDA): Correlation Matrices, Outlier Detection",
          "Data Visualization: Matplotlib, Seaborn & Interactive Plotly Charts"
        ],
        milestone_project: "Automated Data Cleaning & Reporting Pipeline on 50,000+ Maharashtra Job Postings",
        key_tools: ["Python", "Pandas", "NumPy", "Seaborn", "Plotly"],
        recommended_course_name: "Advanced Data Science with Python",
        completed: hasSkill('python')
      },
      {
        step: 5,
        title: "Cloud Data Warehousing & Capstone Portfolio Presentation",
        duration: "3 Weeks",
        focus: "Connecting to cloud data lakes, automated ETL refreshes, and portfolio creation",
        topics: [
          "Cloud Data Warehouse Basics: Amazon Redshift, Google BigQuery, Snowflake",
          "Scheduled ETL Pipelines & Automated Data Refreshes",
          "Analytical Storytelling & Executive Presentation Skills",
          "GitHub Portfolio Building & Interactive Live Dashboard Hosting"
        ],
        milestone_project: "Public End-to-End Labour Market Intelligence Dashboard with GitHub Documentation",
        key_tools: ["AWS Athena", "BigQuery", "GitHub", "Power BI Service"],
        recommended_course_name: "Cloud Infrastructure & DevOps Engineering",
        completed: hasSkill('cloud')
      }
    ];
  }

  if (normalizedRoleId.includes('cloud') || normalizedRoleName.includes('cloud') || normalizedRoleName.includes('devops')) {
    return [
      {
        step: 1,
        title: "Linux Administration & Networking Foundations",
        duration: "3-4 Weeks",
        focus: "Command line proficiency, user management, and core networking protocols",
        topics: [
          "Linux Shell: Bash Scripting, File Permissions, Cron Jobs, SSH Key Pairs",
          "Networking Fundamentals: OSI Model, TCP/IP, Subnetting, CIDR, DNS, HTTP/S",
          "Process Monitoring & Systemd Service Management (journalctl, top, htop)",
          "Version Control with Git: Branching, Rebasing, Pull Requests, Merge Conflict Resolution"
        ],
        milestone_project: "Automated Linux Server Hardening & Health Monitoring Bash Suite",
        key_tools: ["Ubuntu Server", "Bash", "Git", "Wireshark", "OpenSSH"],
        recommended_course_name: "Cloud Infrastructure & DevOps Engineering",
        completed: hasSkill('linux') || hasSkill('git')
      },
      {
        step: 2,
        title: "Public Cloud Architecture & Core Services (AWS/Azure)",
        duration: "4 Weeks",
        focus: "Compute, storage, networking, and identity management in public clouds",
        topics: [
          "Compute: AWS EC2 Instances, Auto-Scaling Groups, Application Load Balancers",
          "Virtual Private Cloud (VPC): Public/Private Subnets, NAT Gateways, Security Groups",
          "Storage: S3 Bucket Policies, EBS Volume Types, EFS Shared Filesystems",
          "Identity & Access Management (IAM): Roles, Policies, Principle of Least Privilege"
        ],
        milestone_project: "High-Availability Multi-AZ Web Infrastructure on AWS with Auto-Scaling",
        key_tools: ["AWS Management Console", "AWS CLI", "Azure Portal", "CloudWatch"],
        recommended_course_name: "Cloud Infrastructure & DevOps Engineering",
        completed: hasSkill('cloud') || hasSkill('aws')
      },
      {
        step: 3,
        title: "Containerization & Microservices with Docker",
        duration: "4 Weeks",
        focus: "Packaging applications into lightweight, reproducible container images",
        topics: [
          "Docker Architecture: Images, Containers, Storage Volumes & Bridge Networks",
          "Dockerfile Optimization: Multi-Stage Builds, Alpine Base Images, Caching Layers",
          "Multi-Container Applications with Docker Compose",
          "Image Registry Management: Docker Hub, AWS Elastic Container Registry (ECR)"
        ],
        milestone_project: "Containerize Full-Stack Node.js & PostgreSQL Application with Docker Compose",
        key_tools: ["Docker", "Docker Compose", "AWS ECR", "Alpine Linux"],
        recommended_course_name: "Cloud Infrastructure & DevOps Engineering",
        completed: hasSkill('docker')
      },
      {
        step: 4,
        title: "Kubernetes Orchestration & CI/CD Pipelines",
        duration: "5 Weeks",
        focus: "Automating container deployment, scaling, and continuous delivery",
        topics: [
          "Kubernetes Core: Pods, Deployments, Services (ClusterIP, NodePort, LoadBalancer)",
          "ConfigMaps, Secrets, Ingress Controllers, and Persistent Volume Claims",
          "Helm Package Manager: Creating and Templating Kubernetes Charts",
          "CI/CD Automation: GitHub Actions Workflows (Build, Test, Push, Deploy)"
        ],
        milestone_project: "Zero-Downtime Rolling Deployment Pipeline for Microservices on Kubernetes",
        key_tools: ["Kubernetes", "Minikube/k3s", "Helm", "GitHub Actions"],
        recommended_course_name: "Cloud Infrastructure & DevOps Engineering",
        completed: hasSkill('kubernetes')
      },
      {
        step: 5,
        title: "Infrastructure as Code (Terraform) & Cloud Security",
        duration: "3-4 Weeks",
        focus: "Declarative infrastructure management and cloud security compliance",
        topics: [
          "Terraform Fundamentals: Providers, Resources, Variables, State Management",
          "Modular Infrastructure as Code (IaC) & Remote State Locking (S3/DynamoDB)",
          "Cloud Security Best Practices: KMS Encryption at Rest, Secrets Manager",
          "Site Reliability: Uptime Monitoring, Log Aggregation, Cost Optimization"
        ],
        milestone_project: "100% Terraform-Automated Production Cloud Infrastructure Deployment",
        key_tools: ["Terraform", "AWS KMS", "Prometheus", "Grafana"],
        recommended_course_name: "Enterprise Cybersecurity & Threat Defense",
        completed: false
      }
    ];
  }

  if (normalizedRoleId.includes('ev') || normalizedRoleName.includes('ev') || normalizedRoleName.includes('battery')) {
    return [
      {
        step: 1,
        title: "High-Voltage Electrical Fundamentals & Safety Protocols",
        duration: "3 Weeks",
        focus: "HV electrical safety, arc flash precautions, and multimeter diagnostics",
        topics: [
          "High Voltage AC/DC Principles: Voltage, Current, Resistance, Power Factor",
          "Safety Standards: ISO 6469, NFPA 70E, Personal Protective Equipment (PPE)",
          "Manual Service Disconnect (MSD) & High-Voltage De-energization Procedures",
          "Precision Measurement: Megohmmeters, Insulation Resistance Testing"
        ],
        milestone_project: "Complete HV De-energization & Insulation Integrity Testing Verification Protocol",
        key_tools: ["Megger Insulation Tester", "Fluke Multimeter", "CAT IV PPE", "Safety Lockouts"],
        recommended_course_name: "EV Powertrain & Battery Diagnostics",
        completed: hasSkill('ev') || hasSkill('electrical')
      },
      {
        step: 2,
        title: "Lithium-Ion Battery Chemistries & Battery Management Systems (BMS)",
        duration: "4 Weeks",
        focus: "Cell chemistries, state of charge/health, cell balancing, and thermal management",
        topics: [
          "Battery Chemistries: LFP, NMC, NCA, Energy Density & Degradation Mechanisms",
          "Battery Management Systems (BMS): Cell Voltage Monitoring, Over-current Protection",
          "Passive & Active Cell Balancing Strategies",
          "State of Charge (SoC) & State of Health (SoH) Estimation Algorithms"
        ],
        milestone_project: "Lithium-ion Pack Cell Balancing & Thermal Runaway Protection Protocol Modeling",
        key_tools: ["BMS Diagnostic Software", "Battery Cycler", "Thermographic Camera"],
        recommended_course_name: "EV Powertrain & Battery Diagnostics",
        completed: hasSkill('battery') || hasSkill('bms')
      },
      {
        step: 3,
        title: "Electric Traction Motors & Inverter Power Electronics",
        duration: "4 Weeks",
        focus: "Permanent Magnet Synchronous Motors, inverters, and regenerative braking",
        topics: [
          "Motor Types: Permanent Magnet Synchronous Motors (PMSM), Induction Motors",
          "Power Inverters: IGBT and SiC MOSFET Switching, Pulse Width Modulation (PWM)",
          "Resolver & Rotor Position Sensor Calibration",
          "Regenerative Braking Systems: Kinetic Energy Recovery & Deceleration Mapping"
        ],
        milestone_project: "PMSM Motor Inverter Drive Calibration & Resolver Phasing Diagnostic Routine",
        key_tools: ["Digital Oscilloscope", "Current Clamps", "Dynamometer"],
        recommended_course_name: "EV Powertrain & Battery Diagnostics",
        completed: false
      },
      {
        step: 4,
        title: "CAN-Bus Telematics & OBD-II Diagnostic Troubleshooting",
        duration: "4 Weeks",
        focus: "Automotive communication networks, DTC diagnostic trouble codes, and harness repair",
        topics: [
          "Controller Area Network (CAN): High-Speed CAN, CAN-FD, Baud Rates, Message Frames",
          "OBD-II Diagnostic Protocols (SAE J1979, UDS ISO 14229)",
          "Wiring Harness Inspection, Terminal Pin Extraction & Environmental Sealing",
          "Diagnostic Trouble Code (DTC) Analysis: P0A80, P0AA6, P0A1F EV fault codes"
        ],
        milestone_project: "Decode Real-Time CAN-Bus Telemetry Packets & Diagnose Intermittent EV Faults",
        key_tools: ["CANalyzer / PCAN", "OBD-II EV Scanner", "PicoScope", "Terminal Repair Kit"],
        recommended_course_name: "EV Powertrain & Battery Diagnostics",
        completed: hasSkill('can') || hasSkill('diagnostics')
      },
      {
        step: 5,
        title: "ARAI Compliance, Charging Standards & Vehicle Road Test Capstone",
        duration: "3-4 Weeks",
        focus: "Indian regulatory compliance, Bharat EV standards, and road-ready validation",
        topics: [
          "Charging Standards: AC Type-2, CCS-2, CHAdeMO, Bharat EV AC-001/DC-001",
          "Automotive Research Association of India (ARAI) AIS 038 & AIS 156 Standards",
          "Combined Charging System (CCS2) Pilot Line & Proximity Handshake Sequencing",
          "Pre-Delivery Inspection (PDI) & Road-Testing Certification Protocol"
        ],
        milestone_project: "Complete AIS-156 Safety Audit & Fast Charging Protocol Verification for EV 2/4 Wheelers",
        key_tools: ["EVSE Test Kit", "CCS2 Simulator", "Vehicle Diagnostic Suite"],
        recommended_course_name: "EV Powertrain & Battery Diagnostics",
        completed: false
      }
    ];
  }

  if (normalizedRoleId.includes('cyber') || normalizedRoleName.includes('cyber')) {
    return [
      {
        step: 1,
        title: "Networking Protocols & Enterprise Security Architecture",
        duration: "3-4 Weeks",
        focus: "TCP/IP, packet analysis, network defense devices, and cryptography",
        topics: [
          "Packet-Level Analysis: TCP 3-Way Handshake, DNS, DHCP, TLS 1.3 Handshake",
          "Wireshark Deep Dive: Packet Filtering, Stream Reassembly, Anomaly Detection",
          "Firewalls, IDS/IPS (Suricata/Snort), and DMZ Architectural Segmentation",
          "Applied Cryptography: Symmetric vs Asymmetric Ciphers, PKI, Digital Signatures"
        ],
        milestone_project: "Sniff & Analyze Malicious Traffic in Wireshark; Formulate Firewall Rules",
        key_tools: ["Wireshark", "Suricata", "Nmap", "OpenSSL"],
        recommended_course_name: "Enterprise Cybersecurity & Threat Defense",
        completed: hasSkill('networking') || hasSkill('cybersecurity')
      },
      {
        step: 2,
        title: "Vulnerability Assessment & Penetration Testing Fundamentals",
        duration: "4 Weeks",
        focus: "Scanning tools, reconnaissance, vulnerability scanning, and ethical hacking",
        topics: [
          "Reconnaissance: OSINT, Nmap Port Scanning, Banner Grabbing",
          "Vulnerability Scanners: Nessus, OpenVAS, CVE Scoring & Risk Prioritization",
          "Linux & Windows Privilege Escalation Basics",
          "Metasploit Framework: Exploits, Payloads, Meterpreter Post-Exploitation"
        ],
        milestone_project: "Comprehensive Vulnerability Assessment Report for Maharashtra State Portal Architecture",
        key_tools: ["Kali Linux", "Nessus", "OpenVAS", "Metasploit"],
        recommended_course_name: "Enterprise Cybersecurity & Threat Defense",
        completed: false
      },
      {
        step: 3,
        title: "Web Application Security & OWASP Top 10 Defenses",
        duration: "4 Weeks",
        focus: "Identifying and mitigating critical web application vulnerabilities",
        topics: [
          "OWASP Top 10: SQL Injection, Cross-Site Scripting (XSS), CSRF, SSRF",
          "Broken Object Level Authorization (BOLA) & Insecure Direct Object References",
          "Burp Suite Professional: Intercepting Proxies, Repeater, Intruder, Automated Scanners",
          "Secure Code Review & Input Sanitization Frameworks"
        ],
        milestone_project: "Audit & Remediate OWASP Top 10 Flaws in Vulnerable Banking/Gov Application",
        key_tools: ["Burp Suite", "OWASP ZAP", "Postman", "SonarQube"],
        recommended_course_name: "Enterprise Cybersecurity & Threat Defense",
        completed: false
      },
      {
        step: 4,
        title: "Security Operations Center (SOC) & SIEM Threat Monitoring",
        duration: "4-5 Weeks",
        focus: "Log aggregation, incident detection, Splunk SPL queries, and alert triaging",
        topics: [
          "SIEM Architectures: Log Ingestion, Normalization, Event Correlation",
          "Splunk Search Processing Language (SPL): Dashboards, Alerts, Real-Time Monitors",
          "MITRE ATT&CK Framework: Mapping Adversary Tactics, Techniques & Procedures (TTPs)",
          "Incident Response Playbooks: Phishing, Ransomware Containment, Malware Triage"
        ],
        milestone_project: "Build Real-Time SOC Detection Rules for Brute Force & Lateral Movement in Splunk",
        key_tools: ["Splunk", "Elastic SIEM", "Wazuh", "Sysmon"],
        recommended_course_name: "Enterprise Cybersecurity & Threat Defense",
        completed: false
      },
      {
        step: 5,
        title: "Incident Response, Digital Forensics & CERT-In Compliance",
        duration: "3 Weeks",
        focus: "Forensic image acquisition, memory analysis, and Indian cybersecurity compliance",
        topics: [
          "Memory Forensics with Volatility: Extracting Process Trees & Injected DLLs",
          "Disk Forensics: Autopsy, FTK Imager, File System Carving, Timeline Analysis",
          "Indian Regulatory Compliance: CERT-In 6-Hour Mandatory Cyber Incident Reporting",
          "Post-Incident Root Cause Analysis & Executive Executive Debriefing"
        ],
        milestone_project: "End-to-End Forensic Investigation & CERT-In Incident Report for Simulated Breach",
        key_tools: ["Volatility", "Autopsy", "FTK Imager", "YARA Rules"],
        recommended_course_name: "Enterprise Cybersecurity & Threat Defense",
        completed: false
      }
    ];
  }

  // Default Full Stack Web Developer
  return [
    {
      step: 1,
      title: "Core Web Fundamentals, JavaScript & Modern Tooling",
      duration: "3-4 Weeks",
      focus: "HTML5 semantic markup, CSS3 layout mastery, and modern ES6+ JavaScript",
      topics: [
        "Semantic HTML5 & WCAG 2.1 Accessibility (a11y) Standards",
        "Modern CSS: Flexbox, CSS Grid, Tailwind CSS Design Systems",
        "JavaScript ES6+: Closures, Event Loop, Promises, Async/Await, Array Methods",
        "Version Control with Git & GitHub Collaboration Workflows"
      ],
      milestone_project: "Build a Fully Responsive Maharashtra Tourism & Cultural Portal with Tailwind",
      key_tools: ["JavaScript ES6+", "HTML5/CSS3", "Tailwind CSS", "Git", "VS Code"],
      recommended_course_name: "Modern Full Stack Web Development",
      completed: hasSkill('javascript') || hasSkill('html')
    },
    {
      step: 2,
      title: "Frontend Engineering with React 19 & Component Architecture",
      duration: "4 Weeks",
      focus: "Declarative component design, hooks, client routing, and state management",
      topics: [
        "React Fundamentals: JSX, Props, State, Component Lifecycle",
        "Advanced React Hooks: useState, useEffect, useMemo, useCallback, useRef",
        "Client-Side Routing with React Router v7 & Protected Route Guards",
        "Global State Management & Asynchronous Data Fetching (TanStack Query)"
      ],
      milestone_project: "Interactive Real-Time Candidate Job Application Portal in React 19",
      key_tools: ["React 19", "Vite", "React Router", "Lucide Icons"],
      recommended_course_name: "Modern Full Stack Web Development",
      completed: hasSkill('react')
    },
    {
      step: 3,
      title: "Backend API Engineering with Node.js, Express & FastAPI",
      duration: "4-5 Weeks",
      focus: "RESTful architecture, middleware design, JWT authentication, and validation",
      topics: [
        "Node.js Event-Driven Architecture & Express Router Middleware",
        "FastAPI Asynchronous Endpoint Design with Pydantic Data Validation",
        "Secure Authentication: Password Hashing (Bcrypt) & JWT Tokens (HS256)",
        "API Error Handling, Rate Limiting, CORS & Input Sanitization"
      ],
      milestone_project: "Production-Grade Secure RBAC REST API with Express and FastAPI",
      key_tools: ["Node.js", "Express", "FastAPI", "JWT", "Bcrypt"],
      recommended_course_name: "Modern Full Stack Web Development",
      completed: hasSkill('node') || hasSkill('api')
    },
    {
      step: 4,
      title: "Relational & NoSQL Database Integration (PostgreSQL & MongoDB)",
      duration: "4 Weeks",
      focus: "Schema design, relational constraints, ORM/ODM integration, and indexing",
      topics: [
        "Relational Schema Design & SQL Queries: Foreign Keys, Indexes, Transactions",
        "Object Relational Mapping (ORM): Prisma & SQLAlchemy ORM",
        "NoSQL Document Modeling with MongoDB & Mongoose",
        "Caching & Session Management with In-Memory Redis"
      ],
      milestone_project: "High-Performance Multi-Tenant Database Schema with Connection Pooling & Redis Cache",
      key_tools: ["PostgreSQL", "MongoDB", "SQLAlchemy", "Redis"],
      recommended_course_name: "Modern Full Stack Web Development",
      completed: hasSkill('sql') || hasSkill('mongodb')
    },
    {
      step: 5,
      title: "Production Deployment, Docker & CI/CD Cloud Automation",
      duration: "3-4 Weeks",
      focus: "Containerizing services, deploying to cloud hosts, and continuous integration",
      topics: [
        "Docker Multi-Stage Containerization for React and Node Services",
        "Nginx Reverse Proxy & SSL/TLS Certificate Configuration (Certbot)",
        "Automated CI/CD Workflows with GitHub Actions (Test, Build, Deploy)",
        "Cloud Hosting on AWS / Render / Vercel with Environment Secret Management"
      ],
      milestone_project: "Deploy Scalable Full-Stack Web Application with Custom Domain and Automated CI/CD",
      key_tools: ["Docker", "Nginx", "GitHub Actions", "AWS / Vercel"],
      recommended_course_name: "Cloud Infrastructure & DevOps Engineering",
      completed: hasSkill('docker') && hasSkill('cloud')
    }
  ];
}

// Get all detailed course curricula
router.get('/curricula', (req, res) => {
  res.json({
    curricula: COURSE_CURRICULA,
    total: Object.keys(COURSE_CURRICULA).length
  });
});

// Student Career Guidance Assessment Endpoint
router.post('/assess', async (req, res) => {
  const { current_skills, target_role_id, district, education_level, selected_course_ids } = req.body;
  const userSkills = (current_skills || []).map(s => s.toLowerCase());

  const jobRoles = store.get('job_roles') || [];
  const allCourses = store.get('courses') || [];

  const targetRole = jobRoles.find(r => r.id === target_role_id) || jobRoles[0] || {
    id: "role-ai-engineer",
    role_name: "AI & Machine Learning Engineer",
    sector: "Information Technology",
    avg_salary_lpa: 10.5,
    open_vacancies: 5400,
    skills: []
  };

  // Determine active course IDs: from selected_course_ids or default from role/sector
  let activeCourseIds = Array.isArray(selected_course_ids) && selected_course_ids.length > 0
    ? selected_course_ids
    : [];

  if (activeCourseIds.length === 0) {
    // Map target role to recommended primary course
    const normalizedRoleId = (targetRole.id || '').toLowerCase();
    const normalizedRoleName = (targetRole.role_name || '').toLowerCase();

    if (normalizedRoleId.includes('ai') || normalizedRoleName.includes('ai') || normalizedRoleName.includes('machine learning')) {
      activeCourseIds = ['course-ai-foundations'];
    } else if (normalizedRoleId.includes('cloud') || normalizedRoleId.includes('devops') || normalizedRoleId.includes('web') || normalizedRoleName.includes('full stack')) {
      activeCourseIds = ['course-fullstack-cloud'];
    } else if (normalizedRoleId.includes('data') || normalizedRoleName.includes('data') || normalizedRoleName.includes('analyst')) {
      activeCourseIds = ['course-data-analytics'];
    } else if (normalizedRoleId.includes('ev') || normalizedRoleName.includes('ev') || normalizedRoleName.includes('battery')) {
      activeCourseIds = ['course-ev-powertrain'];
    } else if (normalizedRoleId.includes('robot') || normalizedRoleName.includes('robot') || normalizedRoleName.includes('automation')) {
      activeCourseIds = ['course-industrial-robotics'];
    } else if (normalizedRoleId.includes('cyber') || normalizedRoleName.includes('cyber') || normalizedRoleName.includes('security')) {
      activeCourseIds = ['course-cybersecurity'];
    } else {
      activeCourseIds = ['course-ai-foundations'];
    }
  }

  // 1. Generate dynamic course-based learning progression roadmap
  const roadmapSteps = generateRoadmapFromCourses(activeCourseIds, current_skills || [], targetRole);

  // 2. Fetch complete unit-by-unit syllabi with topics, labs & tools for selected courses
  const courseSyllabi = getSyllabusForCourses(activeCourseIds);

  // 3. Assemble detailed course objects
  const selectedCoursesDetail = activeCourseIds.map(id => {
    const fromStore = allCourses.find(c => c.id === id);
    const fromCurricula = COURSE_CURRICULA[id];
    if (fromStore && fromCurricula) return { ...fromStore, ...fromCurricula };
    if (fromCurricula) return fromCurricula;
    if (fromStore) return fromStore;
    return { id, course_name: id, sector: targetRole.sector, duration: "6 Months" };
  });

  // 4. Calculate diagnostic skill coverage based on selected courses and target role
  const targetRoleSkills = targetRole.skills || [];
  const skillsUserHas = [];
  const skillsUserNeeds = [];

  // Skills required by role and covered by courses
  const skillsSetToAssess = new Set();
  targetRoleSkills.forEach(s => skillsSetToAssess.add(s.skill_name));
  selectedCoursesDetail.forEach(c => {
    (c.skills_covered || []).forEach(sk => skillsSetToAssess.add(sk));
  });

  skillsSetToAssess.forEach(skillName => {
    const hasSkill = userSkills.some(us => 
      us.includes(skillName.toLowerCase()) || 
      skillName.toLowerCase().includes(us)
    );
    if (hasSkill) {
      skillsUserHas.push(skillName);
    } else {
      skillsUserNeeds.push(skillName);
    }
  });

  const totalSkillsCount = skillsSetToAssess.size || 1;
  const careerMatch = Math.round((skillsUserHas.length / totalSkillsCount) * 100);

  // 5. Filter all recommended verified courses across Maharashtra
  const recommendedCourses = allCourses.filter(c => 
    c.status !== 'Low Demand / Obsolete' && (
      c.sector === targetRole.sector || 
      activeCourseIds.includes(c.id) ||
      (targetRole.sector === 'Information Technology' && c.sector === 'Information Technology')
    )
  );

  // 6. Fetch Groq LLaMA 3 personalized mentor advice with selected courses context
  let mentorAdvice = null;
  try {
    const courseNamesStr = selectedCoursesDetail.map(c => c.course_name).join(', ');
    mentorAdvice = await groqService.generateCareerAdvice({
      userSkills: current_skills || [],
      targetRole,
      district: district || "Pune",
      educationLevel: education_level || "Diploma",
      selectedCourses: courseNamesStr
    });
  } catch (err) {
    console.warn('[CareerGuidanceRoutes] Groq mentor advice warning:', err.message);
  }

  res.json({
    assessment: {
      target_role: targetRole.role_name,
      sector: targetRole.sector,
      district: district || "Pune",
      education_level: education_level || "B.Tech / Polytechnic Diploma",
      career_match_percentage: careerMatch,
      skills_you_have: skillsUserHas,
      skills_you_need: skillsUserNeeds,
      average_salary_lpa: targetRole.avg_salary_lpa,
      open_vacancies: targetRole.open_vacancies,
      selected_course_ids: activeCourseIds,
      selected_courses: selectedCoursesDetail,
      course_syllabi: courseSyllabi,
      roadmap: roadmapSteps,
      recommended_courses: recommendedCourses,
      ai_mentor: mentorAdvice,
      ai_engine: {
        provider: 'Groq Cloud',
        model: groqService.getActiveModel(),
        source: mentorAdvice?.source || 'local:fallback'
      }
    }
  });
});

module.exports = router;
