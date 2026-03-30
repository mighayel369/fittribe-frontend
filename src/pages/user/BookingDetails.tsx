
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavBar from "../../layout/UserNavBar";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { type UserBookingDetails } from "../../types/bookingType";
import {
  Calendar, Clock, User, IndianRupee,
  ArrowLeft, RefreshCw, Timer, Activity,
  ShieldCheck, Info, MapPin
} from "lucide-react";
import { UserBookingService } from "../../services/user/user.booking";
import { PublicTrainersService } from "../../services/public/trainers";
import DEFAULT_IMAGE from '../../assets/default image.png'
const BookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [booking, setBooking] = useState<UserBookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false)
  const [modalConfig, setModalConfig] = useState<{
    type: 'cancel' | 'accept' | 'decline' | null;
    title: string;
    confirmText: string;
    theme: 'red' | 'indigo' | 'emerald';
  }>({
    type: null,
    title: "",
    confirmText: "",
    theme: 'indigo'
  })
  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails(bookingId);
    }
  }, [bookingId]);

  const fetchBookingDetails = async (id: string) => {
    try {
      setLoading(true);
      const res = await UserBookingService.getBookingDetails(id);
      setBooking(res.data);
      document.title = `FitTribe | Session Details`;
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!newDate || !booking?.trainerId) return;
    console.log(booking?.trainerId)
    const fetchSlots = async () => {
      try {
        const res = await PublicTrainersService.getTrainerAvailability(
          new Date(newDate),
          booking.trainerId
        );
        console.log(res)
        setSlots(res.data || []);
      } catch (error: any) {
        console.log(error)
      }
    };
    fetchSlots();
  }, [newDate]);

  const openConfirmation = (type: 'cancel' | 'accept' | 'decline') => {
    const configs = {
      cancel: {
        title: "Cancel Session",
        confirmText: "Yes, Cancel Booking",
        theme: 'red' as const
      },
      accept: {
        title: "Accept New Schedule",
        confirmText: "Accept Proposal",
        theme: 'emerald' as const
      },
      decline: {
        title: "Decline Proposal",
        confirmText: "Decline and Keep Original",
        theme: 'red' as const
      }
    };

    setModalConfig({ type, ...configs[type] });
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
  if (!modalConfig.type) return;

  setShowModal(false); 
  
  if (modalConfig.type === 'cancel') {
    await handleCancelBooking();
  } else if (modalConfig.type === 'accept') {
    await handleAcceptTrainerProposal();
  } else if (modalConfig.type === 'decline') {
    await handleDeclineTrainerProposal();
  }
};
  const handleRescheduleSubmit = async () => {
    if (!newDate || !newTime) {
      setToast({ message: "Please select both date and time", type: "error" });
      return;
    }

    try {
      const res = await UserBookingService.requestReschedule({
        bookingId,
        newDate,
        newTimeSlot: newTime
      });
      console.log(res)
      if (res.success) {
        setBooking((prev: any) => ({
          ...prev,
          bookingStatus: 'reschedule_requested'
        }));

        setToast({
          message: res.message || "Reschedule request sent! Waiting for trainer approval.",
          type: "success"
        });
      }
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "Failed to request reschedule",
        type: "error"
      });
    } finally {
      setShowRescheduleModal(false);
      setNewTime("");
      setSlots([]);
    }
  };

  const handleCancelBooking = async () => {

    try {
      if (!booking) return
      setLoading(true);
      const res = await UserBookingService.cancelSession(booking.bookingId);

      if (res.success) {
        setBooking((prev: any) => ({ ...prev, bookingStatus: "cancelled" }));
        setToast({
          message: res.message || "Booking cancelled successfully. Refund processed to wallet.",
          type: "success"
        });
      }
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "Failed to cancel booking",
        type: "error"
      });
    } finally {
      setLoading(false);
      setShowModal(false)
    }
  };

  const handleAcceptTrainerProposal = async () => {
    if (!booking) return
    try {
      setLoading(true);
      const res = await UserBookingService.acceptReschedule(booking.bookingId);
      if (res.success) {
        setToast({ message: "Reschedule accepted! Session updated.", type: "success" });
        fetchBookingDetails(booking.bookingId);
      }
    } catch (error: any) {
      setToast({ message: "Failed to accept reschedule", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineTrainerProposal = async () => {
    if (!booking) return
    try {
      setLoading(true);
      const res = await UserBookingService.declineReschedule(booking.bookingId);
      if (res.success) {
        setToast({ message: "Proposal declined. Original time kept.", type: "success" });
        fetchBookingDetails(booking.bookingId);
      }
    } catch (error: any) {
      setToast({ message: "Failed to decline", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading booking details..." />;
  if (!booking) return <div className="text-center py-20">Booking not found.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <UserNavBar />

      <main className="pt-32 pb-20 max-w-5xl mx-auto px-6">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to My Bookings
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-100 text-xs font-bold uppercase tracking-[0.2em]">
                <ShieldCheck size={14} />
                Verified Booking #{booking.bookingId.slice(-8)}
              </div>
              <h1 className="text-3xl font-extrabold mt-2 flex items-center gap-3">
                {booking.bookedProgram}
                <Activity size={24} className="text-blue-300" />
              </h1>
            </div>
            <div className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 ${booking.bookingStatus === 'confirmed'
              ? 'bg-green-500/20 text-green-100 border-green-400/30'
              : 'bg-orange-500/20 text-orange-100 border-orange-400/30'
              }`}>
              {booking.bookingStatus}
            </div>
          </div>

          <div className="p-8 grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {booking.rescheduleRequest && (
                <div className={`mb-8 p-6 rounded-[2rem] border-2 animate-in slide-in-from-top-4 duration-500 ${booking.rescheduleRequest.requestedBy === 'trainer'
                    ? "bg-amber-50 border-amber-200 shadow-lg shadow-amber-100/50"
                    : "bg-indigo-50 border-indigo-100"
                  }`}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-2xl ${booking.rescheduleRequest.requestedBy === 'trainer' ? "bg-amber-500 text-white" : "bg-indigo-500 text-white"}`}>
                        <RefreshCw size={24} className="animate-spin-slow" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-gray-900">
                          {booking.rescheduleRequest.requestedBy === 'trainer' ? "Trainer Proposed a New Time" : "Reschedule Request Sent"}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.rescheduleRequest.requestedBy === 'trainer'
                            ? `${booking.trainerName} is busy at the original time and proposed:`
                            : `You have requested to move this session to:`}
                        </p>

                        <div className="flex items-center gap-4 mt-4 bg-white/60 p-3 rounded-xl border border-white w-fit">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                            <Calendar size={16} className="text-indigo-500" />
                            {new Date(booking.rescheduleRequest.newDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </div>
                          <div className="w-px h-4 bg-gray-300" />
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                            <Clock size={16} className="text-indigo-500" />
                            {booking.rescheduleRequest.newTimeSlot}
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.rescheduleRequest.requestedBy === 'trainer' ? (
                      <div className="flex gap-3 w-full md:w-auto">
                        <button
                         onClick={() => openConfirmation('accept')}
                          className="p-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                        >
                          Accept New Time
                        </button>
                        <button
                          onClick={() => openConfirmation('decline')}
                          className="p-3 bg-white text-rose-600 border border-rose-200 rounded-xl font-bold text-sm hover:bg-rose-50 transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm border border-indigo-200">
                        Waiting for Trainer Approval...
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Date</p>
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <Calendar size={16} className="text-indigo-500" />
                    {new Date(booking.bookedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Time Slot</p>
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <Clock size={16} className="text-indigo-500" />
                    {booking.bookedTime}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 col-span-2 md:col-span-1">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Duration</p>
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <Timer size={16} className="text-indigo-500" />
                    {booking.sessionDuration || 60} Minutes
                  </div>
                </div>
              </div>

              <section className="bg-indigo-50/30 p-6 rounded-2xl border border-indigo-100/50">
                <h3 className="text-indigo-900/40 text-[10px] font-black uppercase mb-4 tracking-[0.2em]">Trainer Details</h3>
                <div className="flex items-center gap-6">
                  <img
                    src={booking.trainerProfilePic || DEFAULT_IMAGE}
                    alt={booking.trainerName}
                    className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-white"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {booking.trainerName}
                      <ShieldCheck size={18} className="text-blue-500" />
                    </h4>
                    <p className="text-indigo-600 font-semibold text-sm">{booking.trainerExperience}+ Years Professional Experience</p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1"><User size={12} /> {booking.trainerGender || 'Professional'}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> Global Session</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-gray-400 text-[10px] font-black uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
                  <Info size={14} /> Program Overview
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  This {booking.bookedProgram} session is designed to meet your specific fitness goals.
                  Please ensure you join the session link 5 minutes before the scheduled time.
                  Have your basic equipment and water bottle ready for the duration of {booking.sessionDuration || 60} minutes.
                </p>
              </section>
              {booking.bookingStatus === 'rejected' && (
                <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
                  <h3 className="text-red-900/40 text-[10px] font-black uppercase mb-2 tracking-[0.2em]">Cancellation Reason</h3>
                  <p className="text-red-700 font-medium italic">"{booking.rejectReason || 'No reason provided by trainer.'}"</p>
                </section>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-gray-500 text-[10px] font-black uppercase mb-6 tracking-[0.2em]">Billing Details</h3>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Base Amount</span>
                    <span className="font-mono">₹{booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Platform Fee</span>
                    <span className="font-mono text-green-400">Included</span>
                  </div>

                  <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                    <span className="font-bold">Total Paid</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-indigo-400 font-mono">₹{booking.totalAmount}</span>
                      <p className="text-[10px] text-gray-500 italic mt-1">Status: {booking.payment?.status}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800 flex items-center gap-3 text-xs text-gray-400">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-indigo-400">
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-200">Payment via {booking.payment?.method}</p>
                    <p>Secured Transaction</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {(booking.bookingStatus === "confirmed") && (<>
                  <button
                    onClick={() => setShowRescheduleModal(true)}
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-indigo-600 text-indigo-600 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                    Reschedule Session
                  </button>

                  <p className="text-[10px] text-center text-gray-400 uppercase tracking-tighter">
                    Policy: Rescheduling is subject to trainer approval
                  </p></>)}
                <div className="space-y-3 mt-4">
                  {(booking.bookingStatus === "confirmed" || booking.bookingStatus === "pending") && (
                    <button
                      onClick={() => openConfirmation('cancel')}
                      className="w-full flex items-center justify-center gap-3 bg-red-50 border-2 border-red-200 text-red-600 py-4 rounded-2xl font-black hover:bg-red-100 hover:border-red-300 transition-all group"
                    >
                      <Activity size={20} className="group-hover:scale-110 transition-transform" />
                      Cancel Session
                    </button>
                  )}
                  <p className="text-[10px] text-center text-gray-400 uppercase tracking-tighter">
                    Note: Full refund is only applicable 24h prior to session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
<Modal 
  isVisible={showModal}
  title={modalConfig.title}
  message={modalConfig.confirmText}
  onConfirm={handleModalConfirm}
  onCancel={() => setShowModal(false)}
>
</Modal>

      <Modal
        isVisible={showRescheduleModal}
        title="Reschedule Your Session"
        confirmText="Confirm New Slot"
        onConfirm={handleRescheduleSubmit}
        onCancel={() => {
          setShowRescheduleModal(false);
          setSlots([])
          setNewTime('')
          setNewDate('')
        }}
      >
        <div className="space-y-6 py-2">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-xs flex gap-3">
            <Info size={18} className="shrink-0" />
            <p>
              Select a new time. Request will be sent to <b>{booking.trainerName}</b> for approval.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                Select New Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm"
                  onChange={(e) => {
                    setNewDate(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">
                Available Slots
              </label>

              {!newDate ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-xs text-gray-400">Please select a date first</p>
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-8 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-xs text-red-500 font-semibold">No slots available for this date</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                  {slots
                    .filter((slotString: string) => {
                      const isSameDate = new Date(booking.bookedDate).toISOString().split('T')[0] === newDate;
                      return !(isSameDate && slotString === booking.bookedTime);
                    })
                    .map((slotString: string, index: number) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setNewTime(slotString)}
                        className={`py-3 px-4 text-[11px] font-bold rounded-xl border transition-all ${newTime === slotString
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-[1.02]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                          }`}
                      >
                        {slotString}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingDetails;