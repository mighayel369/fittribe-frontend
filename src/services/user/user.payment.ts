import { API_ENDPOINTS } from "../../api/endPoints";
import axiosInstance from "../../api/AxiosInstance";

export interface InitiatePaymentDTO {
  trainerId: string;
  programId: string;
  date: string;
  time: string;
  amount: number;
}

export interface VerifyPaymentDTO {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const UserPaymentService = {

  initiateCheckout: async (payload: InitiatePaymentDTO) => {
    const { data } = await axiosInstance.post(
      API_ENDPOINTS.USER_PAYMENTS.INITIATE, 
      payload
    );
    return data;
  },
  verifyTransaction: async (payload: VerifyPaymentDTO) => {
    const { data } = await axiosInstance.post(
      API_ENDPOINTS.USER_PAYMENTS.VERIFY, 
      payload
    );
    return data;
  }
};