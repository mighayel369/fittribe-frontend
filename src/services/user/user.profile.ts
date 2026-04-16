import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";
import type { UpdateUserProfileDTO } from "../../types/userType";



export const UserProfileService = {

  updateProfile: async (payload: FormData|UpdateUserProfileDTO) => {
      const { data } = await axiosInstance.put(API_ENDPOINTS.USER_ACCOUNT.UPDATE_PROFILE, payload);
      return data;
  },

  getProfile: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.USER_ACCOUNT.GET_ME);
    return data;
  },

  updateAvatar: async (formData: FormData) => {
    const { data } = await axiosInstance.patch(API_ENDPOINTS.USER_ACCOUNT.UPDATE_AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
    changePassword: async (payload: any) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.USER_ACCOUNT.CHANGE_PASSWORD,payload);
    return data;
  },

  verifySession: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.USER_ACCOUNT.VERIFY_SESSION);
    return data;
  },
};