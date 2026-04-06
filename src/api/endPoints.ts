

export const API_ENDPOINTS = {
  SHARED_AUTH: {
    RESEND_OTP: (role: string) => `${role}/auth/resend-otp`,
    REFRESH: (role: string) => `${role}/auth/refresh-token`,
    LOGOUT: (role: string) => `${role}/auth/security/logout`,
    CHANGE_PASSWORD: (role: string) => `${role}/auth/security/change-password`,
    VERIFY_OTP:(role:string) =>`${role}/auth/verify-otp`,
  },

  USER_AUTH: {
    LOGIN: 'user/auth/login',
    REGISTER: 'user/auth/register',
    FORGOT_PW: 'user/auth/forgot-password',
    RESET_PW: (token: string) => `user/auth/reset-password/${token}`,
    GOOGLE: 'user/auth/google'
  },

  TRAINER_AUTH: {
    LOGIN: 'trainer/auth/login',
    REGISTER: 'trainer/auth/register'
  },

  ADMIN_AUTH: {
    LOGIN: 'admin/auth/login',
  },


  ADMIN_MGMT: {
    PLATFORM: {
      OVERVIEW: 'admin/platform/platform-overview',
      METRICS:'/admin/platform/leave-metrics',
      LEAVE_REQUEST_HISTORY:'/admin/platform/history',
      LEAVE_STATUS:(id:string)=>`/admin/platform/update-status/${id}`
    },

    USERS: {
      GET_ALL: 'admin/users',
      GET_DETAILS: (id: string) => `admin/users/${id}`,
      TOGGLE_STATUS: (id: string) => `admin/users/${id}/status`,
    },

    TRAINERS: {
      LIST_VERIFIED: 'admin/trainers/verified',
      LIST_PENDING: 'admin/trainers/pending',
      GET_DETAILS: (id: string) => `admin/trainers/${id}`,
      UPDATE_STATUS: (id: string) => `admin/trainers/${id}/status`,
      VERIFY_ACTION: (id: string) => `admin/trainers/${id}/verify`,
    },

    PROGRAMS: {
      ONBOARD: 'admin/programs/onboard', 
      INVENTORY: 'admin/programs/inventory',
      GET_DETAILS: (id: string) => `admin/programs/${id}`,
      UPDATE_SPECS: (id: string) => `admin/programs/${id}/specs`,
      TOGGLE_VISIBILITY: (id: string) => `admin/programs/${id}/visibility`,
      DELETE: (id: string) => `admin/programs/${id}`,
    },
  },
  WALLET: {
    GET_MY_WALLET: (role: string) => `${role}/wallet/my-wallet`
  },
  USER_PAYMENTS: {
    INITIATE: 'user/payments/initiate', 
    VERIFY: 'user/payments/verify',  
  },
  TRAINER_ACCOUNT: {
    GET_ME: 'trainer/account/me',
    VERIFY_SESSION: 'trainer/account/verify',
    UPDATE_PROFILE: 'trainer/account/profile',
    UPDATE_AVATAR: 'trainer/account/avatar',   
    REAPPLY: 'trainer/account/re-apply',  


    METRICS: 'trainer/dashboard/metrics',
    AGENDA: 'trainer/dashboard/agenda',

 
    GET_CONFIG: 'trainer/schedule/config',
    SYNC_TEMPLATE: 'trainer/schedule/weekly-template',
  },


  USER_ACCOUNT: {
  
    GET_ME: 'user/account/me',
    VERIFY_SESSION: 'user/account/verify',
    UPDATE_PROFILE: 'user/account/update',
    UPDATE_AVATAR: 'user/account/avatar', 
  },
  TRAINER_BOOKINGS: {
    HISTORY: 'trainer/bookings/history',
    PENDING: 'trainer/bookings/pending',
    RESCHEDULE_REQUESTS: 'trainer/bookings/reschedule',
    DETAILS: (bookingId: string) => `trainer/bookings/${bookingId}`,
    
    ACCEPT: 'trainer/bookings/accept',
    REJECT: 'trainer/bookings/reject',
    APPROVE_RESCHEDULE: 'trainer/bookings/reschedule/approve',
    REJECT_RESCHEDULE: 'trainer/bookings/reschedule/reject',
    RESCHEDULE_BY_TRAINER:'trainer/bookings/reschedule'
  },

  USER_BOOKINGS: {
    HISTORY: 'user/bookings/history',
    DETAILS: (id: string) => `user/bookings/${id}/details`,
    

    CHECKOUT: 'user/bookings/checkout',
    RESCHEDULE_REQUEST: 'user/bookings/reschedule',
    CANCEL: (bookingId: string) => `user/bookings/${bookingId}`,
    ACCEPT_RESCHEDULE: (id: string) => `user/bookings/${id}/reschedule/accept`,
    DECLINE_RESCHEDULE: (id: string) => `user/bookings/${id}/reschedule/decline`,
  },
  DISCOVERY: {
    PROGRAMS: {
      EXPLORE: (role: string) => `${role}/discovery/explore`,
    },
    TRAINERS: {
      EXPLORE: 'user/discovery/trainers/explore',
      DETAILS: (id: string) => `user/discovery/trainers/explore/${id}`,
      AVAILABILITY: 'user/discovery/trainers/availability',
    },
  },
  TRAINER_LEAVES: {
    APPLY: 'trainer/leaves/apply',
    HISTORY: 'trainer/leaves/history',
    CANCEL: (leaveId: string) => `trainer/leaves/${leaveId}/cancel`,
    METRICS:'trainer/leaves/metrics',
    WITHDRAW_REQUEST:(id:string)=>`trainer/leaves/withdraw/${id}`
  },
  NOTIFICATION:{
    GET_ALL:(role:string)=>`/${role}/notification/get`,
    MARK_AS_READ:(role:string,id:string)=>`/${role}/notification/mark-as-read/${id}`,
    MARK_ALL_READ:(role:string)=>`/${role}/notification/mark-all-as-read`
  },
  CHAT:{
    CHAT_LIST:(role:string)=>`${role}/chats/chat-list`,
    NON_CHAT_LIST:(role:string)=>`${role}/chats/non-chat-list`,

    FETCH_MESSAGES:(role:string,chatId:string)=>`${role}/chats/messages/${chatId}`,
    GET_CHAT_ID:(role:string,id:string)=>`${role}/chats/chat-id/${id}`,
    MARK_AS_READ:(role:string,chatId:string)=>`${role}/chats/mark-as-read/${chatId}`
  }
};