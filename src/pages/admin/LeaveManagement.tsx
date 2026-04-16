import { useState, useEffect, useCallback } from "react";
import { GenericPieChart } from "../../components/PieChart";
import SearchInput from "../../components/SearchInput";
import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import { LeaveService } from "../../services/admin/admin.leave.service";
import GenericTable from "../../components/GenericTable";
import { getAdminLeaveColumns } from "../../constants/TableColumns/LeaveColumns";
import { ChevronLeft, ChevronRight, FileDown, Calendar as CalendarIcon } from "lucide-react";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { AdminPlatformService } from "../../services/admin/admin.platform.service";
const LeaveManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [metrics, setMetrics] = useState<any>(null);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);


  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedLeave, setSelectedLeave] = useState<any | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);


  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [adminComment, setAdminComment] = useState("");
  const LIMIT = 5;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [metricsResponse, historyResponse] = await Promise.all([
        LeaveService.getLeaveMetrics(),
        LeaveService.getLeaveistory(currentPage, searchTerm, LIMIT)
      ]);

      setMetrics(metricsResponse);
      setLeaves(historyResponse.data);
      setTotal(historyResponse.total);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleActionClick = (leave: any, type: 'approve' | 'reject') => {
    setSelectedLeave(leave);
    setActionType(type);
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedLeave || !actionType) return;

    try {
      const status = actionType === 'approve' ? 'APPROVED' : 'REJECTED';
      console.log(selectedLeave)
      const result = await LeaveService.updateLeaveStatus(
        selectedLeave,
        status,
        adminComment
      );

      setToastType("success");
      setToastMessage(result.message);
      setShowModal(false);
      setAdminComment("");
      fetchData();
    } catch (error: any) {
      const errMesg = error.response?.data?.message || "Update failed";
      setToastType("error");
      setToastMessage(errMesg);
    }
  };

const handleExportLeaveReport = async () => {
  try {
    const res = await AdminPlatformService.ExportLeaveReport();
    
    const blob = new Blob([res.data], { type: 'application/pdf' });

    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `FitTribe-Leave-Report-${date}.pdf`);
    
    document.body.appendChild(link);
    link.click();
    
    link.remove();
    window.URL.revokeObjectURL(url);
    
    setToastType("success");
    setToastMessage("Report downloaded successfully!");
  } catch (error) {
    console.error("Export failed:", error);
    setToastType("error");
    setToastMessage("Failed to download report.");
  }
};

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const columns = getAdminLeaveColumns(handleActionClick);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminTopBar />
      <AdminSideBar />

      <main className="ml-72 pt-28 px-10 pb-12">
        {toastMessage && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage(null)}
          />
        )}

        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Leaves</h1>
            <p className="text-slate-500 font-medium">Manage trainer availability and time-off metrics.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center font-bold gap-2 bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
              onClick={handleExportLeaveReport}
            >
              <FileDown size={14} /> Export
            </button>
            <div className="flex bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-2.5 gap-2 items-center">
              <CalendarIcon size={14} className="text-red-500" />
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </header>

        <div className="flex items-center gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <SearchInput
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search trainer..."
              fullWidth={false}
            />
          </div>
        </div>

        <figure className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white p-8 shadow-sm border border-slate-100 rounded-[2rem]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b pb-2">Approval Status</h3>
            <GenericPieChart data={metrics?.data?.approvalStatus || []} />
          </div>

          <div className="bg-white p-8 shadow-sm border border-slate-100 rounded-[2rem]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b pb-2">Leave Types</h3>
            <GenericPieChart data={metrics?.data?.leaveTypes || []} />
          </div>
        </figure>

        <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm overflow-hidden">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Trainers Leave List</h3>

          <GenericTable
            data={leaves}
            page={currentPage}
            columns={columns}
            loading={loading}
            emptyMessage="No leave records found matching your criteria."
          />

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-50">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
              Showing {leaves.length} of {total} results
            </p>
            <div className="flex gap-3">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all bg-white shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                disabled={currentPage * LIMIT >= total || loading}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-all bg-white shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {showModal && selectedLeave && actionType && (
          <Modal
            isVisible={showModal}
            title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request`}
            onCancel={() => {
              setShowModal(false);
              setAdminComment("");
            }}
            onConfirm={handleConfirmAction}
          >

            <div className="mt-4">
              <p className="text-sm text-slate-500 mb-4">
                Are you sure you want to {actionType} this request for <strong>{selectedLeave.trainerName}</strong>?
              </p>

              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                Admin Comment (Optional)
              </label>
              <textarea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="Provide a reason or note for the trainer..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all resize-none h-24"
              />
              {actionType === 'reject' && !adminComment && (
                <p className="text-[10px] text-amber-500 font-bold mt-1 uppercase tracking-tighter">
                  Note: It is recommended to provide a reason for rejections.
                </p>
              )}
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default LeaveManagement;