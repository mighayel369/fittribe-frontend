import { FaUserCircle } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { AuthService } from "../services/shared/auth.service";
import { clearAuth } from "../redux/slices/authSlice";
import NotificationDropdown from "../components/NotificationDropdown";
import { useNotification } from "../hooks/useNotification";

const TrainerTopBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { role, user } = useAppSelector((state) => state.auth);

  const {
    notifications,
    unreadCount,
    clearUnread,
    markAsRead,
    markAllAsRead
  } = useNotification();

  const handleLogout = async () => {
    await AuthService.logout(role || 'trainer');
    dispatch(clearAuth());
    navigate('/trainer/login');
  };

  const handleToggleNotif = () => {
    setShowNotif(!showNotif);
    if (!showNotif) {
      clearUnread();
    }
  };

  return (
    <nav className="bg-zinc-100 border border-gray-200 rounded-lg h-20 px-8 flex justify-between items-center fixed top-5 right-5 left-72 z-20 shadow-md">
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 w-64"
        />
      </div>

      <div className="flex items-center gap-6 text-2xl relative">

        <div className="relative cursor-pointer group" onClick={handleToggleNotif}>
          <IoIosNotifications className={`transition-colors ${unreadCount > 0 ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"}`} />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white items-center justify-center font-bold">
                {unreadCount}
              </span>
            </span>
          )}


          {showNotif && (
            <div className="absolute right-0 top-full mt-2">
              <NotificationDropdown
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onClose={() => setShowNotif(false)}
              />
            </div>
          )}
        </div>


        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="flex items-center gap-2 cursor-pointer group">
            <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-600 transition-colors">
              {user?.name || "Trainer"}
            </span>
            <FaUserCircle className="text-gray-600 group-hover:text-yellow-500 transition-all" />
          </div>

          <div className="relative">
            {showDropdown && (
              <div className="absolute right-0 w-32 bg-white text-gray-800 rounded shadow-lg z-20 text-sm border animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors rounded-b"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TrainerTopBar;