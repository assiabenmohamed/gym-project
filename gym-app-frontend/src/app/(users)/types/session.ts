// Enhanced Session Schema with Program Integration
export interface Set {
  repetition: number;
  weight?: number;
}

export interface SessionExercise {
  name: string; // ObjectId reference to Exercise
  sets: Set[];
}

export interface SessionCategory {
  name: string;
  exercises: SessionExercise[];
}

export interface Session {
  _id?: string;
  program: string; // ObjectId reference to Program
  user: string; // ObjectId reference to User
  date: Date;
  categories: SessionCategory[];
  createdAt?: string;
  updatedAt?: string;
}

// Program interfaces for data population
export interface ProgramExercise {
  name: string;
  sets: { repetition: number }[];
}

export interface ProgramStructure {
  name: string;
  exercises: ProgramExercise[];
}

export interface Program {
  _id: string;
  name: string;
  user: string;
  trainer: string;
  structure: ProgramStructure[];
  isActive: boolean;
  duration: number; // Duration in days (max 60 days)
}

export interface Exercise {
  _id: string;
  name: string;
  category?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
}
