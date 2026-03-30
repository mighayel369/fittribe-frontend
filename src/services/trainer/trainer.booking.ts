import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const TrainerBookingService = {

  getSessionHistory: async (page: number, search: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.TRAINER_BOOKINGS.HISTORY, {
      params: { pageNo: page, search }
    });
    return data;
  },

  getPendingSessions: async (pageNo: number, search: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.TRAINER_BOOKINGS.PENDING, {
      params: { pageNo, search }
    });
    return data;
  },

  getRescheduleRequests: async (pageNo: number, search: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.TRAINER_BOOKINGS.RESCHEDULE_REQUESTS, {
      params: { pageNo, search }
    });
    return data;
  },

  acceptBooking: async (bookingId: string) => {
    const { data } = await axiosInstance.patch(API_ENDPOINTS.TRAINER_BOOKINGS.ACCEPT, { 
      bookingId 
    });
    return data;
  },

  rejectBooking: async (bookingId: string, reason: string) => {
    const { data } = await axiosInstance.patch(
      API_ENDPOINTS.TRAINER_BOOKINGS.REJECT, 
      { reason, bookingId }
    );
    return data;
  },

  approveReschedule: async (bookingId: string) => {
    const { data } = await axiosInstance.patch(API_ENDPOINTS.TRAINER_BOOKINGS.APPROVE_RESCHEDULE, { 
      bookingId 
    });
    return data;
  },

  rejectReschedule: async (bookingId: string, reason: string) => {
    const { data } = await axiosInstance.patch(API_ENDPOINTS.TRAINER_BOOKINGS.REJECT_RESCHEDULE, { 
      bookingId,
      reason
    });
    return data;
  },

  getBookingDetails: async (bookingId: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.TRAINER_BOOKINGS.DETAILS(bookingId));
    return data;
  },

rescheduleByTrainer: async (bookingId: string, newDate: string, newTimeSlot: string) => {
    const { data } = await axiosInstance.put(API_ENDPOINTS.TRAINER_BOOKINGS.RESCHEDULE_BY_TRAINER, 
        { 
            bookingId,
            newDate, 
            newTimeSlot
        }
    );
    return data;
}
};