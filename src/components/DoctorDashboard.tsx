import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  User as UserIcon, 
  Stethoscope, 
  Plus, 
  Trash2, 
  Pill, 
  AlertCircle, 
  DollarSign, 
  Building2, 
  Video, 
  Activity,
  Award,
  ChevronDown
} from 'lucide-react';
import { Appointment, Doctor, MedicalRecord, PrescriptionItem, User, UserRole } from '../types';
import { StorageService } from '../services/storageService';

interface DoctorDashboardProps {
  currentUser: User | null;
  doctors: Doctor[];
  appointments: Appointment[];
  onRefreshAppointments: () => void;
  onViewMedicalRecord: (appointment: Appointment) => void;
  onOpenAuth?: (mode?: 'LOGIN' | 'REGISTER', role?: UserRole) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  currentUser,
  doctors,
  appointments,
  onRefreshAppointments,
  onViewMedicalRecord,
  onOpenAuth,
}) => {
  if (!currentUser || currentUser.role !== 'DOCTOR') {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 max-w-md mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Doctor Portal Authentication</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Please sign in with your registered Doctor credentials to manage clinical queues, write prescriptions, and update room availability.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onOpenAuth?.('LOGIN', 'DOCTOR')}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Doctor Sign In
          </button>
          <button
            onClick={() => onOpenAuth?.('REGISTER', 'DOCTOR')}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Register as Doctor
          </button>
        </div>
      </div>
    );
  }

  // Determine selected doctor: if user is DOCTOR with doctorId, use that; else default to first doctor
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    currentUser.doctorId || doctors[0].id
  );

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  // Tab filter: Today's, Upcoming, Completed, All
  const [filterMode, setFilterMode] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');

  // Consultation & Prescription Writer Modal state
  const [activeConsultationApt, setActiveConsultationApt] = useState<Appointment | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { medicine: '', dosage: '', frequency: 'Twice daily after meals', duration: '5 days', notes: '' },
  ]);

  // Appointments for this doctor
  const doctorAppointments = appointments.filter(a => a.doctorId === selectedDoctor.id);

  const filteredAppointments = doctorAppointments.filter(a => {
    if (filterMode === 'UPCOMING') return a.status === 'CONFIRMED' || a.status === 'PENDING';
    if (filterMode === 'COMPLETED') return a.status === 'COMPLETED';
    return true;
  });

  const pendingCount = doctorAppointments.filter(a => a.status === 'PENDING').length;
  const confirmedCount = doctorAppointments.filter(a => a.status === 'CONFIRMED').length;
  const completedCount = doctorAppointments.filter(a => a.status === 'COMPLETED').length;
  const totalRevenue = doctorAppointments
    .filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED')
    .reduce((sum, a) => sum + a.fee, 0);

  // Toggle doctor availability
  const handleToggleAvailability = () => {
    StorageService.updateDoctorAvailability(selectedDoctor.id, !selectedDoctor.isAvailableToday);
    onRefreshAppointments();
  };

  // Quick Status update
  const handleUpdateStatus = (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    StorageService.updateAppointmentStatus(id, status);
    onRefreshAppointments();
  };

  // Open Prescription Form
  const handleStartConsultation = (apt: Appointment) => {
    setActiveConsultationApt(apt);
    setDiagnosis(apt.medicalRecord?.diagnosis || '');
    setSymptoms(apt.medicalRecord?.symptoms || apt.reason || '');
    setDoctorNotes(apt.medicalRecord?.doctorNotes || '');
    setFollowUpDate(apt.medicalRecord?.followUpDate || '');
    if (apt.medicalRecord?.prescriptions?.length) {
      setPrescriptions(apt.medicalRecord.prescriptions);
    } else {
      setPrescriptions([
        { medicine: '', dosage: '', frequency: 'Twice daily after meals', duration: '5 days', notes: '' },
      ]);
    }
  };

  // Prescription Form items helpers
  const handleAddMedicine = () => {
    setPrescriptions(prev => [
      ...prev,
      { medicine: '', dosage: '', frequency: 'Once daily in morning', duration: '7 days', notes: '' },
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateMedicine = (index: number, field: keyof PrescriptionItem, value: string) => {
    setPrescriptions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Submit Consultation & Prescription
  const handleSaveConsultation = () => {
    if (!activeConsultationApt) return;
    if (!diagnosis.trim()) {
      alert('Please enter a clinical diagnosis.');
      return;
    }

    const validPrescriptions = prescriptions.filter(p => p.medicine.trim() !== '');

    const record: MedicalRecord = {
      diagnosis: diagnosis.trim(),
      symptoms: symptoms.trim(),
      doctorNotes: doctorNotes.trim(),
      prescriptions: validPrescriptions,
      followUpDate: followUpDate || undefined,
      createdAt: new Date().toISOString(),
    };

    StorageService.addMedicalRecord(activeConsultationApt.id, record);
    setActiveConsultationApt(null);
    onRefreshAppointments();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Doctor Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={selectedDoctor.image}
              alt={selectedDoctor.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{selectedDoctor.name}</h1>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Doctor Management Portal
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {selectedDoctor.title} • {selectedDoctor.specialty}
              </p>
              <p className="text-[11px] text-slate-400">
                Clinic: {selectedDoctor.roomNumber}, {selectedDoctor.clinicAddress}
              </p>
            </div>
          </div>

          {/* Switch Doctor Dropdown (for testing different doctor accounts) */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
              <span className="text-slate-400 font-medium">Viewing as:</span>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>

            {/* In-Clinic Availability Toggle */}
            <button
              onClick={handleToggleAvailability}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedDoctor.isAvailableToday
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-100 border-slate-300 text-slate-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${selectedDoctor.isAvailableToday ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>Today's Status: {selectedDoctor.isAvailableToday ? 'Available & Accepting' : 'Off-Duty'}</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Scheduled Visits</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{confirmedCount}</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending Approval</span>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Completed</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Gross Billed</span>
            <p className="text-2xl font-black text-blue-600 mt-1">${totalRevenue}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 w-fit">
        <button
          onClick={() => setFilterMode('ALL')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filterMode === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Appointments ({doctorAppointments.length})
        </button>
        <button
          onClick={() => setFilterMode('UPCOMING')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filterMode === 'UPCOMING'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Active Queue ({confirmedCount + pendingCount})
        </button>
        <button
          onClick={() => setFilterMode('COMPLETED')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            filterMode === 'COMPLETED'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Completed Records ({completedCount})
        </button>
      </div>

      {/* Appointment Queue List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No appointments in this view</h3>
          <p className="text-xs text-slate-500 mt-1">
            When patients book consultations for {selectedDoctor.name}, they will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => {
            const isPending = apt.status === 'PENDING';
            const isConfirmed = apt.status === 'CONFIRMED';
            const isCompleted = apt.status === 'COMPLETED';
            const isCancelled = apt.status === 'CANCELLED';

            return (
              <div
                key={apt.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Patient Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">#{apt.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isConfirmed 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isPending 
                          ? 'bg-amber-100 text-amber-800' 
                          : isCompleted 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {apt.status}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 flex items-center gap-1">
                        {apt.visitType === 'IN_PERSON' ? <Building2 className="w-3 h-3 text-emerald-600" /> : <Video className="w-3 h-3 text-purple-600" />}
                        <span>{apt.visitType === 'IN_PERSON' ? 'Clinic Visit' : 'Telehealth Video'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{apt.patientName}</h3>
                      <span className="text-xs text-slate-500 font-medium">
                        ({apt.patientAge} years, {apt.patientGender})
                      </span>
                      <span className="text-xs text-slate-400">• Phone: {apt.patientPhone}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {apt.timeSlot}
                      </span>
                      <span className="text-emerald-700 font-bold">${apt.fee} consultation fee</span>
                    </div>

                    {/* Patient Complaint / Symptoms */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium block">Chief Complaint / Symptoms:</span>
                      <p className="text-slate-800 font-medium mt-0.5">{apt.reason}</p>
                    </div>

                    {isCompleted && apt.medicalRecord && (
                      <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/60 text-xs">
                        <span className="text-emerald-800 font-bold block">
                          Recorded Diagnosis: {apt.medicalRecord.diagnosis}
                        </span>
                        <p className="text-slate-600 text-[11px] mt-0.5">
                          {apt.medicalRecord.prescriptions.length} medications prescribed • Follow-up: {apt.medicalRecord.followUpDate || 'None set'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Doctor Action Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* If pending: Approve or Decline */}
                    {isPending && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Confirm</span>
                      </button>
                    )}

                    {/* Start Consultation / Write Prescription */}
                    {!isCancelled && (
                      <button
                        onClick={() => handleStartConsultation(apt)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Edit Prescription' : 'Complete & Prescribe'}</span>
                      </button>
                    )}

                    {/* View Prescription if completed */}
                    {isCompleted && apt.medicalRecord && (
                      <button
                        onClick={() => onViewMedicalRecord(apt)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <span>View Slip</span>
                      </button>
                    )}

                    {/* Cancel button if not cancelled */}
                    {!isCancelled && !isCompleted && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                        className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Write Clinical Diagnosis & Prescriptions */}
      {activeConsultationApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>Clinical Consultation & Prescription Slip</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Patient: {activeConsultationApt.patientName} ({activeConsultationApt.patientAge}y) • #{activeConsultationApt.id}
                </p>
              </div>
              <button
                onClick={() => setActiveConsultationApt(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Diagnosis */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Primary Clinical Diagnosis *
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Viral Bronchitis, Essential Hypertension..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Symptoms / Clinical Examination */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Observed Symptoms & Vital Signs
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. BP 125/80, Pulse 76 bpm, clear breath sounds..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Prescriptions (Table / List) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Prescribed Medications (Rx)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {prescriptions.map((p, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Medicine name (e.g. Amoxicillin 500mg)"
                          value={p.medicine}
                          onChange={(e) => handleUpdateMedicine(idx, 'medicine', e.target.value)}
                          className="flex-1 px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-medium"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g. 1 tab)"
                          value={p.dosage}
                          onChange={(e) => handleUpdateMedicine(idx, 'dosage', e.target.value)}
                          className="w-24 px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-medium"
                        />
                        {prescriptions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(idx)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Frequency (e.g. 2x daily after food)"
                          value={p.frequency}
                          onChange={(e) => handleUpdateMedicine(idx, 'frequency', e.target.value)}
                          className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g. 5 days)"
                          value={p.duration}
                          onChange={(e) => handleUpdateMedicine(idx, 'duration', e.target.value)}
                          className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="Special instructions"
                          value={p.notes || ''}
                          onChange={(e) => handleUpdateMedicine(idx, 'notes', e.target.value)}
                          className="px-2 py-1 bg-white rounded-lg border border-slate-200 text-[11px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor's Advice & Lifestyle Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Doctor's Advice & Care Plan
                </label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="e.g. Adequate rest, drink 2.5L water daily, avoid strenuous physical activity for 48 hours..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Follow-up date */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Next Follow-up Consultation Date (Optional)
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveConsultationApt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConsultation}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/30 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Complete Consultation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
