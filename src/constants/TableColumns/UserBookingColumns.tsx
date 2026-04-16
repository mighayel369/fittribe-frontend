import { type ColumnDefinition } from "../../types/table-types";
import { FaStar, FaCheckCircle } from "react-icons/fa";

export const userBookingHistoryColumns = (
  onView: (id: string) => void,
  onReview: (booking: any) => void 
): ColumnDefinition<any>[] => [
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
    header: "Feedback",
    accessor: "isReviewed",
    render: (b: any) => {
      if (b.isReviewed) {
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 w-fit">
            <FaCheckCircle size={10} />
            <span className="text-[9px] font-black uppercase tracking-widest">Reviewed</span>
          </div>
        );
      }

      return (
        <button
          onClick={() => onReview(b)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-black uppercase rounded-lg transition-all shadow-sm border border-amber-600/20 group"
        >
          <FaStar className="group-hover:rotate-12 transition-transform" size={10} />
          Add Review
        </button>
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