import React from 'react';
import { 
  X, 
  Printer, 
  FileText, 
  Pill, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  HeartPulse, 
  AlertCircle,
  Download,
  Stethoscope
} from 'lucide-react';
import { Appointment } from '../types';

interface MedicalRecordModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  appointment,
  onClose,
}) => {
  const record = appointment.medicalRecord;

  const handlePrint = () => {
    window.print();
  };

  if (!record) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Clinical Records Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            The doctor has not uploaded diagnosis or prescription for this appointment.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in print:p-0 print:bg-white">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl overflow-hidden flex flex-col print:shadow-none print:border-none">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold">Consultation Report & Digital Prescription</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Prescription Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs" id="printable-record">
          {/* Clinic & Doctor Top Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900">MedPulse Health Clinic</h1>
                <p className="text-[11px] text-slate-500">Department of {appointment.doctorSpecialty}</p>
                <p className="text-[10px] text-slate-400">Consultant: {appointment.doctorName}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-serif font-black text-emerald-700">℞</span>
              <p className="text-[10px] text-slate-400">Date: {appointment.date}</p>
              <p className="text-[10px] font-mono text-slate-500">Ref: {appointment.id}</p>
            </div>
          </div>

          {/* Patient Info Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Patient Name</span>
              <p className="font-bold text-slate-900">{appointment.patientName}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Age / Gender</span>
              <p className="font-medium text-slate-800">{appointment.patientAge} Y / {appointment.patientGender}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Contact Phone</span>
              <p className="font-medium text-slate-800">{appointment.patientPhone}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Visit Mode</span>
              <p className="font-semibold text-emerald-700">
                {appointment.visitType === 'IN_PERSON' ? 'In-Person Clinic' : 'Telehealth Video'}
              </p>
            </div>
          </div>

          {/* Clinical Findings & Diagnosis */}
          <div className="space-y-3">
            <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Clinical Diagnosis
              </span>
              <p className="text-sm font-bold text-slate-900">{record.diagnosis}</p>
            </div>

            {record.symptoms && (
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Presented Symptoms & Vitals
                </span>
                <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/70">
                  {record.symptoms}
                </p>
              </div>
            )}
          </div>

          {/* Prescribed Medications */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Pill className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Prescribed Medications & Regimen
              </h3>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Medicine / Formulation</th>
                    <th className="py-2 px-3">Dosage</th>
                    <th className="py-2 px-3">Frequency</th>
                    <th className="py-2 px-3">Duration</th>
                    <th className="py-2 px-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {record.prescriptions.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{p.medicine}</td>
                      <td className="py-2.5 px-3 text-slate-700">{p.dosage}</td>
                      <td className="py-2.5 px-3 text-slate-700">{p.frequency}</td>
                      <td className="py-2.5 px-3 text-slate-700">{p.duration}</td>
                      <td className="py-2.5 px-3 text-slate-500 italic">{p.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctor Notes & Advice */}
          {record.doctorNotes && (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Doctor's Clinical Advice & Lifestyle Guidelines
              </span>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70 leading-relaxed">
                {record.doctorNotes}
              </p>
            </div>
          )}

          {/* Follow-up info & Signature */}
          <div className="pt-4 border-t border-slate-200 flex items-end justify-between">
            <div>
              {record.followUpDate && (
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>
                    Recommended Next Follow-up: <strong className="text-slate-900">{record.followUpDate}</strong>
                  </span>
                </div>
              )}
              <p className="text-[10px] text-slate-400 mt-1">
                Report generated electronically via MedPulse Clinic System.
              </p>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-sm text-slate-700 mb-1 underline decoration-emerald-500 decoration-2">
                {appointment.doctorName}
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Verified Medical Officer Signature
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Prescription</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
