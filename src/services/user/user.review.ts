import axiosInstance from "../../api/AxiosInstance"
import { API_ENDPOINTS } from "../../api/endPoints"


export const userReviewService={
    addReview:async(payload:any)=>{
        const {data}=await axiosInstance.post(API_ENDPOINTS.REVIEW.ADD_REVIEW,payload)
        return data
    }
}