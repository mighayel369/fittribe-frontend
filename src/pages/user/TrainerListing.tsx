import { useEffect, useState, useRef } from "react";
import UserNavBar from "../../layout/UserNavBar";
import { FaMapMarkerAlt, FaStar, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import SearchInput from "../../components/SearchInput";
import { type Program } from "../../types/programType";
import { type UserSideTrainer } from "../../types/trainerType";
import { PublicTrainersService } from "../../services/public/trainers";
import { PublicProgramsService } from "../../services/public/programs";
import { cleanTrainerFilters } from "../../helperFunctions/cleanFilters"
import DEFAULT_IMAGE from './../../assets/default image.png'
import Toast from "../../components/Toast";
type ProgramOption = {
  programId: string;
  name: string;
};
const TrainerListing = () => {
  const navigate = useNavigate();
  const [startPrice, setStartPrice] = useState<number>(0)
  const [endPrice, setEndPrice] = useState<number>(3000)
  const [filters, setFilters] = useState({
    gender: "",
    language: "",
    programId: "",
    sort: "rating",
    startPrice: 0,
    endPrice: 3000
  });
  const [search, setSearch] = useState("");
  const [programs, setPrograms] = useState<ProgramOption[]>([])
  const [trainers, setTrainers] = useState<UserSideTrainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const maxLimit = 3000;
  const priceRangeLeftPercent = (startPrice / maxLimit) * 100;
  const priceRangeRightPercent = (endPrice / maxLimit) * 100;
  const priceFilterDivRef = useRef<HTMLDivElement>(null)
  const [activeHandle, setActiveHandle] = useState<"left" | "right" | null>(null);
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!activeHandle || !priceFilterDivRef.current) return;

      const rect = priceFilterDivRef.current.getBoundingClientRect();

      let percentage = (e.clientX - rect.left) / rect.width;
      percentage = Math.max(0, Math.min(1, percentage));

      const rawPrice = percentage * maxLimit;
      const steppedPrice = Math.round(rawPrice / 50) * 50;

      if (activeHandle === "left") {
        if (steppedPrice < endPrice) {
          setStartPrice(steppedPrice);
        }
      } else if (activeHandle === "right") {
        if (steppedPrice > startPrice) {
          setEndPrice(steppedPrice);
        }
      }
    };

    const handleGlobalMouseUp = () => {
      setFilters(prev => ({ ...prev, startPrice: startPrice, endPrice: endPrice }))
      console.log(filters)
      setActiveHandle(null);
    };
    if (activeHandle) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [activeHandle, startPrice, endPrice]);

  const handleLeftMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveHandle("left");
  };

  const handleRightMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveHandle("right");
  };
  useEffect(() => {
    const fetchServices = async () => {
      try {
        let response = await PublicProgramsService.explorePrograms();

        if (response.data.data) {
          const programData: ProgramOption[] = response.data.data.map(
            (curr: Program): ProgramOption => ({
              programId: curr.programId,
              name: curr.name,
            })
          );
          setPrograms(programData)
        }
      } catch (error: any) {
        setToast({ message: error.message, type: 'error' });
      }
    };
    fetchServices();
  }, []);
  useEffect(() => {
    document.title = "FitTribe | Expert Trainers";
  }, [filters]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        console.log(filters)
        const cleanedFilter = cleanTrainerFilters({ ...filters, search })
        const response = await PublicTrainersService.exploreTrainers(page, cleanedFilter);
        setTrainers(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err: any) {
        setToast({ message: err.message, type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, [page, search, filters]);




  useEffect(() => {
    setPage(1);
  }, [search, filters]);
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <UserNavBar />

      {toast && (
        <Toast
          message={toast.message}
          type="success"
          onClose={() => setToast(null)}
        />
      )}
      <div className="pt-40 pb-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Find Your <span className="text-red-600">Perfect Coach</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Transform your fitness journey with our world-class certified trainers tailored to your goals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10">

        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name or specialty..."
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Gender", key: "gender", options: ["male", "female"] },
              { label: "Programs", key: "programId", options: [...programs] },
            ].map((item) => (
              <div key={item.key} className="relative group">
                <select
                  onChange={(e) => setFilters({ ...filters, [item.key]: e.target.value })}
                  className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border-none rounded-xl font-medium text-gray-700 cursor-pointer focus:ring-2 focus:ring-red-500 transition-all"
                >
                  <option value="">{item.label}</option>
                  {item.options.map((opt: any) => {
                    if (item.key === "programId") {
                      return (
                        <option key={opt.programId} value={opt.programId}>
                          {opt.name}
                        </option>
                      );
                    }
                    return (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    );
                  })}
                </select>
                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />

              </div>
            ))}

            <div className="relative">
              <select
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border-none rounded-xl font-medium text-gray-700 cursor-pointer focus:ring-2 focus:ring-red-500 transition-all"
              >
                <option value="rating">Rating</option>
                <option value="exp">Experience</option>
              </select>
              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />

            </div>

          </div>
          <div className="flex flex-col gap-2 w-[300px]">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Price Range</span>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">₹{startPrice} - ₹{endPrice}</span>
            </div>

            <div
              className="w-full h-2 bg-slate-100 border border-slate-200 rounded-full relative flex items-center"
              ref={priceFilterDivRef}
            >
              <div
                className="absolute h-full bg-blue-500 rounded-full"
                style={{
                  left: `${priceRangeLeftPercent}%`,
                  right: `${100 - priceRangeRightPercent}%`
                }}
              />

              <div
                className="absolute -translate-x-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform select-none"
                style={{ left: `${priceRangeLeftPercent}%` }}
                onMouseDown={handleLeftMouseDown}
              />

              <div
                className="absolute -translate-x-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform select-none"
                style={{ left: `${priceRangeRightPercent}%` }}
                onMouseDown={handleRightMouseDown}
              />
            </div>
          </div>
        </div>


        <div className="py-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl" />)}
            </div>
          ) : trainers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl italic">No trainers match your current filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trainers.map((trainer) => (
                  <div
                    key={trainer.trainerId}
                    onClick={() => navigate(`/trainer-details/${trainer.trainerId}`)}
                    className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full"
                  >

                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <span className="text-white font-bold text-sm">Click to view full profile</span>
                      </div>
                      <img
                        src={trainer.profilePic || DEFAULT_IMAGE}
                        alt={trainer.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <FaStar className="text-yellow-500 text-xs" />
                        <span className="text-xs font-black text-gray-800">{trainer.rating || 0}</span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                          {trainer.name}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {Array.isArray(trainer.programs) && trainer.programs.length > 0 ? (
                            trainer.programs.map((program, index) => (
                              <span
                                key={index}
                                className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wider border border-red-100/50"
                              >
                                {program}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              Fitness Coach
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <FaMapMarkerAlt className="text-[10px]" />
                          </div>
                          {trainer.address || "NA"}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center italic font-bold text-[8px]">
                            Yr
                          </div>
                          {trainer.experience || "0"} + Years Experience
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center italic font-bold text-[8px]">
                            Rs
                          </div>
                          {trainer.pricePerSession}
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Verified Professional</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/trainer-booking/${trainer.trainerId}`);
                          }}
                          className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors shadow-lg shadow-gray-200"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div >
  );
};

export default TrainerListing;