import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  Phone, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storageService';
import { SPECIALTIES } from '../data/mockData';

interface AuthModalProps {
  initialMode?: 'LOGIN' | 'REGISTER';
  defaultRole?: UserRole;
  onClose: () => void;
  onUserLoggedIn: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'LOGIN',
  defaultRole = 'PATIENT',
  onClose,
  onUserLoggedIn,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(initialMode);
  const [role, setRole] = useState<UserRole>(defaultRole);

  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register inputs
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerSpecialty, setRegisterSpecialty] = useState('Cardiology');
  const [registerAge, setRegisterAge] = useState<number>(28);
  const [registerGender, setRegisterGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [registerBloodGroup, setRegisterBloodGroup] = useState('O+');
  const [registerAllergies, setRegisterAllergies] = useState('');

  // Status feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = StorageService.login({
        email: loginEmail.trim(),
        password: loginPassword,
        role,
      });

      setIsLoading(false);
      if (res.success && res.user) {
        onUserLoggedIn(res.user);
        onClose();
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify or register.');
      }
    }, 250);
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!registerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!registerPassword || registerPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = StorageService.register({
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        phone: registerPhone.trim(),
        role,
        specialty: role === 'DOCTOR' ? registerSpecialty : undefined,
        age: Number(registerAge) || 28,
        gender: registerGender,
        bloodGroup: registerBloodGroup,
        allergies: registerAllergies.trim(),
      });

      setIsLoading(false);
      if (res.success && res.user) {
        setSuccessMessage('Account created successfully! Logging you in...');
        setTimeout(() => {
          onUserLoggedIn(res.user!);
          onClose();
        }, 400);
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              {role === 'DOCTOR' ? <Stethoscope className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-sm font-bold">
                {mode === 'LOGIN' ? 'Sign In to MedPulse' : 'Create an Account'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {role === 'DOCTOR' ? 'Doctor Portal Authentication' : 'Patient Portal Authentication'}
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

        {/* Tab Toggle: Sign In vs Register */}
        <div className="grid grid-cols-2 bg-slate-100 p-1.5 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('LOGIN');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'LOGIN'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('REGISTER');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'REGISTER'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register (New Account)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Role selector pill */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setRole('PATIENT');
                  setErrorMessage('');
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'PATIENT'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('DOCTOR');
                  setErrorMessage('');
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  role === 'DOCTOR'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Doctor / Specialist
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: LOGIN */}
          {mode === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              </button>

              <div className="pt-2 text-center border-t border-slate-100">
                <p className="text-[11px] text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('REGISTER');
                      setErrorMessage('');
                    }}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Create New Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* MODE 2: REGISTER */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder={role === 'DOCTOR' ? 'Dr. Alex Morgan' : 'Alex Morgan'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Role-Specific fields */}
              {role === 'DOCTOR' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Specialty / Department *
                  </label>
                  <select
                    value={registerSpecialty}
                    onChange={(e) => setRegisterSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {SPECIALTIES.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Age</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={registerAge}
                      onChange={(e) => setRegisterAge(Number(e.target.value))}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Gender</label>
                    <select
                      value={registerGender}
                      onChange={(e) => setRegisterGender(e.target.value as any)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Blood</label>
                    <select
                      value={registerBloodGroup}
                      onChange={(e) => setRegisterBloodGroup(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLoading ? 'Creating Account...' : 'Complete Registration & Sign In'}</span>
              </button>

              <div className="pt-2 text-center border-t border-slate-100">
                <p className="text-[11px] text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('LOGIN');
                      setErrorMessage('');
                    }}
                    className="font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
