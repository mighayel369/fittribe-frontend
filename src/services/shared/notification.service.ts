import axiosInstance from "../../api/AxiosInstance"
import { API_ENDPOINTS } from "../../api/endPoints"

export const NotificationService = {
    GETALL: async (role: string) => {
        const { data } = await axiosInstance.get(API_ENDPOINTS.NOTIFICATION.GET_ALL(role))
        return data
    },
    MARK_AS_READ: async (role: string, id: string) => {
        const { data } = await axiosInstance.patch(API_ENDPOINTS.NOTIFICATION.MARK_AS_READ(role, id))
        return data
    },
    MARK_ALL_AS_READ: async (role: string) => {
        const { data } = await axiosInstance.patch(API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ(role))
        return data
    }
}