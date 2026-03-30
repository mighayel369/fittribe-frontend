import { useEffect, useState } from "react";
import { AdminPlatformService } from "../../services/admin/admin.platform.service";
import AdminSideBar from "../../layout/AdminSideBar";
import AdminTopBar from "../../layout/AdminTopBar";
import StatCard from "../../components/StatCard";
import { GenericAreaChart } from "../../components/AreaChart";
import { GenericBarChart } from "../../components/BarChart";
import { DollarSign, Star, TrendingUp, Users, PieChart, Calendar } from "lucide-react";
import { GenericPieChart } from "../../components/PieChart";
import Toast from "../../components/Toast";
import { useLocation } from 'react-router-dom';
import {type AdminDashbardResponseDTO, type TopTrainersDTO } from "../../types/dashboardType";
const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashbardResponseDTO|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await AdminPlatformService.DashboardInsights();
      setDashboardData(response.dashboardData);
    } catch (err: any) {
  const errorMsg = err.response?.data?.message || "Failed to load system analytics";
  setToastMessage(errorMsg);
} finally {
  setLoading(false);
}
  }
  let location=useLocation()
useEffect(() => {
  if (location.state?.message) {
    setToastMessage(location.state.message);
    window.history.replaceState({}, document.title);
  }
  fetchDashboardData();
}, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading Analytics...</div>;
  }

  if (!dashboardData) {
  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <p className="text-slate-500 font-medium">Unable to load dashboard.</p>
      <button onClick={fetchDashboardData} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Retry</button>
    </div>
  );
}

  const { metrics, performanceData, topTrainers, bookingStatus, peakHoursData } = dashboardData;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSideBar />
      <AdminTopBar />

      <main className="ml-72 pt-28 px-10 pb-12">
              {toastMessage && (
                <Toast 
                  message={toastMessage} 
                  type="success" 
                  onClose={() => setToastMessage(null)} 
                />
              )}
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Analytics</h1>
            <p className="text-slate-500 font-medium">Monitoring platform growth and trainer performance.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchDashboardData} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700">
              Refresh Data
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title='Total Revenue' value={`$${metrics.totalRevenue.toLocaleString()}`} icon={DollarSign} subText="Lifetime Earnings" />
          <StatCard title='Total Bookings' value={metrics.totalBookings} icon={Calendar} subText="Completed Sessions" />
          <StatCard title='Active Trainers' value={metrics.totalActiveTrainers} icon={Users} subText="Verified Personnel" />
          <StatCard title='Retention Rate' value={metrics.rententionRate} icon={TrendingUp} subText="Repeat customer rate" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Revenue & User Growth</h3>
                  <p className="text-sm text-slate-500 font-medium">Monthly performance comparison</p>
                </div>
                <div className="flex gap-4 text-xs font-bold">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#4F46E5] rounded-full"></div> Revenue
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#10B981] rounded-full"></div> New Users
                  </span>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <GenericAreaChart
                  data={performanceData}
                  xKey="month"
                  series={[
                    { key: "revenue", color: "#4F46E5", name: "Revenue ($)" },
                    { key: "users", color: "#10B981", name: "New Users" }
                  ]}
                />
              </div>
            </section>


            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Top Trainers ({topTrainers[0]?.month})</h3>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-bold">This Month</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
                      <th className="pb-4 font-bold">Trainer</th>
                      <th className="pb-4 font-bold">Bookings</th>
                      <th className="pb-4 font-bold">Rating</th>
                      <th className="pb-4 font-bold">Revenue</th>
                      <th className="pb-4 font-bold">Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {topTrainers.map((trainer: TopTrainersDTO, idx: number) => (
                      <tr key={idx} className="group">
                        <td className="py-4 font-bold text-slate-900 text-sm">{trainer.name}</td>
                        <td className="py-4 text-sm text-slate-600">{trainer.bookings}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                            <Star size={14} fill="currentColor" /> {trainer.rating.toFixed(1)}
                          </div>
                        </td>
                        <td className="py-4 text-sm font-bold text-emerald-600">${trainer.revenue.toLocaleString()}</td>
                        <td className="py-4">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full" style={{ width: trainer.useage }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{trainer.useage} Capacity</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieChart size={18} className="text-indigo-500" /> Booking Status
              </h3>

              <GenericPieChart data={bookingStatus} />
            </section>

            <section className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-xl text-white relative">
              <div className="relative z-10">
                <h3 className="text-xl font-black">Peak Hours</h3>
                <p className="text-indigo-100 text-xs mb-6">Top 4 high-traffic slots</p>
                <GenericBarChart data={peakHoursData} categoryKey="time" valueKey="count" />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;