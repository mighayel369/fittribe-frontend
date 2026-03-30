
import { FaCheck } from 'react-icons/fa';

interface Notification {
  _id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface Props {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const NotificationDropdown = ({ notifications, onMarkAsRead, onMarkAllAsRead, onClose }: Props) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-[10px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="h-[250px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-xs text-gray-400">No new notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`group relative px-4 py-4 transition-all hover:bg-gray-50/80 ${!notif.isRead ? "bg-blue-50/10 border-l-4 border-l-blue-500" : "border-l-4 border-l-transparent"
                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[12px] font-bold text-gray-900 pr-6">{notif.title}</span>
                <span className="text-[9px] text-gray-400 whitespace-nowrap">
                  {notif.time}
                </span>
              </div>

              <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed mb-2">
                {notif.message}
              </p>
              <div className='flex justify-end '>
                {!notif.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notif._id);
                    }}
                    className="flex items-center  gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <FaCheck size={8} />
                    Mark as read
                  </button>
                )}
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-gray-100" />
            </div>

          ))
        )}
      </div>

      <div className="h-2 bg-gray-50/50"></div>
    </div>
  );
};

export default NotificationDropdown;