import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  HeartPulse,
  Sparkles,
  Baby,
  Brain,
  Activity,
  Stethoscope,
  Smile,
  Eye,
  ShieldCheck,
  Video
} from 'lucide-react';
import { Doctor, SpecialtyCategory } from '../types';
import { SPECIALTIES } from '../data/mockData';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  doctors,
  onSelectDoctor,
  onBookAppointment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee_asc' | 'fee_desc'>('rating');

  // Filter & Sort
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesQuery = 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.clinicAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.bio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpecialty = 
        selectedSpecialty === 'all' || 
        doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

      const matchesAvailability = availableTodayOnly ? doctor.isAvailableToday : true;

      return matchesQuery && matchesSpecialty && matchesAvailability;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'fee_asc') return a.consultationFee - b.consultationFee;
      if (sortBy === 'fee_desc') return b.consultationFee - a.consultationFee;
      return 0;
    });
  }, [doctors, searchQuery, selectedSpecialty, availableTodayOnly, sortBy]);

  // Map specialty icon
  const getSpecialtyIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'cardiology':
        return <HeartPulse className="w-5 h-5" />;
      case 'dermatology':
        return <Sparkles className="w-5 h-5" />;
      case 'pediatrics':
        return <Baby className="w-5 h-5" />;
      case 'neurology':
        return <Brain className="w-5 h-5" />;
      case 'orthopedics':
        return <Activity className="w-5 h-5" />;
      case 'general medicine':
        return <Stethoscope className="w-5 h-5" />;
      case 'psychiatry & mental health':
        return <Smile className="w-5 h-5" />;
      case 'ophthalmology':
        return <Eye className="w-5 h-5" />;
      default:
        return <Stethoscope className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-8 sm:p-12 shadow-xl border border-slate-700/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verified Medical Specialists & Instant Scheduling
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Book Top Board-Certified Doctors in Real-Time
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Select an expert physician, view live consultation slots, book clinic or virtual visits, and receive your digital medical pass in seconds.
          </p>

          {/* Quick Search inside Hero */}
          <div className="mt-8 flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/15">
            <div className="flex-1 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4" />
              <input
                type="text"
                placeholder="Search by doctor name, specialty, condition, or symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white text-slate-900 placeholder-slate-400 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Waiting Queue</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Digital Prescriptions & Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <span>In-Clinic or Video Telehealth</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Selector Carousel / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Explore Specialties</h2>
            <p className="text-xs text-slate-500">Find doctors dedicated to your specific medical needs</p>
          </div>
          <button
            onClick={() => setSelectedSpecialty('all')}
            className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
              selectedSpecialty === 'all'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:text-emerald-700 bg-slate-100'
            }`}
          >
            All Specialties ({doctors.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {SPECIALTIES.map((spec) => {
            const isSelected = selectedSpecialty.toLowerCase() === spec.name.toLowerCase();
            return (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialty(isSelected ? 'all' : spec.name)}
                className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs text-slate-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform ${
                  isSelected 
                    ? 'bg-emerald-600 text-white scale-105' 
                    : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100'
                }`}>
                  {getSpecialtyIcon(spec.name)}
                </div>
                <span className="text-xs font-semibold leading-tight line-clamp-1">{spec.name}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{spec.doctorCount} doctors</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control bar: Availability toggle & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={availableTodayOnly}
              onChange={(e) => setAvailableTodayOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600"
            />
            <span className="text-xs font-semibold text-slate-700">Available Today Only</span>
          </label>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredDoctors.length}</strong> available doctors
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="rating">Top Rated (Highest First)</option>
            <option value="experience">Most Experienced</option>
            <option value="fee_asc">Consultation Fee: Low to High</option>
            <option value="fee_desc">Consultation Fee: High to Low</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No doctors match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query, selecting another specialty, or unchecking "Available Today Only".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('all');
              setAvailableTodayOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                {/* Doctor Head Info */}
                <div className="flex gap-4 items-start">
                  <div className="relative">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-emerald-200 transition-all shadow-sm"
                    />
                    {doctor.isAvailableToday ? (
                      <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                        Online
                      </span>
                    ) : (
                      <span className="absolute -bottom-1.5 -right-1.5 bg-slate-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                        Off Today
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {doctor.specialty}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{doctor.rating.toFixed(2)}</span>
                        <span className="text-slate-400 font-normal text-[10px]">({doctor.reviewCount})</span>
                      </div>
                    </div>

                    <h3 
                      onClick={() => onSelectDoctor(doctor)}
                      className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors mt-1 cursor-pointer truncate"
                    >
                      {doctor.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 line-clamp-1">{doctor.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{doctor.qualification}</p>
                  </div>
                </div>

                {/* Key badges / Meta */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong>{doctor.experienceYears}+ years</strong> experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{doctor.roomNumber}</span>
                  </div>
                </div>

                {/* Location snippet */}
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 flex items-center gap-1">
                  <span>Clinic:</span>
                  <span className="text-slate-600">{doctor.clinicAddress}</span>
                </p>

                {/* Quick preview of available slots */}
                <div className="mt-3 bg-slate-50/80 rounded-xl p-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      Next Available Slots:
                    </span>
                    <span className="text-emerald-700 font-semibold">
                      {doctor.availableSlots.length} slots
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.availableSlots.slice(0, 4).map((slot, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/80"
                      >
                        {slot}
                      </span>
                    ))}
                    {doctor.availableSlots.length > 4 && (
                      <span className="text-[11px] text-slate-400 px-1 py-0.5 font-medium">
                        +{doctor.availableSlots.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Fee */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fee</span>
                  <div className="text-lg font-black text-slate-900">
                    ${doctor.consultationFee}
                    <span className="text-[10px] font-normal text-slate-500 ml-1">/ visit</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectDoctor(doctor)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => onBookAppointment(doctor)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
