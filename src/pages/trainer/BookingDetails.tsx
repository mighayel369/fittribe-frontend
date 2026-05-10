import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Calendar, Clock, IndianRupee, ArrowLeft, MessageSquare,
    CheckCircle, CalendarClock, Phone, Mail, ChevronRight
} from "lucide-react";
import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import { TrainerBookingService } from "../../services/trainer/trainer.booking";
import { type TrainerBookingDetails } from "../../types/bookingType";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { HiOutlineX } from "react-icons/hi";
import { formatTime, formatDate } from "../../utils/formatTime";

const BOOKING_ACTION = {
    booking: {
        accept: (id: string) => TrainerBookingService.acceptBooking(id),
        reject: (id: string, reason: string) => TrainerBookingService.rejectBooking(id, reason),
    },
    reschedule: {
        accept: (id: string) => TrainerBookingService.approveReschedule(id),
        reject: (id: string, reason: string) => TrainerBookingService.rejectReschedule(id, reason),
    },
};

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<TrainerBookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [rescheduleModal, setRescheduleModal] = useState(false);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleTime, setRescheduleTime] = useState("");
    const [rescheduleReason, setRescheduleReason] = useState("");

    const [pendingAction, setPendingAction] = useState<{
        type: 'accept' | 'reject';
        context: 'booking' | 'reschedule';
    } | null>(null);

    useEffect(() => {
        document.title = "FitTribe | Booking Summary";
        fetchBookingDetails();
    }, [id]);

    const fetchBookingDetails = async () => {
        if (!id) return;
        try {
            const res = await TrainerBookingService.getBookingDetails(id);
            if (res.success) setBooking(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const triggerAction = (type: 'accept' | 'reject', context: 'booking' | 'reschedule') => {
        setPendingAction({ type, context });
        setShowModal(true);
    };



    const handleConfirmAction = async (reason?: string) => {
        if (!pendingAction || !id) return;
        if (pendingAction.type === 'reject' && (!reason || reason.trim().length < 5)) {
            setToast({ message: "Provide a reason (min 5 chars).", type: "error" });
            return;
        }

        try {
            setLoading(true);
            const res = await BOOKING_ACTION[pendingAction.context][pendingAction.type](id, reason || "");
            if (res.success) {
                await fetchBookingDetails();
                setToast({ message: res.message, type: "success" });
                setShowModal(false);
                setPendingAction(null);
            }
        } catch (err: any) {
            setToast({ message: err.response?.data?.message || "Action failed", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleRescheduleSubmit = async () => {
        if (!id || !rescheduleDate || !rescheduleTime || !rescheduleReason) {
            setToast({ message: "All fields are required", type: "error" });
            return;
        }
        try {
            setLoading(true);
            const res = await TrainerBookingService.rescheduleByTrainer(id, rescheduleDate, rescheduleTime, rescheduleReason);
            if (res.success) {
                setToast({ message: "Proposal sent!", type: "success" });
                setRescheduleModal(false);
                fetchBookingDetails();
            }
        } catch (err: any) {
            setToast({ message: "Reschedule failed", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading message="Syncing session details..." />;
    if (!booking) return <div className="ml-72 pt-32 text-center font-medium text-gray-400">Booking not found.</div>;

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <TrainerTopBar />
            <TrainerSideBar />

            <main className="ml-72 pt-24 px-8 pb-12 max-w-7xl mx-auto mt-12">
                {toast && <Toast {...toast} onClose={() => setToast(null)} />}


                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group"
                        >
                            <ArrowLeft size={20} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                                Booking Overview
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Session Details</h1>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Booking Reference</span>
                        <p className="text-sm font-mono font-bold text-gray-600">#{booking.bookingId.toUpperCase()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
         
                    <div className="col-span-12 lg:col-span-8 space-y-6">

                
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative">

                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Primary Client</h2>
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div className="h-24 w-24 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-inner">
                                    {booking.clientProfilePic ? (
                                        <img src={booking.clientProfilePic} className="h-full w-full object-cover rounded-[2rem]" alt="" />
                                    ) : (
                                        <span className="text-3xl font-black text-indigo-300">{booking.clientName.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">{booking.clientName}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500">
                                        <span className="flex items-center gap-1.5"><Mail size={16} className="text-gray-300" /> {booking.clientEmail}</span>
                                        <span className="flex items-center gap-1.5"><Phone size={16} className="text-gray-300" /> {booking.clientPhone || "No Phone"}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/trainer/chats', { state: { receiverId: booking.clientId, name: booking.clientName } })}
                                    className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                >
                                    <MessageSquare size={18} /> Chat with Client
                                </button>
                            </div>
                        </div>


                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Schedule & Service</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                            <Calendar size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Event Date</p>
                                            <p className="text-lg font-black text-gray-800">{formatDate(booking.bookedDate)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Time Window</p>
                                            <p className="text-lg font-black text-gray-800">
                                                {formatTime(booking.bookedTime)} <span className="text-sm font-medium text-gray-400">({booking.sessionDuration}m)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-3xl p-6 border border-dashed border-gray-200">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Program Selection</p>
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-black text-indigo-900">{booking.bookedProgram || "Standard Coaching"}</h4>
                                        <ChevronRight className="text-indigo-300" />
                                    </div>
                                    <p className="text-xs text-indigo-600 font-bold mt-2 flex items-center gap-1">
                                        <CheckCircle size={14} /> Full Access Session
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-span-12 lg:col-span-4 space-y-6">

            
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Payment Status</h2>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-3xl font-black text-gray-900 flex items-center gap-1">
                                    <IndianRupee size={24} className="text-gray-400" /> {booking.trainerEarning}
                                </span>
                                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${booking.paymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {booking.paymentStatus}
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400">Booking Status</span>
                                <span className={`text-xs font-black uppercase ${booking.bookingStatus === 'confirmed' ? 'text-emerald-600' : 'text-amber-600'
                                    }`}>
                                    {booking.bookingStatus}
                                </span>
                            </div>
                        </div>

                        {booking.bookingStatus === 'pending' && !booking.rescheduleRequest && (
                            <div className="bg-indigo-900 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-200 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] mb-2">New Inquiry</h2>
                                    <p className="text-sm text-indigo-100 mb-8 font-medium">Please review the time slot before confirming.</p>
                                    <div className="space-y-3">
                                        <button onClick={() => triggerAction('accept', 'booking')} className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                                            <CheckCircle size={18} /> Accept Session
                                        </button>
                                        <button onClick={() => setRescheduleModal(true)} className="w-full py-4 bg-indigo-800 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 border border-indigo-700">
                                            <CalendarClock size={18} /> Reschedule
                                        </button>
                                        <button onClick={() => triggerAction('reject', 'booking')} className="w-full py-4 text-indigo-300 rounded-2xl font-bold text-sm hover:text-white transition-all">
                                            Decline Request
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 text-indigo-800 opacity-20">
                                    <CheckCircle size={150} />
                                </div>
                            </div>
                        )}

                        {booking.rescheduleRequest && (
                            <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <CalendarClock className="text-amber-600" size={24} />
                                    <h2 className="text-sm font-black text-amber-900 uppercase">Reschedule Update</h2>
                                </div>
                                <div className="p-5 bg-white rounded-3xl shadow-sm mb-6">
                                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Proposed Slot</p>
                                    <p className="font-black text-gray-800">{formatDate(booking.rescheduleRequest.newDate)}</p>
                                    <p className="text-sm font-bold text-amber-600">{formatTime(booking.rescheduleRequest.newTimeSlot)}</p>
                                </div>
                                {booking.rescheduleRequest.requestedBy === 'user' ? (
                                    <div className="flex gap-2">
                                        <button onClick={() => triggerAction("accept", "reschedule")} className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-bold text-xs uppercase">Accept</button>
                                        <button onClick={() => triggerAction("reject", "reschedule")} className="flex-1 py-3 bg-white border border-amber-200 text-amber-600 rounded-xl font-bold text-xs uppercase">Decline</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-amber-700 text-xs font-black italic">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative rounded-full h-2 w-2 bg-amber-500"></span>
                                        </span>
                                        Waiting for client's nod...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {rescheduleModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4">
                        <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Propose Change</h2>
                                    <p className="text-sm text-gray-500 font-medium">Suggest a better time for this session.</p>
                                </div>
                                <button onClick={() => setRescheduleModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><HiOutlineX size={24} /></button>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-2 block">New Date</label>
                                    <input type="date" min={new Date().toISOString().split('T')[0]} value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-2 block">New Start Time</label>
                                    <input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 mb-2 block">Reason for change</label>
                                    <textarea value={rescheduleReason} onChange={(e) => setRescheduleReason(e.target.value)} placeholder="e.g., Previous session overran..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-medium outline-none h-28 resize-none" />
                                </div>
                                <button onClick={handleRescheduleSubmit} className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">
                                    Send Proposal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <Modal
                    isVisible={showModal}
                    onCancel={() => setShowModal(false)}
                    onConfirm={handleConfirmAction}
                    title="Confirm Action"
                    message={`Are you sure you want to ${pendingAction?.type} this request?`}
                    showReasonInput={pendingAction?.type === "reject"}
                />
            </main>
        </div>
    );
};

export default BookingDetails;