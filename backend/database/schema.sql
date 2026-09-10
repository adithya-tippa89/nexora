-- SkillSync Maharashtra Database Schema
-- Standard MySQL 8.0+ Compatible

CREATE DATABASE IF NOT EXISTS skillsync_maharashtra;
USE skillsync_maharashtra;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'institution', 'employer', 'student') NOT NULL DEFAULT 'student',
    district VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Districts Table
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(36) PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(50) NOT NULL DEFAULT 'Maharashtra',
    division VARCHAR(50) NOT NULL,
    industrial_zone VARCHAR(100),
    top_sectors JSON,
    active_institutes INT DEFAULT 0,
    job_openings INT DEFAULT 0
);

-- 3. Job Roles Table
CREATE TABLE IF NOT EXISTS job_roles (
    id VARCHAR(36) PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    demand_score DECIMAL(5, 2) NOT NULL,
    growth_rate DECIMAL(5, 2) NOT NULL,
    avg_salary_lpa DECIMAL(5, 2),
    open_vacancies INT DEFAULT 0,
    description TEXT
);

-- 4. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(36) PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    demand_score DECIMAL(5, 2) NOT NULL,
    growth_rate DECIMAL(5, 2) NOT NULL,
    velocity_status ENUM('Rising', 'High-Velocity', 'Stable', 'Declining') DEFAULT 'Rising',
    description TEXT
);

-- 5. Job Role Skills Junction
CREATE TABLE IF NOT EXISTS job_role_skills (
    id VARCHAR(36) PRIMARY KEY,
    job_role_id VARCHAR(36) NOT NULL,
    skill_id VARCHAR(36) NOT NULL,
    proficiency_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL,
    importance_score DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 6. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(36) PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    placement_rate DECIMAL(5, 2) NOT NULL,
    enrollment_count INT NOT NULL DEFAULT 0,
    industry_match_score DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    status ENUM('High Demand', 'Needs Update', 'Low Demand / Obsolete') NOT NULL DEFAULT 'High Demand',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Course Skills Junction
CREATE TABLE IF NOT EXISTS course_skills (
    id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    skill_id VARCHAR(36) NOT NULL,
    coverage_level ENUM('Basic', 'Intermediate', 'Advanced') NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 8. District Skill Demand Table
CREATE TABLE IF NOT EXISTS district_skill_demand (
    id VARCHAR(36) PRIMARY KEY,
    district_id VARCHAR(36) NOT NULL,
    skill_id VARCHAR(36) NOT NULL,
    demand_score DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 9. Employers Table
CREATE TABLE IF NOT EXISTS employers (
    id VARCHAR(36) PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    contact_email VARCHAR(255),
    active_hiring_count INT DEFAULT 0
);

-- 10. Employer Skill Validation Table
CREATE TABLE IF NOT EXISTS employer_skill_validation (
    id VARCHAR(36) PRIMARY KEY,
    employer_id VARCHAR(36) NOT NULL,
    job_role_id VARCHAR(36) NOT NULL,
    skill_id VARCHAR(36) NOT NULL,
    validation_status ENUM('Approved', 'Not Required', 'Added Missing') NOT NULL,
    feedback_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES employers(id) ON DELETE CASCADE,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- 11. Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(36) PRIMARY KEY,
    recommendation_type ENUM('Curriculum Update', 'New Training Program', 'Trainer Upskilling', 'Equipment Upgrade', 'Intake Reduction') NOT NULL,
    target_type ENUM('Course', 'District', 'Institution', 'Sector') NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    priority ENUM('Critical', 'High', 'Medium', 'Low') NOT NULL DEFAULT 'High',
    description TEXT NOT NULL,
    rationale TEXT,
    suggested_modules JSON,
    status ENUM('Pending Review', 'Approved', 'Rejected', 'Implemented') DEFAULT 'Pending Review',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Trainer Profiles & Upskilling Table
CREATE TABLE IF NOT EXISTS trainer_profiles (
    id VARCHAR(36) PRIMARY KEY,
    trainer_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    current_skills JSON NOT NULL,
    target_course_id VARCHAR(36),
    trainer_skill_gap DECIMAL(5, 2) NOT NULL,
    upskilling_status ENUM('Identified', 'Enrolled in FDP', 'Certified', 'Pending') DEFAULT 'Identified'
);

-- 13. Equipment Planning & Infrastructure Table
CREATE TABLE IF NOT EXISTS equipment_planning (
    id VARCHAR(36) PRIMARY KEY,
    lab_name VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    required_equipment JSON NOT NULL,
    available_equipment JSON NOT NULL,
    readiness_score DECIMAL(5, 2) NOT NULL,
    estimated_budget_inr DECIMAL(12, 2) NOT NULL,
    status ENUM('Action Required', 'Budget Approved', 'Procurement Ongoing', 'Ready') DEFAULT 'Action Required'
);

-- 14. Emerging Technologies Table
CREATE TABLE IF NOT EXISTS emerging_technologies (
    id VARCHAR(36) PRIMARY KEY,
    tech_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    growth_rate DECIMAL(5, 2) NOT NULL,
    adoption_rate DECIMAL(5, 2) NOT NULL,
    maharashtra_job_volume INT NOT NULL,
    required_skills JSON NOT NULL,
    recommended_courses JSON NOT NULL
);

-- 15. District Training Plans Table
CREATE TABLE IF NOT EXISTS district_training_plans (
    id VARCHAR(36) PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL,
    financial_year VARCHAR(20) NOT NULL,
    priority_sectors JSON NOT NULL,
    recommended_courses JSON NOT NULL,
    required_trainers INT NOT NULL,
    required_infra_labs INT NOT NULL,
    expected_employment INT NOT NULL,
    budget_allocation_cr DECIMAL(8, 2) NOT NULL,
    status ENUM('Draft', 'Submitted', 'State Approved', 'Under Execution') DEFAULT 'State Approved',
    generated_date DATE NOT NULL
);
