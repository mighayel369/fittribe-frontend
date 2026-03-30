import { useEffect, useState } from "react";
import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import { FaCalendarAlt, FaFileAlt } from "react-icons/fa";
import Toast from "../../components/Toast";
import GenericTable from "../../components/GenericTable";
import { leaveFields } from "../../constants/FormFields/leave-fields";
import FormModal from "../../components/FormModal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type LeaveRequestFormData, type TrainerLeaveRequest, type TrainerLeaveMetrics } from "../../types/leaveType";
import { getTrainerLeaveColumns } from "../../constants/TableColumns/LeaveColumns";
import Modal from "../../components/Modal";
import { TrainerLeaveManagementService } from "../../services/trainer/trainer.leave.managemnt";
const TrainerLeaveManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState(false)
  const [leaves, setLeaves] = useState<TrainerLeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [leaveStats, setLeaveStats] = useState<TrainerLeaveMetrics[]>([]);
  const [selectedLeave, setSelectedLeave] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'cancel' | null>(null);

  const handleLeaveSubmit = async (formDataObject: LeaveRequestFormData) => {
    try {
      setLoadingButton(true)
      const formData = new FormData();
      formData.append("type", formDataObject.type);
      formData.append("startDate", formDataObject.startDate);
      formData.append("endDate", formDataObject.endDate);
      formData.append("reason", formDataObject.reason);
      if (formDataObject.documents) {
        formData.append("documents", formDataObject.documents);
      }

      const res = await TrainerLeaveManagementService.applyForLeave(formData);

      if (res.success) {
        setToast({ message: res.message, type: "success" });
        setIsModalOpen(false);
        getHistory();
        getMetrics();
      }
    } catch (err: any) {
      const errMesg = err.response?.data?.message || "Something went wrong";
      setToast({ message: errMesg, type: "error" });
    } finally {
      setLoadingButton(false)
      setIsModalOpen(false);
    }
  };


  const handleActionClick = (leave: any, type: 'cancel') => {
    setSelectedLeave(leave);
    setActionType(type);
    setShowModal(true);
  };

  const handleWithdrwaLeaveRequest = async () => {
    if (!selectedLeave || !actionType) return;

    try {
      const result = await TrainerLeaveManagementService.withdrawLeave(
        selectedLeave
      );

      setToast({message:result.message,type:'success'})
      setShowModal(false);
      getHistory()
    } catch (error: any) {
      const errMesg = error.response?.data?.message || "Update failed";
      setToast({message:errMesg,type:'error'})
    }
  }

  useEffect(() => {
    document.title = 'FitTribe Leave Management'
    setLoading(false);
  }, []);

  const getMetrics = async () => {
    try {
      const res = await TrainerLeaveManagementService.getLeaveMtrics();
      if (res.success) setLeaveStats(res.data);
    } catch (err) {
      console.error("Metrics fetch failed", err);
    }
  };

  const getHistory = async () => {
    setLoading(true);
    try {
      const res = await TrainerLeaveManagementService.getLeaveistory(currentPage, '');
      if (res.success) {
        setLeaves(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      console.error("History fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, [currentPage]);

  useEffect(() => {
    getMetrics();
    document.title = 'FitTribe Leave Management';
  }, []);

  const getStatColor = (label: string) => {
    if (label.toLowerCase().includes("sick")) return "bg-rose-100 text-rose-600";
    if (label.toLowerCase().includes("casual")) return "bg-sky-100 text-sky-600";
    return "bg-emerald-100 text-emerald-600";
  };

  const columns = getTrainerLeaveColumns(handleActionClick);

  return (
    <div className="min-h-screen bg-gray-50">
      <TrainerTopBar />
      <TrainerSideBar />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="ml-72 pt-24 px-10 pb-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Leave Management</h1>
            <p className="text-gray-500 mt-1">Track your time off and request new leaves.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-xl text-sm"
          >
            Request Leave
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {leaveStats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <span className={`p-2 rounded-lg ${getStatColor(stat.label)}`}>
                  <FaCalendarAlt size={20} />
                </span>
                <span className="text-2xl font-black text-gray-800">{stat.usedCount}/{stat.totalCount}</span>
              </div>
              <h3 className="text-gray-500 font-medium">{stat.label}</h3>
              <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-1000"
                  style={{ width: `${(stat.usedCount / stat.totalCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-50 flex items-center gap-2">
            <FaFileAlt className="text-emerald-600" />
            <h2 className="font-bold text-gray-700">Leave History</h2>
          </div>
          <GenericTable
            data={leaves}
            columns={columns}
            page={currentPage}
            loading={loading}
            emptyMessage="You haven't requested any leaves yet."
          />
        </div>
        <div className="flex justify-between items-center mt-6">
          <p className="text-xs text-gray-500 font-medium">Showing {leaves.length} of {total} results</p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={currentPage * 5 >= total}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {showModal && selectedLeave && actionType && (
          <Modal
            isVisible={showModal}
            title={`Withdraw Leave Request`}
            onCancel={() => {
              setShowModal(false);
            }}
            onConfirm={handleWithdrwaLeaveRequest}
          >
          </Modal>
        )}
      </main>
      {isModalOpen && (
        <FormModal
          heading="Request Leave"
          fields={leaveFields}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleLeaveSubmit}
          buttonText="Submit"
          loading={loadingButton}
        />
      )}
    </div>
  );
};

export default TrainerLeaveManagement;