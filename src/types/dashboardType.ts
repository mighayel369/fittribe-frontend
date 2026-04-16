import {type ChatList } from "./chatType";
export interface PendingActionDTO {
  bookingId: string;
  type: string;
  clientName: string;
  detail: string;
  time: string;
}

export interface UpcomingAppointmentDTO {
  bookingId: string;
  clientName: string;
  timeSlot: string;
  program: string;
  status: 'confirmed' | 'pending' | 'completed'; 
  profilePic: string;
  meetLink?:string
}



export interface TrainerMonthlyPerformanceDTO {
  month: string;
  sessionCount: number;
}

export interface metrics{
    monthlyEarning:number;
    upcomingTotal:number;
    todayProgress:string;
    averageRating:number
}

export interface TrainerDashboardMainData {
    metrics:metrics,
    pendingActions:PendingActionDTO[],
    performanceData:TrainerMonthlyPerformanceDTO[],
    recentChats:ChatList[]
}


export interface PerformanceDataDTO{
    month:string,
    revenue:number,
    users:number
}

export interface TopTrainersDTO{
    month:string,
    name:string,
    bookings:number,
    rating:number,
    revenue:number,
    useage:string
}

export interface BookingStatusDTO{
    label: string,
    count:number
}
export interface PeakBookingTimeDataDTO{
    time:string,
    count:number
}


export interface AdminDashbardResponseDTO{
    metrics:{
        totalRevenue:number,
        totalBookings:number,
        totalActiveTrainers:number,
        rententionRate:string
    }
    performanceData:PerformanceDataDTO[],
    topTrainers:TopTrainersDTO[],
    bookingStatus:BookingStatusDTO[],
    peakHoursData:PeakBookingTimeDataDTO[]
}