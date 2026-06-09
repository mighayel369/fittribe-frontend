import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { getSocket } from '../utils/socket';
import { ChatService } from '../services/shared/chat.service';

export const useChat = (chatId?: string, receiverId?: string, search: string = "", onNewChatEstablished?: (newChatId: string) => void) => {
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
                setChatList(listResponse.data);

                if (chatId) {
                    const messageResponse = await ChatService.getMessage(chatId, role);
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

                const isDirectMatch = receiverId && (
                    (data.senderId === receiverId && data.receiverId === user.id) ||
                    (data.senderId === user.id && data.receiverId === receiverId)
                );

                if (isCurrentChat || isDirectMatch) {
                    if (!chatId && data.chatId && onNewChatEstablished) {
                        onNewChatEstablished(data.chatId);
                    }

                    setMessages((prev) => {
                        if (prev.some((m) => m.messageId === data.messageId)) return prev;
                        return [...prev, data];
                    });
                }
                setChatList((prev) => {
                    const index = prev.findIndex(item =>
                        (data.chatId && item.chatId === data.chatId) ||
                        (item.user && item.user.userId === data.senderId) ||
                        (item.user && item.user.userId === data.receiverId)
                    );

                    if (index !== -1) {
                        const updatedList = [...prev];
                        const targetChat = { ...updatedList[index] };

                        targetChat.message = {
                            messageId: data.messageId,
                            chatId: data.chatId,
                            senderId: data.senderId,
                            type: data.type || "text",
                            content: data.content || "",
                            file: data.file,
                            isRead: data.isRead || false,
                            isActive: data.isActive || true,
                            createdAt: data.createdAt || new Date().toISOString()
                        };

                        if (!isCurrentChat && data.senderId !== user.id) {
                            targetChat.unreadCount = (targetChat.unreadCount || 0) + 1;
                        }

                        updatedList[index] = targetChat;

                        const [movedRow] = updatedList.splice(index, 1);
                        return [movedRow, ...updatedList];
                    }

                    return prev;
                });
            });

            return () => {
                socket.off("message_received");
            };
        }
    }, [user?.id, accessToken, chatId, receiverId]);

    useEffect(() => {
        if (user?.id && accessToken && chatId) {
            const socket = getSocket(user.id);

            socket.emit("join_chat_room", chatId);

            return () => {
                socket.emit("leave_chat_room", chatId);
            };
        }
    }, [chatId, user?.id, accessToken]);

    const sendMessage = (text: string, fileData?: { url: string; type: string, name: string, size: number }) => {
        if (!text.trim() && !fileData) return;
        if ((!chatId && !receiverId) || !user?.id) return;

        const socket = getSocket(user.id);
        const newMessage = {
            chatId: chatId || undefined,
            receiverId: receiverId,
            content: text.trim() || "",
            type: fileData ? fileData.type : "text",
            file: fileData ? {
                url: fileData.url,
                mimeType: fileData.type,
                name: fileData.name,
                size: fileData.size
            } : undefined
        };
        socket.emit('send_message', newMessage);
    };

    return { messages, chatList, sendMessage, loading };
};