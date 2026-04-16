


import axiosInstance from "../../api/AxiosInstance"
import { API_ENDPOINTS } from "../../api/endPoints"


export const adminReviewService={
    flagReview:async(reviewId:string)=>{
        const {data}=await axiosInstance.get(API_ENDPOINTS.REVIEW.FLAG_REVIEW(reviewId))
        return data
    }
}