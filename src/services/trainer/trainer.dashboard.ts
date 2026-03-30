import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const TrainerDashboardService = {
 
  getMetrics: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.TRAINER_ACCOUNT.METRICS);
    return data;
  },

  getDailyAgenda: async (date: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.TRAINER_ACCOUNT.AGENDA, {
      params: { date }
    });
    return data;
  }
};