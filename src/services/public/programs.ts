import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const PublicProgramsService={
    explorePrograms: async (role: string = 'user') => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.DISCOVERY.PROGRAMS.EXPLORE(role));
    console.log(data)
    return data;
  },
}