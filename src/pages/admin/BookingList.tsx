import { useEffect, useState, useMemo, useCallback } from "react";
import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import GenericTable from "../../components/GenericTable";
import Pagination from "../../components/Pagination";
import { GenericPieChart } from "../../components/PieChart";
import { GenericAreaChart } from "../../components/AreaChart";
import { Calendar, CheckCircle, Users, AlertCircle, Eye, RefreshCcw, Search } from "lucide-react";
import { AdminBookingService } from "../../services/admin/admin.booking.service";
import { useNavigate } from "react-router-dom";
const BookingList = () => {

  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(10);

  const [bookings, setBookings] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [trendRange, setTrendRange] = useState<'7days' | '6months'>('7days');

  const totalPages = Math.ceil(totalCount / limit);

  const navigate=useNavigate()

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await AdminBookingService.getBookingsMetrics(trendRange);
      setMetrics(res);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  }, [trendRange]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await AdminBookingService.getAllBookings(page, searchTerm, limit);
      setBookings(res.data || []);
      setTotalCount(res.total || 0);
    } catch (error) {
      console.error("Pagination Error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, limit]);


  const handleSyncData = async () => {
    setLoading(true);
    await Promise.all([fetchMetrics(), fetchBookings()]);
    setLoading(false);
  };

  useEffect(() => {
    document.title = "FitTribe | Booking Command Center";
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const displayBookings = useMemo(() => {
    if (statusFilter === "all") return bookings;
    return bookings.filter(b => b.status.toLowerCase() === statusFilter.toLowerCase());
  }, [bookings, statusFilter]);

  const statCards = [
    {
      label: "Today's Sessions",
      value: metrics?.stats?.todaySessions ?? 0,
      icon: <Calendar size={20} />,
      color: "bg-indigo-500",
      trend: "Live",
    },
    {
      label: "Pending Requests",
      value: metrics?.stats?.pendingRequests ?? 0,
      icon: <AlertCircle size={20} />,
      color: "bg-amber-500",
      trend: "Needs Action",
    },
    {
      label: "Total Bookings",
      value: metrics?.stats?.totalBookings?.toLocaleString() ?? "0",
      icon: <Users size={20} />,
      color: "bg-blue-500",
      trend: "Lifetime",
    },
    {
      label: "Success Rate",
      value: metrics?.stats?.successRate ?? "0%",
      icon: <CheckCircle size={20} />,
      color: "bg-emerald-500",
      trend: "High",
    },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <AdminTopBar />
      <AdminSideBar />

      <main className="ml-64 mt-16 p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Booking Overview</h1>
            <p className="text-slate-500 font-medium text-lg">Monitor scheduling volume and fulfillment metrics.</p>
          </div>
          <button
            onClick={handleSyncData}
            disabled={loading}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} /> Sync Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.color} p-3 rounded-2xl text-white`}>{stat.icon}</div>
                <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-slate-50 text-slate-600 uppercase">
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-wider">Booking Volume</h3>
              <select
                value={trendRange}
                onChange={(e) => setTrendRange(e.target.value as any)}
                className="bg-slate-50 border-none text-xs font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all"
              >
                <option value="7days">Last 7 Days</option>
                <option value="6months">Last 6 Months</option>
              </select>
            </div>
            <GenericAreaChart
              data={metrics?.charts?.bookingTrend || []}
              xKey="label"
              height={280}
              series={[{ key: 'bookings', color: '#6366f1', name: 'Total Bookings' }]}
            />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-lg uppercase tracking-wider mb-8">Fulfillment</h3>
            <GenericPieChart data={metrics?.charts?.statusDistribution || []} />
          </div>
        </div>

        <div className="bg-white p-4 mb-8 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search Client, Trainer or ID..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-transparent focus:bg-white rounded-2xl focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm transition-all"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
              {['all', 'completed', 'pending', 'cancelled'].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${statusFilter === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <GenericTable
            data={displayBookings}
            page={page}
            loading={loading}
            columns={[
              {
                header: "BId",
                accessor: "id",
                render: (row: any) => <span className="font-mono font-black text-slate-400 text-sm">#{row.id.toString().slice(-5)}</span>
              },
              {
                header: "Appointment",
                accessor: "client",
                render: (row: any) => (
                  <div className="py-1">
                    <p className="text-sm font-black text-slate-900">{row.client}</p>
                    <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tight">With {row.trainer}</p>
                  </div>
                )
              },
              {
                header: "Scheduled For",
                accessor: "date",
                render: (row: any) => <span className="text-sm font-bold text-slate-600">{row.date}</span>
              },
              {
                header: "Status",
                accessor: "status",
                render: (row: any) => (
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${row.status.toLowerCase() === 'completed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                      row.status.toLowerCase() === 'confirmed' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                        row.status.toLowerCase() === 'cancelled' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                    {row.status}
                  </span>
                )
              },
              {
                header: "Action",
                accessor: "id",
                render: (row:any) => (
                  <button className="bg-slate-50 p-3 rounded-2xl hover:bg-slate-900 hover:text-white transition-all group" onClick={()=>navigate(`/admin/bookings/${row.id}`)}>
                    <Eye size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                )
              }
            ]}
          />

          <div className="p-8 border-t border-slate-100 bg-slate-50/30 flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingList;