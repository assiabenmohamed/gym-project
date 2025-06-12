export interface User {
  id: string;
  name: string;
  email: string;
  goal: "muscle_gain" | "fat_loss" | "maintenance";
  trainerAssigned: string | null;
}

export interface BodyTrackingEntry {
  id: string;
  user: string;
  date: string;
  weight: number;
  fatMass: number | null;
  muscleMass: number | null;
  boneMass: number | null;
  visceralFat: number | null;
  metabolicRate: number | null;
  metabolicAge: number | null;
  waterMass: number | null;
  note: string;
}

export interface FormData {
  date: string;
  weight: string;
  fatMass: string;
  muscleMass: string;
  boneMass: string;
  visceralFat: string;
  metabolicRate: string;
  metabolicAge: string;
  waterMass: string;
  note: string;
}

export interface ChartDataPoint {
  date: string;
  weight: number;
  fatMass: number | null;
  muscleMass: number | null;
  waterMass: number | null;
  metabolicRate: number | null;
}

export interface BodyCompositionData {
  name: string;
  value: number;
  color: string;
}

export interface ProgressSummary {
  weightChange: number;
  fatLoss: number;
  muscleGain: number;
  days: number;
}

export interface GoalInfo {
  label: string;
  color: string;
}

export type UserRole = "member" | "trainer";
export type ActiveTab = "overview" | "chart" | "history";
