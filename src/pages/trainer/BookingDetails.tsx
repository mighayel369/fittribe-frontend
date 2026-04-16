import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, Clock, IndianRupee, ArrowLeft, MessageSquare, CheckCircle, XCircle, CalendarClock } from "lucide-react";
import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import { TrainerBookingService } from "../../services/trainer/trainer.booking";
import { type TrainerBookingDetails } from "../../types/bookingType";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { HiOutlineX } from "react-icons/hi";
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
    const [rescheduleModal, setRescheduleModal] = useState(false)
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleTime, setRescheduleTime] = useState("");
    useEffect(() => {
        document.title = "FitTribe | Booking Summary";
        fetchBookingDetails();
    }, [id]);
    const [pendingAction, setPendingAction] = useState<{
        type: 'accept' | 'reject';
        context: 'booking' | 'reschedule';
    } | null>(null);

    const triggerAction = (type: 'accept' | 'reject', context: 'booking' | 'reschedule') => {
        setPendingAction({ type, context });
        setShowModal(true);
    };


    const handleChatClick = (chatId: string | null, receiverId: string, name: string, pic: string) => {
        navigate('/trainer/chats', {
            state: {
                activeChatId: chatId,
                receiverId: receiverId,
                name: name,
                profilePic: pic
            }
        });
    };
    const handleConfirmAction = async (reason?: string) => {
        if (!pendingAction || !id) return;

        if (pendingAction.type === 'reject' && (!reason || reason.trim().length < 5)) {
            setShowModal(false);
            setToast({
                message: "Please provide a valid reason (at least 5 characters) for rejection.",
                type: "error"
            });
            return;
        }

        try {
            setLoading(true);
            const serviceFn = BOOKING_ACTION[pendingAction.context][pendingAction.type];

            const res = await serviceFn(id, reason || "");

            if (res.success) {
                await fetchBookingDetails();
                setToast({ message: res.message, type: "success" });
                setShowModal(false);
                setPendingAction(null);
            }
        } catch (err: any) {
            console.error(err);
            setToast({
                message: err.response?.data?.message || "An error occurred while processing the request.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRescheduleSubmit = async () => {
        if (!id || !rescheduleDate || !rescheduleTime) {
            setToast({ message: "Please select both date and time", type: "error" });
            return;
        }

        try {
            setLoading(true);
            const res = await TrainerBookingService.rescheduleByTrainer(id, rescheduleDate, rescheduleTime);

            if (res.success) {
                setToast({ message: "Reschedule request sent to client", type: "success" });
                setRescheduleModal(false);
                fetchBookingDetails();
            }
        } catch (err: any) {
            setToast({
                message: err.response?.data?.message || "Reschedule failed",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) return <Loading message="Loading booking details..." />;
    if (!booking) return <div className="ml-72 pt-24 text-center">Booking not found.</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <TrainerTopBar />
            <TrainerSideBar />

            <main className="ml-72 pt-24 px-10 pb-12">
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-xl transition-all shadow-sm">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Session Details</h1>
                        <p className="text-sm text-gray-500">ID: #{booking.bookingId.toUpperCase()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Client Profile</h2>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                                    {booking.clientProfilePic ? <img src={booking.clientProfilePic} className="rounded-2xl" /> : booking.clientName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{booking.clientName}</h3>
                                    <p className="text-gray-500 text-sm">{booking.clientEmail}</p>
                                    <p className="text-gray-500 text-sm">{booking.clientPhone || "No phone provided"}</p>
                                </div>
                                <button
                                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all"
                                    onClick={() => handleChatClick(
                                        booking.chatId,
                                        booking.clientId,
                                        booking.clientName,
                                        booking.clientProfilePic || ''
                                    )}
                                >
                                    <MessageSquare size={16} /> Chat
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Service Information</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <Calendar className="text-indigo-500 mt-1" size={20} />
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase">Scheduled Date</p>
                                        <p className="font-bold text-gray-800">{new Date(booking.bookedDate).toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="text-indigo-500 mt-1" size={20} />
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase">Time Slot</p>
                                        <p className="font-bold text-gray-800">{booking.bookedTime} ({booking.sessionDuration} mins)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Booking Status</h2>
                            <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 ${booking.bookingStatus === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {booking.bookingStatus}
                            </div>
                            {booking.bookingStatus === 'rejected' && booking.rejectReason && (
                                <div className="mt-2 p-3 bg-red-50 rounded-2xl border border-red-100">
                                    <p className="text-[10px] font-bold text-red-400 uppercase mb-1">Reason for Rejection</p>
                                    <p className="text-sm text-red-700 italic">"{booking.rejectReason}"</p>
                                </div>
                            )}

                            <hr className="my-4 border-gray-50" />

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Your Earnings</span>
                                <span className="text-2xl font-black text-gray-900 flex items-center">
                                    <IndianRupee size={20} /> {booking.trainerEarning}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2">Payment Status: <span className="uppercase font-bold">{booking.paymentStatus}</span></p>
                        </div>

                        {booking.rescheduleRequest && (
                            <div className={`p-6 rounded-3xl shadow-lg mb-6 ${booking.rescheduleRequest.requestedBy === 'trainer'
                                ? 'bg-white border-2 border-indigo-100'
                                : 'bg-indigo-600 text-white shadow-indigo-100'
                                }`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <CalendarClock size={20} className={booking.rescheduleRequest.requestedBy === 'trainer' ? 'text-indigo-600' : 'text-white'} />
                                    <h2 className="text-xs font-black uppercase tracking-widest">
                                        {booking.rescheduleRequest.requestedBy === 'trainer' ? 'Waiting for Client' : 'Reschedule Requested'}
                                    </h2>
                                </div>

                                <p className={`text-sm mb-4 ${booking.rescheduleRequest.requestedBy === 'trainer' ? 'text-gray-600' : 'text-indigo-50'}`}>
                                    {booking.rescheduleRequest.requestedBy === 'trainer'
                                        ? "You've proposed a new time. Waiting for the client to confirm or decline."
                                        : "The client has requested to change this session to:"}
                                </p>

                                <div className={`p-4 rounded-2xl mb-4 ${booking.rescheduleRequest.requestedBy === 'trainer' ? 'bg-indigo-50' : 'bg-indigo-500/40'
                                    }`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs uppercase font-bold opacity-60">Proposed Date</p>
                                            <p className={`font-bold ${booking.rescheduleRequest.requestedBy === 'trainer' ? 'text-indigo-900' : 'text-white'}`}>
                                                {new Date(booking.rescheduleRequest.newDate).toDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs uppercase font-bold opacity-60">Proposed Time</p>
                                            <p className={`font-bold ${booking.rescheduleRequest.requestedBy === 'trainer' ? 'text-indigo-900' : 'text-white'}`}>
                                                {booking.rescheduleRequest.newTimeSlot}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {booking.rescheduleRequest.requestedBy === 'user' && (
                                    <div className="flex gap-2">
                                        <button
                                            className="flex-1 py-3 bg-white text-indigo-600 rounded-xl font-bold text-xs uppercase hover:bg-indigo-50 transition-colors"
                                            onClick={() => triggerAction("accept", "reschedule")}
                                        >
                                            Accept New Time
                                        </button>
                                        <button
                                            className="flex-1 py-3 bg-indigo-700 text-white border border-indigo-400 rounded-xl font-bold text-xs uppercase hover:bg-indigo-800 transition-colors"
                                            onClick={() => triggerAction("reject", "reschedule")}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                )}

                                {booking.rescheduleRequest.requestedBy === 'trainer' && (
                                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs italic">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                        </span>
                                        Pending Client Response...
                                    </div>
                                )}
                            </div>
                        )}
                        {!booking.rescheduleRequest && booking.rejectReason && booking.bookingStatus === 'pending' && (
                            <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-5 flex items-start gap-4">
                                    <div className="bg-rose-100 p-2 rounded-2xl">
                                        <XCircle size={24} className="text-rose-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-rose-900 font-bold text-sm uppercase tracking-tight">
                                                Proposal Declined by Client
                                            </h3>
                                            <span className="text-[10px] font-bold text-rose-400 bg-rose-100/50 px-2 py-0.5 rounded-full uppercase">
                                                Recent Update
                                            </span>
                                        </div>
                                        <p className="text-rose-700 text-sm mt-1 italic">
                                            "{booking.rejectReason}"
                                        </p>
                                        <p className="text-rose-600/60 text-[11px] mt-2 font-medium">
                                            The original session time is still active. Please choose a new action below.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {booking.bookingStatus === "pending" && !booking.rescheduleRequest && (
                            <div className="bg-white border-2 border-indigo-500 p-6 rounded-3xl shadow-xl animate-in slide-in-from-bottom-4">
                                <h2 className="text-indigo-600 text-xs font-black uppercase tracking-widest mb-2">New Request</h2>
                                <p className="text-gray-600 text-sm mb-6">Will you accept this session for the requested slot?</p>
                                <div className="flex gap-3 justify-between">
                                    <button
                                        onClick={() => triggerAction('accept', 'booking')}
                                        className="p-2 bg-emerald-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
                                    >
                                        <CheckCircle size={18} />
                                        Accept
                                    </button>

                                    <button
                                        onClick={() => setRescheduleModal(true)}
                                        className=" p-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-100 hover:text-amber-800 transition-all active:scale-95"
                                    >
                                        <CalendarClock size={18} className="text-amber-600" />
                                        Reschedule
                                    </button>

                                    <button
                                        onClick={() => triggerAction('reject', 'booking')}
                                        className="p-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-100 hover:text-rose-800 transition-all active:scale-95"
                                    >
                                        <XCircle size={18} className="text-rose-600" />
                                        Decline
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                <Modal
                    isVisible={showModal}
                    onCancel={() => setShowModal(false)}
                    onConfirm={handleConfirmAction}
                    title="Confirm Action"
                    message={`Confirming will ${pendingAction?.type} this ${pendingAction?.context} request.`}
                    showReasonInput={pendingAction?.type === "reject"}
                />
                {rescheduleModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Reschedule</h2>
                                    <p className="text-sm text-gray-500">Propose a new time to {booking.clientName}</p>
                                </div>
                                <button
                                    onClick={() => setRescheduleModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <HiOutlineX size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">New Date</label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={rescheduleDate}
                                        onChange={(e) => setRescheduleDate(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">New Time Slot</label>
                                    <input
                                        type="time"
                                        value={rescheduleTime}
                                        onChange={(e) => setRescheduleTime(e.target.value)}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="pt-4 flex flex-col gap-3">
                                    <button
                                        onClick={handleRescheduleSubmit}
                                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <CalendarClock size={20} />
                                        Send Proposal
                                    </button>
                                    <button
                                        onClick={() => setRescheduleModal(false)}
                                        className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BookingDetails;