import { useEffect, useState, useMemo } from "react";
import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import StatCard from "../../components/StatCard";
import { TrainerDashboardService } from "../../services/trainer/trainer.dashboard";
import { GenericAreaChart } from "../../components/AreaChart";
import { useNavigate } from "react-router-dom";
import {
  DollarSign, Star, Clock, TrendingUp,
  AlertCircle, MessageSquare, Calendar, ChevronRight
} from "lucide-react";
import {type PendingActionDTO, type RecentChatDTO, type TrainerDashboardMainData } from "../../types/dashboardType";
import {type UpcomingAppointmentDTO } from "../../types/dashboardType";
import DEFAULT_IMAGE from '../../assets/default image.png'
const TrainerHome = () => {
  const [dashData, setDashData] = useState<TrainerDashboardMainData|null>(null);
  const [appointments, setAppointments] = useState<UpcomingAppointmentDTO[]>([]);
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate()
  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date();
    const diff = startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1);
    const monday = new Date(startOfWeek.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.getDate(),
        fullDate: d.toISOString()
      });
    }
    return days;
  }, []);

  useEffect(() => {
    loadInitialDashboard();
  }, []);

const loadInitialDashboard = async () => {
  try {
    setLoading(true);
    const [mainResponse, appointmentResponse] = await Promise.all([
      TrainerDashboardService.getMetrics(),
      TrainerDashboardService.getDailyAgenda(new Date().toISOString())
    ]);

    setDashData(mainResponse.dashboardData); 
    setAppointments(appointmentResponse.dashboardData.upcomingAppointments);
    console.log(appointments)
  } catch (error) {
    console.error("Dashboard Load Error:", error);
  } finally {
    setLoading(false);
  }
};

  const handleDateChange = async (date: number, fullDate: string) => {
    setSelectedDate(date);
    try {
      const data = await TrainerDashboardService.getDailyAgenda(fullDate);
      setAppointments(data.dashboardData.upcomingAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  if (loading || !dashData) {
    return <div className="flex h-screen items-center justify-center">Loading Coach...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TrainerTopBar />
      <TrainerSideBar />

      <main className="ml-72 pt-28 px-10 pb-12">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 font-medium mt-1">
              Welcome back, Coach. You have <span className="text-red-600 font-bold">{dashData.metrics.todayProgress} sessions</span> today.
            </p>
          </div>
        </header>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title='Monthly Revenue' value={dashData.metrics.monthlyEarning} icon={DollarSign} subText="This Month" />
          <StatCard title='Upcoming' value={dashData.metrics.upcomingTotal} icon={Calendar} subText="Total Active" />
          <StatCard title='Daily Progress' value={dashData.metrics.todayProgress} icon={Clock} subText="Completed/Total" />
          <StatCard title='Avg Rating' value={dashData.metrics.averageRating} icon={Star} subText="User Reviews" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">

            <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-3">
                  <AlertCircle size={14} className="text-rose-500" /> Pending Actions
                </h3>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full">
                  {dashData.pendingActions.length} New Requests
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {dashData.pendingActions.map((action: PendingActionDTO, index: number) => (
                  <div key={index} className="w-[260px] bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col justify-between transition-all hover:border-rose-200" onClick={()=>navigate(`/trainer/bookings/${action.bookingId}`)}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white text-rose-500 rounded-xl shadow-sm flex-shrink-0">
                        <Clock size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-900 leading-tight truncate">{action.clientName}</p>
                        <p className="text-rose-500 font-black tracking-tight capitalize text-[8px] mt-0.5">{action.type}</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate mt-1">{action.detail}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-1.5 bg-white text-slate-500 border border-slate-200 rounded-lg text-[9px] font-bold uppercase hover:bg-slate-100">Decline</button>
                      <button className="flex-1 py-1.5 bg-rose-500 text-white rounded-lg text-[9px] font-bold uppercase hover:bg-rose-600">Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>


            <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-800">Appointments</h3>
              </div>


              <div className="flex justify-between mb-6 overflow-x-auto pb-2 gap-2">
                {weekDays.map((wd) => (
                  <button
                    key={wd.date}
                    onClick={() => handleDateChange(wd.date, wd.fullDate)}
                    className={`flex flex-col items-center min-w-[45px] py-2 rounded-xl transition-all border ${wd.date === selectedDate ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100'}`}
                  >
                    <span className="text-[8px] font-bold uppercase opacity-60">{wd.label}</span>
                    <span className="text-sm font-black">{wd.date}</span>
                  </button>
                ))}
              </div>


              <div className="space-y-2">
                {appointments.length > 0 ? (
                  appointments.map((app: UpcomingAppointmentDTO, idx: number) => (
                    <div key={idx} className="group flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200" onClick={()=>navigate(`/trainer/bookings/${app.bookingId}`)}>
                      <div className="flex items-center gap-3">
                        <img src={app.profilePic || DEFAULT_IMAGE} className="w-10 h-10 rounded-full object-cover" alt="" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{app.clientName}</h4>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded-md">{app.program}</span>
                            <span className="text-[9px] text-slate-400 font-medium">{app.timeSlot}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-lg uppercase ${app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {app.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 text-xs py-10">No appointments for this day.</p>
                )}
              </div>
            </section>
          </div>
          <div className="space-y-8">
            <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-3">
                  <MessageSquare size={14} className="text-indigo-600" /> Recent Chats
                </h3>
              </div>

              <div className="space-y-4">
                {dashData.recentChats && dashData.recentChats.length > 0 ? (
                  dashData.recentChats.map((chat: RecentChatDTO, index: number) => (
                    <div key={index} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-all">
                      <div className="relative flex-shrink-0">
                        <img
                          src={chat.profilePic ||DEFAULT_IMAGE}
                          className="w-8 h-8 rounded-full object-cover border border-slate-100"
                          alt=""
                        />
                        {chat.unread && (
                          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-indigo-600 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-slate-900 truncate">{chat.clientName}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase ml-2">{chat.time}</span>
                        </div>
                        <p className={`text-[10px] truncate leading-tight mt-0.5 ${chat.unread ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}`}>
                          {chat.lastMesg}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
               
                  <div className="py-8 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 mb-3">
                      <MessageSquare size={16} className="text-slate-300" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">No recent conversations</p>
                  </div>
                )}
              </div>

              <button className="w-full mt-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-[10px] hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 group">
                View All Messages <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </section>
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-gray-800 uppercase">Monthly Growth</h3>
                <TrendingUp className="text-emerald-500" size={20} />
              </div>
              <div className="h-[180px] w-full">
                <GenericAreaChart
                  data={dashData.performanceData}
                  xKey="month"
                        series={[
                      { key: "sessionCount", color: "#4F46E5", name: "Sessions Completed" }
                    ]} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainerHome;