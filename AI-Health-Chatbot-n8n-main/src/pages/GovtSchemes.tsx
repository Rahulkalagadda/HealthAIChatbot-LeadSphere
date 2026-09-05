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
        <div className="lg:col-span-8 space-y-12">
           <div className="flex items-center justify-between px-4">
              <h2 className="text-3xl font-black font-headline tracking-tighter uppercase italic text-slate-800 flex items-center gap-3">
                <Plus className="w-8 h-8 text-blue-600" />
                Available Schemes
              </h2>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all">
                 <Filter className="w-5 h-5" />
              </button>
           </div>

           <div className="space-y-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                   <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-xs font-black uppercase tracking-widest text-slate-400 italic">Syncing with Central Databases...</p>
                </div>
              ) : schemes.length > 0 ? (
                schemes.map((scheme, i) => (
                  <Card key={i} className="group overflow-hidden border-none bg-white rounded-[48px] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-transparent hover:border-blue-100">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-4 bg-slate-100 p-10 flex flex-col justify-between group-hover:bg-blue-600 transition-colors duration-500">
                           <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                              <Sparkles className="w-10 h-10 text-blue-600" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-100/60 mb-1">Eligibility</p>
                              <p className="text-sm font-black text-slate-800 group-hover:text-white leading-tight">{scheme.eligibility}</p>
                           </div>
                        </div>
                        <div className="md:col-span-8 p-10 md:p-14 space-y-8 flex flex-col">
                           <h3 className="text-3xl font-black font-headline tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic">{scheme.title}</h3>
                           <p className="text-slate-500 font-bold leading-relaxed">{scheme.description}</p>
                           
                           <div className="flex flex-wrap gap-3">
                              {scheme.benefits.slice(0, 3).map((benefit, j) => (
                                <Badge key={j} className="bg-slate-50 text-slate-500 border-none px-4 py-2 rounded-full font-bold text-[10px] uppercase">{benefit}</Badge>
                              ))}
                           </div>

                           <div className="pt-4 flex items-center justify-between mt-auto">
                              <Link 
                                to={`/scheme/${encodeURIComponent(scheme.title)}`}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:underline"
                              >
                                View Detailed Coverage <ChevronRight className="w-4 h-4" />
                              </Link>
                              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                 <ArrowRight className="w-5 h-5" />
                              </div>
                           </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="bg-white p-20 rounded-[56px] text-center space-y-6 border-4 border-dashed border-slate-100">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                      <Search className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 uppercase italic">No Matches Found</h3>
                   <p className="text-slate-400 font-bold max-w-xs mx-auto">Try searching for broader terms like "Blood" or "Women Health".</p>
                </div>
              )}
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-10">
           {/* Alerts Panel */}
           <section className="bg-rose-50 rounded-[48px] p-10 border border-rose-100 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                 <AlertTriangle className="w-32 h-32 text-rose-600" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 text-rose-600">
                   <AlertTriangle className="w-6 h-6 animate-pulse" />
                   <h3 className="text-lg font-black uppercase tracking-tight italic">Health Alerts</h3>
                </div>
                
                <div className="space-y-6">
                   {alerts.length > 0 ? alerts.map((alert, i) => (
                     <div key={i} className="space-y-2 pb-6 border-b border-rose-200 last:border-0 last:pb-0">
                        <p className="font-black text-rose-900 text-lg tracking-tight uppercase leading-none">{alert.title}</p>
                        <p className="text-xs text-rose-800 font-bold opacity-70 italic">{alert.description}</p>
                        <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest pt-2">{alert.time}</p>
                     </div>
                   )) : (
                     <p className="text-xs text-rose-800 font-bold opacity-70">No critical alerts for your region today. Stay safe!</p>
                   )}
                </div>
                
                <button className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95">Update Monitoring Block</button>
              </div>
           </section>

           {/* Quick Actions */}
           <section className="bg-slate-900 text-white rounded-[48px] p-12 space-y-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-3">
                    <History className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-black uppercase tracking-tight italic">Status Check</h3>
                 </div>
                 <p className="text-blue-100/60 font-medium text-sm leading-relaxed">Check if you already have an active Ayushman Bharat (PM-JAY) coverage using your Aadhaar.</p>
                 <div className="space-y-4">
                    <input className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-sm font-bold placeholder:text-blue-100/30 outline-none focus:border-blue-400" placeholder="Enter Aadhaar Number" />
                    <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all hover:bg-blue-500">Verify Account</button>
                 </div>
              </div>
           </section>

           <div className="bg-blue-50/50 p-10 rounded-[48px] border border-blue-100 space-y-6">
              <h4 className="font-black text-slate-800 uppercase tracking-tight">Need Assistance?</h4>
              <p className="text-xs text-slate-500 font-bold leading-relaxed italic opacity-80">Our AI assistant can help you understand complex government terms in your regional language.</p>
              <Link to="/chat" className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] hover:underline">
                 Ask Seva Assistant <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GovtSchemes;
