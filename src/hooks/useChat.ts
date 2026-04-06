import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { getSocket } from '../utils/socket';
import { ChatService } from '../services/shared/chat.service';


export const useChat = (chatId?: string, receiverId?: string) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [chatList, setChatList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { user, accessToken,role } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const fetchChatData = async () => {
          if (!user?.id || !role) return;
            setLoading(true);
            console.log(role)
            try {
                if (chatId) {
                    const response = await ChatService.getMessage(chatId,role)
                    setMessages(response.data);
                } else {
                    const response = await ChatService.getChatLists(role)
                    setChatList(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch chat data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChatData();
    }, [user?.id, chatId,role]);

    useEffect(() => {
        if (user?.id && accessToken) {
            const socket = getSocket(user.id);

            socket.on('message_received', (data: any) => {
                const isCurrentChat = chatId && data.chatId === chatId;
                const isNewChatFromTarget = !chatId && receiverId && data.senderId === receiverId;

                if (isCurrentChat || isNewChatFromTarget) {
                    setMessages((prev) => [...prev, data]);
                }

                setChatList((prev) => {
                    const index = prev.findIndex(chat => chat.chatId === data.chatId || chat.receiverId === data.senderId);
                    if (index !== -1) {
                        const updatedList = [...prev];
                        updatedList[index].lastMessage = data.content || data.text;
                        return updatedList;
                    }
                    return prev;
                });
            });

            return () => {
                socket.off("message_received");
            };
        }
    }, [user?.id, accessToken, chatId, receiverId]);

    const sendMessage = (text: string) => {
        if (!text.trim() || (!chatId && !receiverId) || !user?.id) return;

        const socket = getSocket(user.id);
        const newMessage = {
            senderId: user.id,
            chatId: chatId || null, 
            receiverId: receiverId,
            content: text,
            type: "text",
            time: new Date().toISOString()
        };

        socket.emit('send_message', newMessage);
        setMessages((prev) => [...prev, newMessage]);
    };

    return { messages, chatList, sendMessage, loading };
};