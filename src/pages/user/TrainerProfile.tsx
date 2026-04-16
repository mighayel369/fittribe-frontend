

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserNavBar from "../../layout/UserNavBar";
import { FaRegCommentDots, FaMapMarkerAlt, FaGlobe, FaAward, FaBolt, FaCalendarCheck, FaBriefcase } from "react-icons/fa";
import DEFAULT_IMAGE from '../../assets/default image.png'
import { PublicTrainersService } from "../../services/public/trainers";
import { useLocation } from 'react-router-dom';
import Toast from "../../components/Toast";
import { ChatService } from "../../services/shared/chat.service";
import { FaStar, FaClock } from "react-icons/fa";
const TrainerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  let location = useLocation()
  const [reviewsData, setReviewsData] = useState<any>(null);
  useEffect(() => {
    if (location.state?.message) {
      setToast({ message: location.state.message, type: 'success' });

      window.history.replaceState({}, document.title);
    }
    document.title = trainer ? `FitTribe | ${trainer.name}` : "FitTribe | Trainer Profile";
  }, [trainer, location]);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        if (!id) return
        setLoading(true);
        const response = await PublicTrainersService.getTrainerDetails(id)
        setTrainer(response.trainer);
      } catch (err: any) {
        let errMesg = err.response?.data?.message
        setToast({ message: errMesg, type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTrainer();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!id) return;
        const response = await PublicTrainersService.getTrainerReviews(id);
        setReviewsData(response.data);
        console.log(response.data)
      } catch (err) {
        console.error("Failed to fetch reviews");
      }
    };
    fetchReviews();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#F8FAFC]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
    </div>
  );
  const handleMessageClick = async () => {
    if (!id || !trainer) return;

    try {
      const response = await ChatService.checkExistingChat(id, 'user');

      if (response.exists && response.chatId) {
        navigate(`/chat/${trainer.trainerId}/${response.chatId}`);
      } else {
        navigate(`/chat/${trainer.trainerId}`);
      }
    } catch (error) {
      console.error("Error fetching chat ID:", error);
      navigate(`/chat/${trainer.trainerId}`);
    }
  };

  if (!trainer) return <p className="text-center mt-20 text-gray-500 font-bold">Trainer not found</p>;

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
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10">


          <div className="lg:w-1/3 space-y-6">
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-white p-2 shadow-2xl shadow-gray-200">
              <img
                src={trainer.profilePic || DEFAULT_IMAGE}
                alt={trainer.name}
                className="w-full h-[450px] object-cover rounded-[2.3rem] transition-transform duration-700 group-hover:scale-105"
              />
              {/* <div className="absolute top-6 left-6">
                <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg ${trainer.status ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                  }`}>
                  {trainer.status ? "● Active Now" : "Currently Offline"}
                </span>
              </div> */}
            </div>

            <button className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-white border border-gray-200 text-gray-800 rounded-2xl font-black shadow-sm hover:bg-gray-50 hover:border-red-200 transition-all group" onClick={handleMessageClick}>
              <FaRegCommentDots className="text-red-500 text-xl group-hover:scale-110 transition-transform" />
              MESSAGE TRAINER
            </button>
          </div>

          <div className="flex-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    {trainer.name}
                  </h1>
                  <p className="flex items-center gap-2 text-gray-500 mt-3 font-medium">
                    <FaMapMarkerAlt className="text-red-500" /> {trainer.address || "Global Remote Coaching"}
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="text-center bg-gray-50 px-6 py-4 rounded-3xl border border-gray-100">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Experience</p>
                    <p className="text-xl font-black text-gray-800 flex items-center justify-center gap-2">
                      <FaBriefcase className="text-red-500 text-sm" /> {trainer.experience || "N/A"}
                    </p>
                  </div>
                  <div className="text-right bg-gray-50 px-6 py-4 rounded-3xl border border-gray-100 min-w-[140px]">
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Rate</p>
                    <p className="text-3xl font-black text-red-600">₹{trainer.pricePerSession || "0"}</p>
                    <p className="text-gray-400 text-[8px] font-bold uppercase">per session</p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-50 mb-8" />

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-wider">
                    <FaBolt className="text-red-500" /> Programs Offers
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.programs?.map((s: any) => (
                      <span key={s.name} className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold border border-red-100">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-wider">
                    <FaGlobe className="text-red-500" /> Communication
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.languages?.map((l: string) => (
                      <span key={l} className="bg-gray-50 text-gray-600 px-4 py-1.5 rounded-full text-xs font-bold border border-gray-100">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-wider mb-4">
                  <FaAward className="text-red-500" /> About the Coach
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg italic font-medium">
                  "{trainer.bio || "No bio available"}"
                </p>
              </div>

              <div className="mt-12 p-6 bg-red-50 rounded-[2rem] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-red-900 font-black text-xl">Ready to start?</h4>
                  <p className="text-red-700/70 text-sm">Secure your slot for the upcoming week.</p>
                </div>
                <button
                  onClick={() => navigate(`/trainer-booking/${trainer.trainerId}`)}
                  className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-red-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-200 hover:bg-red-700 transition-all"
                >
                  <FaCalendarCheck /> BOOK A SESSION
                </button>
              </div>
            </div>
          </div>

        </div>
        <div className="mt-16 border-t border-gray-100 pt-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">
                Client Reviews
              </h2>
              <p className="text-gray-500 font-medium">What the tribe says about {trainer.name}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-black text-gray-900">
                <FaStar className="text-yellow-400" />
                {reviewsData?.rating?.toFixed(1) || "0.0"}
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {reviewsData?.totalReviewCount || 0} REVIEWS
              </p>
            </div>
          </div>

    <div className="relative">
  <div className="grid md:grid-cols-2 gap-6 overflow-y-auto max-h-[400px] pb-24 pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
      reviewsData.reviews.map((review: any, index: number) => (
        <div 
          key={index} 
          className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div className="absolute top-0 right-0 bg-indigo-50 text-indigo-600 px-4 py-1 text-[9px] font-black uppercase rounded-bl-2xl border-l border-b border-indigo-100">
            {review.program}
          </div>

          <div className="flex items-center gap-4 mb-5">
            <img
              src={review.profilePic || DEFAULT_IMAGE}
              alt={review.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div>
              <h4 className="font-black text-slate-900 uppercase text-xs leading-tight">
                {review.name}
              </h4>
              <div className="flex text-amber-400 text-[10px] mt-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < review.rating ? "fill-current" : "text-slate-200"} />
                ))}
              </div>
            </div>
          </div>

          <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4 line-clamp-3 italic">
            "{review.comment}"
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
              <FaClock size={10} /> {review.time}
            </span>
          </div>
        </div>
      ))
    ) : (
      <div className="col-span-2 text-center py-16 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No coach feedback found</p>
      </div>
    )}
  </div>

  {reviewsData?.reviews && reviewsData.reviews.length > 0 && (
    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent pointer-events-none rounded-b-[3rem]"></div>
  )}
</div>
        </div>
      </main>
    </div>
  );
};

export default TrainerProfile;
