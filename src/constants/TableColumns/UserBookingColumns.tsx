import {type ColumnDefinition } from "../../types/table-types";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-500 text-white border-emerald-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  reschedule_requested: "bg-indigo-50 text-indigo-700 border-indigo-200",
  rejected: "bg-red-500 text-white border-red-200"
};

export const userBookingHistoryColumns = (onView: (id: string) => void): ColumnDefinition<any>[] => [
  {
    header: "Trainer",
    accessor: "trainer",
    render: (b: any) => (
      <div className="flex items-center gap-3 py-1">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shadow-sm shrink-0">
          <img 
            src={b.trainerProfilePic || '/default-avatar.png'} 
            className="w-full h-full object-cover" 
            alt="Trainer" 
          />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{b.trainerName}</p>
        </div>
      </div>
    )
  },
  {
    header: "Program",
    accessor: "program",
    render: (b: any) => (
      <div className="flex flex-col">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">
             {b.bookedProgram || 'NA'}
        </span>
        <span className="text-[10px] text-gray-400 font-bold">₹{b.sessionAmount}</span>
      </div>
    )
  },
  {
    header: "Session Details",
    accessor: "date",
    render: (b: any) => (
      <div className="text-sm">
        <p className="font-bold text-gray-700">{new Date(b.bookedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        <p className="text-[11px] text-gray-400 font-medium">{b.bookedTime}</p>
      </div>
    )
  },
  {
    header: "Status",
    accessor: "status",
    render: (b: any) => {
      const style = statusStyles[b.bookingStatus] || "bg-gray-50 text-gray-600 border-gray-200";
      return (
        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase border tracking-widest ${style}`}>
          {b.bookingStatus}
        </span>
      );
    }
  },
  {
    header: "Actions",
    accessor: "",
    render: (b: any) => (
      <button 
        onClick={() => onView(b.bookingId)}
        className="px-4 py-1.5 bg-gray-900 text-white text-[10px] font-black rounded-lg hover:bg-red-600 transition-all uppercase tracking-widest shadow-sm"
      >
        Details
      </button>
    )
  }
];