import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Sparkles, 
  BookOpen, 
  AlertTriangle, 
  Building2, 
  Award, 
  TrendingUp, 
  ArrowRight,
  Target,
  FileText,
  Users,
  Cpu,
  Compass,
  Flame,
  Search,
  CheckCircle2,
  MapPin,
  Zap,
  Filter,
  DollarSign,
  ChevronRight,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
  GraduationCap,
  X,
  Crown,
  BarChart3
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';

const MAHARASHTRA_SKILL_BENCHMARKS = [
  {
    skill: "Artificial Intelligence & ML",
    category: "AI & Software",
    demand_percentage: 97.4,
    job_count: 4200,
    salary_range: "₹8.5 - 18.0 LPA",
    min_salary_lpa: 8.5,
    max_salary_lpa: 18.0,
    growth_rate: "+45.0% YoY",
    velocity: "Surging",
    districts: ["Pune", "Mumbai", "Nagpur"],
    top_employers: ["Tata Elxsi", "Persistent", "Tech Mahindra", "NVIDIA"],
    recommended_path: "Deep Learning, PyTorch, LangChain & LLM Ops"
  },
  {
    skill: "Python & Data Science",
    category: "AI & Software",
    demand_percentage: 96.5,
    job_count: 6800,
    salary_range: "₹5.5 - 12.0 LPA",
    min_salary_lpa: 5.5,
    max_salary_lpa: 12.0,
    growth_rate: "+28.4% YoY",
    velocity: "High Demand",
    districts: ["Pune", "Mumbai", "Nashik"],
    top_employers: ["Infosys", "Wipro", "L&T Infotech", "Cognizant"],
    recommended_path: "Pandas, NumPy, Scikit-Learn, FastAPI"
  },
  {
    skill: "Generative AI & LLM Systems",
    category: "AI & Software",
    demand_percentage: 95.0,
    job_count: 3100,
    salary_range: "₹9.0 - 22.0 LPA",
    min_salary_lpa: 9.0,
    max_salary_lpa: 22.0,
    growth_rate: "+65.0% YoY",
    velocity: "Surging",
    districts: ["Mumbai", "Pune"],
    top_employers: ["Jio Platforms", "Fractal Analytics", "TCS AI Labs"],
    recommended_path: "RAG Architectures, Vector DBs, Prompt Engineering"
  },
  {
    skill: "Cloud Computing (AWS & Azure)",
    category: "Cloud & DevOps",
    demand_percentage: 93.8,
    job_count: 5400,
    salary_range: "₹6.8 - 14.5 LPA",
    min_salary_lpa: 6.8,
    max_salary_lpa: 14.5,
    growth_rate: "+31.0% YoY",
    velocity: "High Demand",
    districts: ["Pune", "Mumbai", "Nagpur"],
    top_employers: ["AWS India", "Microsoft", "Capgemini", "Accenture"],
    recommended_path: "AWS Solutions Architect, Terraform, Serverless"
  },
  {
    skill: "React & Modern Web (Next.js)",
    category: "AI & Software",
    demand_percentage: 92.5,
    job_count: 5900,
    salary_range: "₹5.0 - 11.5 LPA",
    min_salary_lpa: 5.0,
    max_salary_lpa: 11.5,
    growth_rate: "+22.0% YoY",
    velocity: "High Demand",
    districts: ["Pune", "Mumbai", "Aurangabad"],
    top_employers: ["Razorpay", "BrowserStack", "Freshworks", "Zensar"],
    recommended_path: "React 19, TypeScript, Tailwind CSS, State Architecture"
  },
  {
    skill: "Power BI & Business Intelligence",
    category: "Data & Analytics",
    demand_percentage: 91.2,
    job_count: 4600,
    salary_range: "₹4.8 - 10.2 LPA",
    min_salary_lpa: 4.8,
    max_salary_lpa: 10.2,
    growth_rate: "+34.5% YoY",
    velocity: "High Demand",
    districts: ["Mumbai", "Pune", "Nashik"],
    top_employers: ["Deloitte", "EY", "Tata Capital", "HDFC Bank"],
    recommended_path: "DAX Modeling, Power Query, Enterprise Dashboards"
  },
  {
    skill: "Cybersecurity & Threat Defense",
    category: "Cloud & DevOps",
    demand_percentage: 89.0,
    job_count: 3800,
    salary_range: "₹6.5 - 15.0 LPA",
    min_salary_lpa: 6.5,
    max_salary_lpa: 15.0,
    growth_rate: "+27.5% YoY",
    velocity: "Rising",
    districts: ["Mumbai", "Pune"],
    top_employers: ["Quick Heal", "KPMG", "PwC India", "HCL Tech"],
    recommended_path: "CompTIA Security+, SOC Analysis, SIEM Tools, Ethical Hacking"
  },
  {
    skill: "Docker & Kubernetes DevOps",
    category: "Cloud & DevOps",
    demand_percentage: 88.0,
    job_count: 4100,
    salary_range: "₹7.0 - 15.5 LPA",
    min_salary_lpa: 7.0,
    max_salary_lpa: 15.5,
    growth_rate: "+29.8% YoY",
    velocity: "High Demand",
    districts: ["Pune", "Mumbai", "Nagpur"],
    top_employers: ["Siemens", "TCS", "Cisco", "Amdocs"],
    recommended_path: "Containerization, Helm, CI/CD GitHub Actions, K8s CKA"
  },
  {
    skill: "EV Battery & BMS Powertrains",
    category: "EV & Automotive",
    demand_percentage: 87.5,
    job_count: 4500,
    salary_range: "₹5.5 - 12.5 LPA",
    min_salary_lpa: 5.5,
    max_salary_lpa: 12.5,
    growth_rate: "+48.0% YoY",
    velocity: "Surging",
    districts: ["Pune", "Aurangabad", "Nashik"],
    top_employers: ["Tata Motors", "Bajaj Auto", "Mahindra & Mahindra", "Ola Electric"],
    recommended_path: "Lithium BMS Testing, CAN bus, Motor Inverters, MATLAB/Simulink"
  },
  {
    skill: "PLC, SCADA & Industrial IoT",
    category: "Industrial Automation",
    demand_percentage: 84.0,
    job_count: 3600,
    salary_range: "₹4.5 - 9.8 LPA",
    min_salary_lpa: 4.5,
    max_salary_lpa: 9.8,
    growth_rate: "+18.5% YoY",
    velocity: "Stable",
    districts: ["Pune", "Aurangabad", "Nashik", "Nagpur"],
    top_employers: ["Bharat Forge", "Siemens Pune", "Thermax", "Schneider Electric"],
    recommended_path: "Siemens S7-1200, Allen-Bradley, Modbus TCP, Node-RED"
  },
  {
    skill: "Industrial Robotics (FANUC/KUKA)",
    category: "Industrial Automation",
    demand_percentage: 82.5,
    job_count: 2900,
    salary_range: "₹5.0 - 10.5 LPA",
    min_salary_lpa: 5.0,
    max_salary_lpa: 10.5,
    growth_rate: "+26.0% YoY",
    velocity: "Rising",
    districts: ["Pune", "Aurangabad"],
    top_employers: ["Tata Technologies", "KUKA Systems", "ABB India", "Force Motors"],
    recommended_path: "Robotic Arm Kinematics, End-Effector Safety, Teach Pendant"
  },
  {
    skill: "Smart Warehouse & Supply Chain IoT",
    category: "Smart Logistics",
    demand_percentage: 79.2,
    job_count: 2700,
    salary_range: "₹4.2 - 8.8 LPA",
    min_salary_lpa: 4.2,
    max_salary_lpa: 8.8,
    growth_rate: "+21.0% YoY",
    velocity: "Rising",
    districts: ["Nagpur", "Mumbai", "Pune"],
    top_employers: ["Delhivery", "Amazon Fulfillment", "DHL Supply Chain", "Mahindra Logistics"],
    recommended_path: "RFID/Barcode Telemetry, WMS Systems, AGV Fleet Routing"
  }
];

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [skillDemand, setSkillDemand] = useState([]);
  const [loading, setLoading] = useState(true);

  // Skill demand interactive states
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('All');
  const [skillDistrictFilter, setSkillDistrictFilter] = useState('All');
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [skillViewMode, setSkillViewMode] = useState('cards'); // 'cards' | 'demand_chart' | 'salary_chart'

  useEffect(() => {
    api.getDashboardStats().then(res => {
      setData(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
    api.getSkillDemand().then(setSkillDemand).catch(err => console.error(err));
  }, []);

  // Merge live API data with rich benchmark profiles
  const mergedSkills = useMemo(() => {
    if (skillDemand && skillDemand.length > 0) {
      const benchmarkMap = new Map(MAHARASHTRA_SKILL_BENCHMARKS.map(b => [b.skill.toLowerCase(), b]));
      
      const enrichedApiSkills = skillDemand.map(item => {
        const itemLower = item.skill?.toLowerCase() || '';
        const match = benchmarkMap.get(itemLower) || 
                      MAHARASHTRA_SKILL_BENCHMARKS.find(b => b.skill.toLowerCase().includes(itemLower) || itemLower.includes(b.skill.toLowerCase()));
        
        return {
          skill: item.skill,
          category: item.category || match?.category || "AI & Software",
          demand_percentage: item.demand_percentage || match?.demand_percentage || 80,
          job_count: item.job_count || match?.job_count || 1200,
          salary_range: match?.salary_range || "₹5.0 - 10.5 LPA",
          min_salary_lpa: match?.min_salary_lpa || 5.0,
          max_salary_lpa: match?.max_salary_lpa || 10.5,
          growth_rate: match?.growth_rate || "+24.0% YoY",
          velocity: match?.velocity || "High Demand",
          districts: match?.districts || ["Pune", "Mumbai"],
          top_employers: match?.top_employers || ["Tata Motors", "Infosys", "Tech Mahindra"],
          recommended_path: match?.recommended_path || `Comprehensive industry mastery modules for ${item.skill}`
        };
      });

      const existingNames = new Set(enrichedApiSkills.map(s => s.skill.toLowerCase()));
      const remainingBenchmarks = MAHARASHTRA_SKILL_BENCHMARKS.filter(b => !existingNames.has(b.skill.toLowerCase()));

      return [...enrichedApiSkills, ...remainingBenchmarks];
    }
    return MAHARASHTRA_SKILL_BENCHMARKS;
  }, [skillDemand]);

  // Filter skills based on user selections
  const filteredSkills = useMemo(() => {
    return mergedSkills.filter(item => {
      const matchesCategory = skillCategoryFilter === 'All' || item.category === skillCategoryFilter;
      const matchesDistrict = skillDistrictFilter === 'All' || (item.districts && item.districts.some(d => d.toLowerCase().includes(skillDistrictFilter.toLowerCase())));
      const matchesSearch = !skillSearchQuery || 
        item.skill.toLowerCase().includes(skillSearchQuery.toLowerCase()) || 
        item.category.toLowerCase().includes(skillSearchQuery.toLowerCase()) ||
        (item.top_employers && item.top_employers.some(e => e.toLowerCase().includes(skillSearchQuery.toLowerCase())));
      return matchesCategory && matchesDistrict && matchesSearch;
    });
  }, [mergedSkills, skillCategoryFilter, skillDistrictFilter, skillSearchQuery]);

  const demandChartData = useMemo(() => {
    return filteredSkills.slice(0, 8).map(s => ({
      name: s.skill.length > 18 ? s.skill.substring(0, 16) + '...' : s.skill,
      fullName: s.skill,
      demand: s.demand_percentage,
      jobs: s.job_count
    }));
  }, [filteredSkills]);

  const salaryChartData = useMemo(() => {
    return filteredSkills.slice(0, 8).map(s => ({
      name: s.skill.length > 18 ? s.skill.substring(0, 16) + '...' : s.skill,
      fullName: s.skill,
      minSalary: s.min_salary_lpa,
      maxSalary: s.max_salary_lpa
    }));
  }, [filteredSkills]);

  const skillCategories = ['All', 'AI & Software', 'EV & Automotive', 'Cloud & DevOps', 'Industrial Automation', 'Data & Analytics', 'Smart Logistics'];
  const skillDistricts = ['All', 'Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad'];

  const COLORS = ['#2563EB', '#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EC4899'];

  const role = currentUser?.role || 'student';

  const renderRoleActions = () => {
    switch (role) {
      case 'student':
        return (
          <>
            <Link
              to="/career-guidance"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              AI Career Roadmap
            </Link>
            <Link
              to="/skills"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              In-Demand Skills
            </Link>
            <Link
              to="/jobs"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-sky-400" />
              View Jobs
            </Link>
          </>
        );
      case 'trainer':
      case 'institution':
        return (
          <>
            <Link
              to="/skill-gap"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Target className="w-4 h-4" />
              Skill Gap Engine
            </Link>
            <Link
              to="/obsolete-courses"
              className="px-4 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 font-bold text-xs border border-rose-800/80 transition flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Obsolete Alerts (2)
            </Link>
            <Link
              to="/equipment-planning"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-sky-400" />
              Lab Equipment
            </Link>
          </>
        );
      case 'employer':
        return (
          <>
            <Link
              to="/jobs"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" />
              Post Job Opening
            </Link>
            <Link
              to="/employer-validation"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              Validate Curriculum
            </Link>
            <Link
              to="/skills"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Skill Demand Insights
            </Link>
          </>
        );
      case 'admin':
      default:
        return (
          <>
            <Link
              to="/district-plans"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              District Plans (DSDP)
            </Link>
            <Link
              to="/skill-gap"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Target className="w-4 h-4 text-sky-400" />
              Skill Gap Engine
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              Groq AI Settings
            </Link>
          </>
        );
    }
  };

  const renderRoleFocusCard = () => {
    switch (role) {
      case 'student':
        return (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50/50 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm shadow-amber-500/30">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">Candidate Career Hub</h4>
                <p className="text-xs text-amber-900 mt-0.5">
                  Explore personalized AI career pathways, identify skill gaps against real jobs, and prepare for industry hiring.
                </p>
              </div>
            </div>
            <Link
              to="/career-guidance"
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition shrink-0 flex items-center gap-1"
            >
              Take Assessment <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      case 'trainer':
      case 'institution':
        return (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50/50 border border-blue-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm shadow-blue-500/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Faculty & Curriculum Modernization</h4>
                <p className="text-xs text-blue-900 mt-0.5">
                  2 programs flagged with syllabus deficits in Western Maharashtra. Modernize EV and industrial IoT coursework.
                </p>
              </div>
            </div>
            <Link
              to="/skill-gap"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition shrink-0 flex items-center gap-1"
            >
              Run Gap Audit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      case 'employer':
        return (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm shadow-emerald-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Industry Talent Partnership</h4>
                <p className="text-xs text-emerald-900 mt-0.5">
                  Over 420 polytechnic candidates in Pune district match your target competencies. Review curriculum standards.
                </p>
              </div>
            </div>
            <Link
              to="/employer-validation"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition shrink-0 flex items-center gap-1"
            >
              Validate Skills <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
      case 'admin':
      default:
        return (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50/50 border border-purple-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm shadow-purple-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider">Statewide Skill Governance (DVET)</h4>
                <p className="text-xs text-purple-900 mt-0.5">
                  36 District Skill Development Plans (DSDP) coordinated. 24 high-priority curriculum actions pending across 6 zones.
                </p>
              </div>
            </div>
            <Link
              to="/district-plans"
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition shrink-0 flex items-center gap-1"
            >
              Inspect DSDP Allocations <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Persona Context */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Maharashtra Labour Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {currentUser?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Currently authenticated as <span className="font-bold text-white underline decoration-blue-400">{currentUser?.roleTitle || role}</span> {currentUser?.organization ? `at ${currentUser.organization}` : ''} ({currentUser?.district || 'Maharashtra'}).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {renderRoleActions()}
          </div>
        </div>
      </div>

      {/* Role-Specific Focus Action Card */}
      {renderRoleFocusCard()}

      {/* Top Statistics Cards - Section 5 Feature 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Job Demand"
          value={data?.stats?.totalJobDemand?.toLocaleString() || "52,400"}
          change="+18.4% YoY"
          isPositive={true}
          icon={Briefcase}
          color="blue"
          subtitle="Across Maharashtra"
        />
        <StatCard
          title="Active Skills"
          value={data?.stats?.activeSkills || "500+"}
          change="+34 New"
          isPositive={true}
          icon={Sparkles}
          color="indigo"
          subtitle="Profiles monitored"
        />
        <StatCard
          title="Training Programs"
          value={data?.stats?.trainingPrograms || "142"}
          change="89% Validated"
          isPositive={true}
          icon={BookOpen}
          color="cyan"
          subtitle="Polytechnics & ITIs"
        />
        <StatCard
          title="Identified Skill Gaps"
          value={data?.stats?.identifiedSkillGaps || "24"}
          change="Action Required"
          isPositive={false}
          icon={AlertTriangle}
          color="rose"
          subtitle="Curriculum deficits"
        />
        <StatCard
          title="Employer Survey"
          value={data?.stats?.employerParticipation || "160+"}
          change="+28 this month"
          isPositive={true}
          icon={Building2}
          color="emerald"
          subtitle="Tata, Infosys, etc."
        />
        <StatCard
          title="Avg Placement Rate"
          value={`${data?.stats?.averagePlacementRate || "74.8"}%`}
          change="+6.2% vs 2025"
          isPositive={true}
          icon={Award}
          color="amber"
          subtitle="Statewide cohort"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sector Demand vs Supply Comparison */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Industry Demand vs Training Supply by Sector</h3>
              <p className="text-xs text-slate-500">Compares employer hiring volumes against polytechnic graduate outputs</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
              Maharashtra 2026-27
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.sectorDemand || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="sector" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} tickFormatter={(v) => v.split(' ')[0]} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="demand" name="Industry Vacancies" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="supply" name="Training Capacity" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Demand Share */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">District Job Share</h3>
              <p className="text-xs text-slate-500">Concentration of current industrial openings</p>
            </div>
            <div className="h-56 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.districtDemand || []}
                    dataKey="openings"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {(data?.districtDemand || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Top Hub</span>
              <p className="font-bold text-slate-900 truncate">Mumbai (31.2K)</p>
            </div>
            <div className="p-2 rounded bg-slate-50">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Tech Capital</span>
              <p className="font-bold text-slate-900 truncate">Pune (24.5K)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Skill Demand & Placement Intelligence Hub */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>Maharashtra Student Skill & Placement Intelligence</span>
            </div>
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              Industry Skill Demand & Placement Velocity
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Live 2026-27 Stream
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Real-time employer demand scores, verified hiring volumes, and salary benchmarks mapped across Pune, Mumbai, Nagpur, and regional industrial corridors.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold leading-none">Openings Tracked</span>
                <span className="font-black text-slate-900">52,400+</span>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold leading-none">State Avg CTC</span>
                <span className="font-black text-slate-900">₹6.8 LPA</span>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold leading-none">Corridors Mapped</span>
                <span className="font-black text-slate-900">36 Districts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls & View Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[220px] max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={skillSearchQuery}
                onChange={(e) => setSkillSearchQuery(e.target.value)}
                placeholder="Search skills, employers..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
              {skillSearchQuery && (
                <button 
                  onClick={() => setSkillSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* District Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={skillDistrictFilter}
                onChange={(e) => setSkillDistrictFilter(e.target.value)}
                className="text-xs bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Maharashtra Corridors</option>
                <option value="Pune">Pune (Tech & Auto)</option>
                <option value="Mumbai">Mumbai (FinTech & IT)</option>
                <option value="Nagpur">Nagpur (Logistics & MIHAN)</option>
                <option value="Nashik">Nashik (Electronics & Auto)</option>
                <option value="Aurangabad">Aurangabad / Sambhajinagar</option>
              </select>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setSkillViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                skillViewMode === 'cards'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Directory Cards
            </button>
            <button
              onClick={() => setSkillViewMode('demand_chart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                skillViewMode === 'demand_chart'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Demand & Jobs Chart
            </button>
            <button
              onClick={() => setSkillViewMode('salary_chart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                skillViewMode === 'salary_chart'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Salary Benchmarks
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {skillCategories.map(cat => {
            const count = cat === 'All' 
              ? mergedSkills.length 
              : mergedSkills.filter(s => s.category === cat).length;
            const isActive = skillCategoryFilter === cat;

            return (
              <button
                key={cat}
                onClick={() => setSkillCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <span>{cat === 'All' ? '🔥 All Domains' : cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Renderers */}
        {skillViewMode === 'cards' && (
          <div>
            {filteredSkills.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSkills.map((item, index) => {
                  const isTop1 = index === 0;
                  const isTop2 = index === 1;
                  const isTop3 = index === 2;

                  return (
                    <div 
                      key={item.skill}
                      className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        {/* Card Header: Rank & Velocity Status */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-1.5">
                            {isTop1 ? (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[11px] font-black shadow-xs">
                                <Crown className="w-3 h-3" /> #1 Rank
                              </span>
                            ) : isTop2 ? (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200 text-slate-800 text-[11px] font-black">
                                #2 Rank
                              </span>
                            ) : isTop3 ? (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black">
                                #3 Rank
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold">
                                #{index + 1}
                              </span>
                            )}
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[130px]">
                              {item.category}
                            </span>
                          </div>

                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 ${
                            item.velocity === 'Surging'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              : item.velocity === 'High Demand'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}>
                            {item.velocity === 'Surging' && '🔥 '}
                            {item.growth_rate}
                          </span>
                        </div>

                        {/* Title & Demand Score Meter */}
                        <div className="mb-3">
                          <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.skill}
                          </h4>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                              <span className="text-slate-500">Industry Demand Score</span>
                              <span className="text-blue-700 font-black">{item.demand_percentage}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                                style={{ width: `${Math.min(item.demand_percentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Quick Metrics Grid */}
                        <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] mb-3">
                          <div className="text-center">
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Vacancies</span>
                            <span className="font-black text-slate-900">{item.job_count?.toLocaleString()}</span>
                          </div>
                          <div className="text-center border-x border-slate-200/60">
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Salary Band</span>
                            <span className="font-black text-emerald-700 truncate block">{item.salary_range}</span>
                          </div>
                          <div className="text-center">
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Corridor</span>
                            <span className="font-black text-slate-800 truncate block">{item.districts?.[0] || 'MH'}</span>
                          </div>
                        </div>

                        {/* Top Hiring Companies */}
                        {item.top_employers && (
                          <div className="mb-2.5">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                              Top Hiring In Maharashtra:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {item.top_employers.slice(0, 3).map((emp, i) => (
                                <span key={i} className="text-[10px] bg-slate-100 text-slate-700 font-medium px-1.5 py-0.5 rounded">
                                  {emp}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommended Path Tip */}
                        {item.recommended_path && (
                          <p className="text-[10px] text-slate-500 bg-blue-50/50 p-2 rounded-lg border border-blue-100/60 line-clamp-1 mb-3">
                            <span className="font-bold text-blue-900">Key Syllabus:</span> {item.recommended_path}
                          </p>
                        )}
                      </div>

                      {/* Student Action Button */}
                      <Link
                        to={`/career-guidance?targetSkill=${encodeURIComponent(item.skill)}`}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition group-hover:shadow group-hover:scale-[1.01]"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        Plan Learning Roadmap
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No skills match the selected filter</p>
                <p className="text-xs text-slate-500 mt-1">Try resetting the domain category or search keywords.</p>
                <button
                  onClick={() => { setSkillCategoryFilter('All'); setSkillDistrictFilter('All'); setSkillSearchQuery(''); }}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* View Mode: Demand & Vacancies Chart */}
        {skillViewMode === 'demand_chart' && (
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Employer Demand Index vs Active Openings</h4>
                <p className="text-[11px] text-slate-500">Compares market demand urgency against verified vacancies</p>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">Top Filtered Skills</span>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandChartData} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#475569' }} 
                    interval={0} 
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#475569' }} domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#475569' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
                    formatter={(val, name) => [
                      name === 'demand' ? `${val}%` : val.toLocaleString(),
                      name === 'demand' ? 'Demand Score' : 'Active Vacancies'
                    ]}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar yAxisId="left" dataKey="demand" name="Demand Score (%)" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="jobs" name="Active Vacancies" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* View Mode: Salary Benchmarks Chart */}
        {skillViewMode === 'salary_chart' && (
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Maharashtra Placement Salary Projections (LPA)</h4>
                <p className="text-[11px] text-slate-500">Junior entry-level package vs 3-year experienced CTC in major industrial zones</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Verified 2026 Scale
              </span>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryChartData} margin={{ top: 10, right: 20, left: -10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#475569' }} 
                    interval={0} 
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#475569' }} unit=" L" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
                    formatter={(val, name) => [`₹${val} LPA`, name === 'minSalary' ? 'Starting CTC' : 'Experienced CTC']}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="minSalary" name="Starting CTC (Min LPA)" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maxSalary" name="Experienced CTC (Max LPA)" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Student High-ROI Placement Action Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/30 text-blue-200 border border-blue-400/40 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                ⭐ Student Placement Accelerator
              </div>
              <h4 className="text-sm font-bold text-white">
                Turn High-Demand Skills into Concrete Campus Offers
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                Maharashtra tech corridors (Pune, Mumbai, Nagpur) reward dual-competencies (e.g. AI + Cloud or EV + PLC). Check your syllabus alignment and generate a step-by-step personalized curriculum roadmap.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-stretch sm:self-auto">
            <Link
              to="/career-guidance"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              Launch Career Wizard
            </Link>
            <Link
              to="/jobs"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Matching Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Role-Aware Quick Workflows */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Action Center for {currentUser?.roleTitle}</h3>
            <p className="text-xs text-slate-500">Frequently used actions tailored to your authorized privileges</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Persona Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/skill-gap"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Skill Gap Diagnosis</h4>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Select district, sector, and course to run mathematical gap matching and AI curriculum recommendations.
            </p>
          </Link>

          <Link
            to="/courses"
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Course Intelligence</h4>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Audit course alignment, inspect missing modules, and modernize curriculums with one-click additions.
            </p>
          </Link>

          <Link
            to="/district-plans"
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">District Training Plan</h4>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Generate and download official PDF District Skill Development Plans (DSDP) for state allocations.
            </p>
          </Link>

          <Link
            to="/career-guidance"
            className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 mb-1">Career Roadmap Wizard</h4>
            <p className="text-[11px] text-slate-500 line-clamp-2">
              Assess candidate skill deficits, visualize step-by-step career path, and view high-placement training.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
