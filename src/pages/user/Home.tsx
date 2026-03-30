
import UserNavBar from "../../layout/UserNavBar";
import homeimage from "../../assets/homepage1.webp";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { type Program } from "../../types/programType";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import { useLocation } from 'react-router-dom';
import Toast from "../../components/Toast";
import { PublicProgramsService } from "../../services/public/programs";
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([])
  const ITEMS_PER_VIEW = 3;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const isLogged=useAppSelector(state=> state.auth.accessToken)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  let location=useLocation()
  useEffect(() => {
      if (location.state?.message) {
        setToastMessage(location.state.message);
  
        window.history.replaceState({}, document.title);
      }
      document.title='FitTribe | Home'
    }, [location]);

  useEffect(() => {
    const fetchServices = async () => {
      let response = await PublicProgramsService.explorePrograms('user');
      setPrograms(response.program.data ?? [])
    }
    fetchServices()
  }, [])
  const visiblePrograms = programs.slice(
    currentIndex,
    currentIndex + ITEMS_PER_VIEW
  );
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
    <div className="bg-white">
      <UserNavBar />
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="success" 
          onClose={() => setToastMessage(null)} 
        />
      )}
      <div className="pt-[74px]">
        <section className="relative h-[70vh] flex items-center overflow-hidden">
          <img
            src={homeimage}
            className="absolute inset-0 w-full h-full object-cover"
            alt="hero"
          />
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">
              EVOLVE <br /> <span className="text-red-600">YOUR BODY.</span>
            </h1>
            <button
              onClick={() => navigate('/trainers')}
              className="mt-8 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-full font-bold inline-flex items-center gap-2 transition-all"
            >
              Get Started <FaArrowRight />
            </button>
          </div>
        </section>
        {!isLogged &&(
        <section className="max-w-7xl mx-auto px-6 py-20 bg-white">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              Join the Movement
            </h2>
            <p className="text-gray-500 mt-2">Choose your path and start your journey with Vitalic today.</p>
            <div className="h-1 w-20 bg-red-600 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-gray-900 h-[400px] flex items-center justify-center text-center p-8 transition-all hover:shadow-2xl hover:shadow-red-600/20">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black text-white mb-4">I WANT TO <br /><span className="text-red-600">GET FIT</span></h3>
                <p className="text-gray-300 mb-8 max-w-xs mx-auto text-sm font-medium">
                  Access world-class trainers, personalized programs, and a community that pushes you.
                </p>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all uppercase tracking-wider text-sm"
                >
                  Join as Member
                </button>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-[2.5rem] bg-gray-900 h-[400px] flex items-center justify-center text-center p-8 transition-all hover:shadow-2xl hover:shadow-gray-900/40">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative z-10">
                <h3 className="text-4xl font-black text-white mb-4">I WANT TO <br /><span className="text-white">COACH</span></h3>
                <p className="text-gray-300 mb-8 max-w-xs mx-auto text-sm font-medium">
                  Grow your business, manage clients effortlessly, and share your expertise with the world.
                </p>
                <button
                  onClick={() => navigate('/trainer/signup')}
                  className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all uppercase tracking-wider text-sm"
                >
                  Become a Trainer
                </button>
              </div>
            </div>
          </div>
        </section>
        )}
      </div>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
            What We Offer
          </h2>
          <div className="h-1 w-20 bg-red-600 mx-auto mt-2"></div>
        </div>

        <div className="relative flex items-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute -left-6 z-10 p-3 rounded-full bg-white shadow
        ${currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            <FaChevronLeft size={22} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {visiblePrograms.map((program) => (
              <div
                key={program.programId}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-gray-50 border shadow hover:shadow-xl transition"
              >
                <div className="h-60 overflow-hidden">
                  <img
                    src={program.programPic}
                    alt={program.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold">{program.name}</h3>
                  <p className="text-sm text-gray-500">{program.description}</p>
                  <button
                    onClick={() => navigate("/trainers")}
                    className="mt-4 text-red-600 font-bold text-sm hover:underline"
                  >
                    Explore Coaches
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={currentIndex + ITEMS_PER_VIEW >= programs.length}
            className={`absolute -right-6 z-10 p-3 rounded-full bg-white shadow
        ${currentIndex + ITEMS_PER_VIEW >= programs.length
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gray-100"
              }`}
          >
            <FaChevronRight size={22} />
          </button>
        </div>
      </section>

      <section className="bg-gray-900 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white text-3xl font-bold mb-6">Ready to reach your goals?</h2>
          <button
            onClick={() => navigate('/trainers')}
            className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all"
          >
            Find a Trainer Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;