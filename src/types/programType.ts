
export type Program = {
  programId: string;
  name: string;
  description: string;
  programPic: string;
  isPublished: boolean;
};


export interface DiscoveryProgram extends Omit<Program, 'duration' | 'isPublished'> {}

export type OnboardNewProgramDTO = {
  name: string;
  description: string;
  programPic:File;
};


export type ModifyProgramDTO = {
  name?: string;
  description?: string;
  status?: boolean;
  programPic?:File
};


