import { Doctor, Appointment, User, AppointmentStatus, MedicalRecord, UserRole } from '../types';
import { INITIAL_DOCTORS } from '../data/mockData';

const STORAGE_KEYS = {
  DOCTORS: 'medpulse_doctors_v2',
  APPOINTMENTS: 'medpulse_appointments_v2',
  USERS: 'medpulse_users_v2',
  CURRENT_USER: 'medpulse_session_user_v2',
};

// Safe JSON parse helper
function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // Initialize storage: no fake user sessions, no fake appointments
  initialize(): void {
    if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
      setStoredItem(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      setStoredItem(STORAGE_KEYS.APPOINTMENTS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      setStoredItem(STORAGE_KEYS.USERS, []);
    }
  },

  // Reset demo data to clean initial state (clears all appointments & registered users)
  resetData(): void {
    setStoredItem(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    setStoredItem(STORAGE_KEYS.APPOINTMENTS, []);
    setStoredItem(STORAGE_KEYS.USERS, []);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Current logged in user (null if guest/unauthenticated)
  getCurrentUser(): User | null {
    return getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Registered Users list
  getUsers(): User[] {
    return getStoredItem<User[]>(STORAGE_KEYS.USERS, []);
  },

  // Mock Authentication: Register new user
  register(data: {
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: UserRole;
    specialty?: string;
    age?: number;
    gender?: 'Male' | 'Female' | 'Other';
    bloodGroup?: string;
    allergies?: string;
  }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const normalizedEmail = data.email.trim().toLowerCase();

    // Check if email already registered
    const exists = users.some(u => u.email.trim().toLowerCase() === normalizedEmail);
    if (exists) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    const userId = `user-${Date.now()}`;
    let doctorId: string | undefined = undefined;

    // If registering as a doctor, add doctor profile to doctors directory
    if (data.role === 'DOCTOR') {
      doctorId = `doc-${Date.now()}`;
      const specialtyName = data.specialty || 'General Medicine';
      const newDoctor: Doctor = {
        id: doctorId,
        name: data.name.startsWith('Dr.') ? data.name : `Dr. ${data.name}`,
        title: `Consultant ${specialtyName}`,
        specialty: specialtyName,
        qualification: 'MD, Board Certified',
        experienceYears: 5,
        rating: 5.0,
        reviewCount: 0,
        consultationFee: 100,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
        clinicAddress: 'MedPulse Outpatient Pavilion, 3rd Floor',
        roomNumber: 'Room 302',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        bio: `${data.name} is a specialist in ${specialtyName} providing comprehensive care and clinical consultations.`,
        education: ['MD - Board Certified Specialist'],
        languages: ['English'],
        availableSlots: [
          '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
          '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM'
        ],
        isAvailableToday: true,
      };

      const doctors = this.getDoctors();
      doctors.unshift(newDoctor);
      setStoredItem(STORAGE_KEYS.DOCTORS, doctors);
    }

    const newUser: User = {
      id: userId,
      name: data.role === 'DOCTOR' && !data.name.startsWith('Dr.') ? `Dr. ${data.name}` : data.name,
      email: normalizedEmail,
      password: data.password || '',
      phone: data.phone || '',
      role: data.role,
      specialty: data.specialty,
      doctorId,
      patientProfile: data.role === 'PATIENT' ? {
        age: data.age || 28,
        gender: data.gender || 'Female',
        bloodGroup: data.bloodGroup || 'O+',
        allergies: data.allergies || 'None',
        emergencyContact: data.phone || '',
      } : undefined,
    };

    users.push(newUser);
    setStoredItem(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  },

  // Mock Authentication: Sign in with credentials
  login(data: {
    email: string;
    password?: string;
    role?: UserRole;
  }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const normalizedEmail = data.email.trim().toLowerCase();

    // Find user by email
    const user = users.find(u => u.email.trim().toLowerCase() === normalizedEmail);
    if (!user) {
      return {
        success: false,
        error: 'No account found with this email. Please register first.',
      };
    }

    // Validate password if user set a password
    if (user.password && data.password && user.password !== data.password) {
      return {
        success: false,
        error: 'Incorrect password. Please verify and try again.',
      };
    }

    // Role check if specified
    if (data.role && user.role !== data.role) {
      return {
        success: false,
        error: `This account is registered as a ${user.role}. Please select the ${user.role} tab to sign in.`,
      };
    }

    // Set active session
    this.setCurrentUser(user);
    return { success: true, user };
  },

  // Mock Authentication: Log out
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Doctors
  getDoctors(): Doctor[] {
    return getStoredItem<Doctor[]>(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
  },

  getDoctorById(id: string): Doctor | undefined {
    return this.getDoctors().find(d => d.id === id);
  },

  updateDoctorAvailability(id: string, isAvailable: boolean): void {
    const doctors = this.getDoctors().map(doc => {
      if (doc.id === id) {
        return { ...doc, isAvailableToday: isAvailable };
      }
      return doc;
    });
    setStoredItem(STORAGE_KEYS.DOCTORS, doctors);
  },

  // Appointments
  getAppointments(): Appointment[] {
    return getStoredItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
  },

  getAppointmentById(id: string): Appointment | undefined {
    return this.getAppointments().find(a => a.id === id);
  },

  getAppointmentsByPatient(patientId: string, email?: string): Appointment[] {
    return this.getAppointments().filter(
      a => a.patientId === patientId || (email && a.patientEmail.toLowerCase() === email.toLowerCase())
    );
  },

  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return this.getAppointments().filter(a => a.doctorId === doctorId);
  },

  // Check if a time slot is already booked for a doctor on a specific date
  isSlotBooked(doctorId: string, date: string, timeSlot: string): boolean {
    const appointments = this.getAppointments();
    return appointments.some(
      a =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.timeSlot === timeSlot &&
        a.status !== 'CANCELLED'
    );
  },

  // Book a new appointment
  bookAppointment(appointmentData: Omit<Appointment, 'id' | 'bookedAt' | 'status'>): Appointment {
    const appointments = this.getAppointments();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `MED-${randomNum}`,
      status: 'CONFIRMED',
      bookedAt: new Date().toISOString(),
    };
    appointments.unshift(newAppointment);
    setStoredItem(STORAGE_KEYS.APPOINTMENTS, appointments);
    return newAppointment;
  },

  // Update appointment status (e.g. CANCELLED, COMPLETED, CONFIRMED)
  updateAppointmentStatus(id: string, status: AppointmentStatus, cancellationReason?: string): Appointment | null {
    const appointments = this.getAppointments();
    let updated: Appointment | null = null;
    const newAppointments = appointments.map(apt => {
      if (apt.id === id) {
        updated = {
          ...apt,
          status,
          ...(cancellationReason ? { cancellationReason } : {}),
        };
        return updated;
      }
      return apt;
    });
    setStoredItem(STORAGE_KEYS.APPOINTMENTS, newAppointments);
    return updated;
  },

  // Reschedule appointment
  rescheduleAppointment(id: string, date: string, timeSlot: string): Appointment | null {
    const appointments = this.getAppointments();
    let updated: Appointment | null = null;
    const newAppointments = appointments.map(apt => {
      if (apt.id === id) {
        updated = {
          ...apt,
          date,
          timeSlot,
          status: 'CONFIRMED',
        };
        return updated;
      }
      return apt;
    });
    setStoredItem(STORAGE_KEYS.APPOINTMENTS, newAppointments);
    return updated;
  },

  // Add clinical consultation record (Doctor writes diagnosis & prescription)
  addMedicalRecord(appointmentId: string, record: MedicalRecord): Appointment | null {
    const appointments = this.getAppointments();
    let updated: Appointment | null = null;
    const newAppointments = appointments.map(apt => {
      if (apt.id === appointmentId) {
        updated = {
          ...apt,
          status: 'COMPLETED',
          medicalRecord: record,
        };
        return updated;
      }
      return apt;
    });
    setStoredItem(STORAGE_KEYS.APPOINTMENTS, newAppointments);
    return updated;
  },
};
