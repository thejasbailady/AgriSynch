
export enum UserRole {
  Admin = 'Admin',
  Supervisor = 'Supervisor',
  Worker = 'Worker',
}

export interface Crop {
  id: string;
  name: string;
  type: string;
  sowDate: string;
  harvestDate: string;
  fieldId: string;
  healthStatus: 'Healthy' | 'Monitor' | 'At Risk';
  photos: { id: string; url: string; date: string }[];
  diseaseLog: DiseaseLog[];
  fertilizerLog: FertilizerLog[];
  waterLog: WaterLog[];
}

export interface LogEntry {
  id: string;
  date: string;
}

export interface DiseaseLog extends LogEntry {
  symptoms: string;
  severity: 'Low' | 'Medium' | 'High';
  treatment: string;
  image?: string;
}

export interface FertilizerLog extends LogEntry {
  type: string;
  amount: number; // in kg
}

export interface WaterLog extends LogEntry {
  amount: number; // in liters
  duration: number; // in minutes
}

export interface Worker {
  id: string;
  name: string;
  role: 'Field Hand' | 'Supervisor' | 'Technician';
  assignedFieldId?: string;
}

export interface AttendanceRecord {
  id: string;
  workerId: string;
  checkIn: string;
  checkOut?: string;
  task: string;
}

export interface Field {
  id: string;
  name: string;
  cropId?: string;
  workerId?: string;
}

export interface PesticideEntry {
  id: string;
  name: string;
  target: string;
  dosage: string;
  date: string;
  safetyGuidelines: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'Alert' | 'Info' | 'Success';
  timestamp: string;
  read: boolean;
}

export interface WeatherDay {
  date: string;
  temp: number;
  rainfall: number;
  wind: number;
  humidity: number;
  condition: 'Sunny' | 'Cloudy' | 'Rain' | 'Storm';
}

export interface YieldData {
  season: string;
  yield: number;
}

export interface CostData {
  month: string;
  cost: number;
  output: number;
}
