import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";
import { type TrainerLoginDTO } from "../../types/trainerType";

export const TrainerAuthService = {

  login: async (payload: TrainerLoginDTO) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.TRAINER_AUTH.LOGIN, payload);
    return data;
  },


  register: async (formData: FormData) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.TRAINER_AUTH.REGISTER, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }
};