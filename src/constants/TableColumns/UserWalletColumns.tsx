import { FaArrowRight } from "react-icons/fa";
import { type NavigateFunction } from "react-router-dom";
import { formatDate } from "../../utils/formatTime";

interface TransactionRow {
  _id: string;
  createdAt: string;
  source: string;
  type: "credit" | "debit";
  amount: number;
  bookingId?: string;
}

export const UserWalletColumns = (navigate: NavigateFunction) => [
  {
    header: "Date",
    accessor: "createdAt",
    render: (row: TransactionRow) => (
      <div className="flex flex-col">
        <span className="font-bold text-gray-900">
          {formatDate(row.createdAt)}
        </span>
        <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">
          {new Date(row.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </span>
      </div>
    )
  },
  {
    header: "Type",
    accessor: "type",
    render: (row: TransactionRow) => (
      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
        row.type === "credit" 
          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
          : "bg-rose-50 text-rose-600 border-rose-100"
      }`}>
        {row.type}
      </span>
    )
  },
  {
    header: "Amount",
    accessor: "amount",
    render: (row: TransactionRow) => (
      <span className={`font-black text-sm font-mono ${
        row.type === "credit" ? "text-emerald-600" : "text-rose-600"
      }`}>
        {row.type === "credit" ? "+" : "-"} ₹{row.amount}
      </span>
    )
  },
  {
    header: "Action",
    accessor: "bookingId",
    className: "text-right",
    render: (row: TransactionRow) => row.bookingId ? (
      <button
        onClick={() => navigate(`/bookings/${row.bookingId}`)}
        className="group inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:text-white hover:bg-indigo-600 transition-all bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm"
      >
        View Details <FaArrowRight className="text-[8px] group-hover:translate-x-1 transition-transform" />
      </button>
    ) : (
      <span className="text-[10px] text-gray-300 font-bold uppercase mr-4">Manual Adjustment</span>
    )
  }
];