import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Filter, Plus, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CourseIntelligencePage = () => {
  const { showToast } = useAuth();
  const [courses, setCourses] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // New Course Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    course_name: '',
    institution_name: '',
    sector: 'Information Technology',
    district: 'Pune',
    duration: '6 Months',
    skills_covered: ''
  });

  const loadCourses = () => {
    setLoading(true);
    api.getCourses({ sector: selectedSector, status: selectedStatus, search: searchTerm })
      .then(res => {
        setCourses(res.courses || []);
        if (res.sectors) setSectors(res.sectors);
        if (res.districts) setDistricts(res.districts);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCourses();
  }, [selectedSector, selectedStatus, searchTerm]);

  const handleCreateCourse = (e) => {
    e.preventDefault();
    api.addCourse(newCourse).then(() => {
      showToast(`Course "${newCourse.course_name}" registered successfully!`);
      setShowAddModal(false);
      setNewCourse({
        course_name: '',
        institution_name: '',
        sector: 'Information Technology',
        district: 'Pune',
        duration: '6 Months',
        skills_covered: ''
      });
      loadCourses();
    }).catch(err => showToast(err.message, 'error'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Curriculum Intelligence System</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Course Intelligence</h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit institutional curriculum alignment against industry signals, evaluate placement effectiveness, and modernise syllabus modules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          Register New Course
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course name or institute..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
          >
            <option value="All">All Sectors</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="High Demand">High Demand</option>
            <option value="Needs Update">Needs Update</option>
            <option value="Low Demand / Obsolete">Low Demand / Obsolete</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div 
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {course.district} • {course.sector}
                </span>
                <StatusBadge status={course.status} size="small" />
              </div>

              <h3 className="text-base font-black text-slate-900 mb-1 leading-snug">{course.course_name}</h3>
              <p className="text-xs text-slate-500 font-medium mb-3">{course.institution_name}</p>

              {/* Statistics Row */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl mb-4 text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Match Score</span>
                  <span className={`text-sm font-black ${course.industry_match_score >= 80 ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {course.industry_match_score}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Placement</span>
                  <span className={`text-sm font-black ${course.placement_rate >= 70 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {course.placement_rate}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Enrolled</span>
                  <span className="text-sm font-black text-slate-800">
                    {course.enrollment_count}
                  </span>
                </div>
              </div>

              {/* Skills Covered */}
              <div className="space-y-2 mb-4">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Curriculum Competencies:
                </span>
                <div className="flex flex-wrap gap-1">
                  {(course.skills_covered || []).map((sk, idx) => (
                    <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Recommendation Quote */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Curriculum Recommendation:</span>
                </div>
                <p className="text-[11px] line-clamp-2 italic">{course.recommendation}</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Duration: {course.duration}</span>
              <Link
                to={`/skill-gap?sector=${encodeURIComponent(course.sector)}`}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1"
              >
                Run Gap Test
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Register New Course</h3>
            <p className="text-xs text-slate-500 mb-4">Add polytechnic or technical institute training program to state database.</p>
            
            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Certificate in Cloud Architecture & DevOps"
                  value={newCourse.course_name}
                  onChange={(e) => setNewCourse({ ...newCourse, course_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Training Institution</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Government Polytechnic Nashik"
                  value={newCourse.institution_name}
                  onChange={(e) => setNewCourse({ ...newCourse, institution_name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sector</label>
                  <select
                    value={newCourse.sector}
                    onChange={(e) => setNewCourse({ ...newCourse, sector: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="Automotive & EV">Automotive & EV</option>
                    <option value="Manufacturing & Automation">Manufacturing & Automation</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={newCourse.district}
                    onChange={(e) => setNewCourse({ ...newCourse, district: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Skills Covered (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, SQL, Power BI"
                  value={newCourse.skills_covered}
                  onChange={(e) => setNewCourse({ ...newCourse, skills_covered: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border rounded-lg text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                >
                  Register Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
