import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const TrainerLeaveManagementService = {
    applyForLeave: async (formData: FormData) => {
        const { data } = await axiosInstance.post(
            API_ENDPOINTS.TRAINER_LEAVES.APPLY,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );
        return data;
    },

    getLeaveistory: async (page: number, search: string) => {
        const { data } = await axiosInstance.get(API_ENDPOINTS.TRAINER_LEAVES.HISTORY, {
            params: { pageNo: page, search }
        });
        return data;
    },

    getLeaveMtrics: async () => {
        const { data } = await axiosInstance.get(API_ENDPOINTS.TRAINER_LEAVES.METRICS);
        return data;
    },

    withdrawLeave:async(leaveId:string)=>{
        const {data}=await axiosInstance.patch(API_ENDPOINTS.TRAINER_LEAVES.WITHDRAW_REQUEST(leaveId))
        return data
    }
};