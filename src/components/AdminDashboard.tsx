import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Building2, 
  Stethoscope, 
  ShieldCheck, 
  ArrowUpRight,
  Filter,
  Eye
} from 'lucide-react';
import { Appointment, Doctor, User } from '../types';
import { StorageService } from '../services/storageService';

interface AdminDashboardProps {
  doctors: Doctor[];
  appointments: Appointment[];
  users: User[];
  onRefreshData: () => void;
  onViewReceipt: (appointment: Appointment) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  doctors,
  appointments,
  users,
  onRefreshData,
  onViewReceipt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Compute metrics
  const totalAppointments = appointments.length;
  const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length;
  const pending = appointments.filter(a => a.status === 'PENDING').length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;
  const cancelled = appointments.filter(a => a.status === 'CANCELLED').length;
  
  const totalRevenue = appointments
    .filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED')
    .reduce((sum, a) => sum + a.fee, 0);

  const activeDoctorsCount = doctors.filter(d => d.isAvailableToday).length;
  const patientCount = users.filter(u => u.role === 'PATIENT').length;

  // Filter master appointment table
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    const matchesQuery = 
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Toggle Doctor Availability
  const handleToggleDocAvailability = (docId: string, currentStatus: boolean) => {
    StorageService.updateDoctorAvailability(docId, !currentStatus);
    onRefreshData();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Clinic Central Administration</h1>
              <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live clinic operations oversight, department scheduling, and master appointment records.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>MedPulse Clinic Network Online</span>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Appointments
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{totalAppointments}</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                +{completed} completed
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Estimated Billing
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-700">${totalRevenue}</span>
              <span className="text-[11px] font-bold text-slate-500">USD</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Active Medical Specialists
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-blue-700">{activeDoctorsCount} / {doctors.length}</span>
              <span className="text-[11px] font-semibold text-blue-600">On-Duty</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Registered Patients
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-purple-700">{patientCount}</span>
              <span className="text-[11px] font-semibold text-slate-500">Active Profiles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Roster & Shift Status */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Specialist Roster & Duty Management</span>
            </h2>
            <p className="text-xs text-slate-500">Manage doctor consultation availability in real-time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {doctors.map(doc => (
            <div key={doc.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <img
                  src={doc.image}
                  alt={doc.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{doc.name}</p>
                  <p className="text-[11px] text-emerald-700 font-medium truncate">{doc.specialty}</p>
                  <p className="text-[10px] text-slate-400 truncate">{doc.roomNumber}</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500">${doc.consultationFee} fee</span>
                <button
                  onClick={() => handleToggleDocAvailability(doc.id, doc.isAvailableToday)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    doc.isAvailableToday
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {doc.isAvailableToday ? 'On Duty' : 'Off Duty'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master Appointment Registry */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Master Appointment Registry</span>
            </h2>
            <p className="text-xs text-slate-500">Live feed of all clinic reservations across all departments</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, doctor, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Master Registry Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Specialist / Doctor</th>
                <th className="py-3 px-4">Date & Slot</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No matching appointment records found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">#{apt.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{apt.patientName}</p>
                      <p className="text-[10px] text-slate-400">{apt.patientPhone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{apt.doctorName}</p>
                      <p className="text-[10px] text-emerald-700">{apt.doctorSpecialty}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900">{apt.date}</p>
                      <p className="text-[10px] text-slate-500">{apt.timeSlot}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {apt.visitType === 'IN_PERSON' ? 'Clinic' : 'Video'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">${apt.fee}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        apt.status === 'CONFIRMED' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : apt.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onViewReceipt(apt)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Pass
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
