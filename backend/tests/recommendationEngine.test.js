const test = require('node:test');
const assert = require('node:assert/strict');
const { buildFallbackRecommendations, validateRecommendations } = require('../services/recommendationEngine');

const analysis = {
  job_role: 'Software Developer',
  course_name: 'Foundations Curriculum',
  missing_skills: ['FastAPI', 'Docker', 'AWS'],
  matrix: [
    { skill_name: 'FastAPI', category: 'Framework', importance: 'required', weight: 1 },
    { skill_name: 'Docker', category: 'DevOps', importance: 'preferred', weight: 0.75 },
    { skill_name: 'AWS', category: 'Cloud', importance: 'mentioned', weight: 1 }
  ]
};

test('fallback ranks actual missing skills by importance and gives learning direction', () => {
  const result = buildFallbackRecommendations({ analysis });
  assert.deepEqual(result.recommendations.map(item => item.skill), ['FastAPI', 'AWS', 'Docker']);
  assert.equal(result.recommendations[0].priority, 'High');
  assert.match(result.recommendations[0].reason, /not covered/);
  assert.ok(result.recommendations.every(item => item.learning_direction));
});

test('no-gap analysis produces no invented recommendations', () => {
  const result = buildFallbackRecommendations({ analysis: { ...analysis, missing_skills: [], matrix: [] } });
  assert.deepEqual(result.recommendations, []);
});

test('valid structured AI response is accepted only for supplied missing skills', () => {
  const fallback = buildFallbackRecommendations({ analysis });
  const validated = validateRecommendations({ recommendations: fallback.recommendations }, analysis.missing_skills);
  assert.equal(validated.recommendations.length, 3);
});

test('malformed AI response is rejected so the data fallback can be used', () => {
  const malformed = { recommendations: [{ skill: 'Invented Skill', priority: 'High', reason: 'generic', learning_order: 1, learning_direction: 'study it' }] };
  assert.equal(validateRecommendations(malformed, analysis.missing_skills), null);
});