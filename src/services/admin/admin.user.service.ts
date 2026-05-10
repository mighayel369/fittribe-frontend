import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const AdminUserService = {
  fetchUsers: async (page: number, search: string, statusFilter: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_MGMT.USERS.GET_ALL, {
      params: { pageNO: page, search, status: statusFilter }
    });
    return data;
  },

  updateUserStatus: async (id: string, newStatus: boolean) => {
    const { data } = await axiosInstance.patch(
      API_ENDPOINTS.ADMIN_MGMT.USERS.TOGGLE_STATUS,
      { status: newStatus, userId: id }
    );
    return data;
  },

  getUserDetails: async (id: string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN_MGMT.USERS.GET_DETAILS(id));
    return data;
  },

  exportUsersPDF: async (range: string) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_MGMT.USERS.EXPORT_USER_PDF, {
      params: { range },
      responseType: 'blob'
    });
    console.log(response)
    return response.data;
  }
};