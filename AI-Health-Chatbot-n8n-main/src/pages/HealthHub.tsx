import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  ShieldCheck, 
  Syringe, 
  Droplets, 
  Brain, 
  Apple, 
  Baby, 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  Map, 
  PhoneCall, 
  Download,
  Search,
  Sparkles,
  HeartPulse,
  Activity,
  AlertTriangle,
  WifiOff,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  FileText
} from "lucide-react";

interface HealthCategory {
  id: string;
  title: string;
  categoryKey: string;
  description: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  tag: string;
  articlesCount: number;
  featuredTopics: string[];
}

const HEALTH_CATEGORIES: HealthCategory[] = [
  {
    id: "preventive-care",
    title: "Preventive Healthcare",
    categoryKey: "preventive",
    description: "Essential lifestyle habits, early screening checks, and seasonal precautions to prevent illness.",
    gradient: "from-emerald-500 to-teal-700",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    icon: ShieldCheck,
    link: "/health-content/preventive-care",
    tag: "Core Prevention",
    articlesCount: 14,
    featuredTopics: ["Blood Pressure Control", "Seasonal Fevers", "Daily Walk Benefits"]
  },
  {
    id: "vaccination-schedules",
    title: "Immunization & Vaccines",
    categoryKey: "vaccination",
    description: "National immunization timetables for infants, children, pregnant women, and senior citizens.",
    gradient: "from-blue-500 to-indigo-700",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    icon: Syringe,
    link: "/health-content/vaccination-schedules",
    tag: "Immunization",
    articlesCount: 18,
    featuredTopics: ["Childhood 0-5 Years", "Tetanus Boosters", "Senior Flu Shots"]
  },
  {
    id: "hygiene-tips",
    title: "Hygiene & Sanitation",
    categoryKey: "hygiene",
    description: "Clean water handling, hand hygiene, and community sanitation protocols to stop infections.",
    gradient: "from-cyan-500 to-blue-600",
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    icon: Droplets,
    link: "/health-content/hygiene-tips",
    tag: "Sanitation",
    articlesCount: 11,
    featuredTopics: ["Water Boiling Guide", "Safe Food Storage", "Handwashing Protocol"]
  },
  {
    id: "mental-wellness",
    title: "Mental Wellness & Stress",
    categoryKey: "mental",
    description: "Actionable techniques for managing anxiety, family stress, and sleep deprivation.",
    gradient: "from-purple-500 to-indigo-600",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    icon: Brain,
    link: "/health-content/mental-wellness",
    tag: "Mindfulness",
    articlesCount: 12,
    featuredTopics: ["Breath Meditation (Pranayama)", "Stress Reduction", "Sleep Hygiene"]
  },
  {
    id: "nutrition-diet",
    title: "Local Nutrition & Diet",
    categoryKey: "nutrition",
    description: "Balanced, affordable diet plans using local grains, lentils, and fresh seasonal vegetables.",
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    icon: Apple,
    link: "/health-content/nutrition",
    tag: "Nutrition",
    articlesCount: 16,
    featuredTopics: ["Millet Diet Power", "Iron-Rich Foods", "Child Growth Diets"]
  },
  {
    id: "maternal-care",
    title: "Maternal & Infant Care",
    categoryKey: "maternal",
    description: "Antenatal guidance, hospital delivery preparation, and newborn breastfeeding safety.",
    gradient: "from-rose-500 to-pink-600",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    icon: Baby,
    link: "/health-content/maternal-care",
    tag: "Family Care",
    articlesCount: 15,
    featuredTopics: ["Antenatal Checkups", "Breastfeeding Basics", "Kangaroo Care"]
  }
];

const FILTER_TABS = [
  { id: "all", label: "All Knowledge" },
  { id: "preventive", label: "Preventive Care" },
  { id: "vaccination", label: "Vaccines" },
  { id: "hygiene", label: "Hygiene" },
  { id: "mental", label: "Mental Health" },
  { id: "nutrition", label: "Nutrition" },
  { id: "maternal", label: "Maternal & Baby" }
];

const LOCAL_HEALTH_BULLETINS = [
  {
    id: 1,
    severity: "alert",
    title: "Monsoon Dengue & Malaria Vigilance",
    location: "Rural & Sub-Urban Blocks",
    date: "Updated Today",
    summary: "Prevent standing water in coolers, tires, and pots. Free rapid NS1 antigen tests available at all block PHCs.",
    action: "View Dengue Guide",
    link: "/health-content/preventive-care"
  },
  {
    id: 2,
    severity: "info",
    title: "National Pulse Polio Sunday",
    location: "Pan-India Booths",
    date: "Upcoming Sunday",
    summary: "Two drops of life for all children under 5 years at nearest government schools, Anganwadis, and bus stands.",
    action: "View Vaccine Chart",
    link: "/health-content/vaccination-schedules"
  },
  {
    id: 3,
    severity: "warning",
    title: "Safe Drinking Water Precaution",
    location: "Monsoon Affected Districts",
    date: "Advisory Active",
    summary: "Boil drinking water for 10+ minutes to prevent acute diarrheal diseases and seasonal typhoid.",
    action: "Read Water Protocol",
    link: "/health-content/hygiene-tips"
  }
];

const HealthHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  React.useEffect(() => {
    document.title = "Health Knowledge Hub | SevaSetu AI";
  }, []);

  const filteredCategories = HEALTH_CATEGORIES.filter(cat => {
    const matchesFilter = selectedFilter === "all" || cat.categoryKey === selectedFilter;
    const matchesSearch = 
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.featuredTopics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10 pb-28 md:pb-12 animate-in fade-in duration-300">
      
      {/* 1. Header Banner & Search Strip */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 text-white shadow-lg relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>SevaSetu Medical Library • Verified Guidelines</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Community Health Knowledge Hub
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Clinically reviewed health education, immunization timetables, dietary practices, and maternal protocols tailored for Indian communities.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics (e.g. Dengue, Child Vaccines, Millet Diet, Blood Pressure)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm font-medium text-white placeholder:text-slate-400 focus:bg-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Emergency Offline Quick-Access Strip */}
      <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <WifiOff className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-emerald-950">100% Offline Emergency First-Aid Pocketbook</h3>
              <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                Works Without Internet
              </span>
            </div>
            <p className="text-xs text-emerald-800 font-medium mt-0.5">
              Instant step-by-step protocols for snakebites, heatstroke, severe burns, poisoning, and CPR with direct phone dialers.
            </p>
          </div>
        </div>

        <Link
          to="/offline-first-aid"
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
        >
          <span>Open First-Aid Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* 3. Category Filter Chips */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Explore Health Domains</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Showing {filteredCategories.length} {filteredCategories.length === 1 ? 'Category' : 'Categories'}
          </span>
        </div>

        {/* Scrollable Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedFilter === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={category.link}
                className="group bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl ${category.iconBg} ${category.iconColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {category.articlesCount} Articles
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  {/* Featured Sub-topics Pills */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {category.featuredTopics.map((topic, i) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>Read Verified Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No matching health guides found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search terms or reset the category filter.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedFilter("all"); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 4. Real-time District Health Bulletins & Disease Surveillance */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-600 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">District Health Vigilance & Alerts</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Updated Daily</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LOCAL_HEALTH_BULLETINS.map((bulletin) => (
            <div
              key={bulletin.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    bulletin.severity === "alert" 
                      ? "bg-rose-100 text-rose-800" 
                      : bulletin.severity === "warning"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {bulletin.severity.toUpperCase()}
                  </span>
                  <span className="text-slate-400 font-medium">{bulletin.date}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{bulletin.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{bulletin.summary}</p>
              </div>

              <Link
                to={bulletin.link}
                className="pt-2 border-t border-slate-100 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between"
              >
                <span>{bulletin.action}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Essential Directories & Resources (Static Safe Colors) */}
      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Essential Health Resources</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Resource 1: Health Calendar */}
          <Link
            to="/health-calendar"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Health Calendar</h4>
              <p className="text-xs text-slate-500 mt-0.5">National health awareness days & local camp dates.</p>
            </div>
            <div className="text-xs font-bold text-blue-600 flex items-center gap-1 pt-1">
              <span>View Calendar</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Resource 2: Health Directory */}
          <Link
            to="/health-directory"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Health Directory</h4>
              <p className="text-xs text-slate-500 mt-0.5">Find nearest Primary Health Centres & civil hospitals.</p>
            </div>
            <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 pt-1">
              <span>Find Centers</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Resource 3: Helplines */}
          <Link
            to="/helplines"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-rose-300 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">Emergency Helplines</h4>
              <p className="text-xs text-slate-500 mt-0.5">Direct 24/7 access to 108, 104, 112 & women safety.</p>
            </div>
            <div className="text-xs font-bold text-rose-600 flex items-center gap-1 pt-1">
              <span>View Numbers</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Resource 4: PDF Library */}
          <Link
            to="/pdf-library"
            className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">PDF Library</h4>
              <p className="text-xs text-slate-500 mt-0.5">Downloadable regional clinical brochures & guides.</p>
            </div>
            <div className="text-xs font-bold text-indigo-600 flex items-center gap-1 pt-1">
              <span>Download PDFs</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        </div>
      </section>

      {/* 6. Consult AI Health Assistant CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl md:rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold">Have Symptoms or Need Personal Guidance?</h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Our clinical AI triage assistant answers health questions in Hindi, Telugu, Odia, and English 24/7.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/chat"
            className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>Consult AI Assistant</span>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HealthHub;