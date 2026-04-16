import React, { useEffect } from 'react';
import UserNavBar from '../../layout/UserNavBar';
import { FaUsers, FaDumbbell, FaChartLine, FaCheckCircle } from 'react-icons/fa';

const About: React.FC = () => {
  useEffect(() => {
    document.title = "FitTribe | Our Mission";
  }, []);

  const stats = [
    { label: "Elite Trainers", value: "500+", icon: <FaDumbbell className="text-indigo-600" /> },
    { label: "Active Tribes", value: "10k+", icon: <FaUsers className="text-indigo-600" /> },
    { label: "Success Stories", value: "98%", icon: <FaChartLine className="text-indigo-600" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <UserNavBar />

      <main className="pt-24 pb-16 px-6">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto text-center mb-20">
          <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">
            The Movement
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
            Beyond Fitness. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              This is a Tribe.
            </span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            FitTribe is a bridge between elite human performance and modern technology. 
            We connect world-class trainers with individuals ready to transcend their limits.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center group hover:border-indigo-200 transition-all">
              <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Vision Section */}
        <section className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] -mr-32 -mt-32"></div>
            <h2 className="text-3xl font-black mb-6">Why we started FitTribe</h2>
            <div className="space-y-6">
              <p className="text-slate-400 leading-relaxed font-medium">
                We noticed that the fitness industry was fragmented. Great coaches were buried under algorithms, 
                and motivated people couldn't find the specific guidance they needed.
              </p>
              <div className="flex gap-4 items-start">
                <FaCheckCircle className="text-indigo-400 mt-1 flex-shrink-0" />
                <p className="text-sm font-medium">Verified elite trainers with proven track records.</p>
              </div>
              <div className="flex gap-4 items-start">
                <FaCheckCircle className="text-indigo-400 mt-1 flex-shrink-0" />
                <p className="text-sm font-medium">Real-time booking and seamless virtual session management.</p>
              </div>
              <div className="flex gap-4 items-start">
                <FaCheckCircle className="text-indigo-400 mt-1 flex-shrink-0" />
                <p className="text-sm font-medium">Direct communication without the middleman noise.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 pl-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Our Core Philosophy</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Consistency beats intensity. Our platform is built to make consistency inevitable 
                by removing the friction of scheduling, payment, and trainer discovery.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                <h4 className="font-black text-indigo-700 text-sm uppercase mb-2">Accessibility</h4>
                <p className="text-[12px] text-indigo-900/70 font-bold leading-tight">Training from anywhere, at any time.</p>
              </div>
              <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200">
                <h4 className="font-black text-slate-700 text-sm uppercase mb-2">Transparency</h4>
                <p className="text-[12px] text-slate-900/70 font-bold leading-tight">Real reviews. Real results. No hidden fees.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="max-w-4xl mx-auto text-center bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-slate-900 mb-6">Ready to find your Tribe?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                Browse Trainers
              </button>
              <button className="px-10 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-slate-900 transition-all">
                Become a Coach
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;