import axiosInstance from "../../api/AxiosInstance";
import { API_ENDPOINTS } from "../../api/endPoints";

export const PublicTrainersService = {

    exploreTrainers: async (page: number, search: string, filters: any) => {
        const { data } = await axiosInstance.get(API_ENDPOINTS.DISCOVERY.TRAINERS.EXPLORE, {
            params: {
                pageNO: page,
                search: search,
                ...filters,
            },
        });
        return data;
    },

    getTrainerDetails: async (id: string) => {
        const { data } = await axiosInstance.get(API_ENDPOINTS.DISCOVERY.TRAINERS.DETAILS(id));
        return data;
    },

    getTrainerAvailability: async (date: Date,trainerId: string) => {
        const { data } = await axiosInstance.get(API_ENDPOINTS.DISCOVERY.TRAINERS.AVAILABILITY, {
            params: { trainerId, date }
        });
        return data;
    },
    getTrainerReviews:async(trainerId:string)=>{
        const {data}=await axiosInstance.get(API_ENDPOINTS.DISCOVERY.TRAINERS.REVIEW_LIST(trainerId))
        return data
    }
};