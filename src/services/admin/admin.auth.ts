import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";
import { type AdminLoginDTO } from "../../types/adminType";

export const AdminAuthService = {
  login: async (payload: AdminLoginDTO) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.ADMIN_AUTH.LOGIN, payload);
    return data;
  }
};