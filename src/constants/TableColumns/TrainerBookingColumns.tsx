import { type TrainerBookingColumnActions, type ColumnDefinition } from "../../types/table-types";
import { formatDate, formatTime } from "../../utils/formatTime";

const ViewButton = ({ id, onClick }: { id: string; onClick: (id: string) => void }) => (
  <button className="px-4 py-1 text-xs font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors tracking-wider" onClick={() => onClick(id)}>
    View
  </button>
);

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-500 text-white border-emerald-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  reschedule_requested: "bg-indigo-50 text-indigo border-indigo-200",
  rejected: "bg-red-500 text-white border-grey-200"
};

export const allBookingsColumns = (onView: (id: string) => void): ColumnDefinition<any>[] => [
  {
    header: "Client Name",
    accessor: "clientName",
    render: (b: any) => (
      <div className="py-1">
        <p className="font-bold text-gray-900 text-sm">{b.clientName}</p>
        <p className="text-[11px] text-gray-500 font-medium">{b.clientEmail}</p>
      </div>
    )
  },
  {
    header: "Program",
    accessor: "program",
    render: (b: any) => (
      <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter bg-indigo-50 px-2 py-1 rounded">
        {b.bookedProgram}
      </span>
    )
  },
  {
    header: "Scheduled At",
    accessor: "date",
    render: (b: any) => (
      <div className="text-sm">
        <p className="font-medium text-gray-700">{formatDate(b.bookedDate)}</p>
        <p className="text-xs text-gray-400">{formatTime(b.bookedTime)}</p>
      </div>
    )
  },
  {
    header: "Status",
    accessor: "status",
    render: (b: any) => {
      const style = statusStyles[b.bookingStatus] || "bg-gray-50 text-gray-600 border-gray-200";
      return (
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border tracking-wider ${style}`}>
          {b.bookingStatus}
        </span>
      );
    }
  },
  {
    header: "Details",
    accessor: "",
    render: (b: any) => <ViewButton id={b.bookingId} onClick={onView} />
  }
];

export const pendingBookingsColumns = (actions: TrainerBookingColumnActions): ColumnDefinition<any>[] => [
  {
    header: "Client Name",
    accessor: "clientName",
    render: (b: any) => (
      <div>
        <p className="font-bold text-gray-800 text-sm">{b.clientName}</p>
        <p className="text-[10px] text-gray-400">{b.clientEmail}</p>
      </div>
    )
  },
  {
    header: "Booking Request",
    accessor: "program",
    render: (b: any) => (
      <div className="text-sm">
        <p className="font-semibold text-amber-700">{b.bookedProgram}</p>
        <p className="text-xs text-gray-500">{formatDate(b.bookedDate)} | {formatTime(b.bookedTime)}</p>
      </div>
    )
  },
  {
    header: "Payment info",
    accessor: "amount",
    render: (b: any) => (
      <div className="text-xs">
        <p className="font-bold text-gray-900">₹{b.sessionAmount}</p>
        <p className="text-[10px] text-emerald-600 font-medium uppercase">{b.paymentMethod} - {b.paymentStatus}</p>
      </div>
    )
  },
  {
    header: "Details",
    accessor: "",
    render: (b: any) => <ViewButton id={b.bookingId} onClick={actions.onView} />
  },
  {
    header: "Decision",
    accessor: "",
    render: (b: any) => (
      <div className="flex gap-2">
        <button
          onClick={() => actions.onAction(b.bookingId, 'accept', 'booking')}
          className="px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded hover:bg-emerald-700 transition uppercase shadow-sm"
        >
          Accept
        </button>
        <button
          onClick={() => actions.onAction(b.bookingId, 'reject', 'booking')}
          className="px-4 py-1.5 bg-white text-rose-500 border border-rose-200 text-[10px] font-bold rounded hover:bg-rose-50 transition uppercase"
        >
          Decline
        </button>
      </div>
    )
  }
];

export const rescheduleColumns = (actions: TrainerBookingColumnActions): ColumnDefinition<any>[] => [
  {
    header: "Client Name",
    accessor: "clientName",
    render: (b: any) => (
      <p className="font-bold text-gray-800 text-sm">{b.clientName}</p>
    )
  },
  {
    header: "Original Schedule",
    accessor: "timeSlot",
    render: (b: any) => (
      <div className="text-xs text-gray-600">
        <p className="">{formatDate(b.bookedDate)}</p>
        <p className="">{formatTime(b.bookedTime)}</p>
      </div>
    )
  },
  {
    header: "Requested Change",
    accessor: "requestedNewTime",
    render: (b: any) => (
      <div className="bg-blue-50 border border-blue-100 px-3 py-1.5 rounded">
        <p className="text-blue-700 font-bold text-xs">{formatDate(b.requestedNewDate)}</p>
        <p className="text-blue-600 font-medium text-[11px]">{formatTime(b.requestedNewTime)}</p>
      </div>
    )
  },
  {
    header: "Action",
    accessor: "",
    render: (b: any) => <ViewButton id={b.bookingId} onClick={actions.onView} />
  },
  {
    header: "Decision",
    accessor: "",
    render: (b: any) => (
      <div className="flex gap-2">
        <button
          onClick={() => actions.onAction(b.bookingId, 'accept', 'reschedule')}
          className="px-5 py-2 bg-emerald-500 text-white rounded text-[10px] font-black uppercase hover:bg-emerald-600 transition shadow-sm"
        >
          Approve
        </button>
        <button
          onClick={() => actions.onAction(b.bookingId, 'reject', 'reschedule')}
          className="px-5 py-2 bg-rose-500 text-white rounded text-[10px] font-black uppercase hover:bg-rose-600 transition shadow-sm"
        >
          Reject
        </button>
      </div>
    )
  }
];