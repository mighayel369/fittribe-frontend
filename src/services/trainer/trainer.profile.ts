import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";


export const TrainerProfileService = {

  getProfile: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.TRAINER_ACCOUNT.GET_ME);
    return data;
  },
    updateProfile: async (payload: FormData) => {
      const { data } = await axiosInstance.put(API_ENDPOINTS.TRAINER_ACCOUNT.UPDATE_PROFILE, payload);
      return data;
  },

  updateAvatar: async (formData: FormData) => {
    const { data } = await axiosInstance.patch(
      API_ENDPOINTS.TRAINER_ACCOUNT.UPDATE_AVATAR, 
      formData, 
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  reapply: async (formData: FormData) => {
    const { data } = await axiosInstance.post(
      API_ENDPOINTS.TRAINER_ACCOUNT.REAPPLY, 
      formData, 
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },
  
  verifySession: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.TRAINER_ACCOUNT.VERIFY_SESSION);
    return data;
  },
};