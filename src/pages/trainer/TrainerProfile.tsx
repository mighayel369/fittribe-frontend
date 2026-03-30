import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import { useEffect, useState } from "react";
import { InfoItem } from "../../components/InfoItem";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import GenericTable from "../../components/GenericTable";
import { TrainerWalletColumns } from "../../constants/TableColumns/TrainerWalletColumn";
import {
  FaMapMarkerAlt,
  FaDumbbell,
  FaStar,
  FaClock,
  FaCamera,
  FaWallet
} from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { WalletService } from "../../services/shared/wallet.service";
import { TrainerProfileService } from "../../services/trainer/trainer.profile";
import DEFAULT_IMAGE from '../../assets/default image.png'


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
  useEffect(() => {
    document.title = "FitTribe | Profile";
  }, []);

  const handleReapply = () => {
    navigate("/trainer/trainer-profile/re-apply");
  };
  const handleEditProfile = () => {
    navigate("/trainer/trainer-profile/edit-profile");
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
      const res = await WalletService.fetchWalletData('trainer',page,5);
      if (res?.success) {
        const {balance,data,total,activeHoldCount}=res.wallet
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
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600">
                Settings will be available soon.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};



export default TrainerProfile;
