import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const UserBookingService = {

  getBookingHistory: async (page: number, search: string) => {
    console.log(page)
    const { data } = await axiosInstance.get(API_ENDPOINTS.USER_BOOKINGS.HISTORY, {
      params: { pageNo: page, search }
    });
    return data;
  },

  checkoutAndBook: async (payload: any) => {
     const { data } = await axiosInstance.post(API_ENDPOINTS.USER_BOOKINGS.CHECKOUT, payload);
     return data;
  },

  getBookingDetails: async (id: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.USER_BOOKINGS.DETAILS(id));
    return data;
  },

  requestReschedule: async (payload: any) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.USER_BOOKINGS.RESCHEDULE_REQUEST, payload);
    return data;
  },

  cancelSession: async (bookingId: string) => {
    const { data } = await axiosInstance.delete(API_ENDPOINTS.USER_BOOKINGS.CANCEL(bookingId));
    return data;
  },
acceptReschedule: async (bookingId: string) => {
    const { data } = await axiosInstance.patch(
        API_ENDPOINTS.USER_BOOKINGS.ACCEPT_RESCHEDULE(bookingId)
    );
    return data;
},

declineReschedule: async (bookingId: string) => {
    const { data } = await axiosInstance.patch(
        API_ENDPOINTS.USER_BOOKINGS.DECLINE_RESCHEDULE(bookingId)
    );
    return data;
}
};