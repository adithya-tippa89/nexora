# 🎨 SkillSync Maharashtra — Frontend Client

> **Single-Page Application (SPA) for Labour Market Intelligence & Curriculum Alignment**  
> Built with **React 19**, **Vite**, **Tailwind CSS v4**, **Lucide Icons**, and **Recharts**.

For full platform documentation, comprehensive system architecture diagrams, and REST API specifications, please refer to the [Root Platform README.md](../README.md).

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Development Server
```bash
npm run dev
```
Local URL: `http://localhost:5173`

### 3. Build Production Bundle
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```

---

## 🧭 Key Architecture & Pages
* **Design System:** Tailwind CSS v4, custom glassmorphism styles in `src/App.css`, and custom status badges.
* **State Management:** `src/context/AuthContext.jsx` with instant demo role switcher across all 4 personas:
  * Government / Admin (`admin`)
  * Training Institution (`institution`)
  * Employer (`employer`)
  * Student (`student`)
* **Core Views (18 Pages):**
  * Landing (`/`), Login (`/login`), Register (`/register`)
  * Executive Dashboard (`/dashboard`)
  * Skill Demand Analytics (`/skills`)
  * Job Roles Analysis (`/job-roles`)
  * Skill Gap Engine (`/skill-gap`)
  * Course Catalog (`/courses`)
  * Obsolete Course Detection (`/obsolete-courses`)
  * District Insights (`/districts`)
  * Trainer Upskilling & FDP (`/trainer-upskilling`)
  * Equipment Planning (`/equipment-planning`)
  * Employer Validation Hub (`/employer-validation`)
  * Student Career Guidance (`/career-guidance`)
  * Emerging Tech Radar (`/emerging-tech`)
  * AI Recommendations Center (`/recommendations`)
  * District Skill Plans (DSDP) (`/district-plans`)
  * Admin Settings & Diagnostics (`/admin`)
