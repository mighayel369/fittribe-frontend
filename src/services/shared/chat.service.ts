import axiosInstance from "../../api/AxiosInstance"
import { API_ENDPOINTS } from "../../api/endPoints"

export const ChatService = {
  getChatLists: async (role:string) => {
    console.log(role,'chatlist role')
    const { data } = await axiosInstance.get(API_ENDPOINTS.CHAT.CHAT_LIST(role));
    return data; 
  },
    getNonChatLists: async (role:string) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.CHAT.NON_CHAT_LIST(role));
    return data; 
  },

  getMessage:async(chatId:string,role:string)=>{
    const {data}=await axiosInstance.get(API_ENDPOINTS.CHAT.FETCH_MESSAGES(role,chatId))
    return data
  },
  checkExistingChat:async(id:string,role:string)=>{
    const {data}=await axiosInstance.get(API_ENDPOINTS.CHAT.GET_CHAT_ID(role,id))
    return data
  },
  markAsRead:async(role:string,chatId:string)=>{
    const {data}=await axiosInstance.patch(API_ENDPOINTS.CHAT.MARK_AS_READ(role,chatId))
    return data
  }
}