import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCheck, FaEnvelope, FaAward, FaLanguage, FaCertificate, FaClock, FaVenusMars, FaArrowLeft
} from "react-icons/fa";
import { DetailCard } from './../../components/DetailCard';
import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import Loading from "../../components/Loading";
import NotFound from "../../components/NotFound";
import { type AdminTrainerDetails } from "../../types/trainerType";
import SubmitButton from "../../components/SubmitButton";
import DEFAULT_IMAGE from '../../assets/default image.png'
import { AdminTrainerService } from "../../services/admin/admin.trainer.service";
const TrainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trainer, setTrainer] = useState<AdminTrainerDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [verifyAction, setVerifyAction] = useState<"accept" | "decline">("accept");
  const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

  useEffect(() => {
    document.title = "FitTribe | Trainer Profile";
    if (id) fetchTrainer();
  }, [id]);

  const fetchTrainer = async () => {
    try {
      setLoading(true);
      const response = await  AdminTrainerService.getTrainerDetails(id!);
      setTrainer(response.trainer);
    } catch (error:any) {
      setToast({ 
        message: error.response?.data?.message || "Verification failed", 
        type: "error" 
      })
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClick = (action: "accept" | "decline") => {
    setVerifyAction(action);
    setShowVerifyModal(true);
  };

  const confirmVerification = async (reason?: string) => {
    if (!id) return;
    setActionLoading(true);
    setShowVerifyModal(false);

    try {
      const result = await  AdminTrainerService.handleTrainerApproval(id, verifyAction, reason);
      if (result.success) {
        setTrainer((prev) => prev ? { ...prev, verified: result.updatedStatus } : null);
        setToast({ message: result.message, type: "success" });
      }
    } catch (err: any) {
      setToast({ 
        message: err.response?.data?.message || "Verification failed", 
        type: "error" 
      });
    } finally {
      setActionLoading(false);
    }
  };

  const toggleBlockStatus = async () => {
    if (!trainer) return;
    setActionLoading(true);
    setShowStatusModal(false);

    try {
      const result = await  AdminTrainerService.updateTrainerStatus(trainer.trainerId, !trainer.status);
      if (result.success) {
        setTrainer((prev) => prev ? { ...prev, status: result.newStatus } : null);
        setToast({ message: result.message, type: "success" });
      }
    } catch (err: any) {
      setToast({ 
        message: err.response?.data?.message || "Status update failed", 
        type: "error" 
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading message="Fetching profile..." />;
  if (!trainer) return <NotFound/>;

  return (
    <>
      <AdminTopBar />
      <AdminSideBar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Modal
        isVisible={showVerifyModal}
        onCancel={() => setShowVerifyModal(false)}
        onConfirm={confirmVerification}
        title={verifyAction === "accept" ? "Accept Trainer" : "Decline Trainer"}
        message={`Confirm ${verifyAction} for ${trainer.name}?`}
        showReasonInput={verifyAction === "decline"}
      />

      <Modal
        isVisible={showStatusModal}
        onCancel={() => setShowStatusModal(false)}
        onConfirm={toggleBlockStatus}
        title={trainer.status ? "Block Trainer" : "Unblock Trainer"}
        message={`Change access for ${trainer.name}?`}
      />

      <main className="ml-64 mt-16 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium"
          >
            <FaArrowLeft /> Back to List
          </button>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className={`p-8 flex flex-col items-center text-white ${
            trainer.verified === 'pending' 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600' 
              : 'bg-gradient-to-r from-teal-500 to-emerald-600'
          }`}>
            <img 
              src={trainer.profilePic || DEFAULT_IMAGE} 
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-4 bg-white object-cover" 
              alt="avatar" 
            />
            <h2 className="text-3xl font-bold flex items-center gap-2">
              {trainer.name}
              {trainer.verified === "accepted" && <FaCheck className="text-green-300 text-xl" />}
            </h2>
            <p className="opacity-90 flex items-center gap-2 italic"><FaEnvelope /> {trainer.email}</p>
            <div className="mt-2 px-4 py-1 bg-white/20 rounded-full text-xs font-medium uppercase tracking-wider">
              Role: {trainer.role} | Verification: {trainer.verified}
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-6">
            <DetailCard icon={<FaVenusMars />} label="Gender" value={trainer.gender || "Not specified"} />
            <DetailCard icon={<FaAward />} label="Experience" value={`${trainer.experience} Years`} />
            <DetailCard icon={<FaCheck />} label="Programs" value={trainer.programs?.map(s => s.name).join(", ") || "None"} />
            <DetailCard icon={<span className="text-lg">₹</span>} label="Price/Session" value={trainer.pricePerSession ? `₹${trainer.pricePerSession}` : "Not Added"} />
            <DetailCard icon={<FaLanguage />} label="Languages" value={trainer.languages?.join(", ") || "English"} />
            <DetailCard icon={<FaClock />} label="Joined On" value={new Date(trainer.joined).toLocaleDateString()} />

            <div className="md:col-span-2 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FaCertificate className="text-indigo-600" /> Professional Certification
              </h4>
              <a 
                href={trainer.certificate} 
                target="_blank" 
                rel="noreferrer" 
                className="text-indigo-600 font-bold hover:underline"
              >
                View Uploaded Document &rarr;
              </a>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t flex justify-end items-center gap-4">
            {trainer.verified === "pending" ? (
              <>
                <SubmitButton
                  type="button"
                  text="Decline Application"
                  loading={actionLoading && verifyAction === "decline"}
                  onClick={() => handleVerifyClick("decline")}
                  className="px-6 py-2.5 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200"
                />
                <SubmitButton
                  type="button"
                  text="Approve & Verify"
                  loading={actionLoading && verifyAction === "accept"}
                  onClick={() => handleVerifyClick("accept")}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md"
                />
              </>
            ):trainer.verified==='accepted'?(
              <div className="w-full md:w-64">
                <SubmitButton
                  type="button"
                  text={trainer.status ? 'Block Account' : 'Unblock Account'}
                  loading={actionLoading}
                  onClick={() => setShowStatusModal(true)}
                  className={`w-full px-8 py-2.5 rounded-xl font-bold text-white shadow-md transition ${
                    trainer.status ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'
                  }`}
                />
              </div>
            ): (
            <div className="text-red-500 font-semibold italic">
              {trainer?.rejectReason}
            </div>
          )}
          </div>
        </div>
      </main>
    </>
  );
};

export default TrainerDetails;