import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaSearch } from "react-icons/fa";
import { UserMinus, UserCheck, Eye } from "lucide-react";

import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import GenericTable from "../../components/GenericTable";
import Pagination from "../../components/Pagination";
import SearchInput from "../../components/SearchInput";

import { type Trainer } from "../../types/trainerType";
import { AdminTrainerService } from "../../services/admin/admin.trainer.service";

const TrainerList = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "FitTribe | Trainers";
  }, []);


  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        const response = await AdminTrainerService.getVerifiedTrainers(page, search);
        setTrainers(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err: any) {
        setToast({
          type: "error",
          message: err.response?.data?.message || "Failed to fetch trainers",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, [page, search]);

  const handleConfirmAction = async () => {
    if (!selectedTrainer) return;
    try {
      const newStatus = !selectedTrainer.status;
      const result = await AdminTrainerService.updateTrainerStatus(
        selectedTrainer.trainerId,
        newStatus
      );

      setTrainers((prev) =>
        prev.map((t) =>
          t.trainerId === selectedTrainer.trainerId ? { ...t, status: newStatus } : t
        )
      );

      setToast({
        type: "success",
        message: result.message || `Trainer ${newStatus ? "unblocked" : "blocked"} successfully`,
      });
      setShowModal(false);
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Action failed",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminTopBar />
      <AdminSideBar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="ml-72 pt-28 px-10 pb-12">

        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Trainer Directory</h1>
            <p className="text-slate-500 font-medium">Manage verified fitness professionals and access control.</p>
          </div>

          <div className="flex items-center gap-4">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name or email..."
            />
            <button
              onClick={() => navigate("/admin/verify-trainer")}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <FaCheckCircle className="text-indigo-200" />
              Verification Requests
            </button>
          </div>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <GenericTable<Trainer>
            data={trainers}
            page={page}
            loading={loading}
            columns={[
              {
                header: "Trainer Details",
                accessor: "name",
                render: (trainer) => (
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold border border-slate-200 uppercase">
                      {trainer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{trainer.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{trainer.email}</p>
                    </div>
                  </div>
                ),
              },
              {
                header: "Rate",
                accessor: "pricePerSession",
                render: (trainer) => (
                  <span className="font-bold text-slate-700">
                    {trainer.pricePerSession ? `₹${trainer.pricePerSession}` : "—"}
                  </span>
                ),
                className: "text-center",
              },
              {
                header: "Status",
                accessor: "status",
                className: "text-center",
                render: (trainer) => (
                  <div className="flex justify-center items-center w-full">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${trainer.status
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${trainer.status ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />

                      {trainer.status ? "Active" : "Blocked"}
                    </span>
                  </div>
                ),
              },
              {
                header: "Management",
                accessor: "action",
                render: (trainer) => (
                  <div className="flex justify-center gap-2">
                    <button
                      title="View Profile"
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      onClick={() => navigate(`/admin/trainers/${trainer.trainerId}`)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      title={trainer.status ? "Block Trainer" : "Unblock Trainer"}
                      className={`p-2 rounded-lg transition-colors ${trainer.status
                          ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                      onClick={() => {
                        setSelectedTrainer(trainer);
                        setShowModal(true);
                      }}
                    >
                      {trainer.status ? <UserMinus size={18} /> : <UserCheck size={18} />}
                    </button>
                  </div>
                ),
                className: "text-center",
              },
            ]}
          />


          {!loading && trainers.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FaSearch className="text-slate-300 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No trainers found</h3>
              <p className="text-slate-500 max-w-xs">We couldn't find any trainers matching "{searchTerm}". Try a different name or email.</p>
            </div>
          )}

          <div className="p-6 border-t border-slate-50 bg-slate-50/50">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>

        {selectedTrainer && (
          <Modal
            isVisible={showModal}
            onCancel={() => setShowModal(false)}
            onConfirm={handleConfirmAction}
            title={selectedTrainer.status ? 'Block Trainer Access' : 'Restore Trainer Access'}
            message={`Are you sure you want to change the status for ${selectedTrainer.name}? This will affect their ability to log in and accept bookings.`}
          />
        )}
      </main>
    </div>
  );
};

export default TrainerList;