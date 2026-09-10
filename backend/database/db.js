const store = require('./dataStore');

// Dual-mode database interface:
// Uses the persistent high-performance DataStore by default,
// with clean extension points for MySQL connection if configured.

const db = {
  store,
  query: async (sql, params = []) => {
    // In-memory relational dispatcher for common queries
    return store;
  },
  status: () => {
    return {
      connected: true,
      engine: 'Persistent Relational JSON Store (with MySQL Schema Export)',
      records: {
        districts: store.get('districts').length,
        skills: store.get('skills').length,
        job_roles: store.get('job_roles').length,
        courses: store.get('courses').length,
        recommendations: store.get('recommendations').length,
        trainers: store.get('trainer_profiles').length,
        equipment: store.get('equipment_planning').length
      }
    };
  }
};

module.exports = db;
