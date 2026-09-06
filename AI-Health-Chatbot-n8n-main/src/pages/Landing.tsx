import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { 
  Heart, 
  Bot, 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  Globe, 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  HelpingHand,
  Menu,
  X,
  Plus,
  Sparkles,
  ChevronDown,
  Mic,
  Camera,
  Users,
  TrendingUp,
  Search,
  DownloadCloud,
  WifiOff
} from "lucide-react";

import { usePWAInstall } from "../hooks/usePWAInstall";

const Landing: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const { installPrompt, isInstalled, handleInstall } = usePWAInstall();

  React.useEffect(() => {
    document.title = "SevaSetu AI | Healthcare Simplified for Bharat";
  }, []);

  const faqItems = [
    { q: "Is my medical data safe and private?", a: "SevaSetu AI follows top-tier encryption and adheres to the National Digital Health Mission (NDHM) guidelines. Your voice and reports are analyzed anonymously and not shared with third parties." },
    { q: "Do I need to pay for using Seva AI?", a: "No. SevaSetu AI is a social impact platform. Every feature, from AI symptom analysis to government scheme checks, is completely free for all Indian citizens." },
    { q: "How accurately does the AI translate reports?", a: "Our AI is trained on vast medical datasets to accurately interpret diagnostic language into simple, regional terms (Hindi, Marathi, etc.). However, it is not a clinical diagnosis and should be verified by a doctor." },
    { q: "Does it work in remote areas with low internet?", a: "Yes. Our platform is optimized to work on low-bandwidth 2G/3G networks. You can also send voice messages which are lighter on data than large text forms." }
  ];

  return (
    <div className="bg-[#F8FAFC] font-sans text-slate-900 min-h-screen overflow-x-hidden selection:bg-blue-100 selection:text-blue-700">
      {/* Premium Navbar */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-2xl border border-white/20 rounded-[32px] px-8 py-4 flex items-center justify-between shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] transition-all hover:bg-white/80">
            <div className="flex items-center gap-3 group cursor-pointer">
              <img 
                src="/app-icon.png" 
                alt="SevaSetu AI" 
                className="w-12 h-12 rounded-2xl object-contain shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform" 
              />
              <span className="text-2xl font-black tracking-tighter text-slate-800">SevaSetu<span className="text-blue-600 italic">AI</span></span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-10 font-black text-[11px] uppercase tracking-widest text-slate-400">
              <a href="#about" className="hover:text-blue-600 transition-colors">How it Works</a>
              
              {installPrompt && !isInstalled && (
                <button 
                  onClick={handleInstall}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
                >
                  <DownloadCloud className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Install App
                </button>
              )}

              <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a>
              <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
              
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-[14px]">
                {(['en', 'hi', 'te', 'or'] as const).map((lang) => (
                  <button 
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all ${
                      language === lang 
                        ? "bg-white text-blue-600 shadow-md" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to={user ? "/chat" : "/login"} className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 active:scale-95 transition-all hover:bg-blue-700">
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <button 
                className="lg:hidden p-3 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl active:scale-90 transition-transform"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center space-y-12 p-8 animate-in fade-in duration-300">
          <button 
            className="absolute top-8 right-8 p-4 text-slate-400 active:scale-90 transition-transform"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-10 h-10" />
          </button>
          
          <div className="flex flex-col items-center gap-8">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black tracking-tight hover:text-blue-600 transition-colors">How it Works</a>
            
            {installPrompt && !isInstalled && (
              <button 
                onClick={() => { handleInstall(); setMobileMenuOpen(false); }}
                className="flex items-center gap-4 text-blue-600 text-4xl font-black tracking-tight group"
              >
                <DownloadCloud className="w-10 h-10" />
                Install App
              </button>
            )}

            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black tracking-tight hover:text-blue-600 transition-colors">Testimonials</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black tracking-tight hover:text-blue-600 transition-colors">FAQ</a>
            <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black tracking-tight hover:text-blue-600 transition-colors">Consult AI</Link>
          </div>
          
          <Link 
            to="/chat" 
            onClick={() => setMobileMenuOpen(false)}
            className="w-full max-w-xs bg-blue-600 text-white px-10 py-6 rounded-[32px] font-black text-center text-xl shadow-2xl shadow-blue-200 active:scale-95 transition-all"
          >
            Start Now
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-28 md:pt-36 pb-16 px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 animate-in slide-in-from-left-6 duration-700">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50/80 backdrop-blur-md rounded-full border border-blue-100 text-blue-700 shadow-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bharat Health AI OS v2.0</span>
              </div>
              <Link to="/offline-first-aid" className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 rounded-full border border-amber-200 text-amber-800 text-[10px] font-bold transition-colors">
                <WifiOff className="w-3 h-3 text-amber-600" />
                <span>100% Offline First-Aid Mode</span>
              </Link>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Healthcare, <br/>
              <span className="text-blue-600 underline decoration-blue-200 decoration-4 underline-offset-4">Simplified</span> for Bharat.
            </h1>
            
            <p className="text-sm md:text-base lg:text-lg text-slate-600 font-medium max-w-xl leading-relaxed">
              Empowering 800M+ citizens across rural India with conversational symptom analysis, instant government scheme eligibility, and multimodal report scanning in regional languages.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
              <Link to="/chat" className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-200 active:scale-95 transition-all group">
                <MessageSquare className="w-4 h-4" />
                <span>{user ? "Go to Consultation" : "Talk to Seva AI"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/schemes" className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-800 hover:border-blue-500 hover:text-blue-600 px-7 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Scheme Wizard</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-xl border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`/avatar-${i}.png`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-500 leading-tight">
                Trusted by <br/>
                <span className="text-slate-900 font-black text-sm">15,000+ Rural Families</span>
              </p>
            </div>
          </div>

          <div className="relative group">
             <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative">
                <img 
                  src="/hero-bg.png" 
                  alt="Rural Healthcare" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
             </div>
             
             {/* Floating Mini Highlight Card */}
             <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[220px] hidden sm:block">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-7 h-7 bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Schemes Active</span>
                </div>
                <p className="text-sm font-black text-slate-800">Ayushman Bharat PM-JAY</p>
                <p className="text-[10px] text-slate-400 font-medium">₹5 Lakh Cashless Coverage</p>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Section */}
      <section id="about" className="py-20 px-4 md:px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left space-y-3 max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Core Health Ecosystem</span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
              Simple. Human. <span className="text-blue-600 underline decoration-blue-100 decoration-4 underline-offset-4">Intelligent.</span>
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-medium max-w-lg">
              Healthcare tools crafted for simplicity. Built to work on low-bandwidth networks and regional dialects.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "Talk to Seva AI", 
                desc: "Send a voice note or type symptoms in Telugu, Hindi, Odia, or English. It’s like speaking with a local health worker.", 
                icon: Mic, 
                step: "01"
              },
              { 
                title: "Scan Lab Reports & X-Rays", 
                desc: "Snap a photo of blood tests, prescriptions, or X-rays. Our vision AI translates medical values into plain advice instantly.", 
                icon: Camera, 
                step: "02"
              },
              { 
                title: "Government Scheme Wizard", 
                desc: "Discover which welfare schemes will sponsor your hospital care and dialysis, with direct 1-click apply links.", 
                icon: HelpingHand, 
                step: "03"
              }
            ].map((s, i) => (
              <div key={i} className="group bg-slate-50 p-7 rounded-2xl space-y-4 hover:bg-white hover:shadow-xl hover:border-slate-200 transition-all border border-slate-100">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-white text-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <s.icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-xs font-black text-slate-300 font-mono">{s.step}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">{s.title}</h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* District Health Monitoring Section */}
      <section className="py-20 px-4 md:px-6 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
             <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">Public Health Shield</span>
             <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
               Community & District <span className="text-rose-600 underline decoration-rose-200 decoration-4">Health Protection</span>
             </h2>
             <p className="text-sm md:text-base text-slate-500 font-medium">
               Anonymous health analytics alerting authorities to localized disease outbreaks before they spread.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <p className="text-base text-slate-600 font-medium leading-relaxed">
                Every consultation and report analysis anonymously contributes to an early-warning map that alerts district officers to sudden viral clusters.
              </p>
              
              <div className="space-y-4">
                {[
                  { label: "Predictive Analytics", desc: "AI forecasts seasonal spikes like Dengue, Malaria, or Viral Fever weeks in advance.", icon: Sparkles },
                  { label: "Emergency Broadcasting", desc: "Instant SMS and WhatsApp broadcasts to at-risk panchayats during heatwaves or water contamination.", icon: Globe }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <item.icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">{item.label}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-7">
               <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-200/80 relative group">
                  <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner">
                     <img src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Map View" />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className="w-28 h-28 bg-rose-600/20 rounded-full border-4 border-rose-600 animate-pulse flex items-center justify-center relative">
                           <div className="absolute inset-0 bg-rose-600/40 rounded-full blur-xl"></div>
                           <span className="bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xl relative z-10 whitespace-nowrap">VIRAL CLUSTER DETECTED</span>
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                     <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider mb-1">Hospital Capacity</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">98% <TrendingUp className="w-5 h-5 text-emerald-600" /></p>
                     </div>
                     <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <p className="text-[10px] font-bold uppercase text-blue-700 tracking-wider mb-1">Villages Monitored</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">1,240</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 md:px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
           <div className="text-center space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600">
                <Sparkles className="w-3.5 h-3.5 fill-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Community Impact</span>
             </div>
             <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
               Voices of <span className="text-blue-600 underline decoration-blue-100 decoration-4">Bharat</span>
             </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                name: "Suresh P.", 
                role: "Farmer, Pune", 
                text: "I didn’t know I qualified for PMJAY. Seva AI guided me without any middleman fees, and now my cardiac surgery is covered.", 
                img: "12"
              },
              { 
                name: "Anita D.", 
                role: "ASHA Health Worker", 
                text: "Explaining reports to villagers in local dialects was hard. Now, I use Seva AI to show them exactly what their blood tests mean.", 
                img: "34"
              },
              { 
                name: "Dr. Vinay K.", 
                role: "PHC Medical Officer", 
                text: "The real-time disease maps give me earlier awareness of monsoon fever outbreaks in remote blocks before reports arrive.", 
                img: "56"
              }
            ].map((t, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl space-y-4 hover:bg-white hover:shadow-lg transition-all border border-slate-100 flex flex-col justify-between">
                <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60">
                  <div className="w-10 h-10 rounded-xl border border-white bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/150?img=${t.img}`} className="w-full h-full object-cover" alt={t.name} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">{t.name}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 md:px-6 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
             <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Got Questions?</span>
             <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
               Frequently Asked <span className="text-blue-600">Questions</span>
             </h2>
          </div>
          
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div 
                key={i} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 cursor-pointer hover:border-blue-300 transition-all"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex justify-between items-center gap-4">
                  <h4 className="font-bold text-sm md:text-base text-slate-800 leading-snug">{item.q}</h4>
                  <div className={`p-1.5 rounded-xl transition-transform text-slate-400 ${openFaq === i ? 'rotate-180 text-blue-600' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                <div className={`text-xs md:text-sm text-slate-500 font-medium leading-relaxed transition-all duration-300 overflow-hidden ${openFaq === i ? 'max-h-[250px] opacity-100 mt-3 pt-3 border-t border-slate-100' : 'max-h-0 opacity-0'}`}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
           <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-8 md:p-14 text-center space-y-6 shadow-2xl text-white">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                Ready to Experience <span className="text-blue-400">Better Healthcare</span>?
              </h2>
              <p className="text-sm md:text-base text-slate-300 max-w-lg mx-auto font-medium">
                Join thousands of citizens across Bharat who rely on SevaSetu for verified medical guidance, scheme eligibility, and report interpretation.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link to="/chat" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                  Start Free Consultation
                </Link>
                <Link to="/offline-first-aid" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95">
                  Offline First-Aid Guide
                </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/app-icon.png" 
                alt="SevaSetu AI" 
                className="w-9 h-9 rounded-xl object-contain shadow-md shadow-blue-500/20" 
              />
              <span className="text-xl font-black tracking-tight text-slate-900">SevaSetu AI</span>
            </div>
            <p className="max-w-md text-sm font-medium text-slate-500 leading-relaxed">
              Democratizing high-quality medical guidance for everyone in India. Verified multilingual AI triage, offline emergency protocols, and scheme accessibility.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-2.5 text-slate-600 font-medium text-sm">
              <li><Link to="/chat" className="hover:text-blue-600 transition-colors">AI Health Assistant</Link></li>
              <li><Link to="/schemes" className="hover:text-blue-600 transition-colors">Govt Schemes & Wizard</Link></li>
              <li><Link to="/offline-first-aid" className="hover:text-blue-600 transition-colors">Offline Pocketbook</Link></li>
              <li><Link to="/analysis" className="hover:text-blue-600 transition-colors">Report Analyzer</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
             <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Emergency Contacts</h4>
             <div className="space-y-1">
               <a href="tel:108" className="text-lg font-bold text-red-600 hover:underline flex items-center gap-1.5">
                 108 <span className="text-xs font-semibold text-slate-500">(National Ambulance)</span>
               </a>
               <p className="text-xs font-medium text-slate-400">Available 24/7 across India</p>
             </div>
             <p className="text-xs text-slate-400 leading-relaxed">© 2026 SevaSetu Health Systems. Educational AI tool, not a substitute for clinical diagnosis.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
