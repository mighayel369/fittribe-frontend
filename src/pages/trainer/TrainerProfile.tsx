import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import { useEffect, useState } from "react";
import { InfoItem } from "../../components/InfoItem";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import GenericTable from "../../components/GenericTable";
import { TrainerWalletColumns } from "../../constants/TableColumns/TrainerWalletColumn";
import { FaLock, FaArrowRight, FaHistory, FaCog } from "react-icons/fa";
import {
  FaMapMarkerAlt,
  FaDumbbell,
  FaStar,
  FaClock,
  FaCamera,
  FaWallet
} from "react-icons/fa";
import Toast from "../../components/Toast";
import { MdWork } from "react-icons/md";
import { WalletService } from "../../services/shared/wallet.service";
import { TrainerProfileService } from "../../services/trainer/trainer.profile";
import DEFAULT_IMAGE from '../../assets/default image.png'
import { type ValidationErrors } from "../../validations/ValidationErrors";
import { type changePassword } from "../../types/changePasswordType";
import { validatePasswordChange } from "../../validations/validatePassword";
const TrainerProfile = () => {
  const navigate = useNavigate()
  const [trainer, setTrainer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"wallet" | "settings">("wallet");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletTransaction, setWalletTransactions] = useState<any[]>([]);
  const [activeHoldCount, setActiveHoldCount] = useState<number>(0);
  const [walletLoading, setWalletLoading] = useState(false);
  const walletColumns = TrainerWalletColumns(navigate);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<any>({});
  useEffect(() => {
    document.title = "FitTribe | Profile";
  }, []);

  const handleReapply = () => {
    navigate("/trainer/trainer-profile/re-apply");
  };
  const handleEditProfile = () => {
    navigate("/trainer/trainer-profile/edit-profile");
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

      const res = await TrainerProfileService.changePassword({
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

  useEffect(() => {
    const fetchTrainerProfile = async () => {
      try {
        const res = await TrainerProfileService.getProfile();
        console.log(res);
        setTrainer(res?.trainer || null);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTrainerProfile();
  }, []);
  useEffect(() => {
    if (activeTab === "wallet") {
      fetchWallet();
    }
  }, [page, activeTab]);

  const fetchWallet = async () => {
    try {
      setWalletLoading(true);
      const res = await WalletService.fetchWalletData('trainer', page, 5);
      if (res?.success) {
        const { balance, data, total, activeHoldCount } = res.wallet
        setWalletTransactions(data);
        setTotalPages(total);
        setWalletBalance(balance)
        setActiveHoldCount(activeHoldCount)
      }
    } catch (err) {
      console.error("Failed to fetch trainer wallet", err);
    } finally {
      setWalletLoading(false);
    }
  };



  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await TrainerProfileService.updateAvatar(formData)
      console.log(res)
      setTrainer((prev: any) => ({
        ...prev,
        profilePic: res.data?.imageUrl
      }))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerTopBar />
      <TrainerSideBar />

      <main className="ml-72 pt-24 px-10">
              {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}
        <h1 className="text-4xl font-bold mb-10 text-gray-800">Profile</h1>

        {trainer ? (
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-10 flex gap-10">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={trainer.profilePic || DEFAULT_IMAGE}
                  alt="Trainer"
                  className="w-60 h-60 object-cover rounded-full shadow-lg"
                />


                <label
                  htmlFor="profilePicUpload"
                  className={`absolute bottom-2 right-4 p-2 rounded-full shadow-lg transition
    ${trainer.verified !== "accepted"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    }`}
                >
                  <FaCamera className="text-white text-lg" />
                </label>


                <input
                  type="file"
                  id="profilePicUpload"
                  accept="image/*"
                  className="hidden"
                  disabled={trainer.verified !== "accepted"}
                  onChange={handleProfilePicChange}
                />
              </div>

              <button
                className="mt-6 px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  trainer.verified === "pending" ||
                  trainer.verified === "rejected"
                }
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>

              {trainer.verified === "rejected" && (
                <button className="mt-3 px-5 py-2 bg-red-500 text-white font-semibold rounded-xl shadow hover:bg-red-600 transition" onClick={handleReapply}>
                  Reapply
                </button>
              )}
            </div>


            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">
                {trainer.name || "Not added"}
              </h2>
              <p className="text-gray-600 flex items-center mt-2">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                {trainer.address || "Not added"}
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                {trainer.bio || "No bio added yet."}
              </p>

              <div className="mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${trainer.verified === "accepted"
                    ? "bg-green-100 text-green-700"
                    : trainer.verified === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {trainer.verified}
                </span>
              </div>

              {trainer.verified === "rejected" && (
                <p className="mt-3 text-red-600 font-medium">
                  Reason: {trainer.rejectReason || "No reason provided"}
                </p>
              )}

              <div className="grid grid-cols-2 gap-6 mt-8">
                <InfoItem
                  icon={<MdWork className="text-blue-600 text-xl" />}
                  label="Experience"
                  value={trainer.experience || "Not added"}
                />
                <InfoItem
                  icon={<FaDumbbell className="text-blue-600 text-xl" />}
                  label="Programs"
                  value={
                    trainer.programs?.length
                      ? trainer.programs.map((s: any) => s.name).join(", ")
                      : "Not added"
                  }
                />

                <InfoItem
                  icon={<FaStar className="text-yellow-500 text-xl" />}
                  label="Rating"
                  value={trainer.rating || "0"}
                />
                <InfoItem
                  icon={<FaClock className="text-blue-600 text-xl" />}
                  label="Availability"
                  value={
                    trainer.status ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Not Active</span>
                    )
                  }
                />
                <InfoItem
                  icon={<FaDumbbell className="text-blue-600 text-xl" />}
                  label="Languages"
                  value={
                    trainer.languages?.length
                      ? trainer.languages.join(", ")
                      : "Not added"
                  }
                />
                <InfoItem
                  icon={<FaDumbbell className="text-blue-600 text-xl" />}
                  label="Price / Session"
                  value={
                    trainer.pricePerSession
                      ? `₹${trainer.pricePerSession}`
                      : "Not added"
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading profile...</p>
        )}

        <div className="max-w-6xl mx-auto mt-10">
          <div className="flex gap-8 border-b mb-6">
            {["wallet", "settings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 font-semibold capitalize ${activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "wallet" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex">
                <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden min-w-[300px]">
                  <div className="relative z-10">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                      Total Balance
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-medium text-gray-400">₹</span>
                      <h2 className="text-3xl font-black">{walletBalance}</h2>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-green-400 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      WITHDRAWABLE
                    </div>
                  </div>
                  <FaWallet className="absolute -right-2 -bottom-2 text-gray-800 text-7xl opacity-30" />
                </div>
              </div>
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
                    Earnings Log
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {walletTransaction.length} Transactions
                  </span>
                </div>

                <GenericTable
                  data={walletTransaction}
                  columns={walletColumns}
                  page={page}
                  loading={walletLoading}
                  emptyMessage="No earnings recorded yet."
                />

                {totalPages >= 1 && (
                  <div className="p-4 border-t border-gray-50  bg-gray-50/10">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[420px]">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Account Settings</h3>
                <p className="text-gray-500 text-sm font-medium">Manage your security and preferences</p>
              </div>

              <div className="border border-gray-100 rounded-[1.5rem] overflow-hidden bg-gray-50/50 shadow-sm">
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

              <div className="border border-gray-100 rounded-[1.5rem] overflow-hidden bg-white shadow-sm">
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
};



export default TrainerProfile;
