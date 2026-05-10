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

export const getAdminWalletColumns = (navigate: NavigateFunction) => [
  {
    header: "Date",
    accessor: "createdAt",
    render: (row: TransactionRow) => (
      <div className="flex flex-col">
        <span className="font-bold text-gray-700">
          {formatDate(row.createdAt)}
        </span>
      </div>
    ),
  },
  {
    header: "Source",
    accessor: "source",
    render: (row: TransactionRow) => (
      <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tighter border border-blue-100">
        {row.source}
      </span>
    ),
  },
  {
    header: "Type",
    accessor: "type",
    render: (row: TransactionRow) => (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
        row.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      }`}>
        {row.type}
      </span>
    ),
  },
  {
    header: "Amount",
    accessor: "amount",
    render: (row: TransactionRow) => (
      <span className={`font-black ${row.type === "credit" ? "text-green-600" : "text-red-600"}`}>
        {row.type === "credit" ? "+" : "-"} ₹{row.amount}
      </span>
    ),
  },
  {
    header: "Action",
    accessor: "bookingId",
    render: (row: TransactionRow) => row.bookingId && (
      <button 
        onClick={() => navigate(`/admin/bookings/${row.bookingId}`)}
        className="flex items-center gap-1 text-[10px] font-bold text-gray-600 hover:text-black transition-colors"
      >
        DETAILS <FaArrowRight className="text-[8px]" />
      </button>
    )
  }
];