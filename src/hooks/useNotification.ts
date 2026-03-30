import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { getSocket} from '../utils/socket';
import { NotificationService } from '../services/shared/notification.service';

export const useNotification=()=>{
   const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, accessToken,role } = useAppSelector((state) => state.auth);
useEffect(() => {
    if(!role) return
    const fetchHistory = async () => {
      if (user?.id && accessToken) {
        try {
          const res = await NotificationService.GETALL(role);
          console.log(res)
          setNotifications(res);
          
          const unread = res.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        } catch (err) {
          console.error("Failed to load notification history", err);
        }
      }
    };

    fetchHistory();
  }, [user?.id, accessToken]);
  useEffect(()=>{
    if(user?.id && accessToken){
        const socket=getSocket(user.id)
        socket.on('notification_received',(data:any)=>{
            setNotifications((prev) => [data, ...prev]);
            setUnreadCount((prev) => prev + 1);
        })

        return ()=>{
            socket.off('notification_received')
        }
    }
  },[user?.id, accessToken])

  const markAsRead = async (id: string) => {
    if (!role) return;

    setNotifications(prev => 
      prev.map(n => n._id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await NotificationService.MARK_AS_READ(role, id);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    if (!role) return;

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await NotificationService.MARK_ALL_AS_READ(role); 
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };
  const clearUnread = () => setUnreadCount(0);

  return { notifications, unreadCount, clearUnread ,markAllAsRead,markAsRead};
}