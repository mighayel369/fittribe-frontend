export type Booking = {
  bookingId: string,
  trainerName: string,
  bookedDate: string,
  bookedTime: number,
  bookedProgram: string,
  sessionAmount: number,
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'reschedule_requested' | 'rejected'
}

export interface TrainerBookingDetails {
  bookingId: string;
  chatId: string,
  clientId: string,
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientProfilePic?: string;

  bookedProgram: string;
  bookedDate: string;
  bookedTime: number;
  sessionDuration: number;
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'reschedule_requested' | 'rejected'
  totalAmount: number;
  trainerEarning: number;
  adminCommission:number
  paymentStatus: string;
  paymentMethod: string;
  paymentId: string
  rescheduleRequest?: {
    newDate: string;
    newTimeSlot: number
    requestedBy: string,
    requestedAt: string;
  };
  rejectReason?: string
}

export interface UserBookingDetails {
  bookingId: string;
  chatId: string;
  bookedProgram: string;
  bookedDate: string;
  bookedTime: number;
  sessionDuration: number;
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'reschedule_requested' | 'rejected';

  trainerId: string;
  trainerName: string;
  trainerProfilePic?: string;
  trainerExperience: number;
  trainerGender: string;

  totalAmount: number;
  payment: {
    method: string;
    status: string;
    paymentId: string;
  };


  rescheduleRequest?: {
    newDate: string;
    newTimeSlot: number;
    requestedBy: string,
    status: string;
  };
  rejectReason?: string
}