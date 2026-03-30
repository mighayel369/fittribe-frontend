import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import { useEffect, useState, useCallback } from "react";
import GenericTable from "../../components/GenericTable";
import { WalletService } from "../../services/shared/wallet.service";
import { useNavigate } from "react-router-dom";
import { getAdminWalletColumns } from "../../constants/TableColumns/AdminWalletColumns";
import { FaHistory } from "react-icons/fa";
import Pagination from "../../components/Pagination";
import Toast from "../../components/Toast"; 

const AdminWallet = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [walletTransaction, setWalletTransactions] = useState<any[]>([]);
  const [activeHoldCount, setActiveHoldCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const walletColumns = getAdminWalletColumns(navigate);
const fetchAdminWallet = useCallback(async () => {
  try {
    setLoading(true);
    const res = await WalletService.fetchWalletData("admin", page, 5); 
    
    if (res?.success) {
      const { balance, data, total, activeHoldCount } = res.wallet;
      setWalletTransactions(data);
      setTotalPages(total);
      setWalletBalance(balance);
      setActiveHoldCount(activeHoldCount);
    }
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || "Could not load treasury.";
    setToast({ message: errorMsg, type: "error" });
  } finally {
    setLoading(false);
  }
}, [page]);

  useEffect(() => {
    document.title = "FitTribe | Admin Wallet";
    fetchAdminWallet();
  }, [fetchAdminWallet]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopBar />
      <AdminSideBar />

      <main className="ml-64 pt-20 px-8 pb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Platform Treasury
            </h2>
            <p className="text-gray-500 text-sm">Monitor platform revenue and transaction flows</p>
          </div>
          <button 
            onClick={fetchAdminWallet} 
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Net Platform Balance</p>
            <h3 className="text-4xl font-black">
                {loading ? "..." : `₹${walletBalance}`}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><FaHistory /></div>
            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tighter">
              Transactions
            </h3>
          </div>

          <GenericTable
            columns={walletColumns}
            data={walletTransaction}
            page={page}
            loading={loading}
            emptyMessage={!loading && !walletTransaction ? "Failed to load transactions." : "No transactions recorded."}
          />
          
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-50">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminWallet;