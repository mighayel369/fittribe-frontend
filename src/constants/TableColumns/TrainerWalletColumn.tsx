
import { FaArrowRight } from "react-icons/fa";
import { type NavigateFunction } from "react-router-dom";
import { FormatDate } from "../../helperFunctions/formatdate";

interface TransactionRow {
  _id: string;
  createdAt: string | Date;
  source: string;
  type: "credit" | "debit";
  amount: number;
  bookingId?: string;
}

export const TrainerWalletColumns = (navigate: NavigateFunction) => [
  {
    header: "Date",
    accessor: "createdAt",
    render: (row: TransactionRow) => (
      <div className="flex flex-col">
        <span className="font-bold text-gray-900">
          {FormatDate(row.createdAt)}
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
    header: "Source",
    accessor: "source",
    render: (row: TransactionRow) => (
      <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-tighter">
        {row.source}
      </span>
    )
  },
  {
    header: "Amount",
    accessor: "amount",
    render: (row: TransactionRow) => (
      <span className={`font-black ${row.type === "credit" ? "text-green-600" : "text-red-600"}`}>
        {row.type === "credit" ? "+" : "-"} ₹{row.amount}
      </span>
    )
  },
  {
    header: "Details",
    accessor: "bookingId",
    render: (row: TransactionRow) => row.bookingId ? (
      <button
        onClick={() => navigate(`/trainer/bookings/${row.bookingId}`)}
        className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors group"
      >
        VIEW <FaArrowRight className="text-[8px] transform group-hover:translate-x-1 transition-transform" />
      </button>
    ) : (
      <span className="text-[10px] text-gray-300 font-medium">INTERNAL</span>
    )
  }
];