import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const AdminProgramService = {
  fetchProgramsInventory: async (page: number, search: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_MGMT.PROGRAMS.INVENTORY, {
      params: { pageNO: page, search }
    });
    return data;
  },

  toggleProgramVisibility: async (id: string, newStatus: boolean) => {
    const { data } = await axiosInstance.patch(API_ENDPOINTS.ADMIN_MGMT.PROGRAMS.TOGGLE_VISIBILITY, { 
      status: newStatus,
      programId:id
    });
    return data;
  },

  onboardNewProgram: async (formData: FormData) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.ADMIN_MGMT.PROGRAMS.ONBOARD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  getProgramDetails: async (id: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_MGMT.PROGRAMS.GET_DETAILS(id));
    return data;
  },

  archiveProgram: async (id: string) => {
    const { data } = await axiosInstance.delete(API_ENDPOINTS.ADMIN_MGMT.PROGRAMS.DELETE(id));
    return data;
  },

  modifyProgram: async (formData: FormData) => {
    const { data } = await axiosInstance.patch(API_ENDPOINTS.ADMIN_MGMT.PROGRAMS.UPDATE_SPECS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }
};