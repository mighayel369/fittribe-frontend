import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaCalendarAlt,
  FaCreditCard, FaCheckCircle,  FaVideo, FaStar
} from "react-icons/fa";
import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import Loading from "../../components/Loading";
import NotFound from "../../components/NotFound";
import { AdminBookingService } from "../../services/admin/admin.booking.service";
import DEFAULT_IMAGE from '../../assets/default image.png';

const BookingDetails = () => {
  const { id } = useParams();
  console.log(id)
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await AdminBookingService.getBookingDetails(id);
          setBooking(response.data);
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Loading message="Syncing with FitTribe Cloud..." />;
  if (!booking) return <NotFound />;

  const statusColors: any = {
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    confirmed: "bg-indigo-50 text-indigo-600 border-indigo-100",
    cancelled: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <AdminTopBar />
      <AdminSideBar />

      <main className="ml-64 mt-16 p-8">
        <div className="max-w-6xl mx-auto flex justify-between items-end mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest mb-4 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Command Center
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Session <span className="text-indigo-600 font-mono">#{booking.bookingId.slice(-7)}</span>
            </h1>
          </div>

          <div className={`px-6 py-2 rounded-2xl border font-black uppercase text-[10px] tracking-widest shadow-sm ${statusColors[booking.bookingStatus.toLowerCase()] || statusColors.pending}`}>
            {booking.bookingStatus}
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 overflow-hidden relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
                  <FaCalendarAlt size={18} />
                </div>
                <h3 className="text-xl font-black text-slate-800">Appointment Intel</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scheduled Date</p>
                  <p className="text-lg font-bold text-slate-900">{booking.scheduledDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Slot (IST)</p>
                  <p className="text-lg font-bold text-slate-900">{booking.scheduledTime}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Type</p>
                  <div className="flex items-center gap-2 text-indigo-600 font-bold">
                    <FaVideo size={14} /> {booking.sssionType}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-lg font-bold text-slate-900">{booking.duration} Minutes</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group" onClick={()=>navigate(`/admin/users/${booking.client.clientId}`)}>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={booking.client.profilePic || DEFAULT_IMAGE}
                    className="w-24 h-24 rounded-3xl object-cover mb-4 border-4 border-slate-50 shadow-xl"
                    alt="client"
                  />
                  <h4 className="text-xl font-black text-slate-900">{booking.client.name}</h4>
                  <p className="text-slate-500 font-medium text-sm mb-6">{booking.client.email}</p>

                  <div className="w-full pt-6 border-t border-slate-50 flex justify-between px-2">
                    <div className="text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">History</p>
                      <p className="font-black text-slate-800 text-sm">{booking.client.totalSessions} Sessions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Joined</p>
                      <p className="font-black text-slate-800 text-sm">{booking.client.joinedOn}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group"  onClick={() => navigate(`/admin/trainers/${booking.trainer.trainerId}`)}>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={booking.trainer.profilePic || DEFAULT_IMAGE}
                    className="w-24 h-24 rounded-3xl object-cover mb-4 border-4 border-indigo-50 shadow-xl"
                    alt="trainer"
                  />
                  <h4 className="text-xl font-black text-slate-900">{booking.trainer.name}</h4>
                  <p className="text-slate-500 font-medium text-sm mb-6">{booking.trainer.serviceProvided}</p>

                  <div className="w-full pt-6 border-t border-slate-50 flex justify-between px-2">
                    <div className="text-left">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Reputation</p>
                      <p className="font-black text-indigo-600 text-sm flex items-center gap-1">
                        <FaStar size={10} /> {booking.trainer.rating}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Experience</p>
                      <p className="font-black text-slate-800 text-sm">{booking.trainer.experience}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16"></div>

              <div className="flex items-center gap-3 mb-10">
                <div className="p-2 bg-white/10 rounded-xl">
                  <FaCreditCard className="text-indigo-400" size={18} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest">Revenue Breakdown</h3>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium text-sm">Base Rate</span>
                  <span className="font-mono text-base font-bold">₹{booking.payment.baseRate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium text-sm">Platform Fee</span>
                  <span className="font-mono text-base font-bold">₹{booking.payment.platformFee.toLocaleString()}</span>
                </div>
                <div className="pt-6 mt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-indigo-400 font-black text-lg">GROSS</span>
                  <span className="text-3xl font-black tracking-tight">₹{booking.payment.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-10 bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                  <FaCheckCircle className="text-emerald-400" size={14} />
                </div>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                  Verified via {booking.payment.paymentType}
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default BookingDetails;