import { type ColumnDefinition } from "../../types/table-types";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { formatTime, formatDate } from "../../utils/formatTime";

export const userBookingHistoryColumns = (
  onView: (id: string) => void,
  onReview: (booking: any) => void 
): ColumnDefinition<any>[] => [
  {
    header: "Trainer",
    accessor: "trainer",
    render: (b: any) => (
      <div className="flex items-center gap-3 py-1">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0 bg-indigo-50 flex items-center justify-center">
          <img 
            src={b.trainerProfilePic || '/default-avatar.png'} 
            className="w-full h-full object-cover" 
            alt="Trainer" 
            onError={(e) => { (e.target as HTMLImageElement).src = '/default-avatar.png' }}
          />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{b.trainerName}</p>
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Professional Trainer</span>
        </div>
      </div>
    )
  },
  {
    header: "Program",
    accessor: "program",
    render: (b: any) => (
      <div className="flex flex-col">
        <span className="text-gray-700 font-semibold bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 w-fit mb-1">
             {b.bookedProgram || 'NA'}
        </span>
        <span className="text-[10px] text-gray-400 font-black ml-1">₹{b.sessionAmount}</span>
      </div>
    )
  },
  {
    header: "Schedule",
    accessor: "date",
    render: (b: any) => (
      <div className="flex flex-col">
        <span className="text-gray-900 font-bold">
          {formatDate(b.bookedDate)}
        </span>
        <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">
          {formatTime(Number(b.bookedTime))}
        </span>
      </div>
    )
  },
  {
    header: "Feedback",
    accessor: "isReviewed",
    render: (b: any) => {
      if (b.isReviewed) {
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 w-fit">
            <FaCheckCircle size={10} />
            <span className="text-[9px] font-black uppercase tracking-widest">Reviewed</span>
          </div>
        );
      }

      return (
        <button
          onClick={() => onReview(b)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-black uppercase rounded-lg transition-all shadow-md shadow-amber-100 border border-amber-600/20 group"
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
        className="px-4 py-2 bg-gray-900 text-white text-[10px] font-black rounded-xl hover:bg-indigo-600 transition-all uppercase tracking-widest shadow-lg shadow-gray-200"
      >
        Details
      </button>
    )
  }
];