import UserNavBar from "../../layout/UserNavBar";
import homeimage from "../../assets/homepage1.webp";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaStar,  FaRocket, FaComments, FaChartBar } from "react-icons/fa";
import { type Program } from "../../types/programType";
import { useAppSelector } from "../../redux/hooks";
import Toast from "../../components/Toast";
import { PublicProgramsService } from "../../services/public/programs";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const ITEMS_PER_VIEW = 3;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const isLogged = useAppSelector(state => state.auth.accessToken);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  let location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setToastMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
    document.title = 'FitTribe | Home';
  }, [location]);

  useEffect(() => {
    const fetchServices = async () => {
      let response = await PublicProgramsService.explorePrograms('user');
      setPrograms(response.program.data ?? []);
    };
    fetchServices();
  }, []);

  const visiblePrograms = programs.slice(currentIndex, currentIndex + ITEMS_PER_VIEW);

  const handleNext = () => {
    if (currentIndex + ITEMS_PER_VIEW < programs.length) {
      setCurrentIndex(prev => prev + ITEMS_PER_VIEW);
    }
  };

  const handlePrev = () => {
    if (currentIndex - ITEMS_PER_VIEW >= 0) {
      setCurrentIndex(prev => prev - ITEMS_PER_VIEW);
    }
  };

  return (
    <div className="bg-white font-sans selection:bg-red-100 selection:text-red-600">
      <UserNavBar />
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
      )}

      <div className="pt-[74px]">
        <section className="relative h-[85vh] flex items-center overflow-hidden">
          <img src={homeimage} className="absolute inset-0 w-full h-full object-cover scale-105" alt="hero" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              <span className="text-red-600 font-black tracking-[0.3em] uppercase text-sm mb-4 block">
                Premium Fitness Experience
              </span>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] text-white uppercase italic">
                Evolve <br /> <span className="text-red-600">Your Body.</span>
              </h1>
              <p className="mt-6 text-gray-300 text-lg font-medium max-w-md">
                Connect with elite trainers worldwide. Personalized programming meets cutting-edge technology.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/trainers')}
                  className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-red-600/20"
                >
                  Start Your Journey <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Your Path to Peak</h2>
              <div className="h-1.5 w-24 bg-red-600 mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: "01", title: "Select Coach", desc: "Browse our vetted tribe of elite professional trainers." },
                { step: "02", title: "Book Session", desc: "Instant scheduling with real-time availability sync." },
                { step: "03", title: "Get Results", desc: "Personalized tracking and direct coach communication." }
              ].map((item, i) => (
                <div key={i} className="text-center group">
                  <span className="text-7xl font-black text-slate-200 group-hover:text-red-100 transition-colors duration-500">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-[-20px] mb-4 uppercase">{item.title}</h3>
                  <p className="text-slate-500 font-medium px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Explore Programs</h2>
              <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest">Tailored for your specific goals</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handlePrev} disabled={currentIndex === 0}
                className="p-4 rounded-2xl bg-slate-100 hover:bg-red-600 hover:text-white transition-all disabled:opacity-20 shadow-sm">
                <FaChevronLeft />
              </button>
              <button onClick={handleNext} disabled={currentIndex + ITEMS_PER_VIEW >= programs.length}
                className="p-4 rounded-2xl bg-slate-100 hover:bg-red-600 hover:text-white transition-all disabled:opacity-20 shadow-sm">
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visiblePrograms.length > 0 ? (
              visiblePrograms.map((program) => (
                <div key={program.programId} className="group cursor-pointer overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-red-600/10 transition-all duration-500">
                  <div className="h-64 overflow-hidden relative">
                    <img src={program.programPic} alt={program.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase text-red-600">
                      Live Sessions
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">{program.name}</h3>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">{program.description}</p>
                    <button onClick={() => navigate("/trainers")} className="w-full py-4 border-2 border-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                      View Coaches
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest">Loading specialized programs...</p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-slate-900 py-24 px-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[120px] -mr-48 -mt-48"></div>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-8">
                Built for <span className="text-red-600">Performance</span>
              </h2>
              <div className="space-y-8">
                {[
                  { icon: <FaRocket />, title: "Real-time Booking", desc: "No more back-and-forth emails. Book instantly." },
                  { icon: <FaComments />, title: "Coach Chat", desc: "Direct 1-on-1 access to your trainer for guidance." },
                  { icon: <FaChartBar />, title: "Progress Analytics", desc: "Visualize your transformation with data dashboards." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white text-xl flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase text-lg mb-1">{feature.title}</h4>
                      <p className="text-slate-400 font-medium">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-[3rem] p-1 w-full aspect-square rotate-3 opacity-20 absolute inset-0"></div>
               <div className="bg-slate-800 rounded-[3rem] p-12 relative z-10 border border-slate-700 shadow-2xl">
                  <div className="space-y-6">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
                      <p className="text-red-500 font-black text-xs uppercase mb-2">Next Session</p>
                      <p className="text-white font-bold text-xl uppercase italic">Strength & Conditioning</p>
                      <p className="text-slate-400 text-sm">Today at 6:00 PM</p>
                    </div>
                    <div className="flex justify-between items-center text-white">
                       <span className="font-black uppercase text-sm">Progress</span>
                       <span className="text-red-500 font-black">84%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                       <div className="bg-red-600 h-full w-[84%]"></div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-black text-center text-slate-900 uppercase mb-16 tracking-tighter">Tribe Success</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Alex Rivers", role: "Athlete", text: "FitTribe changed how I view fitness. The UI is clean, and my coach is world-class." },
                { name: "Sarah Chen", role: "UI Designer", text: "The booking system is flawless. I've never been this consistent with my training." },
                { name: "Mark Sloan", role: "Entrepreneur", text: "Data-driven results. Finally a platform that respects my time and my goals." }
              ].map((t, i) => (
                <div key={i} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <div className="flex text-red-600 mb-6"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
                  <p className="text-slate-700 font-medium italic mb-8">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div>
                      <h4 className="font-black text-slate-900 uppercase text-xs">{t.name}</h4>
                      <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {!isLogged && (
          <section className="max-w-7xl mx-auto px-6 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group overflow-hidden rounded-[3rem] bg-slate-950 h-[450px] flex items-center justify-center text-center p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <h3 className="text-5xl font-black text-white mb-4 uppercase italic">Get <span className="text-red-600">Fit</span></h3>
                  <button onClick={() => navigate('/signup')} className="mt-6 bg-red-600 text-white px-10 py-4 rounded-full font-black hover:bg-red-700 transition-all uppercase tracking-widest text-xs">
                    Join as Member
                  </button>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-[3rem] bg-slate-950 h-[450px] flex items-center justify-center text-center p-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <h3 className="text-5xl font-black text-white mb-4 uppercase italic">Lead <span className="text-white">Tribe</span></h3>
                  <button onClick={() => navigate('/trainer/signup')} className="mt-6 bg-white text-black px-10 py-4 rounded-full font-black hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">
                    Become a Trainer
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
        <section className="bg-red-600 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-white text-4xl md:text-5xl font-black mb-8 uppercase italic tracking-tighter">Ready to join the tribe?</h2>
            <button onClick={() => navigate('/trainers')} className="bg-white text-red-600 px-12 py-5 rounded-full font-black hover:bg-slate-100 transition-all uppercase tracking-widest shadow-2xl">
              Find a Trainer Now
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;