const fs = require('fs');
const path = require('path');
const store = require('./database/dataStore');

let sql = '-- SkillSync Maharashtra Seed SQL Data\nUSE skillsync_maharashtra;\n\n';

// Districts
store.get('districts').forEach(d => {
  sql += "INSERT INTO districts (id, district_name, state, division, industrial_zone, active_institutes, job_openings) VALUES ('" +
    d.id + "', '" + d.district_name + "', 'Maharashtra', '" + d.division + "', '" + d.industrial_zone + "', " +
    d.active_institutes + ", " + d.job_openings + ") ON DUPLICATE KEY UPDATE job_openings=" + d.job_openings + ";\n";
});

// Skills
store.get('skills').forEach(s => {
  sql += "INSERT INTO skills (id, skill_name, category, demand_score, growth_rate, velocity_status, description) VALUES ('" +
    s.id + "', '" + s.skill_name + "', '" + s.category + "', " + s.demand_score + ", " + s.growth_rate + ", '" +
    s.velocity_status + "', '" + s.description.replace(/'/g, "''") + "') ON DUPLICATE KEY UPDATE demand_score=" + s.demand_score + ";\n";
});

// Job Roles
store.get('job_roles').forEach(r => {
  sql += "INSERT INTO job_roles (id, role_name, sector, demand_score, growth_rate, avg_salary_lpa, open_vacancies, description) VALUES ('" +
    r.id + "', '" + r.role_name + "', '" + r.sector + "', " + r.demand_score + ", " + r.growth_rate + ", " +
    r.avg_salary_lpa + ", " + r.open_vacancies + ", '" + r.description.replace(/'/g, "''") + "') ON DUPLICATE KEY UPDATE demand_score=" + r.demand_score + ";\n";
});

// Courses
store.get('courses').forEach(c => {
  sql += "INSERT INTO courses (id, course_name, institution_name, sector, district, duration, placement_rate, enrollment_count, industry_match_score, status) VALUES ('" +
    c.id + "', '" + c.course_name + "', '" + c.institution_name + "', '" + c.sector + "', '" + c.district + "', '" +
    c.duration + "', " + c.placement_rate + ", " + c.enrollment_count + ", " + c.industry_match_score + ", '" + c.status + "') ON DUPLICATE KEY UPDATE placement_rate=" + c.placement_rate + ";\n";
});

fs.writeFileSync(path.join(__dirname, 'database', 'seed.sql'), sql, 'utf8');
console.log('seed.sql successfully written.');
