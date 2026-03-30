import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  Search, ChevronLeft, ChevronRight } from "lucide-react";
import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import Toast from "../../components/Toast";
import Loading from "../../components/Loading";
import { TrainerBookingService } from "../../services/trainer/trainer.booking";
import GenericTable from "../../components/GenericTable";
import Modal from "../../components/Modal";
import {type TrainerBookingColumnActions } from "../../types/table-types";
import { allBookingsColumns,pendingBookingsColumns,rescheduleColumns } from "../../constants/TableColumns/TrainerBookingColumns";
type TabType = "all" | "pending" | "reschedule";

const TRAINER_BOOKING_ACTIONS = {
    booking: {
        accept: (id: string) => TrainerBookingService.acceptBooking(id),
       reject: (id: string, reason: string) => TrainerBookingService.rejectBooking(id, reason),    },
    reschedule: {
        accept: (id: string) => TrainerBookingService.approveReschedule(id),
        reject: (id: string,reason:string) => TrainerBookingService.rejectReschedule(id,reason),
    },
};
const TrainerBookings = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [bookings, setBookings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
const [showModal, setShowModal] = useState(false);
const navigate = useNavigate();
const [selectedId, setSelectedId] = useState<string | null>(null);
  const [action, setAction] = useState<{
    type: 'accept' | 'reject';
    context: 'booking' | 'reschedule';
  } | null>(null);

const triggerAction = (id: string, type: 'accept' | 'reject', context: 'booking' | 'reschedule') => {
    setSelectedId(id);
    setAction({ type, context });
    setShowModal(true);
  };

const getActiveColumns = () => {
const actions: TrainerBookingColumnActions = {
    onView: (id) => navigate(`/trainer/bookings/${id}`),
    onAction: triggerAction 
  };    
    switch (activeTab) {
      case "pending":
        return pendingBookingsColumns(actions);
      case "reschedule":
        return rescheduleColumns(actions);
      default:
        return allBookingsColumns(actions.onView);
    }
  };


  useEffect(() => {
    fetchData();
  }, [activeTab, currentPage, searchQuery]);



const fetchData = async () => {
    try {
      setIsLoading(true);
      const serviceMap = {
        all: TrainerBookingService.getSessionHistory,
        pending: TrainerBookingService.getPendingSessions,
        reschedule: TrainerBookingService.getRescheduleRequests,
      };

      const res = await serviceMap[activeTab](currentPage, searchQuery);
      console.log(res)
      if (res.success) {
        setBookings(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      setToast({ message: "Failed to load bookings", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

const handleConfirmAction = async (reason?: string) => {
    if (!action || !selectedId) return;

    if (action.type === 'reject' && (!reason || reason.trim().length < 5)) {
      setShowModal(false)
      setToast({ 
        message: "Please provide a valid reason (at least 5 characters).", 
        type: "error" 
      });
      return; 
    }

    try {
      setIsLoading(true);
      const serviceFn = TRAINER_BOOKING_ACTIONS[action.context][action.type];
      console.log(serviceFn)
      const res = await serviceFn(selectedId, reason || "");
      console.log(res)
      if (res.success) {
        setToast({ message: res.message, type: "success" });
        await fetchData();
        setAction(null);
        setSelectedId(null);
      }
    } catch (err: any) {
      console.log(err)
      setToast({ 
        message: err.response?.data?.message || "Action failed.", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TrainerTopBar />
      <TrainerSideBar />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="ml-72 pt-24 px-10 pb-12">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Bookings</h1>
            <p className="text-gray-500 mt-1">Manage your training sessions and requests.</p>
          </div>

          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search service..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </header>

        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 w-fit">
          {[
            { id: "all", label: "All Sessions", color: "indigo" },
            { id: "pending", label: "Pending", color: "indigo" },
            { id: "reschedule", label: "Reschedules", color: "indigo" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as TabType); setCurrentPage(1); }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                  ? `bg-${tab.color}-600 text-white shadow-md shadow-${tab.color}-200`
                  : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Loading message="Fetching your data..." />
        ) : (
          <>
          <GenericTable
            data={bookings}
            columns={getActiveColumns()} 
            page={currentPage}
            loading={isLoading}
            emptyMessage={`No ${activeTab} records found.`}
          />


            <div className="flex justify-between items-center mt-6">
              <p className="text-xs text-gray-500 font-medium">Showing {bookings.length} of {total} results</p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  disabled={currentPage * 5 >= total}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
                <Modal
                    isVisible={showModal}
                    onCancel={() => setShowModal(false)}
                    onConfirm={handleConfirmAction}
                    title="Confirm Action"
                    message={`Confirming will ${action?.type} this ${action?.context} request.`}
                    showReasonInput={action?.type === "reject"}
                />
      </main>
    </div>
     );
};

export default TrainerBookings;