import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";
export const TrainerScheduleService={
getSchedule: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.TRAINER_ACCOUNT.GET_CONFIG);
    return data;
  },
syncWeeklyTemplate: async (weeklyAvailability: any) => {
    const {data}=await axiosInstance.put(API_ENDPOINTS.TRAINER_ACCOUNT.SYNC_TEMPLATE, { weeklyAvailability });
    return data
  },
};