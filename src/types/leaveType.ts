export interface LeaveRecord {
  type: LEAVE_TYPE;
  startDate: string;
  endDate: string;
  reason: string;
  status: LEAVE_STATUS
}


export const LEAVE_TYPES = {
    SICK: 'sick',
    CASUAL: 'casual',
    MEDICAL: 'medical'
} as const;

export type LEAVE_TYPE = typeof LEAVE_TYPES[keyof typeof LEAVE_TYPES];

export const LEAVE_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    WITHDRAWN: 'withdrawn'
} as const;

export type LEAVE_STATUS = typeof LEAVE_STATUS[keyof typeof LEAVE_STATUS];

export interface LeaveRequestFormData {
  type: LEAVE_TYPE;
  startDate: string;
  endDate: string;
  reason: string;
  documents?: File | null;
}

export interface LeaveRequestBase {
    leaveId: string; 
    type: LEAVE_TYPE;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: LEAVE_STATUS;
    submittedAt: string;
}

export interface TrainerLeaveRequest extends LeaveRequestBase {
    adminComment?: string;
}


export interface AdminLeaveRequest extends LeaveRequestBase {
    trainerId: string;
    trainerName: string;
    trainerProfilePic: string;
    trainerServices: string[];
}

export interface TrainerLeaveMetrics{
    label:string,
    usedCount:number,
    totalCount:number
}