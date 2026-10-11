import React from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  GraduationCap, 
  Globe, 
  CheckCircle2, 
  Phone,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { Doctor } from '../types';

interface DoctorDetailModalProps {
  doctor: Doctor;
  onClose: () => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Banner with Doctor Cover */}
        <div className="relative bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-emerald-500/40 shadow-lg"
              />
              {doctor.isAvailableToday && (
                <span className="absolute bottom-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-slate-900">
                  Available Today
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {doctor.specialty}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{doctor.rating.toFixed(2)}</span>
                  <span className="text-slate-300 font-normal">({doctor.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">{doctor.name}</h2>
              <p className="text-xs text-slate-300 font-medium">{doctor.title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{doctor.qualification}</p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Experience</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{doctor.experienceYears}+ Years</p>
            </div>
            <div className="border-x border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Consultation Fee</span>
              <p className="text-sm font-black text-emerald-700 mt-0.5">${doctor.consultationFee}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Clinic Room</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{doctor.roomNumber}</p>
            </div>
          </div>

          {/* About Doctor */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>About & Clinical Specialization</span>
            </h3>
            <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
              {doctor.bio}
            </p>
          </div>

          {/* Education & Credentials */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Education & Medical Training</span>
            </h3>
            <div className="space-y-1.5">
              {doctor.education.map((edu, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{edu}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinic Location & Working Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clinic Address</span>
              </h4>
              <p className="text-slate-800 font-semibold">{doctor.roomNumber}</p>
              <p className="text-slate-500 mt-0.5">{doctor.clinicAddress}</p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Languages & Working Days</span>
              </h4>
              <p className="text-slate-700">
                <strong className="text-slate-900">Languages:</strong> {doctor.languages.join(', ')}
              </p>
              <p className="text-slate-700 mt-1">
                <strong className="text-slate-900">Available:</strong> {doctor.availableDays.join(', ')}
              </p>
            </div>
          </div>

          {/* Typical Slots Preview */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Standard Daily Consultation Slots</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {doctor.availableSlots.map((slot, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Consultation</span>
            <p className="text-base font-black text-slate-900">${doctor.consultationFee}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookAppointment(doctor);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
