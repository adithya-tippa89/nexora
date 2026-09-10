const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'skillsync_db.json');

const stripBom = (str) => {
  if (typeof str === 'string') {
    return str.replace(/^\uFEFF/, '');
  }
  return str;
};

class DataStore {
  constructor() {
    this.data = this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(stripBom(raw));
        if (parsed.districts && parsed.districts.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.warn('Persistent DB read failed, falling back to default seed files:', err.message);
      }
    }
    return this.loadDefaultSeed();
  }

  loadDefaultSeed() {
    const dataDir = path.join(__dirname, '..', 'data');
    const read = (file) => {
      try {
        const raw = fs.readFileSync(path.join(dataDir, file), 'utf8');
        return JSON.parse(stripBom(raw));
      } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
        return [];
      }
    };

    const initial = {
      users: [
        {
          id: "usr-admin-1",
          name: "Dr. Rajeshwar Patil",
          email: "admin@maharashtra.gov.in",
          password: "password123",
          role: "admin",
          roleTitle: "Government / State Admin",
          district: "Mumbai Suburban",
          organization: "Directorate of Vocational Education and Training (DVET)"
        },
        {
          id: "usr-inst-1",
          name: "Prof. Sunita Deshmukh",
          email: "institute@coep.ac.in",
          password: "password123",
          role: "institution",
          roleTitle: "Training Institution",
          district: "Pune",
          organization: "Government Polytechnic Pune & Skill Hub"
        },
        {
          id: "usr-emp-1",
          name: "Anand Kulkarni",
          email: "recruitment@tatamotors.com",
          password: "password123",
          role: "employer",
          roleTitle: "Employer / Industry Partner",
          district: "Pune",
          organization: "Tata Motors Innovation Labs"
        },
        {
          id: "usr-std-1",
          name: "Rohan Shinde",
          email: "rohan.shinde@student.ac.in",
          password: "password123",
          role: "student",
          roleTitle: "Candidate / Student",
          district: "Pune",
          organization: "B.Tech Computer Science (Final Year)"
        }
      ],
      districts: read('districts.json'),
      skills: read('skills.json'),
      job_roles: read('jobRoles.json'),
      courses: read('courses.json'),
      employers: read('employers.json'),
      employer_validations: read('employerValidations.json'),
      recommendations: read('recommendations.json'),
      trainer_profiles: read('trainers.json'),
      equipment_planning: read('equipment.json'),
      emerging_tech: read('emergingTech.json'),
      district_training_plans: read('districtPlans.json')
    };

    this.saveData(initial);
    return initial;
  }

  saveData(data) {
    try {
      const payload = data || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write persistent data:', err);
    }
  }

  reset() {
    this.data = this.loadDefaultSeed();
    return this.data;
  }

  get(collection) {
    return this.data[collection] || [];
  }

  findById(collection, id) {
    return (this.data[collection] || []).find(item => item.id === id);
  }

  create(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    this.data[collection].unshift(item);
    this.saveData();
    return item;
  }

  update(collection, id, updates) {
    if (!this.data[collection]) return null;
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[collection][index] = { ...this.data[collection][index], ...updates };
      this.saveData();
      return this.data[collection][index];
    }
    return null;
  }

  delete(collection, id) {
    if (!this.data[collection]) return false;
    const orig = this.data[collection].length;
    this.data[collection] = this.data[collection].filter(item => item.id !== id);
    if (this.data[collection].length !== orig) {
      this.saveData();
      return true;
    }
    return false;
  }
}

const store = new DataStore();
module.exports = store;
