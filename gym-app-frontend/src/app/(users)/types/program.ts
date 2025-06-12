export interface Exercise {
  _id: string;
  name: string;
}

export interface Set {
  repetition: number;
}

export interface ProgramExercise {
  name: string; // ObjectId reference to Exercise
  sets: Set[];
}

export interface WorkoutStructure {
  name: string;
  exercises: ProgramExercise[];
}

export interface Program {
  _id?: string;
  user: string;
  trainer: string;
  name: string;
  duration: number;
  isActive: boolean;
  objective?: string;
  structure: WorkoutStructure[];
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  trainerAssigned: string | null;
}
