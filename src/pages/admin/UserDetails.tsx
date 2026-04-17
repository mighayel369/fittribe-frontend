import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEnvelope, FaCalendarAlt, FaVenusMars,
  FaBirthdayCake, FaArrowLeft, FaShieldAlt, FaPhone, FaMapMarkerAlt
} from "react-icons/fa";
import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import { AdminUserService } from "../../services/admin/admin.user.service";
import Loading from "../../components/Loading";
import NotFound from "../../components/NotFound";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import SubmitButton from "../../components/SubmitButton";
import DEFAULT_IMAGE from '../../assets/default image.png'
import {type User } from "../../types/userType";
const UserDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

  useEffect(() => {
    document.title = "FitTribe | User Profile";
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await AdminUserService.getUserDetails(id);
      setUser(response.user);
    } catch (error:any) {
        const errorMsg = error.response?.data?.message || "Failed to fetch user datas";
      setToast({ message: errorMsg, type: "error" });    
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockStatus = async () => {
    if (!user || actionLoading) return;

    setActionLoading(true);
    setShowStatusModal(false);

    try {
      const result = await AdminUserService.updateUserStatus(user.userId, !user.status);

      if (result.success) {
        setUser((prev: any) => ({ ...prev, status: result.newStatus }));
        setToast({ message: result.message, type: "success" });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Status update failed";
      setToast({ message: errorMsg, type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading message="Loading member profile..." />;
  if (!user) return <NotFound/>;

  return (
    <>
      <AdminTopBar />
      <AdminSideBar />

      <main className="ml-64 mt-16 p-8 bg-[#F8FAFC] min-h-screen">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        <Modal
          isVisible={showStatusModal}
          onCancel={() => setShowStatusModal(false)}
          onConfirm={toggleBlockStatus}
          title={user.status ? "Block User Account" : "Unblock User Account"}
          message={`Are you sure you want to ${user.status ? "restrict" : "restore"} access for ${user.name}?`}
        />

        <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium"
          >
            <FaArrowLeft /> Back to List
          </button>
          <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
            user.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {user.status ? "Account Active" : "Account Blocked"}
          </span>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-gray-100">
                <img src={user.profilePic || DEFAULT_IMAGE} className="w-full h-full object-cover" alt="Profile" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">Administrative View</span>
                <h1 className="text-4xl font-black text-gray-900 mt-1">{user.name}</h1>
                <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-2">
                  <FaEnvelope className="text-gray-400" /> {user.email}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><FaCalendarAlt /></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 leading-none">Joined On</p>
                      <p className="font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><FaShieldAlt /></div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 leading-none">Role</p>
                      <p className="font-semibold capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-6 bg-blue-600 rounded-full" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <InfoRow icon={<FaVenusMars />} label="Gender" value={user.gender} />
                <InfoRow icon={<FaBirthdayCake />} label="Age" value={user.age ? `${user.age} Years` : "N/A"} />
                <InfoRow icon={<FaPhone />} label="Phone" value={user.phone} />
                <InfoRow icon={<FaMapMarkerAlt />} label="Address" value={user.address} />
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-6 bg-orange-500 rounded-full" />
                Fitness Insights
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                  <p className="text-[10px] font-bold text-orange-400 uppercase">Goal</p>
                  <p className="text-sm font-black text-orange-700">Athletic Body</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Weight</p>
                  <p className="text-sm font-black text-blue-700">60</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medical Notes</span>
                  <span className="text-xs font-bold text-gray-700">{"None Reported"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience</span>
                  <span className="text-xs font-bold text-gray-700 capitalize">{"Beginner"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-1 flex items-center gap-3">
                  <div className="w-2 h-6 bg-red-600 rounded-full" />
                  Account Security
                </h3>
                <p className="text-sm text-gray-500 font-medium">Manage access permissions for this user.</p>
              </div>

              <div className="w-full md:w-auto text-center space-y-2">
                <div className="min-w-[200px]">
                   <SubmitButton 
                    type="button"
                    text={user.status ? 'Block Account' : 'Unblock Account'} 
                    loading={actionLoading}
                    onClick={() => setShowStatusModal(true)} 
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium">
                  Status changes will take effect immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

const InfoRow = ({ icon, label, value }: { icon: any, label: string, value: any }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-3">
      <span className="text-gray-400">{icon}</span>
      <span className="text-sm font-bold text-gray-400 uppercase tracking-tight">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-800">{value ?? "N/A"}</span>
  </div>
);

export default UserDetails;