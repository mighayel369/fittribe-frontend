import UserNavBar from "../../layout/UserNavBar";
import React, { useEffect, useState } from "react";
import GenericTable from "../../components/GenericTable";
import Pagination from "../../components/Pagination";
import { UserWalletColumns } from "../../constants/TableColumns/UserWalletColumns";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaCalendarAlt,
  FaWallet,
  FaHistory,
  FaCog,
  FaCamera,
  FaArrowRight,
  FaLock
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Toast from "../../components/Toast";
import { type ValidationErrors } from "../../validations/ValidationErrors";
import { type changePassword } from "../../types/changePasswordType";
import { validatePasswordChange } from "../../validations/validatePassword";
import DEFAULT_IMAGE from '../../assets/default image.png'
import { WalletService } from "../../services/shared/wallet.service";
import { UserProfileService } from "../../services/user/user.profile";
import type { User } from "../../types/userType";
import { AuthService } from "../../services/shared/auth.service";
import { useChat } from "../../hooks/useChat";
import { formatChatTime } from "../../helperFunctions/formatdate";
import { ChatService } from "../../services/shared/chat.service";
const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>("wallet");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletTransaction, setWalletTransactions] = useState<any[]>([]);
  const [activeHoldCount, setActiveHoldCount] = useState<number>(0);
  const [walletLoading, setWalletLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [passwordErrors, setPasswordErrors] = useState<ValidationErrors<changePassword>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState<boolean>(false);

  const { chatList, loading } = useChat();
  const walletCoulmns = UserWalletColumns(navigate)
  useEffect(() => {
    document.title = "FitTribe | My Account";
    getUserData();
  }, []);

  useEffect(() => {
    if (activeTab === "wallet") {
      fetchWalletData();
    }
  }, [page, activeTab]);

  const getUserData = async () => {
    try {
      const res = await UserProfileService.getProfile();
      if (res.success) setUser(res.userData);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const fetchWalletData = async () => {
    try {
      setWalletLoading(true);
      const res = await WalletService.fetchWalletData('user', page, 5);
      if (res?.success) {
        const { balance, data, total, activeHoldCount } = res.wallet
        setWalletTransactions(data);
        setTotalPages(total);
        setWalletBalance(balance)
        setActiveHoldCount(activeHoldCount)
      }
    } catch (error) {
      console.error("Error fetching wallet data", error);
    } finally {
      setWalletLoading(false);
    }
  };

const handleChatClick = async (chat: any) => {
  try {
    if (chat.unReadCount > 0) {
      await ChatService.markAsRead('user', chat.chatId);
    }
    
    navigate(`/chat/${chat.id}/${chat.chatId}`);
  } catch (error) {
    navigate(`/chat/${chat.id}/${chat.chatId}`);
  }
};
  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("profilePic", file);
      const res = await UserProfileService.updateProfile(formData);
      if (res.success) {
        setUser((prev: any) => ({ ...prev, profilePic: res.data?.imageUrl }));
        setToastType("success");
        setToastMessage(res.message);
      }
    } catch (err: any) {
      let errMesg = err.response?.data?.message
      setToastMessage(errMesg)
      setToastType('error')
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: ValidationErrors<changePassword> = validatePasswordChange(passwordData);
    console.log(passwordData)
    setPasswordErrors(validationErrors);
    console.log(validationErrors)
    console.log(passwordErrors)
    if (Object.keys(validationErrors).length > 0) return;
    try {
      setPasswordLoading(true);

      const res = await AuthService.changePassword('user', {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      console.log(res)
      if (res.success) {
        setToastType("success");
        setToastMessage(res.message ?? "Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setIsPasswordOpen(false);
      }
    } catch (error: any) {
      console.log(error)
      setToastType("error");
      setToastMessage(error.response.data.message ?? "An error occurred. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabs = [
    { id: "schedule", label: "My Schedule", icon: <FaCalendarAlt /> },
    { id: "wallet", label: "Wallet", icon: <FaWallet /> },
    { id: "chat", label: "Chat History", icon: <FaEnvelope /> },
    { id: "history", label: "Booking History", icon: <FaHistory /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <UserNavBar />
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="w-44 h-44 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-gray-100">
                <img src={user?.profilePic || DEFAULT_IMAGE} className="w-full h-full object-cover" alt="Profile" />
              </div>
              <label htmlFor="profilePicUpload" className="absolute bottom-2 right-2 bg-red-600 p-3 rounded-full cursor-pointer shadow-lg hover:bg-red-700 transition-all transform hover:scale-110">
                <FaCamera className="text-white" />
                <input type="file" id="profilePicUpload" className="hidden" onChange={handleProfilePicChange} />
              </label>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black text-gray-900 mt-1">{user?.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-gray-500 text-sm">
                <span className="flex items-center gap-2"><FaEnvelope className="text-red-400" /> {user?.email}</span>
                {user?.phone && <span className="flex items-center gap-2"><FaPhone className="text-red-400" /> {user?.phone}</span>}
                {user?.address && <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-400" /> {user?.address}</span>}
              </div>
              <span className="text-md">{user?.gender}</span>
            </div>

            <div className="bg-gray-900 text-white rounded-3xl p-6 min-w-[200px] text-center shadow-2xl shadow-gray-200">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Wallet Balance</p>
              <h2 className="text-3xl font-black">₹{walletBalance}</h2>
              <button onClick={() => setActiveTab("wallet")} className="mt-3 text-[10px] font-bold text-red-500 flex items-center gap-2 mx-auto hover:text-red-400">
                VIEW TRANSACTIONS <FaArrowRight />
              </button>
            </div>

            <button onClick={() => navigate("/profile/edit")} className="p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
              <FaEdit className="text-xl" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold text-sm transition-all ${activeTab === tab.id
                ? "bg-red-600 text-white shadow-lg shadow-red-200"
                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 min-h-[400px] animate-in fade-in slide-in-from-bottom-4">

          {activeTab === "wallet" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Holds</p>
                  <h4 className="text-3xl font-black mt-1 text-orange-500">
                    {activeHoldCount}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1 italic">Funds locked for pending sessions</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-red-600 text-white rounded-lg text-sm"><FaHistory /></div>
                    Transaction Log
                  </h3>
                </div>

                <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                  <GenericTable
                    data={walletTransaction}
                    columns={walletCoulmns}
                    page={page}
                    loading={walletLoading}
                    emptyMessage="No transactions found for your account."
                  />
                  {totalPages >= 1 && (
                    <div className="p-6 border-t border-gray-50">
                      <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="text-center py-20">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-3xl text-blue-500" />
              </div>
              <h3 className="text-xl font-bold">Coming Up Next</h3>
              <p className="text-gray-500 mt-2">No training sessions scheduled for today.</p>
              <button onClick={() => navigate('/trainers')} className="mt-6 text-red-600 font-bold hover:underline">Find a Trainer</button>
            </div>
          )}
          {activeTab === "chat" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Messages</h3>
                <p className="text-gray-500 text-sm font-medium">Recent conversations with your trainers</p>
              </div>

              <div className="grid gap-3">
                {chatList.length > 0 ? (
                  chatList.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatClick(chat)}
                      className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-[1.5rem] hover:border-red-100 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="relative shrink-0">
                        {chat.profilePic ? (
                          <img
                            src={chat.profilePic}
                            alt={chat.name}
                            className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center font-bold text-red-600 text-lg border border-red-100">
                            {chat.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                      </div>


                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                            {chat.name}
                          </h4>

                          <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap ml-2">
                            {formatChatTime(chat.lastMessageTime)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center gap-4">
                          <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                            {chat.lastMessage || "No messages yet"}
                          </p>


                          <div className="flex items-center gap-2 shrink-0">
                            {chat.unReadCount > 0 && (
                              <span className="bg-green-500 text-white text-[8px] font-bold  rounded-full min-w-[14px] h-[14px] flex items-center justify-center">
                                {chat.unReadCount}
                              </span>
                            )}
                            <FaArrowRight size={10} className="text-gray-300 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (

                  <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <FaEnvelope className="text-2xl text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-medium">No conversations yet.</p>
                    <button
                      onClick={() => navigate('/trainers')}
                      className="mt-4 text-sm font-bold text-red-600 hover:text-red-700 underline-offset-4 hover:underline"
                    >
                      Browse Trainers
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "history" && <p className="text-gray-500 italic">No previous booking history found.</p>}

          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-4">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Account Settings</h3>
                <p className="text-gray-500 text-sm font-medium">Manage your security and preferences</p>
              </div>

              <div className="border border-gray-100 rounded-[1.5rem] overflow-hidden bg-gray-50/50">
                <button
                  onClick={() => setIsPasswordOpen(!isPasswordOpen)}
                  className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors border-b border-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <FaLock className="text-sm" />
                    </div>
                    <span className="font-bold text-gray-800">Password & Security</span>
                  </div>
                  <FaArrowRight className={`text-gray-300 text-xs transition-transform duration-300 ${isPasswordOpen ? 'rotate-90' : ''}`} />
                </button>

                {isPasswordOpen && (
                  <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-300">
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Password</label>
                        <input
                          type="password"
                          required
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500/10 focus:outline-none"
                          placeholder="••••••••"
                        />
                        {passwordErrors.currentPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {passwordErrors.currentPassword}
                          </p>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">New Password</label>
                          <input
                            type="password"
                            required
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500/10 focus:outline-none"
                            placeholder="••••••••"
                          />
                          {passwordErrors.newPassword && (
                            <p className="text-red-500 text-xs mt-1">
                              {passwordErrors.newPassword}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Confirm New</label>
                          <input
                            type="password"
                            required
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-red-500/10 focus:outline-none"
                            placeholder="••••••••"
                          />
                          {passwordErrors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">
                              {passwordErrors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
                      >
                        {passwordLoading ? "Updating..." : "Save New Password"}
                      </button>
                    </form>
                  </div>
                )}
              </div>

              <div className="border border-gray-100 rounded-[1.5rem] overflow-hidden bg-white">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FaCog className="text-sm" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm">Email Notifications</span>
                      <span className="text-[10px] text-gray-400 font-medium tracking-tight">Receive updates about your sessions</span>
                    </div>
                  </div>
                  <input type="checkbox" className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-red-600 transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-3 after:h-3 after:rounded-full after:transition-all checked:after:translate-x-5 shadow-inner" />
                </div>
              </div>

              <div className="border border-gray-100 rounded-[1.5rem] overflow-hidden bg-white">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                      <FaHistory className="text-sm" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm">Privacy Mode</span>
                      <span className="text-[10px] text-gray-400 font-medium tracking-tight">Hide profile from public search</span>
                    </div>
                  </div>
                  <input type="checkbox" className="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-red-600 transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-3 after:h-3 after:rounded-full after:transition-all checked:after:translate-x-5 shadow-inner" />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfile;