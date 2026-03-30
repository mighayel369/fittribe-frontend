import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const AuthService={
refreshAccessToken: async (role: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.SHARED_AUTH.REFRESH(role));
    return data;
  },

  logout: async (role: string) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.SHARED_AUTH.LOGOUT(role));
    return data;
  },

 resendOtp: async (email: string, role: string) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.SHARED_AUTH.RESEND_OTP(role), { email });
    return data;
  },
    changePassword: async (role: string, payload: any) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.SHARED_AUTH.CHANGE_PASSWORD(role), payload);
    return data;
  },
    verifyOtp: async (email: string | null, otpCode: string,role:string) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.SHARED_AUTH.VERIFY_OTP(role), { 
      email, 
      otp: otpCode 
    });
    return data;
  },
}