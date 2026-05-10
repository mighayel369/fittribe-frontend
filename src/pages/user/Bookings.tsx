import { useEffect, useState } from "react";
import UserNavBar from "../../layout/UserNavBar";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import SearchInput from "../../components/SearchInput";
import GenericTable from "../../components/GenericTable";
import { FaCalendarAlt, FaChevronRight } from "react-icons/fa";
import { type Booking } from "../../types/bookingType";
import { UserBookingService } from "../../services/user/user.booking";
import Toast from "../../components/Toast";
import { formatTime, formatDate } from "../../utils/formatTime";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    document.title = "FitTribe | My Bookings";
    fetchBookings();
  }, [page, search]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await UserBookingService.getBookingHistory(page, search, "UPCOMING");
      setBookings(res.bookingData);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setToast({ 
        message: err.response?.data?.message || "Failed to fetch bookings", 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <UserNavBar />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              My <span className="text-indigo-600">Sessions</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Manage and track your upcoming fitness journey.</p>
          </div>

          <div className="w-full md:w-80">
            <SearchInput
              placeholder="Search trainer or program..."
              value={search}
              onChange={(value) => {
                setPage(1);
                setSearch(value);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm shadow-indigo-100/20">
            <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
              <FaCalendarAlt size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Bookings</p>
              <p className="text-2xl font-black text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden p-2">
          <GenericTable
            data={bookings}
            page={page}
            loading={loading}
            emptyMessage="No upcoming sessions found."
            columns={[
              {
                header: "Trainer",
                accessor: "trainerName",
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 border border-indigo-100">
                      {row.trainerName?.charAt(0) || "T"}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">{row.trainerName || "N/A"}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Professional Trainer</span>
                    </div>
                  </div>
                ),
              },
              {
                header: "Program",
                accessor: "bookedProgram",
                render: (row) => (
                    <span className="text-gray-700 font-semibold bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                        {row.bookedProgram}
                    </span>
                )
              },
              {
                header: "Schedule",
                accessor: "bookedDate",
                render: (row) => (
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-bold">
                      {formatDate(row.bookedDate)}
                    </span>
                    <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">
                      {formatTime(Number(row.bookedTime))}
                    </span>
                  </div>
                )
              },
              {
                header: "Investment",
                accessor: "sessionAmount",
                render: (row) => <span className="font-black text-gray-900">₹{row.sessionAmount}</span>
              },
              {
                header: "Status",
                accessor: "bookingStatus",
                render: (row) => (
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(row.bookingStatus)}`}>
                    {row.bookingStatus}
                  </span>
                ),
              },
              {
                header: "",
                accessor: "action",
                className: "text-right",
                render: (row) => (
                  <button
                    onClick={() => navigate(`/bookings/${row.bookingId}`)}
                    className="group bg-gray-50 text-gray-900 p-2 px-4 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 ml-auto"
                  >
                    Details
                    <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ),
              },
            ]}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </main>
    </div>
  );
};

export default Bookings;