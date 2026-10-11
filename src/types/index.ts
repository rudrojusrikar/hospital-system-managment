export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export type AppointmentStatus = 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';

export type VisitType = 'IN_PERSON' | 'VIDEO_CALL';

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  image: string;
  clinicAddress: string;
  roomNumber: string;
  availableDays: string[];
  bio: string;
  education: string[];
  languages: string[];
  availableSlots: string[];
  isAvailableToday: boolean;
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface MedicalRecord {
  diagnosis: string;
  symptoms: string;
  doctorNotes: string;
  prescriptions: PrescriptionItem[];
  followUpDate?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  clinicAddress: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  visitType: VisitType;
  reason: string;
  status: AppointmentStatus;
  fee: number;
  bookedAt: string;
  medicalRecord?: MedicalRecord;
  cancellationReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: UserRole;
  specialty?: string; // If role is DOCTOR
  avatar?: string;
  doctorId?: string; // If role is DOCTOR
  patientProfile?: {
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    bloodGroup: string;
    allergies: string;
    emergencyContact: string;
  };
}

export interface SpecialtyCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  doctorCount: number;
}
