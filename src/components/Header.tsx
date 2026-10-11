import React, { useState } from 'react';
import { 
  HeartPulse, 
  Calendar, 
  Stethoscope, 
  BarChart3, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  UserPlus,
  ChevronDown, 
  RotateCcw,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storageService';

interface HeaderProps {
  currentUser: User | null;
  onUserChange: (user: User | null) => void;
  currentTab: 'directory' | 'patient' | 'doctor' | 'admin';
  onTabChange: (tab: 'directory' | 'patient' | 'doctor' | 'admin') => void;
  upcomingCount: number;
  onOpenAuth: (mode?: 'LOGIN' | 'REGISTER') => void;
  onLogout: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onUserChange,
  currentTab,
  onTabChange,
  upcomingCount,
  onOpenAuth,
  onLogout,
  onResetData,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top announcement bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Clinic Live Hours: 08:00 AM - 09:00 PM EST
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-300">
              Instant Online Confirmations & Real-Time Slot Reservation
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a 
              href="tel:18005550199" 
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Emergency Hotline: <strong className="text-white">(800) 555-0199</strong></span>
            </a>
            <button
              onClick={onResetData}
              title="Reset all appointments and registered users"
              className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => onTabChange('directory')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  MedPulse
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Clinic OS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Online Doctor Appointment System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => onTabChange('directory')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'directory'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Find Doctors</span>
            </button>

            <button
              onClick={() => onTabChange('patient')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'patient'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>My Appointments</span>
              {upcomingCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {upcomingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('doctor')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'doctor'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Doctor Portal</span>
            </button>

            <button
              onClick={() => onTabChange('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Admin Stats</span>
            </button>
          </nav>

          {/* Authentication Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              /* User logged in: Profile & Logout */
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left shadow-2xs cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs ring-1 ring-slate-200">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <span className="truncate max-w-[120px]">{currentUser.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        currentUser.role === 'DOCTOR' 
                          ? 'bg-blue-100 text-blue-700' 
                          : currentUser.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {currentUser.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 truncate block max-w-[120px]">
                      {currentUser.email}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-1 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Role: {currentUser.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenAuth('LOGIN');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Switch / Register Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* User not logged in: Sign In & Register Buttons */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('LOGIN')}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-600" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('REGISTER')}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-sm shadow-emerald-600/30 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Subnav */}
        <div className="flex md:hidden items-center justify-around gap-1 mt-3 pt-2 border-t border-slate-100">
          <button
            onClick={() => onTabChange('directory')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs font-medium ${
              currentTab === 'directory' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors</span>
          </button>
          <button
            onClick={() => onTabChange('patient')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs font-medium relative ${
              currentTab === 'patient' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Appointments</span>
            {upcomingCount > 0 && (
              <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-emerald-600"></span>
            )}
          </button>
          <button
            onClick={() => onTabChange('doctor')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs font-medium ${
              currentTab === 'doctor' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Doctor</span>
          </button>
          <button
            onClick={() => onTabChange('admin')}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-xs font-medium ${
              currentTab === 'admin' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
