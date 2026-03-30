import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const AdminPlatformService={
  DashboardInsights: async () => {
        const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_MGMT.PLATFORM.OVERVIEW);
        return data
}
}