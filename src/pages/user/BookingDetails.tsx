import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavBar from "../../layout/UserNavBar";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { type UserBookingDetails } from "../../types/bookingType";
import {
  Calendar, Clock, User, IndianRupee,
  ArrowLeft, RefreshCw, Timer,
  ShieldCheck, Info, MapPin, Receipt,
  ChevronRight, AlertCircle, XCircle,
  MessageSquare
} from "lucide-react";
import { UserBookingService } from "../../services/user/user.booking";
import { PublicTrainersService } from "../../services/public/trainers";
import DEFAULT_IMAGE from '../../assets/default image.png'
import { formatTime, formatDate } from "../../utils/formatTime";

const BookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [booking, setBooking] = useState<UserBookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState(0);
  const [slots, setSlots] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false)
  const [reason, setReason] = useState("");
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
    if (bookingId) fetchBookingDetails(bookingId);
  }, [bookingId]);

  const fetchBookingDetails = async (id: string) => {
    try {
      setLoading(true);
      const res = await UserBookingService.getBookingDetails(id);
      setBooking(res.data);
      document.title = `Session | ${res.data.bookedProgram}`;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!newDate || !booking?.trainerId) return;
    const fetchSlots = async () => {
      try {
        const res = await PublicTrainersService.getTrainerAvailability(new Date(newDate), booking.trainerId);
        setSlots(res.data.slots || []);
      } catch (error) { console.log(error) }
    };
    fetchSlots();
  }, [newDate]);

  const openConfirmation = (type: 'cancel' | 'accept' | 'decline') => {
    const configs = {
      cancel: { title: "Cancel Session", confirmText: "Yes, Cancel Booking", theme: 'red' as const },
      accept: { title: "Accept New Schedule", confirmText: "Accept Proposal", theme: 'emerald' as const },
      decline: { title: "Decline Proposal", confirmText: "Decline & Keep Original", theme: 'red' as const }
    };
    setModalConfig({ type, ...configs[type] });
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    if (!modalConfig.type) return;
    setShowModal(false);
    if (modalConfig.type === 'cancel') await handleCancelBooking();
    else if (modalConfig.type === 'accept') await handleAcceptTrainerProposal();
    else if (modalConfig.type === 'decline') await handleDeclineTrainerProposal();
  };

  const handleRescheduleSubmit = async () => {
    if (!newDate || !newTime || reason.trim().length < 3) {
      setToast({ message: "Please select a date, time and provide a valid reason", type: "error" });
      return;
    }
    try {
      const res = await UserBookingService.requestReschedule({
        bookingId: bookingId!,
        newDate,
        newTimeSlot: newTime,
        reason
      });
      if (res.success) {
        setToast({ message: "Reschedule request sent to trainer", type: "success" });
        fetchBookingDetails(bookingId!);
      }
    } catch (error: any) {
      setToast({ message: error.response?.data?.message || "Failed to request reschedule", type: "error" });
    } finally {
      setShowRescheduleModal(false);
      resetRescheduleState();
    }
  };

  const resetRescheduleState = () => {
    setNewTime(0);
    setSlots([]);
    setReason("");
    setNewDate("");
  }

  const handleCancelBooking = async () => {
    try {
      if (!booking) return
      setLoading(true);
      const res = await UserBookingService.cancelSession(booking.bookingId);
      if (res.success) {
        setBooking((prev: any) => ({ ...prev, bookingStatus: "cancelled" }));
        setToast({ message: "Booking cancelled. Refund processed to wallet.", type: "success" });
      }
    } catch (error: any) {
      const message = error.response?.data?.message
      setToast({ message: message || "Failed to cancel booking", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTrainerProposal = async () => {
    if (!booking) return
    try {
      setLoading(true);
      const res = await UserBookingService.acceptReschedule(booking.bookingId);
      if (res.success) {
        setToast({ message: "Reschedule accepted!", type: "success" });
        fetchBookingDetails(booking.bookingId);
      }
    } catch (error) { setToast({ message: "Failed to accept", type: "error" }); }
    finally { setLoading(false); }
  };

  const handleDeclineTrainerProposal = async () => {
    if (!booking) return
    try {
      setLoading(true);
      const res = await UserBookingService.declineReschedule(booking.bookingId);
      if (res.success) {
        setToast({ message: "Proposal declined", type: "success" });
        fetchBookingDetails(booking.bookingId);
      }
    } catch (error) { setToast({ message: "Failed to decline", type: "error" }); }
    finally { setLoading(false); }
  };

  if (loading) return <Loading message="Syncing your session details..." />;
  if (!booking) return <div className="text-center py-20 font-medium text-gray-500">Booking details not found.</div>;

  const isConfirmed = booking.bookingStatus === 'confirmed';
  const isCancelled = booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'rejected';

  return (
    <div className="min-h-screen bg-[#FBFDFF]">
      <UserNavBar />

      <main className="pt-32 pb-20 max-w-6xl mx-auto px-6">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-indigo-600 mb-8 transition-all font-bold text-sm group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          BACK TO DASHBOARD
        </button>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${isConfirmed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  isCancelled ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                  {booking.bookingStatus}
                </div>
              </div>

              <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                <ShieldCheck size={14} />
                SECURE BOOKING ID: {booking.bookingId.slice(-12)}
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-6">
                {booking.bookedProgram}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50/80 p-4 rounded-3xl border border-gray-100/50">
                  <p className="text-gray-400 text-[9px] font-bold uppercase mb-2">Schedule</p>
                  <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                    <Calendar size={16} className="text-indigo-500" />
                    {formatDate(booking.bookedDate)}
                  </div>
                </div>
                <div className="bg-gray-50/80 p-4 rounded-3xl border border-gray-100/50">
                  <p className="text-gray-400 text-[9px] font-bold uppercase mb-2">Time Slot</p>
                  <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                    <Clock size={16} className="text-indigo-500" />
                    {formatTime(Number(booking.bookedTime))}
                  </div>
                </div>
                <div className="bg-gray-50/80 p-4 rounded-3xl border border-gray-100/50 col-span-2 md:col-span-1">
                  <p className="text-gray-400 text-[9px] font-bold uppercase mb-2">Duration</p>
                  <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                    <Timer size={16} className="text-indigo-500" />
                    {booking.sessionDuration || 60} Mins
                  </div>
                </div>
              </div>
            </div>

            {booking.rescheduleRequest && (
              <div className={`p-8 rounded-[2.5rem] border-2 shadow-xl ${booking.rescheduleRequest.requestedBy === 'trainer' ? "bg-amber-50 border-amber-100" : "bg-indigo-50 border-indigo-100"
                }`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-start gap-5">
                    <div className={`p-5 rounded-3xl shadow-lg ${booking.rescheduleRequest.requestedBy === 'trainer' ? "bg-amber-500" : "bg-indigo-600"}`}>
                      <RefreshCw size={28} className="text-white animate-spin-slow" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">
                        {booking.rescheduleRequest.requestedBy === 'trainer' ? "New Proposal Received" : "Reschedule Pending"}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1 font-medium">
                        {booking.rescheduleRequest.requestedBy === 'trainer'
                          ? `${booking.trainerName} suggested a time change:`
                          : `Awaiting response for your request:`}
                      </p>
                      <div className="flex items-center gap-3 mt-4">
                        <div className="px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 text-xs font-black text-gray-800">
                          <Calendar size={14} className="text-indigo-500" />
                          {formatDate(booking.rescheduleRequest.newDate)}
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                        <div className="px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 text-xs font-black text-gray-800">
                          <Clock size={14} className="text-indigo-500" />
                          {isNaN(Number(booking.rescheduleRequest.newTimeSlot))
                            ? booking.rescheduleRequest.newTimeSlot
                            : formatTime(Number(booking.rescheduleRequest.newTimeSlot))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.rescheduleRequest.requestedBy === 'trainer' && (
                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={() => openConfirmation('accept')} className="flex-1 md:flex-none px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/50 uppercase tracking-widest">
                        Accept
                      </button>
                      <button onClick={() => openConfirmation('decline')} className="flex-1 md:flex-none px-6 py-4 bg-white text-rose-600 border-2 border-rose-100 rounded-2xl font-black text-xs hover:bg-rose-50 transition-all uppercase tracking-widest">
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}


            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-gray-400 text-[10px] font-black uppercase mb-6 tracking-[0.3em]">Session Instructor</h3>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative">
                  <img
                    src={booking.trainerProfilePic || DEFAULT_IMAGE}
                    alt={booking.trainerName}
                    className="w-32 h-32 rounded-[2rem] object-cover shadow-xl border-4 border-white ring-1 ring-gray-100"
                  />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h4 className="text-2xl font-black text-gray-900">{booking.trainerName}</h4>
                  <p className="text-indigo-600 font-bold text-sm mb-4">{booking.trainerExperience}+ Years Expert Trainer</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    <span className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 flex items-center gap-2 uppercase tracking-tighter">
                      <User size={14} className="text-gray-400" /> {booking.trainerGender}
                    </span>
                    <span className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 flex items-center gap-2 uppercase tracking-tighter">
                      <MapPin size={14} className="text-gray-400" /> Virtual Session
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => console.log("chat")}
                  className="px-6 py-4 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <MessageSquare size={18} /> Chat with Trainer
                </button>
              </div>
            </div>


            {booking.rejectReason && (
              <div className="bg-rose-50 rounded-[2rem] p-8 border border-rose-100">
                <div className="flex items-center gap-3 text-rose-600 font-black text-[10px] uppercase tracking-widest mb-3">
                  <AlertCircle size={16} /> Cancellation Note
                </div>
                <p className="text-rose-800 font-medium leading-relaxed italic">"{booking.rejectReason}"</p>
              </div>
            )}
          </div>


          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <h3 className="text-gray-500 text-[10px] font-black uppercase mb-8 tracking-[0.3em] flex items-center gap-2">
                <Receipt size={14} /> Payment Summary
              </h3>

              <div className="space-y-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold">Session Fee</span>
                  <span className="font-mono font-black">₹{booking.totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold">Platform fee</span>
                  <span className="font-mono text-emerald-400 font-black">INCLUDED</span>
                </div>
                <div className="border-t border-gray-800 my-6 pt-6 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Paid</p>
                    <span className="text-4xl font-black font-mono tracking-tighter">₹{booking.totalAmount}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8px] font-black px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 uppercase tracking-tighter`}>
                      {booking.payment?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400">
                  <IndianRupee size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Paid via</p>
                  <p className="text-xs font-bold text-gray-200">{booking.payment?.method || 'Secure Payment'}</p>
                </div>
              </div>
            </div>


            <div className="space-y-3">
              {isConfirmed && !booking.rescheduleRequest && (
                <button
                  onClick={() => setShowRescheduleModal(true)}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-indigo-600 text-indigo-600 py-5 rounded-[1.5rem] font-black hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-lg shadow-indigo-100 group uppercase text-xs tracking-widest"
                >
                  <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                  Reschedule Session
                </button>
              )}

              {(booking.bookingStatus === "confirmed" || booking.bookingStatus === "pending") && (
                <button
                  onClick={() => openConfirmation('cancel')}
                  className="w-full flex items-center justify-center gap-3 bg-rose-50 text-rose-600 py-5 rounded-[1.5rem] font-black hover:bg-rose-600 hover:text-white transition-all duration-300 group uppercase text-xs tracking-widest border-2 border-rose-100 border-dashed"
                >
                  <XCircle size={18} className="group-hover:scale-110 transition-transform" />
                  Cancel Booking
                </button>
              )}

              <div className="p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100">
                <div className="flex items-start gap-3">
                  <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed tracking-tighter">
                    Policy: Cancellations within 24 hours of the session start time may not be eligible for a full refund.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <Modal
        isVisible={showModal}
        title={modalConfig.title}
        confirmText={modalConfig.confirmText}
        onConfirm={handleModalConfirm}
        onCancel={() => setShowModal(false)}
      />

      {/* Reschedule Custom Modal Content */}
      <Modal
        isVisible={showRescheduleModal}
        title="Reschedule Session"
        confirmText="Send Request"
        onConfirm={handleRescheduleSubmit}
        onCancel={() => {
          setShowRescheduleModal(false);
          resetRescheduleState();
        }}
      >
        <div className="space-y-6 py-2">
          <div className="p-4 bg-indigo-50 text-indigo-700 rounded-2xl text-xs font-bold leading-relaxed border border-indigo-100">
            Select a new slot. Note that rescheduling requires approval from <b>{booking.trainerName}</b>.
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Choose Date</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Available Slots</label>
              {!newDate ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-[2rem] text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Select a date first
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-10 bg-rose-50 rounded-[2rem] text-[10px] font-black text-rose-500 uppercase tracking-widest border border-rose-100">
                  No availability on this date
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1">
                  {slots.map((slot: number) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewTime(slot)}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${newTime === slot
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                        : "bg-white text-gray-600 border-gray-100 hover:border-indigo-200"
                        }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Reason for Change</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Work emergency, Personal commitment..."
                className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] resize-none"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingDetails;