# SkillSync Maharashtra
### *Aligning Skills with Industry. Building Careers for Tomorrow.*

> **Motto:** “Right Skills. Right Training. Right Jobs.”  
> **Initiative:** Labour Market Intelligence and Curriculum Alignment Platform for the Government of Maharashtra (DVET & MSSDS).

---

## 🚀 Overview

**SkillSync Maharashtra** is a full-stack web application that creates a continuous, evidence-based connection between:
$$\text{Industry Demand} \longrightarrow \text{Required Skills} \longrightarrow \text{Training Programs} \longrightarrow \text{Students} \longrightarrow \text{Employment}$$

It solves the critical mismatch where students complete technical courses but remain unemployed because courses lag behind modern employer requirements, while employers face shortages of job-ready candidates.

---

## 👥 Supported Roles (Multi-Stakeholder Experience)

The platform supports 4 distinct user roles with an **Instant Demo Role Switcher**:
1. **Government / Admin:** View statewide & district skill demand, monitor training programs, approve curriculum interventions, sunset obsolete courses, and generate official District Training Plans (DSDP).
2. **Training Institution (Polytechnics & ITIs):** Compare existing curriculum with industry demand, identify missing skills, receive AI curriculum upgrade recommendations, and enroll faculty in Faculty Development Programs (FDP).
3. **Employer / Industry Partners:** Post skill requirements, vote on competency profiles (👍 Approve / 👎 Not Required / ➕ Add Missing), and view candidate skill readiness.
4. **Candidate / Student:** Profile evaluation, career match diagnosis, missing skills identification, visual step-by-step career progression roadmap, and course enrollment.

---

## 📑 18 Functional Modules & Pages

1. **Landing Page (`/`):** Hero section with tagline, live counters (50K+ signals, 500+ skills, 36 districts, 1M+ candidates), futuristic UI preview, closed-loop workflow visualizer.
2. **Login Page (`/login`):** Multi-role authentication + **One-Click Instant Evaluation Login** for all 4 roles.
3. **Registration Page (`/register`):** Role-specific onboarding with Maharashtra's 36 district selector.
4. **Main Dashboard (`/dashboard`):** 6 Top Stat Cards (Total Job Demand, Active Skills, Training Programs, Identified Skill Gaps, Employer Participation, Avg Placement Rate), sector charts, district demand trends.
5. **Skill Demand Analytics (`/skills`):** Demand scores, YoY growth rates, velocity indicators (High-Velocity, Rising, Stable, Declining) with Bar and Line charts.
6. **Job Role Analysis (`/job-roles`):** Deep dive into roles (Data Analyst, Cloud Engineer, AI Specialist, EV Diagnostics, Industrial Robotics, Full Stack Dev, etc.) with required proficiencies and gap rates.
7. **Skill Gap Analysis Engine (`/skill-gap`):** **Core Platform Engine**. Select District, Sector, Job Role, and Course. Computes Skill Match % and Skill Gap %, displays matrix, missing skill alerts, and one-click AI Curriculum Update.
8. **Course Intelligence (`/courses`):** Course catalog with Industry Match Scores, Placement Rates, Enrollment counts, status badges (🟢 High Demand, 🟡 Needs Update, 🔴 Low Demand/Obsolete), and register course modal.
9. **Obsolete Course Detection (`/obsolete-courses`):** Automatic alerts identifying stagnant courses (<30% placement, high supply) with decommissioning and modernization pathways.
10. **District Insights (`/districts`):** Deep dive across Maharashtra hubs (Pune, Mumbai, Nagpur, Nashik, Chhatrapati Sambhajinagar, Thane, Kolhapur, Solapur) detailing industrial corridors, local employers, and shortages.
11. **Trainer Upskilling Module (`/trainer-upskilling`):** Audits faculty capabilities vs modern course requirements (e.g. 60% trainer gap) and assigns trainers to state Faculty Development Programs (FDP).
12. **Equipment Planning Module (`/equipment-planning`):** Lab infrastructure analysis comparing required equipment (GPU clusters, EV testbeds, Cobots) vs available hardware with modernization grant approvals.
13. **Employer Validation Module (`/employer-validation`):** Real-time industry consensus portal where employers endorse skills, mark not required, or suggest missing tools.
14. **Student Career Guidance (`/career-guidance`):** Student wizard: select current skills, target role, and district. Shows career match %, skills you have (✅), skills you need (❌), and interactive 5-step visual roadmap.
15. **Emerging Technology Tracker (`/emerging-tech`):** Tracks Generative AI, Electric Vehicles (EV), Cloud Microservices, Industrial Robotics, and Zero Trust Cybersecurity.
16. **Recommendation Center (`/recommendations`):** AI policy decision-support hub categorizing interventions with formal approval workflows.
17. **District Training Plan (`/district-plans`):** Generates official Government District Skill Development Plans (DSDP) with priority sectors, courses, trainer & lab requirements, employment estimates, and **Print / PDF Download**.
18. **Admin Settings (`/admin`):** Platform sensitivity thresholds, database diagnostics, and one-click restore to Maharashtra baseline state.

---

## ⚙️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Recharts, React Router DOM (v6).
- **Backend:** Node.js, Express.js REST APIs.
- **Database:**
  - `backend/database/schema.sql`: Full MySQL 8.0+ DDL with all 11 relational tables + indices.
  - `backend/database/seed.sql`: Complete MySQL insert scripts populated with Maharashtra dataset.
  - `backend/database/dataStore.js`: Integrated persistent database store ensuring zero-friction out-of-the-box operation without requiring manual database installations.

---

## 🏃 Running the Application

### 1. Backend Server (Port 5000)
```bash
cd backend
npm install
npm start
```
API Health check: `http://localhost:5000/api/health`

### 2. Frontend Application (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Client URL: `http://localhost:5173`
