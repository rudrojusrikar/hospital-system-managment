import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User as UserIcon, 
  MapPin, 
  Video, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { Doctor, Appointment, User, VisitType } from '../types';
import { StorageService } from '../services/storageService';

interface BookingModalProps {
  doctor: Doctor;
  currentUser: User | null;
  onClose: () => void;
  onBookingSuccess: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  currentUser,
  onClose,
  onBookingSuccess,
}) => {
  // Steps: 1 = Date & Time, 2 = Patient Details, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Generate next 14 available dates
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayFull = d.toLocaleDateString('en-US', { weekday: 'long' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNum = d.getDate();
      const isWorkingDay = doctor.availableDays.includes(dayFull);

      dates.push({
        iso,
        dayName,
        monthName,
        dayNum,
        isWorkingDay,
        isToday: i === 0,
        isTomorrow: i === 1,
      });
    }
    return dates;
  }, [doctor]);

  // Default to first working day
  const defaultDate = availableDates.find(d => d.isWorkingDay)?.iso || availableDates[0].iso;

  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [visitType, setVisitType] = useState<VisitType>('IN_PERSON');

  // Patient Intake Form
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientAge, setPatientAge] = useState<number>(currentUser?.patientProfile?.age || 28);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>(currentUser?.patientProfile?.gender || 'Female');
  const [reason, setReason] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Quick symptom chips
  const quickSymptoms = [
    'Routine Health Check',
    'Follow-up Consultation',
    'Chest Discomfort',
    'Fever & Cough',
    'Skin Rash / Allergy',
    'Severe Headache',
    'Joint Pain / Swelling',
    'Prescription Refill',
  ];

  // Group doctor slots into Morning and Afternoon
  const morningSlots = doctor.availableSlots.filter(s => s.includes('AM'));
  const afternoonSlots = doctor.availableSlots.filter(s => s.includes('PM'));

  // Handler for booking submission
  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlot) {
      setErrorMsg('Please select a date and an available time slot.');
      setStep(1);
      return;
    }
    if (!patientName.trim() || !patientPhone.trim() || !reason.trim()) {
      setErrorMsg('Please complete all required patient intake fields.');
      setStep(2);
      return;
    }

    // Verify slot is still available
    if (StorageService.isSlotBooked(doctor.id, selectedDate, selectedSlot)) {
      setErrorMsg('This slot was just reserved. Please select another slot.');
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const fullReason = medicalNotes ? `${reason.trim()} (Notes: ${medicalNotes.trim()})` : reason.trim();

      const newAppointment = StorageService.bookAppointment({
        patientId: currentUser?.id || `patient-${Date.now()}`,
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim(),
        patientPhone: patientPhone.trim(),
        patientAge: Number(patientAge) || 30,
        patientGender,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorImage: doctor.image,
        clinicAddress: doctor.clinicAddress,
        date: selectedDate,
        timeSlot: selectedSlot,
        visitType,
        reason: fullReason,
        fee: doctor.consultationFee,
      });

      setIsSubmitting(false);
      onBookingSuccess(newAppointment);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg('Failed to process booking. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-emerald-500/50"
            />
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Book Consultation with {doctor.name}
              </h2>
              <p className="text-xs text-emerald-400 font-medium">
                {doctor.specialty} • ${doctor.consultationFee} fee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Step Indicator */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
              step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              1
            </span>
            <span className={step === 1 ? 'font-bold text-slate-900' : 'text-slate-500'}>
              Date & Slot
            </span>
          </div>

          <div className="w-8 h-0.5 bg-slate-200"></div>

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
              step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </span>
            <span className={step === 2 ? 'font-bold text-slate-900' : 'text-slate-500'}>
              Patient Details
            </span>
          </div>

          <div className="w-8 h-0.5 bg-slate-200"></div>

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
              step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              3
            </span>
            <span className={step === 3 ? 'font-bold text-slate-900' : 'text-slate-500'}>
              Review & Book
            </span>
          </div>
        </div>

        {/* Error message banner if any */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Date & Time Slot Selection */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Consultation Type Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Select Consultation Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVisitType('IN_PERSON')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      visitType === 'IN_PERSON'
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${visitType === 'IN_PERSON' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">In-Person Clinic Visit</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{doctor.roomNumber}, {doctor.clinicAddress}</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisitType('VIDEO_CALL')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      visitType === 'VIDEO_CALL'
                        ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${visitType === 'VIDEO_CALL' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">HD Video Telehealth</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Secure encrypted virtual room link sent to your email</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Selection Horizon */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Appointment Date
                  </label>
                  <span className="text-xs text-slate-500">
                    Clinic Days: <strong className="text-slate-800">{doctor.availableDays.join(', ')}</strong>
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
                  {availableDates.map((d) => {
                    const isSelected = selectedDate === d.iso;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        disabled={!d.isWorkingDay}
                        onClick={() => {
                          setSelectedDate(d.iso);
                          setSelectedSlot(''); // Reset slot on date change
                        }}
                        className={`shrink-0 w-16 p-2.5 rounded-2xl flex flex-col items-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-600'
                            : !d.isWorkingDay
                            ? 'bg-slate-100 text-slate-400 opacity-50 cursor-not-allowed'
                            : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-[10px] font-semibold uppercase">
                          {d.isToday ? 'Today' : d.isTomorrow ? 'Tmrw' : d.dayName}
                        </span>
                        <span className="text-lg font-black my-0.5">{d.dayNum}</span>
                        <span className="text-[10px] opacity-80">{d.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Select Available Time Slot
                </label>

                <div className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  {/* Morning Slots */}
                  {morningSlots.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Morning Consultation Slots</span>
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {morningSlots.map((slot) => {
                          const isBooked = StorageService.isSlotBooked(doctor.id, selectedDate, slot);
                          const isSelected = selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : isBooked
                                  ? 'bg-slate-200/80 text-slate-400 cursor-not-allowed line-through'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                              }`}
                            >
                              <span>{slot}</span>
                              {isBooked && (
                                <span className="block text-[8px] font-bold text-red-500">Booked</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Afternoon Slots */}
                  {afternoonSlots.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>Afternoon / Evening Consultation Slots</span>
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {afternoonSlots.map((slot) => {
                          const isBooked = StorageService.isSlotBooked(doctor.id, selectedDate, slot);
                          const isSelected = selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : isBooked
                                  ? 'bg-slate-200/80 text-slate-400 cursor-not-allowed line-through'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                              }`}
                            >
                              <span>{slot}</span>
                              {isBooked && (
                                <span className="block text-[8px] font-bold text-red-500">Booked</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Patient Intake Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Patient Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Chief complaint / Reason */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Reason for Consultation / Symptoms *
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe your symptoms, how long you've had them, or reason for this consultation..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {/* Quick suggestions */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-400 self-center">Quick tags:</span>
                  {quickSymptoms.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => setReason(prev => prev ? `${prev}, ${sym}` : sym)}
                      className="text-[10px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/60 transition-colors"
                    >
                      + {sym}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Past Medical History / Known Allergies (Optional)
                </label>
                <input
                  type="text"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  placeholder="e.g. Asthma, Penicillin allergy, Hypertension..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Review & Summary */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Review Appointment Summary</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Doctor</span>
                    <p className="font-bold text-slate-900">{doctor.name}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">{doctor.specialty}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Schedule</span>
                    <p className="font-bold text-slate-900">{selectedDate}</p>
                    <p className="text-[11px] text-slate-600 font-semibold">{selectedSlot}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Visit Mode</span>
                    <p className="font-bold text-slate-900">
                      {visitType === 'IN_PERSON' ? 'In-Person Clinic Visit' : 'HD Video Call'}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {visitType === 'IN_PERSON' ? doctor.roomNumber : 'Encrypted Link'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Fee</span>
                    <p className="text-base font-black text-slate-900">${doctor.consultationFee}</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Payable at clinic or post-visit</p>
                  </div>
                </div>
              </div>

              {/* Patient Review card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Patient:</span>
                  <span className="font-bold text-slate-900">{patientName} ({patientAge}y, {patientGender})</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Phone & Email:</span>
                  <span className="text-slate-700">{patientPhone} • {patientEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Chief Complaint:</span>
                  <p className="text-slate-800 font-medium mt-1 bg-white p-2.5 rounded-xl border border-slate-200/60">
                    {reason}
                    {medicalNotes && <span className="block text-slate-500 mt-1">Note: {medicalNotes}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 px-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant reservation confirmed directly in clinic scheduling queue. Free cancellation up to 2 hours before appointment.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Navigation Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setStep((step - 1) as any);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1) {
                  if (!selectedDate || !selectedSlot) {
                    setErrorMsg('Please pick both an appointment date and a time slot to continue.');
                    return;
                  }
                  setErrorMsg('');
                  setStep(2);
                } else if (step === 2) {
                  if (!patientName.trim() || !patientPhone.trim() || !reason.trim()) {
                    setErrorMsg('Please fill in patient name, phone number, and consultation reason.');
                    return;
                  }
                  setErrorMsg('');
                  setStep(3);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-sm shadow-emerald-600/30 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmBooking}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-md shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Confirming Booking...' : 'Confirm & Schedule Appointment'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
