
import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const WalletService = {
  fetchWalletData: async (role: string, page: number, limit: number) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.WALLET.GET_MY_WALLET(role), {
      params: { 
        pageNo: page, 
        limit 
      }
    });
    return data;
  }
};