
import { type ProgramInfo } from "./programType";

export type TrainerSignupDTO = {
  name: string;
  email: string;
  password?: string;
  confirm?: string;
  gender: string;
  experience: number;
  pricePerSession: number;
  programs: string[];
  languages: string[];
  certificate?: File | null;
};

export type TrainerLoginDTO = {
  email: string;
  password?: string;
};


export interface Trainer {
  trainerId: string;
  name: string;
  email: string;
  status: boolean;
  pricePerSession: number;
}

export interface UserSideTrainer extends Trainer {
  profilePic: string | null;
  rating: number;
  experience: number;
  address: string | null;
  programs: string;
}

export interface PendingTrainer extends Omit<Trainer, 'status' | 'email'> {
  gender: string;
  programs: string[];
}

export interface AdminTrainerDetails {
  trainerId: string;
  name: string;
  email: string;
  role: "trainer";
  profilePic: string | null;
  gender: string;

  experience: number;
  languages: string[];
  pricePerSession: number;
  programs: ProgramInfo[]

  certificate: string;
  verified: "pending" | "accepted" | "rejected";
  status: boolean;
  joined: string;
  rejectReason?: string;
}

export interface TrainerAccount {
  trainerId: string;
  name: string;
  email: string;
  phone?: string;
  gender: string;
  address: string;
  bio: string;
  profilePic: string;
  experience: number;
  languages: string[];
  pricePerSession: number;
  programs: ProgramInfo[];
  status: boolean;
  verified: "pending" | "accepted" | "rejected";
  rejectReason?: string;
  certificate: string;
  joined: string;
  rating: number;
}

export interface UpdateTrainerProfileDTO {
  name: string;
  gender: string;
  experience: number;
  languages: string[];
  bio: string;
  phone: string;
  address: string;
  pricePerSession: number;
  programs: string[];
}

export interface ReapplyTrainerDTO {
  name: string;
  gender: string;
  experience: number;
  programs: string[];
  languages: string[];
  pricePerSession: number;
  certificate?: File | null;
}

export interface TrainerDetails {
  trainerId: string;
  name: string;
  email: string;
  status: boolean;
  profilePic: string;
  pricePerSession: number;
  verified: string;
  certificate: string;
  joined: string;
  gender: string;
  programs: { programId: string; name: string }[];
  role: string;
  experience: number;
  languages: string[];
  rejectReason?: string;
  phone?: string
}




export interface TrainerProfileType {
  trainerId: string;
  name: string;
  profilePic: string;
  pricePerSession: number;
  experience: number;
  languages: string[];
  address: string;
  bio: string;
  programs: ProgramInfo[];
  rating: number;
  chatId?: string;
}