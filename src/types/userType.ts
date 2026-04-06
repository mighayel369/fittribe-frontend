export interface UserSignupDTO {
  name: string;
  email: string;
  password?: string;
  confirm?: string;
}

export interface UserLoginDTO {
  email: string;
  password?: string;
}


export type User = {
  userId: string;     
  name: string;
  email: string;
  role: string;        
  status: boolean;
  createdAt: Date;
  gender?: string;
  age?: number;
  phone?: string | null;
  address?: string | null;
  profilePic?: string | null;
  googleId?: string | null;
};

export interface UpdateUserProfileDTO {
  name: string;
  phone: string;
  address: string;
  gender?: string;
  age?: number;
  profilePic?: string
}
