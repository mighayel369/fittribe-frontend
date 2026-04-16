export interface ChatList{
    id:string;
    name: string;
    profilePic: string;
    lastMessage: string;
    lastMessageTime: string;
    unReadCount: number;
    chatId: string;
}

export interface NonChatList{
    name:string,
    email:string,
    profilePic:string,
    id:string
}