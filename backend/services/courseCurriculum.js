/**
 * Comprehensive Course Curriculum & Syllabus Registry for Maharashtra Technical Courses
 * Provides unit-by-unit breakdown, topics to learn, lab practicals, tech stacks, and
 * dynamic roadmap synthesis based on student course selections.
 */

const COURSE_CURRICULA = {
  "course-ai-foundations": {
    id: "course-ai-foundations",
    course_name: "Applied Artificial Intelligence & Machine Learning",
    institution_name: "Veermata Jijabai Technological Institute (VJTI Hub)",
    sector: "Information Technology",
    district: "Mumbai Suburban",
    duration: "9 Months",
    credits: 36,
    certification: "Maharashtra State Council for Vocational Training (MSCVT) Level-8 Diploma in AI",
    overview: "Industry-aligned artificial intelligence curriculum focused on machine learning algorithms, deep neural networks, computer vision, generative AI with LLMs, and high-throughput MLOps deployment.",
    prerequisites: ["Basic Programming Concepts", "High School Mathematics / Calculus"],
    career_pathways: ["AI/ML Engineer", "Data Scientist", "LLM Application Developer", "MLOps Engineer"],
    capstone_project: "Autonomous Multi-Modal Industrial Quality Assurance System using Vision Transformers & LLaMA 3 RAG",
    units: [
      {
        unit_number: 1,
        title: "Mathematical Foundations & High-Performance Python",
        duration: "4 Weeks (48 Hours)",
        focus: "Linear algebra, multivariable calculus, probability, and vectorized computing",
        topics: [
          "Linear Algebra for ML: Vectors, Dot Products, Matrices, Eigenvalues & SVD",
          "Calculus & Optimization: Partial Derivatives, Gradients, Jacobians, and Gradient Descent",
          "High-Performance Python: NumPy Arrays, Broadcasting, and Vectorized Computation",
          "Data Wrangling: Pandas DataFrames, Reshaping, Multi-Indexing & Time-Series Operations",
          "Exploratory Data Analysis: Statistical Distributions, Seaborn & Matplotlib Visualization"
        ],
        practical_lab: "Lab 1: Implement an End-to-End Multivariable Stochastic Gradient Descent Optimizer from Scratch in Pure NumPy without high-level libraries.",
        key_tools: ["Python 3.12", "NumPy", "Pandas", "Matplotlib", "JupyterLab"],
        learning_outcomes: "Students master vector calculus and can transform unstructured raw datasets into normalized numerical tensors."
      },
      {
        unit_number: 2,
        title: "Classical Machine Learning & Statistical Modeling",
        duration: "5 Weeks (60 Hours)",
        focus: "Supervised and unsupervised learning, feature engineering, and cross-validation",
        topics: [
          "Supervised Learning: Linear & Logistic Regression, Regularization (L1 Lasso / L2 Ridge)",
          "Ensemble Tree Methods: Decision Trees, Random Forests, AdaBoost, and Gradient Boosting (XGBoost, LightGBM)",
          "Unsupervised Learning: K-Means Clustering, Hierarchical Clustering, DBSCAN, and PCA Dimensionality Reduction",
          "Feature Engineering: Target Encoding, Polynomial Features, Imputation Strategies & Pipelines",
          "Model Evaluation & Hyperparameter Optimization: Stratified K-Fold, ROC-AUC, PR Curves, Optuna"
        ],
        practical_lab: "Lab 2: Maharashtra Industrial Energy Consumption Predictive Model with Automated Pipeline, Hyperparameter Tuning via Optuna, and XGBoost.",
        key_tools: ["Scikit-Learn", "XGBoost", "LightGBM", "Optuna", "Joblib"],
        learning_outcomes: "Build production-grade machine learning pipelines with rigorous cross-validation and leakage prevention."
      },
      {
        unit_number: 3,
        title: "Deep Learning Architectures & Computer Vision with PyTorch",
        duration: "6 Weeks (72 Hours)",
        focus: "Neural network mechanics, backpropagation, CNNs, and computer vision",
        topics: [
          "Neural Network Mechanics: Perceptrons, Multi-Layer Perceptrons (MLPs), Activation Functions (ReLU, GELU)",
          "Loss Optimization & Backpropagation: Computational Graphs, Autograd, AdamW Optimizer, Learning Rate Schedulers",
          "Convolutional Neural Networks (CNNs): Kernels, Convolutions, Stride, Pooling, Batch Normalization",
          "Modern Vision Backbones: ResNet, EfficientNet, MobileNet, and Transfer Learning Strategies",
          "Object Detection & Segmentation: YOLOv10 Architecture, Anchor Boxes, Non-Maximum Suppression (NMS)"
        ],
        practical_lab: "Lab 3: Train and fine-tune a YOLOv10/ResNet-50 defect detector on industrial automotive component surface cracks with PyTorch and CUDA.",
        key_tools: ["PyTorch 2.4", "Torchvision", "CUDA / cuDNN", "TensorBoard", "Roboflow"],
        learning_outcomes: "Ability to construct custom PyTorch datasets, train deep convolutional networks, and deploy real-time vision detectors."
      },
      {
        unit_number: 4,
        title: "Generative AI, Large Language Models & Prompt Engineering",
        duration: "6 Weeks (72 Hours)",
        focus: "Transformer architectures, embeddings, Retrieval-Augmented Generation (RAG), and agentic workflows",
        topics: [
          "Attention Mechanisms & Transformers: Scaled Dot-Product Attention, Multi-Head Attention, Positional Encoding",
          "HuggingFace Ecosystem: Model Hub, Tokenizers, AutoModel, Quantization (BitsAndBytes, QLoRA)",
          "Embeddings & Vector Databases: Dense Vector Spaces, Cosine Similarity, ChromaDB, Milvus, and FAISS",
          "Retrieval-Augmented Generation (RAG): Chunking strategies, Semantic Re-ranking, HyDE, Multi-Query Retrievers",
          "Agentic Workflows & Prompt Engineering: Chain-of-Thought, ReAct pattern, LangChain, and Groq API tool-calling"
        ],
        practical_lab: "Lab 4: Build a production-grade Marathi & English Bilingual Citizen Services Scheme Advisor using LangChain, ChromaDB, and Groq Cloud LLaMA 3.",
        key_tools: ["LangChain", "HuggingFace", "ChromaDB", "Groq API", "Llama 3.3", "Streamlit"],
        learning_outcomes: "Design, build, and evaluate enterprise RAG systems and tool-calling agentic AI workflows."
      },
      {
        unit_number: 5,
        title: "MLOps, Model Serving & High-Throughput Cloud Deployment",
        duration: "5 Weeks (60 Hours)",
        focus: "Packaging ML pipelines, REST API deployment, ONNX runtime, and monitoring",
        topics: [
          "FastAPI Asynchronous Serving: Microservice endpoints, Pydantic schemas, streaming responses",
          "Model Serialization & Optimization: ONNX Runtime, TensorRT, TorchScript, and quantization",
          "Containerization: Multi-stage Dockerfiles for ML inference with NVIDIA container runtime",
          "Model Registry & Experiment Tracking: MLflow experiment logging, model lineage, artifact storage",
          "Continuous Delivery & Monitoring: GitHub Actions CI/CD, data drift detection (Evidently AI), Prometheus metrics"
        ],
        practical_lab: "Lab 5: Containerize and deploy a high-throughput async inference microservice on AWS EC2/ECS with automated model performance telemetry.",
        key_tools: ["FastAPI", "Docker", "ONNX Runtime", "MLflow", "AWS / Render", "Prometheus"],
        learning_outcomes: "Productionize machine learning models into reliable, monitored, low-latency cloud microservices."
      }
    ]
  },

  "course-fullstack-cloud": {
    id: "course-fullstack-cloud",
    course_name: "Advanced Full Stack & Cloud Engineering",
    institution_name: "Government Polytechnic Pune",
    sector: "Information Technology",
    district: "Pune",
    duration: "8 Months",
    credits: 32,
    certification: "State Board of Technical Education (MSBTE) Certificate in Cloud & Modern Full Stack Engineering",
    overview: "Comprehensive software engineering program spanning modern frontend architecture (React 19), distributed backend APIs (Node.js & FastAPI), cloud databases (PostgreSQL & MongoDB), and AWS container orchestration.",
    prerequisites: ["Computer Science / IT Basics", "Logical Problem Solving"],
    career_pathways: ["Full Stack Web Developer", "Cloud Application Engineer", "Backend Engineer", "DevOps Specialist"],
    capstone_project: "Statewide Technical Apprenticeship Portal with Real-Time Video Interviews, JWT Auth, and AWS ECS Deployment",
    units: [
      {
        unit_number: 1,
        title: "Modern Web Standards, Semantic HTML5 & Modern ES6+ JavaScript",
        duration: "4 Weeks (48 Hours)",
        focus: "Web standards, DOM manipulation, asynchronous JavaScript, and Git collaboration",
        topics: [
          "Semantic HTML5 & Accessibility (WCAG 2.1 AA Compliance, ARIA Roles)",
          "Modern CSS & Responsive Systems: Flexbox, CSS Grid, Media Queries, Tailwind CSS Design Tokens",
          "JavaScript ES6+ In-Depth: Closures, Prototypal Inheritance, Event Loop, Microtasks vs Macrotasks",
          "Asynchronous Programming: Promises, Async/Await, Fetch API, and AbortController",
          "Modern Tooling & Version Control: Git branching strategies (Gitflow), GitHub Actions basics, Vite bundler"
        ],
        practical_lab: "Lab 1: Build a fully responsive, accessible Maharashtra e-Government portal UI with Tailwind CSS, dark mode support, and zero external JS frameworks.",
        key_tools: ["JavaScript ES6+", "HTML5/CSS3", "Tailwind CSS", "Vite", "Git & GitHub"],
        learning_outcomes: "Write maintainable, semantic code with clean UI layouts and advanced ES6+ asynchronous logic."
      },
      {
        unit_number: 2,
        title: "Frontend Engineering with React 19 & State Architecture",
        duration: "6 Weeks (72 Hours)",
        focus: "Component composition, React 19 hooks, client routing, and query management",
        topics: [
          "React 19 Fundamentals: JSX, Virtual DOM reconciliation, Props, Pure Components",
          "Advanced Hooks: useState, useEffect, useMemo, useCallback, useRef, useTransition, useActionState",
          "Single Page App Routing: React Router v7, Protected Route Guards, Dynamic Param Loaders",
          "Server State & Asynchronous Data: TanStack Query (React Query) for caching, optimistic updates, and polling",
          "Form Validation & UI Kits: React Hook Form, Zod schema validation, Lucide icons, and Tailwind styling"
        ],
        practical_lab: "Lab 2: Create a high-performance Real-Time Job Application & Profile Management SPA in React 19 with optimistic updates and client-side validation.",
        key_tools: ["React 19", "React Router v7", "TanStack Query", "Zod", "Lucide Icons"],
        learning_outcomes: "Develop complex interactive web applications with robust state management and optimal rendering performance."
      },
      {
        unit_number: 3,
        title: "Scalable Backend APIs with Node.js, Express & FastAPI",
        duration: "6 Weeks (72 Hours)",
        focus: "RESTful architecture, asynchronous event loop, JWT authentication, and security middleware",
        topics: [
          "Node.js Architecture: Event-Driven Non-Blocking I/O, Streams, Buffers, Worker Threads",
          "Express API Design: Router Modularization, Custom Middleware, Centralized Error Handling",
          "FastAPI Python Framework: Async endpoints, Pydantic type models, OpenAPI automated documentation",
          "Enterprise Authentication: Bcrypt password hashing, JSON Web Tokens (JWT), Refresh Token rotation",
          "API Security Best Practices: Rate limiting, Helmet HTTP headers, CORS policies, SQL injection prevention"
        ],
        practical_lab: "Lab 3: Build a production-grade dual-engine REST API (Express + FastAPI) with role-based access control (RBAC), JWT sessions, and audit logging.",
        key_tools: ["Node.js", "Express", "FastAPI", "JWT", "Bcrypt", "Postman / Thunder Client"],
        learning_outcomes: "Design secure, robust, and well-documented REST APIs conforming to enterprise industry standards."
      },
      {
        unit_number: 4,
        title: "Relational & NoSQL Database Engineering (PostgreSQL & MongoDB)",
        duration: "5 Weeks (60 Hours)",
        focus: "Relational schema design, SQL optimization, transactions, and document databases",
        topics: [
          "Relational Database Design: 1NF, 2NF, 3NF Normalization, Primary/Foreign Keys, Cascade Rules",
          "Advanced SQL: Multi-table JOINs, Subqueries, Common Table Expressions (CTEs), Window Functions",
          "Database Indexing & Performance: B-Tree Indexes, EXPLAIN ANALYZE execution plans, Connection Pooling",
          "Object-Relational Mapping (ORM): Prisma ORM & SQLAlchemy migrations and schemas",
          "NoSQL Modeling: MongoDB Collections, Aggregation Pipeline, Mongoose schemas, and Redis in-memory cache"
        ],
        practical_lab: "Lab 4: Design and deploy a multi-tenant PostgreSQL database with connection pooling, Prisma ORM migrations, and Redis caching for high-read endpoints.",
        key_tools: ["PostgreSQL 16", "Prisma ORM", "MongoDB", "Redis", "DBeaver"],
        learning_outcomes: "Model complex data relationships, write efficient SQL queries, and implement caching layers."
      },
      {
        unit_number: 5,
        title: "Cloud Native DevOps, Docker Containerization & CI/CD",
        duration: "5 Weeks (60 Hours)",
        focus: "Docker multi-stage packaging, reverse proxies, cloud hosting, and automated CI/CD pipelines",
        topics: [
          "Containerization with Docker: Multi-stage Dockerfiles for React and Node services, caching layers",
          "Multi-Service Orchestration: Docker Compose for local full-stack environments with health checks",
          "Web Servers & Reverse Proxies: Nginx configuration, SSL/TLS certificates with Let's Encrypt / Certbot",
          "Cloud Deployment: AWS EC2 / ECS, AWS RDS PostgreSQL, S3 asset buckets, and Vercel/Render hosting",
          "CI/CD Automation: GitHub Actions workflows to lint, run unit tests, build Docker images, and deploy"
        ],
        practical_lab: "Lab 5: Deploy the complete full-stack web application with Docker Compose, automated GitHub Actions CI/CD pipeline, and Nginx reverse proxy.",
        key_tools: ["Docker", "Docker Compose", "Nginx", "GitHub Actions", "AWS (EC2/S3/RDS)", "Render"],
        learning_outcomes: "Automate software testing, container packaging, and cloud infrastructure deployment with zero downtime."
      }
    ]
  },

  "course-data-analytics": {
    id: "course-data-analytics",
    course_name: "Diploma in Data Analytics",
    institution_name: "Maharashtra State Skill Institute (MSSI)",
    sector: "Information Technology",
    district: "Pune",
    duration: "6 Months",
    credits: 24,
    certification: "MSSDS Government of Maharashtra Certified Data Analytics Professional",
    overview: "Industry-focused program covering modern spreadsheet financial modeling, enterprise relational querying with PostgreSQL, Power BI interactive dashboarding, and Python exploratory data analysis.",
    prerequisites: ["Basic Computer Literacy", "Elementary Mathematics & Statistics"],
    career_pathways: ["Data Analyst", "Business Intelligence Developer", "MIS Executive", "Operations Analyst"],
    capstone_project: "Statewide Labour Market & Polytechnic Placement Intelligence Power BI Executive Dashboard",
    units: [
      {
        unit_number: 1,
        title: "Advanced Spreadsheet Engineering & Financial Modeling",
        duration: "3 Weeks (36 Hours)",
        focus: "Excel lookup formulas, pivot tables, data cleaning, and financial scenario models",
        topics: [
          "Advanced Functions: XLOOKUP, INDEX/MATCH, Dynamic Array Formulas (FILTER, UNIQUE, SORT)",
          "Data Cleaning: Power Query M-Engine, Unpivoting Columns, Text Delimiters, Date Transformations",
          "Statistical Modeling: Mean, Median, Mode, Standard Deviation, Regression Trendlines",
          "Executive Dashboards: Pivot Tables, Slicers, Timelines, Conditional Formatting Rules",
          "Financial & What-If Analysis: Goal Seek, Data Tables, Scenario Manager, NPV & IRR calculations"
        ],
        practical_lab: "Lab 1: Build an interactive financial budget and quarterly revenue projection model for Maharashtra agricultural MSMEs in Excel.",
        key_tools: ["Microsoft Excel 365", "Power Query", "Google Sheets"],
        learning_outcomes: "Clean messy operational data and build dynamic corporate financial models and reports."
      },
      {
        unit_number: 2,
        title: "Relational Querying & Database Warehousing with SQL",
        duration: "4 Weeks (48 Hours)",
        focus: "Complex SQL querying, multi-table joins, aggregations, and window functions",
        topics: [
          "Relational Database Principles: Tables, Primary & Foreign Keys, Data Types, Constraints",
          "Data Manipulation: SELECT, WHERE, GROUP BY, HAVING, ORDER BY, Aggregations (SUM, AVG, COUNT)",
          "Complex Joins: INNER, LEFT, RIGHT, FULL OUTER JOINs, and Self-Joins",
          "Common Table Expressions (CTEs) and Correlated Subqueries",
          "Advanced Analytical Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), NTILE()"
        ],
        practical_lab: "Lab 2: Write analytical SQL queries to extract multi-year candidate placement patterns across 36 Maharashtra districts using PostgreSQL.",
        key_tools: ["PostgreSQL", "MySQL", "DBeaver", "pgAdmin 4"],
        learning_outcomes: "Query enterprise databases, perform complex data aggregations, and write production analytical queries."
      },
      {
        unit_number: 3,
        title: "Enterprise Business Intelligence & DAX Modeling with Power BI",
        duration: "5 Weeks (60 Hours)",
        focus: "Star schema data modeling, DAX formulas, interactive visual storytelling, and KPI reports",
        topics: [
          "Data Extraction & Transformation (ETL): Power Query Editor, M-Language transformations",
          "Data Modeling: Star Schemas, Snowflake Schemas, Fact vs Dimension Tables, Relationship Cardinality",
          "DAX Calculations: CALCULATE(), FILTER(), ALL(), RELATED(), and Time Intelligence (YTD, QTD, MoM Growth)",
          "Visual Design Principles: Card KPIs, Gauge visualizers, Matrix drill-downs, Decomposition Trees",
          "Report Distribution: Bookmarks, Custom Tooltips, Power BI Service publishing, and RLS (Row-Level Security)"
        ],
        practical_lab: "Lab 3: Build a production-grade 4-page Executive Power BI Dashboard tracking Maharashtra district-level skill shortages and industrial vacancies.",
        key_tools: ["Power BI Desktop", "DAX Studio", "Power BI Service"],
        learning_outcomes: "Construct robust star schemas, author complex DAX metrics, and build executive-level dashboards."
      },
      {
        unit_number: 4,
        title: "Python for Data Analysis, Cleaning & Statistical Storytelling",
        duration: "5 Weeks (60 Hours)",
        focus: "Pandas manipulation, NumPy vectors, statistical distributions, and visualization libraries",
        topics: [
          "Python Essentials for Data: Data types, loops, list comprehensions, lambda functions",
          "Pandas DataFrames: Filtering, grouping, merging, pivot tables, and missing value imputation",
          "Exploratory Data Analysis (EDA): Correlation analysis, skewness, outlier detection with IQR and Z-scores",
          "Data Storytelling Visualizations: Matplotlib subplots, Seaborn heatmaps, box plots, and violin plots",
          "Interactive Visuals: Plotly Express interactive charts, histograms, and geographic choropleth maps"
        ],
        practical_lab: "Lab 4: Conduct an exploratory data analysis on 100,000+ Maharashtra government employment records, presenting visual insights with Seaborn and Plotly.",
        key_tools: ["Python", "Pandas", "NumPy", "Seaborn", "Plotly", "JupyterLab"],
        learning_outcomes: "Automate repetitive data cleaning tasks and communicate statistical findings through visual storytelling."
      },
      {
        unit_number: 5,
        title: "Cloud Data Warehouses & Analytics Portfolio Capstone",
        duration: "3 Weeks (36 Hours)",
        focus: "Modern data warehousing (BigQuery, Redshift), scheduled refreshes, and portfolio creation",
        topics: [
          "Modern Data Warehousing: Cloud storage, columnar storage concepts, Google BigQuery / AWS Athena",
          "Automated ETL Pipelines: Scheduled SQL views, automated data refreshes, and alerts",
          "Business Stakeholder Communication: Presenting metrics, executive summaries, data governance",
          "Portfolio Development: Publishing live dashboards to GitHub, Tableau Public, and Power BI web"
        ],
        practical_lab: "Lab 5: Deploy the complete data analytics portfolio capstone with interactive public dashboard, SQL scripts, and documentation on GitHub.",
        key_tools: ["Google BigQuery", "GitHub", "Power BI Service", "Markdown"],
        learning_outcomes: "Present and deploy analytics solutions to corporate and government stakeholders."
      }
    ]
  },

  "course-ev-powertrain": {
    id: "course-ev-powertrain",
    course_name: "Advanced EV Powertrain & Battery Diagnostics",
    institution_name: "Automotive Research & Training Center",
    sector: "Automotive & EV",
    district: "Nashik",
    duration: "6 Months",
    credits: 26,
    certification: "Automotive Skills Development Council (ASDC) Certified EV Powertrain Technician",
    overview: "Specialized vocational training on high-voltage electrical safety, Lithium-ion battery chemistries, Battery Management Systems (BMS), electric traction motors, inverters, and CAN-Bus diagnostic protocols.",
    prerequisites: ["Automotive / Electrical / Mechanical Diploma or ITI"],
    career_pathways: ["EV Powertrain Diagnostic Specialist", "Battery Pack Assembly & Test Engineer", "EV Service Engineer", "BMS Calibration Technician"],
    capstone_project: "Complete Teardown, Cell Balancing, BMS Calibration & AIS-156 Compliance Audit on an Electric 2-Wheeler / 3-Wheeler Powertrain",
    units: [
      {
        unit_number: 1,
        title: "High-Voltage Electrical Fundamentals & Safety Protocols",
        duration: "3 Weeks (36 Hours)",
        focus: "High-voltage safety, arc-flash protection, isolation testing, and safety standards",
        topics: [
          "High Voltage AC/DC Fundamentals: Voltage, Current, Resistance, Power Factor, 3-Phase AC Systems",
          "Safety Standards & Regulations: ISO 6469, NFPA 70E, OSHA High-Voltage Safety Guidelines",
          "Personal Protective Equipment (PPE): Class 0 1000V Insulated Gloves, Arc-Flash Shields, insulated hand tools",
          "Manual Service Disconnect (MSD) Protocols: Lockout/Tagout (LOTO), Zero-Energy Verification Procedures",
          "Insulation Resistance Testing: Megohmmeter operation, isolation monitoring systems"
        ],
        practical_lab: "Lab 1: Execute complete high-voltage de-energization, zero-energy state verification, and isolation resistance testing on a 400V EV traction circuit.",
        key_tools: ["Fluke 1587 Insulation Multimeter", "CAT IV 1000V PPE Kit", "LOTO Kit", "High Voltage Probe"],
        learning_outcomes: "Safely isolate, de-energize, and inspect high-voltage electric vehicle propulsion circuits."
      },
      {
        unit_number: 2,
        title: "Lithium-Ion Battery Chemistries & Battery Management Systems (BMS)",
        duration: "5 Weeks (60 Hours)",
        focus: "Cell chemistry, thermal runaway, cell balancing, SoC and SoH algorithms",
        topics: [
          "Battery Chemistries: LFP (Lithium Iron Phosphate), NMC (Nickel Manganese Cobalt), NCA, cylindrical vs prismatic vs pouch cells",
          "Degradation Mechanisms: Solid Electrolyte Interphase (SEI) growth, lithium plating, thermal runaway mechanisms",
          "Battery Management System (BMS) Architecture: Master-Slave BMS, voltage sensing, current shunt measurement",
          "Cell Balancing Algorithms: Passive dissipative bleeding vs active inductive/capacitive energy transfer",
          "State Estimation: State of Charge (SoC) Coulomb counting and OCV lookup, State of Health (SoH), State of Power (SoP)"
        ],
        practical_lab: "Lab 2: Perform multi-cell balancing on an LFP battery module, calibrate BMS overvoltage/undervoltage thresholds, and model thermal limits.",
        key_tools: ["BMS Diagnostic Software", "Battery Cycler / Load Tester", "Thermal Imaging Camera", "Cell Balancer"],
        learning_outcomes: "Diagnose battery pack imbalances, calibrate BMS firmware thresholds, and verify thermal safety mechanisms."
      },
      {
        unit_number: 3,
        title: "Electric Traction Motors & Power Electronics Inverters",
        duration: "4 Weeks (48 Hours)",
        focus: "PMSM motors, SiC/IGBT inverters, field-oriented control, and regenerative braking",
        topics: [
          "Electric Motor Architectures: Permanent Magnet Synchronous Motors (PMSM), AC Induction Motors, Switched Reluctance Motors",
          "Power Inverters: Insulated Gate Bipolar Transistors (IGBT) and Silicon Carbide (SiC) MOSFET switching",
          "Pulse Width Modulation (PWM) & Field-Oriented Control (FOC): dq-axis current vector control",
          "Motor Position Feedback: Resolvers, Hall Effect Sensors, resolver-to-digital conversion, and phase calibration",
          "Regenerative Braking Systems: Kinetic energy recuperation, deceleration torque blending, and thermal dissipation"
        ],
        practical_lab: "Lab 3: Calibrate motor resolver offset angle and test PMSM inverter efficiency under variable dynamometer torque loads.",
        key_tools: ["Digital Storage Oscilloscope", "Current Clamps", "Motor Dynamometer Bench", "Resolver Calibration Tool"],
        learning_outcomes: "Calibrate traction motor controllers, troubleshoot inverter gate driver faults, and inspect resolver phasing."
      },
      {
        unit_number: 4,
        title: "CAN-Bus Telemetry & OBD-II Diagnostic Troubleshooting",
        duration: "5 Weeks (60 Hours)",
        focus: "Controller Area Network, CAN frames, OBD-II DTC faults, and wiring harness inspection",
        topics: [
          "Automotive Communication Networks: CAN 2.0B, CAN-FD, LIN bus, baud rates, 120-ohm terminating resistors",
          "CAN Frame Structure: Arbitration ID, DLC, Data payload, CRC check, message broadcasting",
          "Diagnostic Protocols: Unified Diagnostic Services (UDS ISO 14229), OBD-II (SAE J1979)",
          "EV Diagnostic Trouble Codes (DTCs): High-voltage interlock loop (HVIL) faults, isolation faults (P0AA6), cell degradation",
          "Wiring Harness Repair: Terminal pin de-pinning, crimping, environmental heat-shrink sealing, and shield continuity"
        ],
        practical_lab: "Lab 4: Sniff live vehicle CAN bus data packets using PCAN-USB, decode battery telemetry frames, and diagnose intermittent HVIL fault codes.",
        key_tools: ["PCAN-USB / CANalyzer", "OBD-II EV Scanner", "PicoScope Automotive", "Deutsch Crimping Kit"],
        learning_outcomes: "Capture and interpret vehicle network telemetry and diagnose complex intermittent electrical faults."
      },
      {
        unit_number: 5,
        title: "ARAI AIS-156 Compliance, Fast Charging Infrastructure & Road Test Capstone",
        duration: "3 Weeks (36 Hours)",
        focus: "Indian regulatory compliance, Bharat EV standards, CCS-2 protocol, and final road-testing",
        topics: [
          "Indian Automotive Regulations: AIS-038 (Rev 2) and AIS-156 Amendment 3 compliance standards",
          "EV Charging Architectures: AC Level-2 (Type 2 Mennekes), DC Fast Charging (CCS-2, CHAdeMO, Bharat DC-001)",
          "Charging Protocol Sequencing: Pilot line PWM signaling, Proximity Detection, PLC ISO 15118 handshake",
          "Pre-Delivery Inspection (PDI): Insulation resistance verification, dynamic road-test acceleration & regenerative braking audit"
        ],
        practical_lab: "Lab 5: Execute an AIS-156 thermal propagation and fast-charging protocol verification test on a prototype EV battery pack.",
        key_tools: ["EVSE Charging Test Station", "CCS2 Handshake Simulator", "Vehicle Diagnostic Suite"],
        learning_outcomes: "Ensure vehicle safety conformance with ARAI certification standards and certify vehicles for road deployment."
      }
    ]
  },

  "course-industrial-robotics": {
    id: "course-industrial-robotics",
    course_name: "Robotics & Smart Factory Automation",
    institution_name: "Chhatrapati Sambhajinagar Industrial Center",
    sector: "Manufacturing & Automation",
    district: "Chhatrapati Sambhajinagar",
    duration: "6 Months",
    credits: 24,
    certification: "MSBTE Advanced Diploma in Industrial Robotics & Smart Factory Automation",
    overview: "Practical training in industrial robotics programming (6-axis articulated arms), PLC ladder logic automation, SCADA human-machine interfaces, and smart factory IoT integration.",
    prerequisites: ["Diploma / Degree in Mechanical / Electrical / Electronics / Mechatronics"],
    career_pathways: ["Robotics Automation Engineer", "PLC/SCADA Commissioning Engineer", "Smart Factory Integration Specialist"],
    capstone_project: "Automated Robotic Pick-and-Place Machine Tending Cell with Machine Vision & PLC Interlocks",
    units: [
      {
        unit_number: 1,
        title: "Industrial Automation Fundamentals, Sensors & Actuators",
        duration: "3 Weeks (36 Hours)",
        focus: "Sensors, industrial actuators, pneumatic and hydraulic valves, and electrical relays",
        topics: [
          "Sensors in Automation: Inductive, Capacitive, Optical, Ultrasonic, and Hall Effect sensors",
          "Actuators & Motion Systems: Stepper Motors, AC Servo Drives, Pneumatic Cylinders, Proportional Solenoid Valves",
          "Industrial Wiring & Control Panels: DIN rail layout, 24V DC power distribution, relay logic, and emergency stop circuits",
          "Signal Conditioning: 4-20mA current loops, 0-10V analog signals, and digital I/O isolation"
        ],
        practical_lab: "Lab 1: Wire and calibrate an industrial 24V DC sensor and pneumatic actuator station with dual-channel emergency stop safety circuit.",
        key_tools: ["Industrial Sensor Trainer", "Pneumatic Valve Manifold", "Digital Multimeter", "Siemens SITOP PSU"],
        learning_outcomes: "Wire, test, and troubleshoot industrial sensors, actuators, and power supplies according to ISO standards."
      },
      {
        unit_number: 2,
        title: "Programmable Logic Controllers (PLC) & Ladder Logic Programming",
        duration: "5 Weeks (60 Hours)",
        focus: "PLC hardware, memory mapping, timers/counters, and IEC 61131-3 languages",
        topics: [
          "PLC Hardware Architecture: CPU, Power Supply, Digital/Analog I/O Modules, Communication Processors",
          "Ladder Diagram (LD) Programming: Contacts, Coils, Branching, Memory Bits, One-shot rising/falling edges",
          "Timers & Counters: TON, TOF, TP, CTU, CTD, and cascading timer sequences",
          "Advanced PLC Instructions: Math blocks, Compare instructions, Move (MOV), FIFO queues, and subroutines",
          "Siemens TIA Portal / Allen Bradley Studio 5000: Hardware configuration, tag database, and online monitoring"
        ],
        practical_lab: "Lab 2: Program a complete automated material sorting conveyor sequence with defect ejection and part counting in Siemens TIA Portal.",
        key_tools: ["Siemens S7-1200 / S7-1500 PLC", "TIA Portal v19", "Allen Bradley Micro850", "Factory I/O Simulator"],
        learning_outcomes: "Design, write, and debug industrial PLC ladder logic programs controlling multi-stage automation equipment."
      },
      {
        unit_number: 3,
        title: "SCADA Systems, HMI Interfacing & Factory Floor Telemetry",
        duration: "4 Weeks (48 Hours)",
        focus: "Industrial HMI screens, SCADA client-server architectures, alarms, and historical trends",
        topics: [
          "Human-Machine Interface (HMI) Design: Screen layout, touch elements, recipe management, user permissions",
          "SCADA Architecture: WinCC / Ignition SCADA, tag server, graphic designer, and animated objects",
          "Industrial Protocols: Modbus TCP/RTU, PROFINET, Ethernet/IP, and OPC-UA communication",
          "Alarm Management: High/Low threshold alarms, acknowledge logic, alarm logging according to ISA-18.2",
          "Historical Data Logging & Real-Time Trend Charts for overall equipment effectiveness (OEE) tracking"
        ],
        practical_lab: "Lab 3: Create an interactive touchscreen HMI and SCADA supervisory screen with real-time process monitoring, alarm banner, and recipe selector.",
        key_tools: ["Siemens WinCC", "Ignition SCADA by Inductive Automation", "KTP700 Basic HMI", "Modbus Poll"],
        learning_outcomes: "Build intuitive operator HMI screens and configure SCADA servers with reliable industrial network communications."
      },
      {
        unit_number: 4,
        title: "6-Axis Articulated Industrial Robot Arm Programming",
        duration: "5 Weeks (60 Hours)",
        focus: "Kinematics, teach pendants, tool center point (TCP) calibration, and robotic motion",
        topics: [
          "Robot Kinematics & Coordinate Systems: World, Base, Tool, and User/Workobject frames",
          "Teach Pendant Operation: Deadman switch, manual jogging in joint and linear coordinate modes",
          "Tool Center Point (TCP) Calibration: 4-point method, tool weight and center of gravity estimation",
          "Robotic Programming Languages: RAPID (ABB) / KRL (KUKA) / Karel (FANUC) syntax, MoveJ, MoveL, MoveC",
          "Grippers & End Effectors: Vacuum suction, pneumatic two-jaw grippers, tool change mechanisms"
        ],
        practical_lab: "Lab 4: Program an ABB / KUKA 6-axis robot arm to perform precision trajectory dispensing and part palletizing with accurate TCP calibration.",
        key_tools: ["ABB RobotStudio", "KUKA.Sim", "FANUC ROBOGUIDE", "6-Axis Articulated Robot Arm"],
        learning_outcomes: "Calibrate robot tool frames and program multi-point continuous path trajectories with precision."
      },
      {
        unit_number: 5,
        title: "Machine Vision Integration, Industrial Edge IoT & Safety Interlocks",
        duration: "3 Weeks (36 Hours)",
        focus: "Cognex/Keyence vision cameras, optical inspection, edge gateways, and safety standards",
        topics: [
          "Machine Vision: Cognex In-Sight / Keyence vision cameras, pattern matching, edge detection, optical character recognition (OCR)",
          "Robot-Vision Handshake: Communicating part coordinates over Ethernet to robot controller",
          "Safety Standards: ISO 10218 (Industrial Robots), ISO 13849-1 (Safety of Machinery - Performance Levels)",
          "Industrial Edge IoT: Node-RED, MQTT message brokers, publishing machine telemetry to state cloud dashboards"
        ],
        practical_lab: "Lab 5: Implement a closed-loop robot vision inspection station: vision camera identifies part orientation and sends coordinates to robot for automated packing.",
        key_tools: ["Cognex In-Sight Explorer", "Node-RED", "MQTT Broker", "Pilz Safety Relays"],
        learning_outcomes: "Integrate industrial vision sensors with robotics and enforce SIL-3 / PL-e certified machine safety."
      }
    ]
  },

  "course-cybersecurity": {
    id: "course-cybersecurity",
    course_name: "Enterprise Cybersecurity & Threat Defense",
    institution_name: "Government ITI Mumbai Central",
    sector: "Information Technology",
    district: "Mumbai City",
    duration: "6 Months",
    credits: 24,
    certification: "Govt. of Maharashtra & CERT-In Accredited Cybersecurity Specialist",
    overview: "Rigorous cyber defense program training candidates in network forensics, penetration testing, web application security (OWASP Top 10), Security Operations Center (SOC) alert triage, and incident reporting.",
    prerequisites: ["Basic Networking Concepts", "Linux Operating System Familiarity"],
    career_pathways: ["SOC Analyst (L1/L2)", "Junior Penetration Tester", "Cybersecurity Consultant", "Network Security Engineer"],
    capstone_project: "End-to-End Enterprise SOC Threat Detection, Memory Forensics & CERT-In 6-Hour Incident Reporting Simulation",
    units: [
      {
        unit_number: 1,
        title: "Networking Protocols & Enterprise Security Architecture",
        duration: "3 Weeks (36 Hours)",
        focus: "TCP/IP, packet analysis, network defense devices, and cryptography",
        topics: [
          "Packet-Level Deep Dive: TCP 3-Way Handshake, DNS query resolution, DHCP lease, TLS 1.3 Handshake",
          "Wireshark Protocol Analysis: Display filters, follow TCP stream, anomaly detection, cleartext credential detection",
          "Network Defenses: Firewalls (Stateful vs NGFW), IDS/IPS (Suricata/Snort), DMZ network segmentation",
          "Applied Cryptography: Symmetric vs Asymmetric Ciphers (AES-256, RSA-4096), PKI certificates, and digital hashing"
        ],
        practical_lab: "Lab 1: Inspect suspicious packet capture (PCAP) in Wireshark, extract exfiltrated data, and formulate perimeter firewall blocking rules.",
        key_tools: ["Wireshark", "Suricata", "Nmap", "OpenSSL", "GNS3 / Packet Tracer"],
        learning_outcomes: "Analyze raw network traffic, identify malicious packet anomalies, and implement perimeter defense rules."
      },
      {
        unit_number: 2,
        title: "Vulnerability Assessment & Penetration Testing Fundamentals",
        duration: "4 Weeks (48 Hours)",
        focus: "Scanning tools, reconnaissance, vulnerability scanning, and ethical exploitation",
        topics: [
          "Reconnaissance & Footprinting: OSINT tools, Nmap stealth SYN scanning, banner grabbing, service enumeration",
          "Vulnerability Scanners: Nessus, OpenVAS, CVE scoring (CVSS v3.1), and risk prioritization matrix",
          "Privilege Escalation: Linux SUID binaries, sudo misconfigurations, Windows unquoted service paths",
          "Metasploit Framework: Exploit modules, payloads (Meterpreter), staged vs non-staged shells, post-exploitation enumeration"
        ],
        practical_lab: "Lab 2: Perform authorized reconnaissance and vulnerability assessment on an enterprise lab network, compiling a CVSS-scored remediation report.",
        key_tools: ["Kali Linux", "Nmap", "Nessus", "Metasploit", "Searchsploit"],
        learning_outcomes: "Discover enterprise security weaknesses and formulate actionable vulnerability remediation plans."
      },
      {
        unit_number: 3,
        title: "Web Application Security & OWASP Top 10 Defenses",
        duration: "5 Weeks (60 Hours)",
        focus: "Web application vulnerabilities, Burp Suite, authorization flaws, and input sanitation",
        topics: [
          "OWASP Top 10 Flaws: SQL Injection (SQLi), Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), SSRF",
          "Broken Object Level Authorization (BOLA) & Insecure Direct Object References (IDOR)",
          "Burp Suite Professional: Intercepting proxy, Repeater, Intruder for brute forcing, and automated vulnerability scanning",
          "Secure Code Review: Parameterized queries, context-aware output encoding, Content Security Policy (CSP) headers"
        ],
        practical_lab: "Lab 3: Audit a simulated state government banking portal, exploit OWASP Top 10 flaws in a controlled sandbox, and write code patches to remediate them.",
        key_tools: ["Burp Suite", "OWASP ZAP", "Postman", "SonarQube", "DVWA"],
        learning_outcomes: "Identify and remediate web application vulnerabilities using industry-standard proxy and security tools."
      },
      {
        unit_number: 4,
        title: "Security Operations Center (SOC) & SIEM Threat Monitoring",
        duration: "5 Weeks (60 Hours)",
        focus: "Log aggregation, incident detection, Splunk SPL queries, and alert triaging",
        topics: [
          "SIEM Architectures: Log collectors, log normalization, parsing, and correlation rules",
          "Splunk Enterprise & Elastic SIEM: Search Processing Language (SPL), dashboards, scheduled alerts, and real-time monitors",
          "MITRE ATT&CK Framework: Mapping adversary tactics, techniques, and procedures (TTPs)",
          "SOC Alert Triage Playbooks: Investigating brute force attempts, suspicious PowerShell execution, and ransomware beacons"
        ],
        practical_lab: "Lab 4: Build a real-time Splunk dashboard with automated alert rules detecting unauthorized lateral movement and privilege escalation.",
        key_tools: ["Splunk Enterprise", "Elastic SIEM", "Wazuh EDR", "Sysmon"],
        learning_outcomes: "Monitor enterprise SIEM consoles, investigate security alerts, and execute SOC incident response playbooks."
      },
      {
        unit_number: 5,
        title: "Incident Response, Digital Forensics & CERT-In Regulatory Compliance",
        duration: "3 Weeks (36 Hours)",
        focus: "Memory forensics, disk acquisition, timeline reconstruction, and Indian cyber law compliance",
        topics: [
          "Memory Forensics: Volatility 3 framework, analyzing volatile RAM dumps, detecting code injection and DLL hollowing",
          "Disk Forensics: Forensic disk imaging (dd, FTK Imager), file system carving (Autopsy), timeline reconstruction",
          "Indian Cyber Regulations: CERT-In mandatory 6-hour cybersecurity incident reporting directions",
          "Post-Incident Root Cause Analysis: Evidence preservation, chain of custody, and executive debriefing"
        ],
        practical_lab: "Lab 5: Conduct forensic memory analysis on an infected workstation image, identify root cause malware, and draft the official CERT-In mandatory incident report.",
        key_tools: ["Volatility 3", "Autopsy", "FTK Imager", "YARA Rules"],
        learning_outcomes: "Execute digital forensic investigations with strict chain of custody and file regulatory incident disclosures."
      }
    ]
  }
};

/**
 * Get comprehensive syllabus details for given course IDs
 */
function getSyllabusForCourses(courseIds = []) {
  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    return [];
  }

  const result = [];
  courseIds.forEach(id => {
    if (COURSE_CURRICULA[id]) {
      result.push(COURSE_CURRICULA[id]);
    }
  });

  return result;
}

/**
 * Generate rich, articulate, professional explanation for each roadmap stage
 */
function getStageDetailedExplanation(courseId, unitNumber, title, focus) {
  const norm = ((title || '') + ' ' + (courseId || '')).toLowerCase();
  if (norm.includes('math') || norm.includes('python')) {
    return `Establishes computational and mathematical rigor. Candidates transition from abstract mathematical principles (linear algebra, vector spaces, dot products, and multivariable gradient calculus) into high-performance Python code using NumPy and Pandas. This foundation is essential for engineering scalable data transformations, understanding loss function optimization, and preparing production feature matrices required by state industries.`;
  }
  if (norm.includes('machine learning') || norm.includes('statistical')) {
    return `Focuses on production-grade machine learning pipelines and statistical modeling. Candidates master the complete supervised and unsupervised modeling lifecycle, feature engineering, bias-variance tradeoffs, ensemble gradient boosting (XGBoost/LightGBM), and automated hyperparameter optimization using Optuna across complex industrial datasets.`;
  }
  if (norm.includes('deep learning') || norm.includes('vision') || norm.includes('pytorch')) {
    return `Delivers deep technical proficiency in modern neural network architectures and GPU-accelerated computing with PyTorch. Students construct convolutional networks from scratch, fine-tune pretrained vision backbones (ResNet, YOLOv10), and deploy real-time object detection models to solve industrial automated defect inspection challenges.`;
  }
  if (norm.includes('generative') || norm.includes('language model') || norm.includes('prompt')) {
    return `Covers cutting-edge generative AI, Transformer self-attention mechanisms, and agentic workflows. Candidates learn vector database indexing (ChromaDB), semantic re-ranking, and Retrieval-Augmented Generation (RAG) using LangChain and high-speed Groq LLaMA 3 inference, enabling the design of intelligent multi-lingual enterprise copilots.`;
  }
  if (norm.includes('mlops') || norm.includes('serving') || norm.includes('cloud deployment')) {
    return `Bridges research models into high-availability cloud microservices. Focuses on asynchronous serving with FastAPI, model serialization with ONNX Runtime, multi-stage Docker containerization, and automated CI/CD deployment with data drift monitoring (Evidently AI) for enterprise reliability.`;
  }
  if (norm.includes('html') || norm.includes('web standards') || norm.includes('javascript')) {
    return `Builds deep core foundations in modern web architecture, semantic HTML5, accessible UI systems, and asynchronous ES6+ JavaScript. Candidates master modern asynchronous control flow, DOM performance, and Git collaborative engineering workflows demanded by digital engineering firms across Mumbai and Pune.`;
  }
  if (norm.includes('react') || norm.includes('frontend')) {
    return `Mastery of declarative component architecture using React 19. Students build responsive, accessible single-page applications with advanced hooks, client routing, server state caching via TanStack Query, and robust client-side schema validation using Zod and Tailwind CSS.`;
  }
  if (norm.includes('backend') || norm.includes('node') || norm.includes('api')) {
    return `Engineers robust, enterprise-grade REST APIs and microservices. Focuses on event-driven Node.js/Express and asynchronous FastAPI Python frameworks, implementing secure JWT authentication, role-based access control (RBAC), and bulletproof rate limiting and security headers.`;
  }
  if (norm.includes('database') || norm.includes('sql') || norm.includes('postgresql')) {
    return `Delivers comprehensive mastery of relational and NoSQL database architecture. Candidates design normalized schemas, write high-performance multi-table analytical SQL queries, optimize queries with B-Tree indexes, and integrate Prisma ORM with Redis in-memory caching.`;
  }
  if (norm.includes('devops') || norm.includes('docker') || norm.includes('ci/cd')) {
    return `Productionizes web applications using modern cloud-native DevOps principles. Covers multi-stage Docker container packaging, Nginx reverse proxy configuration, SSL/TLS certificates, and automated continuous delivery pipelines with GitHub Actions and AWS cloud infrastructure.`;
  }
  if (norm.includes('high-voltage') || norm.includes('safety') || norm.includes('electrical')) {
    return `Mandatory safety protocols and technical foundations for high-voltage electric vehicle propulsion circuits. Students master ISO 6469 and NFPA 70E standards, manual service disconnect procedures, CAT IV personal protective equipment, and precision insulation resistance diagnostics.`;
  }
  if (norm.includes('battery') || norm.includes('bms') || norm.includes('lithium')) {
    return `In-depth engineering of Lithium-ion battery packs (LFP/NMC chemistries) and Battery Management Systems (BMS). Covers cell balancing algorithms, thermal runaway mitigation, and algorithmic estimation of State of Charge (SoC) and State of Health (SoH) to ensure maximum vehicle pack longevity.`;
  }
  if (norm.includes('motor') || norm.includes('inverter') || norm.includes('traction')) {
    return `Focuses on electric traction motors (PMSM/Induction) and power electronics inverters. Students calibrate resolver position sensors, tune Silicon Carbide (SiC) MOSFET gate drivers, and program regenerative braking deceleration torque blending.`;
  }
  if (norm.includes('can-bus') || norm.includes('obd') || norm.includes('diagnostics')) {
    return `Automotive network telematics and diagnostic troubleshooting. Candidates decode real-time CAN-Bus and CAN-FD message frames, perform OBD-II / UDS diagnostic trouble code (DTC) triage, and repair automotive wiring harnesses using environmental sealing.`;
  }
  if (norm.includes('charging') || norm.includes('arai') || norm.includes('ais-156')) {
    return `Ensures vehicle regulatory compliance under ARAI AIS-156 and AIS-038 Indian automotive safety mandates. Covers Combined Charging System (CCS-2) communication sequencing and comprehensive pre-delivery road validation protocols.`;
  }
  if (norm.includes('plc') || norm.includes('ladder logic')) {
    return `Industrial programmable logic controller (PLC) automation. Candidates master hardware memory mapping, IEC 61131-3 ladder logic programming, and hardware configuration in Siemens TIA Portal controlling multi-stage manufacturing conveyors and actuators.`;
  }
  if (norm.includes('scada') || norm.includes('hmi')) {
    return `Supervisory control and human-machine interface (HMI) engineering. Focuses on designing operator touchscreens, industrial communication protocols (Modbus TCP, PROFINET, OPC-UA), and real-time alarm management according to ISA-18.2 standards.`;
  }
  if (norm.includes('robot') || norm.includes('arm')) {
    return `Comprehensive kinematics and trajectory programming of 6-axis industrial articulated robot arms (ABB / KUKA / FANUC). Candidates master Tool Center Point (TCP) calibration, coordinate workobjects, and continuous path motion for robotic welding and palletizing.`;
  }
  if (norm.includes('cyber') || norm.includes('network defense') || norm.includes('security')) {
    return `Defensive security architecture, packet analysis, and threat containment. Covers deep Wireshark protocol inspection, firewall configuration, vulnerability assessment with Nessus, OWASP Top 10 remediation, and mandatory 6-hour CERT-In incident disclosure protocols.`;
  }
  return `Delivers specialized industry competencies in ${title}. Focuses on ${focus || 'hands-on problem solving'}, providing candidates with the practical skills, analytical reasoning, and software toolchains required by leading employers across Maharashtra.`;
}

/**
 * Build a dynamic, chronological, step-by-step roadmap tailored specifically
 * to the courses the student has selected.
 */
function generateRoadmapFromCourses(selectedCourseIds = [], userSkills = [], targetRole = null) {
  const userSkillsLower = (userSkills || []).map(s => s.toLowerCase());
  const hasSkill = (term) => userSkillsLower.some(s => s.includes(term.toLowerCase()) || term.toLowerCase().includes(s));

  // If no specific course selected, default to targetRole or AI
  const courseIds = selectedCourseIds && selectedCourseIds.length > 0 
    ? selectedCourseIds 
    : ['course-ai-foundations'];

  const selectedCurricula = courseIds.map(id => COURSE_CURRICULA[id]).filter(Boolean);

  if (selectedCurricula.length === 0) {
    // Fallback to AI Foundations
    selectedCurricula.push(COURSE_CURRICULA['course-ai-foundations']);
  }

  // If single course is selected, synthesize direct 5-unit progression roadmap
  if (selectedCurricula.length === 1) {
    const curr = selectedCurricula[0];
    return curr.units.map((unit, idx) => {
      // Check if user already has skills covering this unit
      let isCompleted = false;
      
      if (idx === 0) {
        // Foundation unit
        if (hasSkill('python') && curr.id.includes('ai')) isCompleted = true;
        if ((hasSkill('javascript') || hasSkill('html')) && curr.id.includes('fullstack')) isCompleted = true;
        if (hasSkill('excel') && curr.id.includes('data')) isCompleted = true;
        if ((hasSkill('electrical') || hasSkill('ev')) && curr.id.includes('ev')) isCompleted = true;
        if (hasSkill('plc') && curr.id.includes('robotics')) isCompleted = true;
        if (hasSkill('networking') && curr.id.includes('cyber')) isCompleted = true;
      } else if (idx === 1) {
        if ((hasSkill('machine learning') || hasSkill('sql')) && curr.id.includes('ai')) isCompleted = true;
        if (hasSkill('react') && curr.id.includes('fullstack')) isCompleted = true;
        if (hasSkill('sql') && curr.id.includes('data')) isCompleted = true;
        if (hasSkill('battery') && curr.id.includes('ev')) isCompleted = true;
        if (hasSkill('plc') && curr.id.includes('robotics')) isCompleted = true;
      }

      const explanation = getStageDetailedExplanation(curr.id, idx + 1, unit.title, unit.focus);

      return {
        step: idx + 1,
        title: unit.title,
        course_id: curr.id,
        course_name: curr.course_name,
        duration: unit.duration,
        focus: unit.focus,
        detailed_explanation: explanation,
        topics: unit.topics,
        milestone_project: unit.practical_lab || curr.capstone_project,
        key_tools: unit.key_tools || [],
        learning_outcomes: unit.learning_outcomes,
        recommended_course_name: curr.course_name,
        completed: isCompleted
      };
    });
  }

  // If multiple courses are selected, build an integrated, prioritized progression:
  const combinedSteps = [];
  let stepIndex = 1;

  // Phase 1: All courses' foundations (Unit 1s)
  selectedCurricula.forEach(c => {
    const u = c.units[0];
    if (u) {
      combinedSteps.push({
        step: stepIndex++,
        phase: "Foundations & Core Prerequisites",
        title: `${c.course_name}: ${u.title}`,
        course_id: c.id,
        course_name: c.course_name,
        duration: u.duration,
        focus: u.focus,
        detailed_explanation: getStageDetailedExplanation(c.id, 1, u.title, u.focus),
        topics: u.topics,
        milestone_project: u.practical_lab,
        key_tools: u.key_tools,
        learning_outcomes: u.learning_outcomes,
        recommended_course_name: c.course_name,
        completed: userSkillsLower.some(s => u.title.toLowerCase().includes(s) || (u.key_tools || []).some(t => t.toLowerCase().includes(s)))
      });
    }
  });

  // Phase 2: Core Engineering & Systems (Unit 2s & 3s)
  selectedCurricula.forEach(c => {
    [1, 2].forEach(uIdx => {
      const u = c.units[uIdx];
      if (u) {
        combinedSteps.push({
          step: stepIndex++,
          phase: "Core Technical Competency",
          title: `${c.course_name}: ${u.title}`,
          course_id: c.id,
          course_name: c.course_name,
          duration: u.duration,
          focus: u.focus,
          detailed_explanation: getStageDetailedExplanation(c.id, uIdx + 1, u.title, u.focus),
          topics: u.topics,
          milestone_project: u.practical_lab,
          key_tools: u.key_tools,
          learning_outcomes: u.learning_outcomes,
          recommended_course_name: c.course_name,
          completed: false
        });
      }
    });
  });

  // Phase 3: Advanced Specialization & Cloud/Architecture (Unit 4s & 5s)
  selectedCurricula.forEach(c => {
    [3, 4].forEach(uIdx => {
      const u = c.units[uIdx];
      if (u) {
        combinedSteps.push({
          step: stepIndex++,
          phase: "Production Deployment & Advanced Specialization",
          title: `${c.course_name}: ${u.title}`,
          course_id: c.id,
          course_name: c.course_name,
          duration: u.duration,
          focus: u.focus,
          detailed_explanation: getStageDetailedExplanation(c.id, uIdx + 1, u.title, u.focus),
          topics: u.topics,
          milestone_project: u.practical_lab,
          key_tools: u.key_tools,
          learning_outcomes: u.learning_outcomes,
          recommended_course_name: c.course_name,
          completed: false
        });
      }
    });
  });

  return combinedSteps;
}

module.exports = {
  COURSE_CURRICULA,
  getSyllabusForCourses,
  generateRoadmapFromCourses
};
