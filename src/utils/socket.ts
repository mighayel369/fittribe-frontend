import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let currentUserId: string | null = null;

export const getSocket = (userId: string) => {
 
  if (socket && currentUserId !== userId) {
    socket.disconnect();
    socket = null;
  }

  if (!socket) {
    socket = io("http://localhost:5000", {
      query: { userId },
      reconnection: true,
      transports: ["websocket"]
    });
    currentUserId = userId;
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentUserId = null;
  }
};