import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  ShieldCheck, 
  HeartPulse, 
  Video, 
  Building2,
  Download,
  Share2
} from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentReceiptModalProps {
  appointment: Appointment;
  onClose: () => void;
  onViewAllAppointments?: () => void;
}

export const AppointmentReceiptModal: React.FC<AppointmentReceiptModalProps> = ({
  appointment,
  onClose,
  onViewAllAppointments,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCalendar = () => {
    // Generate .ics calendar format
    const [year, month, day] = appointment.date.split('-').map(Number);
    const summary = `Doctor Appointment with ${appointment.doctorName} (${appointment.doctorSpecialty})`;
    const description = `Appointment ID: ${appointment.id}\\nClinic: ${appointment.clinicAddress}\\nType: ${appointment.visitType}\\nReason: ${appointment.reason}`;
    const location = appointment.visitType === 'IN_PERSON' ? appointment.clinicAddress : 'Telehealth Video Call';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MedPulse Clinic//Doctor Appointment System//EN',
      'BEGIN:VEVENT',
      `UID:${appointment.id}@medpulse.clinic`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}T090000Z`,
      `DTEND:${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}T100000Z`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `appointment-${appointment.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in print:p-0 print:bg-white">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-xl overflow-hidden flex flex-col print:shadow-none print:border-none">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <h2 className="text-sm font-bold">Appointment Confirmed & Scheduled!</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket / Pass Container */}
        <div id="printable-receipt" className="p-6 sm:p-8 space-y-6">
          {/* Clinic Brand and Reference */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900">
                  MedPulse Clinic Network
                </h1>
                <p className="text-xs text-slate-500">Official Clinical Appointment Pass</p>
                <p className="text-[10px] text-slate-400">Accredited Multi-Specialty Outpatient Pavilion</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Booking ID
              </span>
              <p className="text-base font-mono font-black text-emerald-700">{appointment.id}</p>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 mt-0.5">
                {appointment.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Patient</span>
              <p className="font-bold text-slate-900 text-sm">{appointment.patientName}</p>
              <p className="text-slate-500 text-[11px]">{appointment.patientAge} yrs • {appointment.patientGender}</p>
              <p className="text-slate-500 text-[11px]">{appointment.patientPhone}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Specialist</span>
              <p className="font-bold text-slate-900 text-sm">{appointment.doctorName}</p>
              <p className="text-emerald-700 font-semibold text-[11px]">{appointment.doctorSpecialty}</p>
              <p className="text-slate-500 text-[11px]">Fee: ${appointment.fee}</p>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Date & Time</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-[11px] mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{appointment.timeSlot}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Consultation Type</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mt-0.5">
                {appointment.visitType === 'IN_PERSON' ? (
                  <>
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>In-Person Clinic Visit</span>
                  </>
                ) : (
                  <>
                    <Video className="w-3.5 h-3.5 text-purple-600" />
                    <span>HD Telehealth Video</span>
                  </>
                )}
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5 truncate">{appointment.clinicAddress}</p>
            </div>
          </div>

          {/* Reason for visit */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Reason for Visit / Symptoms
            </span>
            <p className="text-slate-800 font-medium">{appointment.reason}</p>
          </div>

          {/* Barcode & Security stamp */}
          <div className="border-t border-dashed border-slate-300 pt-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-700">Important Instructions for Patient:</p>
              <ul className="text-[10px] text-slate-500 space-y-0.5 list-disc pl-3">
                <li>Please arrive at the clinic reception 15 minutes before your time slot.</li>
                <li>Bring a valid photo ID and any recent lab reports or medications.</li>
                <li>Free cancellation or rescheduling available in your patient portal.</li>
              </ul>
            </div>

            {/* Visual Barcode */}
            <div className="text-center pl-4 shrink-0">
              <div className="flex items-center justify-center gap-0.5 h-8">
                {[4, 2, 6, 3, 7, 2, 5, 8, 3, 2, 6, 4, 3, 7, 2, 6, 3, 5, 2, 7].map((h, i) => (
                  <div
                    key={i}
                    className="bg-slate-800"
                    style={{ width: i % 3 === 0 ? '2.5px' : '1.5px', height: `${h * 4}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-500 block mt-1 tracking-widest">
                *{appointment.id}*
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={handleDownloadCalendar}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Add to Calendar (.ics)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>

            {onViewAllAppointments ? (
              <button
                onClick={() => {
                  onClose();
                  onViewAllAppointments();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
              >
                Go to My Appointments
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
