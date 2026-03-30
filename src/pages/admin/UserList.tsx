
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserFriends } from "react-icons/fa";
import { UserMinus, UserCheck, Eye } from "lucide-react";

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
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
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
      const res = await AdminUserService.fetchUsers(page, search);
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
  }, [page, search]);

  const handleConfirmAction = async () => {
    if (!selectedUser) return;
    const targetId = selectedUser.userId;
    const targetStatus = !selectedUser.status;

    try {
      let res = await AdminUserService.updateUserStatus(targetId, targetStatus);
      setUsers(prev => prev.map(u => u.userId === targetId ? { ...u, status: targetStatus } : u));
      setShowModal(false);
      setToast({ type: "success", message: res.message || "Status updated successfully" });
    } catch (error: any) {
      setToast({
        type: "error",
        message: error.response?.data?.message || "Action failed",
      });
    } finally {
      setSelectedUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminTopBar />
      <AdminSideBar />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <main className="ml-72 pt-28 px-10 pb-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Directory</h1>
            <p className="text-slate-500 font-medium">Manage platform members and monitor account statuses.</p>
          </div>

          <div className="flex items-center gap-4">
            <SearchInput 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Search by name or email..." 
            />
          </div>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <GenericTable<User>
            data={users}
            page={page}
            loading={loading}
            columns={[
              {
                header: "User Details",
                accessor: "name",
                render: (user) => (
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 font-bold border border-slate-200 uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                    </div>
                  </div>
                ),
              },
              {
                header: "Status",
                accessor: "status",
                className: "text-center",
                render: (user) => (
                  <div className="flex justify-center items-center w-full">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                      user.status 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {user.status ? "Active" : "Blocked"}
                    </span>
                  </div>
                ),
              },
              {
                header: "Management",
                accessor: "userId",
                className: "text-center",
                render: (user) => (
                  <div className="flex justify-center gap-2">
                    <button
                      title="View Details"
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => navigate(`/admin/users/${user.userId}`)}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      title={user.status ? "Block User" : "Unblock User"}
                      className={`p-2 rounded-lg transition-colors ${
                        user.status 
                        ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" 
                        : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
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
                <FaSearch className="text-slate-300 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No users found</h3>
              <p className="text-slate-500 max-w-xs">We couldn't find any users matching "{searchTerm}".</p>
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

        {selectedUser && (
          <Modal
            isVisible={showModal}
            onCancel={() => setShowModal(false)}
            onConfirm={handleConfirmAction}
            title={selectedUser.status ? 'Restrict User Access' : 'Restore User Access'}
            message={`Are you sure you want to change the status for ${selectedUser.name}? This will prevent them from accessing their account until unblocked.`}
          />
        )}
      </main>
    </div>
  );
};

export default UserList;