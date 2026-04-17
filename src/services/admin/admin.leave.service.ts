import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";
export const LeaveService = {
    getLeaveMetrics: async () => {
        const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_MGMT.PLATFORM.METRICS);
        return data
    },
    getLeaveistory: async (page: number, search: string, limit: number) => {
        const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_MGMT.PLATFORM.LEAVE_REQUEST_HISTORY, {
            params: { pageNo: page, search, limit }
        });
        return data;
    },
    updateLeaveStatus: async (leaveId: string, status: string, adminComment?: string) => {
        const { data } = await axiosInstance.patch(API_ENDPOINTS.ADMIN_MGMT.PLATFORM.LEAVE_STATUS, { status, adminComment,leaveId });
        return data
    }
}