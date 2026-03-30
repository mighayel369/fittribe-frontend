import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";
import { type UserLoginDTO } from "../../types/userType";

export const UserAuthService = {
  login: async (payload: UserLoginDTO) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.USER_AUTH.LOGIN, payload);
    return data;
  },

  register: async (payload: { name: string; email: string; password: string }) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.USER_AUTH.REGISTER, payload);
    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.USER_AUTH.FORGOT_PW, { email });
    return data;
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.USER_AUTH.RESET_PW(token), { password });
    return data;
  },

  initiateGoogleLogin: () => {
    window.location.href = `${axiosInstance.defaults.baseURL}/${API_ENDPOINTS.USER_AUTH.GOOGLE}`;
  },
};