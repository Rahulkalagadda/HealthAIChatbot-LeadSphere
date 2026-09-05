import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  Info, 
  ShieldCheck, 
  Plus, 
  Filter,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertTriangle,
  History
} from "lucide-react";
import { schemesService, alertsService } from "../services/api";
import { toast } from "sonner";
import { SchemeWizard } from "../components/SchemeWizard";

interface Scheme {
  title: string;
  description: string;
  benefits: string[];
  eligibility: string;
  apply_url: string;
}

const GovtSchemes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Government Health Schemes | SevaSetu";
    const initialFetch = async () => {
      setIsLoading(true);
      try {
        const data = await schemesService.getSchemes("health");
        setSchemes(data.schemes.slice(0, 3));
        
        const alertData = await alertsService.getAlerts("Maharashtra");
        setAlerts(alertData.alerts || []);
      } catch (err) {
        toast.error("Error loading initial data.");
      } finally {
        setIsLoading(false);
      }
    };
    initialFetch();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const data = await schemesService.getSchemes(searchQuery);
      setSchemes(data.schemes);
      if (data.schemes.length === 0) {
        toast.info("No schemes found for your query.");
      }
    } catch (err) {
      toast.error("Failed to fetch schemes. Using offline data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-10 pb-28 md:pb-12">
      {/* Search Hero */}
      <section className="relative space-y-6 animate-in slide-in-from-top-4 duration-500">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Social Security Engine</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-800">
            Government Health <span className="text-blue-600 underline decoration-blue-200 decoration-4 underline-offset-4">Assurance Hub</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl font-semibold leading-relaxed">
            Instant access to 500+ Central and State health schemes, cashless hospital coverage, and eligibility rules for Bharat.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative max-w-3xl group">
           <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-blue-600 group-focus-within:scale-110 transition-transform" />
           </div>
           <input 
              type="text"
              placeholder="Search diseases, scheme names, or keywords (e.g., Ayushman, Cancer, Dialysis)..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-32 text-sm font-semibold placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
           />
           <button 
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
           >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Search"}
           </button>
        </form>
      </section>

      {/* Standout Feature: Smart Scheme Eligibility Wizard */}
      <section>
        <SchemeWizard />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Schemes List */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-blue-600" />
                Available Schemes ({schemes.length})
              </h2>
              <button className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm">
                 <Filter className="w-4 h-4" /> Filter
              </button>
           </div>

           <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-white rounded-3xl border border-slate-100">
                   <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-xs font-semibold text-slate-400">Syncing central & state databases...</p>
                </div>
              ) : schemes.length > 0 ? (
                schemes.map((scheme, i) => (
                  <Card key={i} className="group border border-slate-200/80 bg-white rounded-2xl md:rounded-3xl shadow-sm hover:shadow-lg hover:border-blue-200 transition-all p-5 md:p-7 space-y-4">
                    <CardContent className="p-0 space-y-4">
                      {/* Top Header with Icon & Title */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                           <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                            {scheme.title}
                          </h3>
                          <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                            {scheme.description}
                          </p>
                        </div>
                      </div>

                      {/* Eligibility Box */}
                      {scheme.eligibility && (
                        <div className="p-3.5 bg-slate-50 border border-slate-100/90 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eligibility Criteria</span>
                          <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                            {scheme.eligibility}
                          </p>
                        </div>
                      )}

                      {/* Benefits Tags */}
                      {scheme.benefits && scheme.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {scheme.benefits.slice(0, 4).map((benefit, j) => (
                            <Badge key={j} variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200/60 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Footer Link & Action */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <Link 
                          to={`/scheme/${encodeURIComponent(scheme.title)}`}
                          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          View Detailed Coverage <ChevronRight className="w-4 h-4" />
                        </Link>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Verified Health Welfare
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="bg-white p-12 md:p-16 rounded-3xl text-center space-y-4 border border-slate-200/80">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
                      <Search className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900">No Matching Schemes Found</h3>
                   <p className="text-xs md:text-sm text-slate-500 font-medium max-w-sm mx-auto">Try searching for broader medical terms like "Blood", "Surgery", or "Maternity".</p>
                </div>
              )}
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
           {/* Alerts Panel */}
           <section className="bg-rose-50/70 rounded-2xl md:rounded-3xl p-6 border border-rose-100 space-y-5 relative overflow-hidden">
              <div className="flex items-center gap-2.5 text-rose-700">
                 <AlertTriangle className="w-5 h-5 animate-pulse text-rose-600" />
                 <h3 className="text-base font-bold tracking-tight">Active Regional Alerts</h3>
              </div>
              
              <div className="space-y-4">
                 {alerts.length > 0 ? alerts.map((alert, i) => (
                   <div key={i} className="space-y-1 pb-3 border-b border-rose-200/60 last:border-0 last:pb-0">
                      <p className="font-bold text-rose-900 text-sm">{alert.title}</p>
                      <p className="text-xs text-rose-700 leading-relaxed">{alert.description}</p>
                      <p className="text-[10px] font-semibold text-rose-500 pt-1">{alert.time}</p>
                   </div>
                 )) : (
                   <p className="text-xs text-rose-800 font-medium">No critical health alerts for your district today. All primary facilities open.</p>
                 )}
              </div>
              
              <button className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-rose-700 transition-all active:scale-95">
                Update District Block
              </button>
           </section>

           {/* Quick Status Check */}
           <section className="bg-slate-900 text-white rounded-2xl md:rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2.5">
                 <History className="w-5 h-5 text-blue-400" />
                 <h3 className="text-base font-bold tracking-tight">Ayushman (PM-JAY) Check</h3>
              </div>
              <p className="text-slate-300 font-normal text-xs leading-relaxed">Verify if your family has active PM-JAY ₹5 Lakh annual hospital cover using your Aadhaar or Ration Card number.</p>
              <div className="space-y-3 pt-1">
                 <input className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-xs font-medium placeholder:text-slate-400 outline-none focus:border-blue-400 text-white" placeholder="Enter Aadhaar or Ration No." />
                 <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all hover:bg-blue-700">Check Status</button>
              </div>
           </section>

           {/* Assistance Card */}
           <div className="bg-blue-50/70 p-6 rounded-2xl md:rounded-3xl border border-blue-100 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Need Help Choosing?</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Our AI assistant can explain eligibility criteria and required documents in English, Hindi, Telugu, or Odia.</p>
              <Link to="/chat" className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-xs hover:underline pt-1">
                 Ask Seva Assistant <ChevronRight className="w-3.5 h-3.5" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GovtSchemes;
