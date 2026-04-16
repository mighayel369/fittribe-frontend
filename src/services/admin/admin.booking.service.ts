import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";


export const AdminBookingService = {
getAllBookings: async (page: number, search: string = "", limit: number = 10) => {
        const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_BOOKINGS.GET_ALL_BOOKINGS, {
            params: { page, search, limit }
        });
        return data;
    },
getBookingsMetrics: async (range: '7days' | '6months' = '7days') => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_BOOKINGS.BOOKING_METRICS,{
        params:{
            range:range
        }
    })
    return data;
},
getBookingDetails:async(bookingId:string)=>{
    const {data}=await axiosInstance.get(API_ENDPOINTS.ADMIN_BOOKINGS.DETAILS(bookingId))
    return data
}
};