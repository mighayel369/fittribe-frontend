import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { getSocket } from '../utils/socket';
import { ChatService } from '../services/shared/chat.service';



export const useChat = (chatId?: string, receiverId?: string, search: string = "") => {
    const [messages, setMessages] = useState<any[]>([]);
    const [chatList, setChatList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { user, accessToken, role } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const fetchChatData = async () => {
            if (!user?.id || !role) return;
            setLoading(true);

            try {
                const listResponse = await ChatService.getChatLists(role, search);
                console.log(listResponse)
                setChatList(listResponse.data);

                if (chatId) {
                    const messageResponse = await ChatService.getMessage(chatId, role);
                    console.log(messageResponse)
                    setMessages(messageResponse.data);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error("Failed to fetch chat data:", error);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchChatData();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [user?.id, chatId, role, search]);

    useEffect(() => {
        if (user?.id && accessToken) {
            const socket = getSocket(user.id);

            socket.on('message_received', (data: any) => {
                const isCurrentChat = chatId && data.chatId === chatId;
                const isNewChatFromTarget = !chatId && receiverId && data.sender === receiverId;

                if (isCurrentChat || isNewChatFromTarget) {
                    setMessages((prev) => [...prev, data]);
                }

                setChatList((prev) => {
                    const index = prev.findIndex(chat =>
                        (data.chatId && chat.chatId === data.chatId) ||
                        chat.id === data.sender
                    );

                    if (index !== -1) {
                        const updatedList = [...prev];
                        const targetChat = { ...updatedList[index] };

                        targetChat.lastMessage = {
                            content: data.content || "",
                            type: data.type || "text",
                            file: data.file ? {
                                url: data.file.url,
                                mimeType: data.file.mimeType || data.type,
                                name: data.file.name || "Attachment",
                                size: data.file.size || 0
                            } : undefined
                        };

                        targetChat.lastMessageTime = new Date();
                        if (!isCurrentChat && !isNewChatFromTarget) {
                            targetChat.unreadCount = (targetChat.unreadCount || 0) + 1;
                        }

                        updatedList[index] = targetChat;

                        const [updatedChatRow] = updatedList.splice(index, 1);
                        return [updatedChatRow, ...updatedList];
                    }

                    return prev;
                });
            });

            return () => {
                socket.off("message_received");
            };
        }
      
    }, [user?.id, accessToken, chatId, receiverId]);

    const sendMessage = (text: string, fileData?: { url: string; type: string, name: string, size: number }) => {
        if (!text.trim() && !fileData) return;
        if ((!chatId && !receiverId) || !user?.id) return;
        console.log(fileData)
        const socket = getSocket(user.id);
        const newMessage = {
            sender: user.id,
            chatId: chatId || undefined,
            receiverId: receiverId,
            content: text.trim() || "",
            type: fileData ? fileData.type : "text",
            file: fileData ? {
                url: fileData.url,
                mimeType: fileData.type,
                name: fileData.name,
                size: fileData.size
            } : undefined,
            time: new Date()
        };
        console.log('new message', newMessage)

        socket.emit('send_message', newMessage);
        setMessages((prev) => [...prev, newMessage]);
    };

    return { messages, chatList, sendMessage, loading };
};