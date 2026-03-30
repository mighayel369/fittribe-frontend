import { type TrainerLeaveRequest, LEAVE_STATUS } from "../../types/leaveType";
import { Check, X } from "lucide-react";
export const getTrainerLeaveColumns =(onAction: (leave: any, type: 'cancel') => void) =>  [
  {
    header: <div className="text-center w-full text-xs font-bold text-gray-600 uppercase">Leave Type</div>,
    accessor: "type",
    className: "text-center",
    render: (row: TrainerLeaveRequest) => (
      <span className="font-medium capitalize text-gray-700 block text-center">
        {row.type.replace('_', ' ')}
      </span>
    )
  },
  {
    header: <div className="text-center w-full text-xs font-bold text-gray-600 uppercase">Dates Requested</div>,
    accessor: "startDate",
    className: "text-center",
    render: (row: TrainerLeaveRequest) => {
      const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-semibold text-gray-800">
            {formatDate(row.startDate)} - {formatDate(row.endDate)}
          </span>
          <span className="text-[10px] text-gray-400">{row.days} {row.days === 1 ? 'day' : 'days'} total</span>
        </div>
      );
    }
  },
  {
    header: <div className="text-center w-full text-xs font-bold text-gray-600 uppercase">Status</div>,
    accessor: "status",
    className: "text-center",
    render: (row: TrainerLeaveRequest) => {
      const statusStyles = {
        [LEAVE_STATUS.APPROVED]: "bg-emerald-100 text-emerald-700 border-emerald-200",
        [LEAVE_STATUS.PENDING]: "bg-amber-100 text-amber-700 border-amber-200",
        [LEAVE_STATUS.REJECTED]: "bg-rose-100 text-rose-700 border-rose-200",
        [LEAVE_STATUS.WITHDRAWN]: "bg-gray-100 text-gray-600 border-gray-200",
      };

      return (
        <div className="flex justify-center items-center">
          <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${statusStyles[row.status]}`}>
            {row.status}
          </span>
        </div>
      );
    }
  },
  {
    header: <div className="text-center w-full text-xs font-bold text-gray-600 uppercase">Submitted On</div>,
    accessor: "submittedAt",
    className: "text-center",
    render: (row: TrainerLeaveRequest) => (
      <span className="text-sm font-semibold text-gray-800 block text-center">
        {new Date(row.submittedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
      </span>
    )
  },
  {
    header: <div className="text-center w-full text-xs font-bold text-gray-600 uppercase">Action</div>,
    accessor: "leaveId",
    className: "text-center",
    render: (row: TrainerLeaveRequest) => (
      <div className="flex justify-center items-center">
        {row.status === LEAVE_STATUS.PENDING ? (
          <button
            onClick={() => {onAction(row.leaveId,'cancel')}}
            className="text-[10px] font-bold text-rose-600 hover:text-rose-800 transition-colors underline"
          >
            Withdraw
          </button>
        ) : <span className="text-gray-300">-</span>}
      </div>
    )
  }
];


export const getAdminLeaveColumns = (onAction: (leave: any, type: 'approve' | 'reject') => void) => [  {
    header: <div className="text-center w-full text-xs font-bold text-gray-600 uppercase">Trainer</div>,
    accessor: "trainer",
    className: "text-center",
    render: (row: any) => (
      <div className="flex items-center gap-3 px-2">
        <img 
          src={row.trainerProfilePic || "/default-avatar.png"} 
          alt={row.trainerName} 
          className="w-8 h-8 rounded-full object-cover border border-gray-200"
        />
        <span className="text-sm font-bold text-slate-700">{row.trainerName}</span>
      </div>
    )
  },
  {
    header: <div className="text-center w-full text-xs font-bold text-gray-600 uppercase">Leave Type</div>,
    accessor: "type",
    className: "text-center",
    render: (row: any) => (
      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
        {row.type.replace('_', ' ')}
      </span>
    )
  },
  {
    header: <div className="text-center w-full text-xs font-bold text-gray-600 uppercase">Reason</div>,
    accessor: "reason",
    className: "text-center",
    render: (row: any) => (
      <span className="text-sm text-slate-600 line-clamp-1 max-w-[200px]">{row.reason}</span>
    )
  },
  {
    header: <div className="text-center w-full text-xs font-bold text-gray-600 uppercase">Dates Requested</div>,
    accessor: "startDate",
    className: "text-center",
    render: (row: any) => {
      const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

      return (
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-slate-800">
            {formatDate(row.startDate)} — {formatDate(row.endDate)}
          </span>
        </div>
      );
    }
  },
  {
    header: <div className="text-center w-full text-xs font-bold text-gray-600 uppercase">Days</div>,
    accessor: "days",
    className: "text-center",
    render: (row: any) => (
      <span className="text-sm font-black text-slate-900">{row.days}</span>
    )
  },
  {
    header: <div className="text-center w-full text-xs font-bold text-gray-600 uppercase">Action</div>,
    accessor: "leaveId",
    className: "text-center",
    render: (row: any) => (
      <div className="flex justify-center items-center gap-2">
        {row.status === LEAVE_STATUS.PENDING ? (
          <>
            <button
              onClick={() => onAction(row.leaveId, 'approve')}
              className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all shadow-sm active:scale-95"
            >
              <Check size={12} strokeWidth={3} />
              Approve
            </button>
            <button
              onClick={() => onAction(row.leaveId, 'reject')}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg border border-transparent hover:border-red-100"
              title="Reject Request"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </>
        ) : (
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
            row.status === LEAVE_STATUS.APPROVED ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'
          }`}>
            {row.status}
          </span>
        )}
      </div>
    )
  }
];