import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserMinus, UserCheck, Eye, FileDown, Filter, RefreshCw } from "lucide-react";

import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import Toast from "../../components/Toast";
import Modal from "../../components/Modal";
import GenericTable from "../../components/GenericTable";
import SearchInput from "../../components/SearchInput";
import Pagination from "../../components/Pagination";
import { AdminUserService } from "../../services/admin/admin.user.service";

type User = {
  userId: string;
  name: string;
  email: string;
  status: boolean;
  createdAt?: string;
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");
  const [exportRange, setExportRange] = useState("1D");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "FitTribe | Users";
  }, []);


  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await AdminUserService.fetchUsers(page, search, statusFilter);
      setUsers(res.data || []);
      setTotalPages(res.total || 1);
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to fetch users",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, statusFilter]);

 const handleExportPDF = async () => {
  try {
    const blobData = await AdminUserService.exportUsersPDF(exportRange);
    console.log(blobData)
    const blob = new Blob([blobData], { type: 'application/pdf' });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    
    const fileName = `FitTribe_Churn_${exportRange.replace(/\s+/g, '_')}.pdf`;
    link.setAttribute('download', fileName);

    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setToast({ type: "success", message: "Download started!" });
  } catch (err) {
    setToast({ type: "error", message: "Failed to generate PDF report" });
    console.error("PDF Export Error:", err);
  }
};

  const handleConfirmAction = async () => {
    if (!selectedUser) return;
    try {
      const targetStatus = !selectedUser.status;
      await AdminUserService.updateUserStatus(selectedUser.userId, targetStatus);
      setUsers(prev => prev.map(u => u.userId === selectedUser.userId ? { ...u, status: targetStatus } : u));
      setShowModal(false);
      setToast({ type: "success", message: "Status updated successfully" });
    } catch (error: any) {
      setToast({ type: "error", message: "Action failed" });
    } finally {
      setSelectedUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminTopBar />
      <AdminSideBar />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="ml-72 pt-28 px-10 pb-12">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Directory</h1>
              <p className="text-slate-500 font-medium">Manage platform members and monitor account statuses.</p>
            </div>

            <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              {['1D', '30D', '90D'].map((range) => (
                <button
                  key={range}
                  onClick={() => setExportRange(range)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${exportRange === range ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  {range}
                </button>
              ))}
              <div className="w-[1px] h-4 bg-slate-200 mx-1" />
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all active:scale-95"
              >
                <FileDown size={14} /> Export CSV
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between mt-8 gap-4">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              {(['all', 'active', 'blocked'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => { setStatusFilter(filter); setPage(1); }}
                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === filter
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search name or email..."
              />
              <button
                onClick={fetchUsers}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-all"
              >
                <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <GenericTable<User>
            data={users}
            page={page}
            loading={loading}
            columns={[
              {
                header: "Name",
                accessor: "name",
                render: (user) => (
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                    </div>
                  </div>
                ),
              },
              {
                header: "Email",
                accessor: "email",
                render: (user) => (
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{user.email}</p>
                    </div>
                  </div>
                ),
              },
              {
                header: "Status",
                accessor: "status",
                className: "text-center",
                render: (user) => (
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.status ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}>
                      {user.status ? "Active" : "Blocked"}
                    </span>
                  </div>
                ),
              },
              {
                header: "Actions",
                accessor: "userId",
                className: "text-center",
                render: (user) => (
                  <div className="flex justify-center gap-2">
                    <button onClick={() => navigate(`/admin/users/${user.userId}`)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Eye size={18} /></button>
                    <button
                      onClick={() => { setSelectedUser(user); setShowModal(true); }}
                      className={`p-2 rounded-lg transition-all ${user.status ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                    >
                      {user.status ? <UserMinus size={18} /> : <UserCheck size={18} />}
                    </button>
                  </div>
                ),
              },
            ]}
          />

          {!loading && users.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Filter className="text-slate-200" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No results found</h3>
              <p className="text-slate-500 max-w-xs">Try adjusting your filters or search terms.</p>
            </div>
          )}

          <div className="p-6 border-t border-slate-50 bg-slate-50/50">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>

        {selectedUser && (
          <Modal
            isVisible={showModal}
            onCancel={() => setShowModal(false)}
            onConfirm={handleConfirmAction}
            title={selectedUser.status ? 'Restrict Access' : 'Restore Access'}
            message={`Change status for ${selectedUser.name}? This will affect their ability to log in.`}
          />
        )}
      </main>
    </div>
  );
};

export default UserList;