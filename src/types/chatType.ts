export interface ChatList {
    id: string;
    name: string;
    profilePic: string;
    lastMessage: MessageType;
    lastMessageTime: string;
    unReadCount: number;
    chatId: string;
}

export interface MessageType {
    sender: string;
    date: string;
    chatId: string;
    type: string
    content?: string;
    file?: {
        url: string;
        mimeType: string;
        size: number;
        name: string
    };
}

export interface NonChatList {
    name: string,
    email: string,
    profilePic: string,
    id: string
}