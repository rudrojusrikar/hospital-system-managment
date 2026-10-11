import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  XCircle, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Video, 
  Building2, 
  Search, 
  Printer, 
  User as UserIcon,
  Phone,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Appointment, User, AppointmentStatus } from '../types';
import { StorageService } from '../services/storageService';

interface PatientDashboardProps {
  currentUser: User | null;
  appointments: Appointment[];
  onRefreshAppointments: () => void;
  onViewReceipt: (appointment: Appointment) => void;
  onViewMedicalRecord: (appointment: Appointment) => void;
  onNavigateToDirectory: () => void;
  onOpenAuth?: (mode?: 'LOGIN' | 'REGISTER') => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  currentUser,
  appointments,
  onRefreshAppointments,
  onViewReceipt,
  onViewMedicalRecord,
  onNavigateToDirectory,
  onOpenAuth,
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | AppointmentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Reschedule state modal
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');

  // Cancellation state modal
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Video call active modal
  const [videoCallApt, setVideoCallApt] = useState<Appointment | null>(null);

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 max-w-md mx-auto my-12 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Sign In to View Appointments</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Please log in or register a patient account to access your scheduled visits, appointment passes, and prescriptions.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onOpenAuth?.('LOGIN')}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => onOpenAuth?.('REGISTER')}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  // Filter appointments for the current user
  const userAppointments = appointments.filter(
    apt => apt.patientId === currentUser.id || apt.patientEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const filteredAppointments = userAppointments.filter(apt => {
    const matchesStatus = filterStatus === 'ALL' || apt.status === filterStatus;
    const matchesSearch = 
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const upcomingCount = userAppointments.filter(
    a => a.status === 'CONFIRMED' || a.status === 'PENDING'
  ).length;
  const completedCount = userAppointments.filter(a => a.status === 'COMPLETED').length;
  const cancelledCount = userAppointments.filter(a => a.status === 'CANCELLED').length;

  // Handle Cancel Appointment
  const handleConfirmCancel = () => {
    if (!cancellingApt) return;
    StorageService.updateAppointmentStatus(
      cancellingApt.id,
      'CANCELLED',
      cancelReason.trim() || 'Patient requested cancellation'
    );
    setCancellingApt(null);
    setCancelReason('');
    onRefreshAppointments();
  };

  // Handle Reschedule Appointment
  const handleConfirmReschedule = () => {
    if (!reschedulingApt || !newDate || !newSlot) return;
    StorageService.rescheduleAppointment(reschedulingApt.id, newDate, newSlot);
    setReschedulingApt(null);
    setNewDate('');
    setNewSlot('');
    onRefreshAppointments();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Patient Profile & Overview Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{currentUser.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Patient Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.email} • {currentUser.phone}
              </p>
              {currentUser.patientProfile && (
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                    Blood Group: <strong>{currentUser.patientProfile.bloodGroup}</strong>
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                    Age: <strong>{currentUser.patientProfile.age}y</strong> ({currentUser.patientProfile.gender})
                  </span>
                  {currentUser.patientProfile.allergies && (
                    <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                      Allergies: {currentUser.patientProfile.allergies}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onNavigateToDirectory}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/30 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Upcoming Visits
              </span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{upcomingCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Completed Visits
              </span>
              <p className="text-2xl font-black text-blue-700 mt-1">{completedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Cancelled / Past
              </span>
              <p className="text-2xl font-black text-slate-600 mt-1">{cancelledCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/80">
          {(['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {status === 'ALL' ? `All (${userAppointments.length})` : status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by doctor, specialty, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No appointments found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery || filterStatus !== 'ALL'
              ? 'Try changing your filter settings or search query.'
              : 'You have not scheduled any doctor appointments yet.'}
          </p>
          <button
            onClick={onNavigateToDirectory}
            className="mt-5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Find a Doctor & Book Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => {
            const isConfirmed = apt.status === 'CONFIRMED';
            const isPending = apt.status === 'PENDING';
            const isCompleted = apt.status === 'COMPLETED';
            const isCancelled = apt.status === 'CANCELLED';

            return (
              <div
                key={apt.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Doctor & Appointment Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={apt.doctorImage}
                      alt={apt.doctorName}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          #{apt.id}
                        </span>
                        {/* Status Badge */}
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
                          {apt.visitType === 'IN_PERSON' ? (
                            <>
                              <Building2 className="w-3 h-3 text-emerald-600" />
                              <span>In-Person</span>
                            </>
                          ) : (
                            <>
                              <Video className="w-3 h-3 text-purple-600" />
                              <span>Telehealth Video</span>
                            </>
                          )}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{apt.doctorName}</h3>
                      <p className="text-xs font-medium text-emerald-700">{apt.doctorSpecialty}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          {apt.date}
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          {apt.timeSlot}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 line-clamp-1">{apt.clinicAddress}</span>
                      </div>

                      {/* Reason */}
                      <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <strong className="text-slate-700">Reason:</strong> {apt.reason}
                      </p>

                      {apt.cancellationReason && (
                        <p className="mt-1 text-xs text-red-600 bg-red-50 p-2 rounded-xl border border-red-100">
                          <strong>Cancellation Reason:</strong> {apt.cancellationReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side Action Buttons */}
                  <div className="flex flex-wrap lg:flex-col items-end gap-2 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* View Pass / Slip */}
                    <button
                      onClick={() => onViewReceipt(apt)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Appointment Pass</span>
                    </button>

                    {/* If Video Call and active */}
                    {apt.visitType === 'VIDEO_CALL' && !isCancelled && (
                      <button
                        onClick={() => setVideoCallApt(apt)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-xs cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Video Room</span>
                      </button>
                    )}

                    {/* View Prescription (if completed) */}
                    {isCompleted && apt.medicalRecord && (
                      <button
                        onClick={() => onViewMedicalRecord(apt)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Prescription</span>
                      </button>
                    )}

                    {/* Reschedule (only if upcoming) */}
                    {(isConfirmed || isPending) && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setReschedulingApt(apt);
                            setNewDate(apt.date);
                            setNewSlot(apt.timeSlot);
                          }}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reschedule</span>
                        </button>

                        <button
                          onClick={() => {
                            setCancellingApt(apt);
                            setCancelReason('');
                          }}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
              <span>Reschedule Appointment #{reschedulingApt.id}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select a new date and time slot for your consultation with {reschedulingApt.doctorName}.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">New Time Slot</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="09:45 AM">09:45 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:15 AM">11:15 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="02:45 PM">02:45 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:15 PM">04:15 PM</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setReschedulingApt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
              >
                Save New Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingApt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span>Cancel Appointment #{cancellingApt.id}</span>
            </h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel your consultation with <strong className="text-slate-900">{cancellingApt.doctorName}</strong> on {cancellingApt.date} at {cancellingApt.timeSlot}?
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Reason for cancellation (optional):
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Schedule conflict, feeling better, relocated..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setCancellingApt(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Consultation Room Demo Modal */}
      {videoCallApt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-6 max-w-xl w-full border border-slate-800 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 className="text-sm font-bold">Secure Telehealth Consultation Session</h3>
              </div>
              <button
                onClick={() => setVideoCallApt(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                Exit Call
              </button>
            </div>

            <div className="aspect-video bg-slate-950 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border border-slate-800">
              <img
                src={videoCallApt.doctorImage}
                alt={videoCallApt.doctorName}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/40 mb-3"
              />
              <p className="text-sm font-bold text-white">{videoCallApt.doctorName}</p>
              <p className="text-xs text-emerald-400">{videoCallApt.doctorSpecialty}</p>
              <div className="mt-3 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                Connected • 256-bit HIPAA Encrypted Stream
              </div>

              {/* Patient thumbnail preview */}
              <div className="absolute bottom-3 right-3 w-28 h-20 rounded-xl bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-[10px] text-slate-300">
                <UserIcon className="w-5 h-5 text-slate-400 mb-1" />
                <span>You (Camera ON)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div>
                <span>Patient: <strong className="text-white">{videoCallApt.patientName}</strong></span>
                <span className="mx-2">•</span>
                <span>Slot: <strong className="text-white">{videoCallApt.timeSlot}</strong></span>
              </div>
              <button
                onClick={() => setVideoCallApt(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
