export type Booking={
    bookingId:string,
    trainerName:string,
    bookedDate:Date,
    bookedTime:string,
    bookedProgram:string,
    sessionAmount:number,
    bookingStatus:'pending' | 'confirmed' | 'completed' | 'cancelled' | 'reschedule_requested'|'rejected'
}

export interface TrainerBookingDetails {
    bookingId: string;
    chatId:string,
    clientId:string,
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    clientProfilePic?: string;
    
    bookedProgram: string;
    bookedDate: string; 
    bookedTime: string;
    sessionDuration: number;
    bookingStatus:'pending' | 'confirmed' | 'completed' | 'cancelled' | 'reschedule_requested'|'rejected'

    totalAmount: number;
    trainerEarning: number;
    paymentStatus: string;
    paymentMethod: string;

    rescheduleRequest?: {
        newDate: string;
        newTimeSlot: string;
        requestedBy:string,
        requestedAt: string;
    };
    rejectReason?:string
}

export interface UserBookingDetails{  
  bookingId: string;    
  
  bookedProgram: string;
  bookedDate: string;      
  bookedTime: string;    
  sessionDuration: number;
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'reschedule_requested'|'rejected';

  trainerId: string;   
  trainerName: string;
  trainerProfilePic?: string;
  trainerExperience: number;
  trainerGender: string;

  totalAmount: number;   
  payment: {
    method: string;     
    status: string;       
  };


  rescheduleRequest?: {
    newDate: string;
    newTimeSlot: string;
    requestedBy:string,
    status: string;
  };
  rejectReason?:string
}