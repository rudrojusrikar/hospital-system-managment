/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DoctorDirectory } from './components/DoctorDirectory';
import { BookingModal } from './components/BookingModal';
import { AppointmentReceiptModal } from './components/AppointmentReceiptModal';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { MedicalRecordModal } from './components/MedicalRecordModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { StorageService } from './services/storageService';
import { Appointment, Doctor, User, UserRole } from './types';
import { HeartPulse, ShieldCheck, PhoneCall, Calendar } from 'lucide-react';

export default function App() {
  // Initialize storage once on mount
  useEffect(() => {
    StorageService.initialize();
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(() => StorageService.getCurrentUser());
  const [doctors, setDoctors] = useState<Doctor[]>(() => StorageService.getDoctors());
  const [appointments, setAppointments] = useState<Appointment[]>(() => StorageService.getAppointments());
  const [currentTab, setCurrentTab] = useState<'directory' | 'patient' | 'doctor' | 'admin'>('directory');

  // Modals state
  const [detailDoctor, setDetailDoctor] = useState<Doctor | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [receiptAppointment, setReceiptAppointment] = useState<Appointment | null>(null);
  const [medicalRecordAppointment, setMedicalRecordAppointment] = useState<Appointment | null>(null);
  
  // Auth modal configuration state
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    mode: 'LOGIN' | 'REGISTER';
    role: UserRole;
  }>({
    isOpen: false,
    mode: 'LOGIN',
    role: 'PATIENT',
  });

  // Toast state
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  // Sync state from storage
  const refreshState = useCallback(() => {
    setDoctors(StorageService.getDoctors());
    setAppointments(StorageService.getAppointments());
    setCurrentUser(StorageService.getCurrentUser());
  }, []);

  const handleOpenAuth = (mode: 'LOGIN' | 'REGISTER' = 'LOGIN', role: UserRole = 'PATIENT') => {
    setAuthModalConfig({
      isOpen: true,
      mode,
      role,
    });
  };

  const handleUserLoggedIn = (user: User) => {
    setCurrentUser(user);
    refreshState();
    setToast({
      message: `Signed in successfully as ${user.name} (${user.role})`,
      type: 'success',
    });
    if (user.role === 'DOCTOR') {
      setCurrentTab('doctor');
    } else {
      setCurrentTab('patient');
    }
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    refreshState();
    setToast({
      message: 'You have been signed out successfully.',
      type: 'info',
    });
    setCurrentTab('directory');
  };

  const handleResetData = () => {
    if (window.confirm('Clear all registered users and booked appointments? (Reverts to empty clinic database)')) {
      StorageService.resetData();
      refreshState();
      setToast({
        message: 'System database cleared. All mock data reset to clean initial state.',
        type: 'info',
      });
    }
  };

  // Handle booking success
  const handleBookingSuccess = (newApt: Appointment) => {
    setBookingDoctor(null);
    refreshState();
    setReceiptAppointment(newApt);
    setToast({
      message: `Appointment scheduled successfully! Booking ID: ${newApt.id}`,
      type: 'success',
    });
  };

  // Compute upcoming appointment count for current patient (0 if not logged in)
  const upcomingCount = currentUser
    ? appointments.filter(
        a => (a.patientId === currentUser.id || a.patientEmail.toLowerCase() === currentUser.email.toLowerCase()) &&
             (a.status === 'CONFIRMED' || a.status === 'PENDING')
      ).length
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Clinic Header */}
      <Header
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        upcomingCount={upcomingCount}
        onOpenAuth={(mode) => handleOpenAuth(mode || 'LOGIN', 'PATIENT')}
        onLogout={handleLogout}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {currentTab === 'directory' && (
          <DoctorDirectory
            doctors={doctors}
            onSelectDoctor={(doc) => setDetailDoctor(doc)}
            onBookAppointment={(doc) => setBookingDoctor(doc)}
          />
        )}

        {currentTab === 'patient' && (
          <PatientDashboard
            currentUser={currentUser}
            appointments={appointments}
            onRefreshAppointments={refreshState}
            onViewReceipt={(apt) => setReceiptAppointment(apt)}
            onViewMedicalRecord={(apt) => setMedicalRecordAppointment(apt)}
            onNavigateToDirectory={() => setCurrentTab('directory')}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'doctor' && (
          <DoctorDashboard
            currentUser={currentUser}
            doctors={doctors}
            appointments={appointments}
            onRefreshAppointments={refreshState}
            onViewMedicalRecord={(apt) => setMedicalRecordAppointment(apt)}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            doctors={doctors}
            appointments={appointments}
            users={StorageService.getUsers()}
            onRefreshData={refreshState}
            onViewReceipt={(apt) => setReceiptAppointment(apt)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">MedPulse Clinic • Online Doctor Appointment System</p>
              <p className="text-[11px] text-slate-400">HIPAA Compliant Outpatient Scheduling & Telehealth Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button
              onClick={() => setCurrentTab('directory')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Browse Specialists
            </button>
            <button
              onClick={() => setCurrentTab('patient')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Patient Portal
            </button>
            <button
              onClick={() => setCurrentTab('doctor')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Doctor Schedule
            </button>
            <button
              onClick={() => setCurrentTab('admin')}
              className="hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Clinic Admin
            </button>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Clear Storage
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {detailDoctor && (
        <DoctorDetailModal
          doctor={detailDoctor}
          onClose={() => setDetailDoctor(null)}
          onBookAppointment={(doc) => {
            setDetailDoctor(null);
            setBookingDoctor(doc);
          }}
        />
      )}

      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          currentUser={currentUser}
          onClose={() => setBookingDoctor(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {receiptAppointment && (
        <AppointmentReceiptModal
          appointment={receiptAppointment}
          onClose={() => setReceiptAppointment(null)}
          onViewAllAppointments={() => {
            setReceiptAppointment(null);
            setCurrentTab('patient');
          }}
        />
      )}

      {medicalRecordAppointment && (
        <MedicalRecordModal
          appointment={medicalRecordAppointment}
          onClose={() => setMedicalRecordAppointment(null)}
        />
      )}

      {authModalConfig.isOpen && (
        <AuthModal
          initialMode={authModalConfig.mode}
          defaultRole={authModalConfig.role}
          onClose={() => setAuthModalConfig(prev => ({ ...prev, isOpen: false }))}
          onUserLoggedIn={handleUserLoggedIn}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
