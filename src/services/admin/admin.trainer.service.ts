import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const AdminTrainerService = {
  getVerifiedTrainers: async (page: number, search: string, filters?: any) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_MGMT.TRAINERS.LIST_VERIFIED, {
      params: { pageNO: page, search, ...filters },
    });
    return data;
  },

  updateTrainerStatus: async (trainerId: string, newStatus: boolean) => {
    const { data } = await axiosInstance.patch(
      API_ENDPOINTS.ADMIN_MGMT.TRAINERS.UPDATE_STATUS, 
      { status: newStatus,trainerId }
    );
    return data;
  },

  getTrainerDetails: async (id: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_MGMT.TRAINERS.GET_DETAILS(id));
    return data;
  },
  handleTrainerApproval: async (id: string, selectedAction: string, reason?: string) => {
    const { data } = await axiosInstance.patch(
      API_ENDPOINTS.ADMIN_MGMT.TRAINERS.VERIFY_ACTION, 
      { action: selectedAction, reason ,traainerId:id}
    );
    return data;
  },

  getPendingTrainers: async (page: number, search: string, filters?: any) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_MGMT.TRAINERS.LIST_PENDING, {
      params: { pageNO: page, search, ...filters },
    });
    return data;
  },
};