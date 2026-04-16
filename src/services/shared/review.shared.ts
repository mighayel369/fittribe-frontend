import axiosInstance from "../../api/AxiosInstance"
import { API_ENDPOINTS } from "../../api/endPoints"


export const sharedReviewService={
    getReviewList:async(role:string)=>{
        const {data}=await axiosInstance.get(API_ENDPOINTS.REVIEW.GET_REVIEWS(role))
        return data
    }
}