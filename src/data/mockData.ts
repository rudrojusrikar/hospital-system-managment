import { Doctor, Appointment, SpecialtyCategory, User } from '../types';

export const SPECIALTIES: SpecialtyCategory[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    iconName: 'HeartPulse',
    description: 'Heart health, cardiovascular disorders, blood pressure, ECG',
    doctorCount: 2,
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    iconName: 'Sparkles',
    description: 'Skin conditions, acne, eczema, hair & nail disorders',
    doctorCount: 2,
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    iconName: 'Baby',
    description: 'Infant, child and adolescent medical care and vaccines',
    doctorCount: 2,
  },
  {
    id: 'neurology',
    name: 'Neurology',
    iconName: 'Brain',
    description: 'Brain, nervous system, migraine, neuropathy disorders',
    doctorCount: 1,
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    iconName: 'Activity',
    description: 'Bones, joints, sports injuries, fractures and arthritis',
    doctorCount: 2,
  },
  {
    id: 'general-medicine',
    name: 'General Medicine',
    iconName: 'Stethoscope',
    description: 'Routine health checkups, viral fevers, diabetes, preventative care',
    doctorCount: 2,
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry & Mental Health',
    iconName: 'Smile',
    description: 'Mental health, anxiety, depression, cognitive counseling',
    doctorCount: 1,
  },
  {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    iconName: 'Eye',
    description: 'Eye examinations, vision testing, cataracts, eye care',
    doctorCount: 1,
  },
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    title: 'Senior Interventional Cardiologist',
    specialty: 'Cardiology',
    qualification: 'MD, FACC - Johns Hopkins University',
    experienceYears: 14,
    rating: 4.95,
    reviewCount: 142,
    consultationFee: 120,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    clinicAddress: 'St. Jude Medical Pavilion, Suite 402, Metro Health Campus',
    roomNumber: 'Room 402-B',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    bio: 'Dr. Jenkins is a board-certified cardiologist specializing in preventive cardiology, hypertension, cardiac imaging, and coronary artery disease management. She has performed over 1,800 cardiac procedures.',
    education: [
      'Doctor of Medicine (MD) - Johns Hopkins School of Medicine',
      'Fellowship in Cardiovascular Disease - Cleveland Clinic',
      'Board Certified in Adult Comprehensive Echocardiography'
    ],
    languages: ['English', 'Spanish'],
    availableSlots: [
      '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
      '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM'
    ],
    isAvailableToday: true,
  },
  {
    id: 'doc-2',
    name: 'Dr. Michael Chen',
    title: 'Lead Pediatric Specialist',
    specialty: 'Pediatrics',
    qualification: 'MD, FAAP - Stanford University School of Medicine',
    experienceYears: 11,
    rating: 4.92,
    reviewCount: 188,
    consultationFee: 95,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    clinicAddress: 'Children First Care Center, Wing C, Metro Health Campus',
    roomNumber: 'Room 112',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    bio: 'Dr. Chen provides compassionate, comprehensive care for newborns through adolescents. Dedicated to making every child feel comfortable while delivering expert developmental assessments and treatments.',
    education: [
      'MD - Stanford University School of Medicine',
      'Pediatric Residency - Boston Children\'s Hospital'
    ],
    languages: ['English', 'Mandarin'],
    availableSlots: [
      '09:30 AM', '10:15 AM', '11:00 AM',
      '01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM', '04:30 PM'
    ],
    isAvailableToday: true,
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova',
    title: 'Consultant Dermatologist & Cosmetologist',
    specialty: 'Dermatology',
    qualification: 'MD, FAAD - University of Pennsylvania',
    experienceYears: 9,
    rating: 4.88,
    reviewCount: 96,
    consultationFee: 110,
    image: 'https://images.unsplash.com/photo-1594824813572-c2053703d198?auto=format&fit=crop&q=80&w=400',
    clinicAddress: 'DermaCare Skin & Laser Institute, Suite 210',
    roomNumber: 'Room 210-A',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    bio: 'Specialist in medical and cosmetic dermatology including acne scars, eczema, psoriasis, skin cancer screenings, and advanced non-surgical aesthetics.',
    education: [
      'MD - Perelman School of Medicine at UPenn',
      'Dermatology Residency - NYU Langone Health'
    ],
    languages: ['English', 'Russian'],
    availableSlots: [
      '10:00 AM', '10:45 AM', '11:30 AM',
      '02:00 PM', '02:45 PM', '03:30 PM', '05:00 PM'
    ],
    isAvailableToday: true,
  },
  {
    id: 'doc-4',
    name: 'Dr. Marcus Vance',
    title: 'Chief of Orthopedic Surgery & Sports Medicine',
    specialty: 'Orthopedics',
    qualification: 'MD, FAAOS - Columbia University College of Physicians',
    experienceYears: 16,
    rating: 4.97,
    reviewCount: 215,
    consultationFee: 135,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    clinicAddress: 'Apex Bone & Joint Institute, 3rd Floor',
    roomNumber: 'Room 304',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    bio: 'Renowned orthopedic surgeon specializing in knee and hip replacements, arthroscopic sports injury repair, ACL reconstructions, and shoulder trauma.',
    education: [
      'MD - Columbia University',
      'Fellowship in Sports Medicine - Hospital for Special Surgery (HSS)'
    ],
    languages: ['English'],
    availableSlots: [
      '08:30 AM', '09:15 AM', '10:00 AM', '11:30 AM',
      '01:30 PM', '02:30 PM', '04:00 PM'
    ],
    isAvailableToday: false,
  },
  {
    id: 'doc-5',
    name: 'Dr. Priya Ramanathan',
    title: 'Consultant Neurologist & Stroke Specialist',
    specialty: 'Neurology',
    qualification: 'MD, DM Neurology - Cambridge & AIIMS',
    experienceYears: 13,
    rating: 4.91,
    reviewCount: 110,
    consultationFee: 140,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    clinicAddress: 'NeuroVascular Care Center, 5th Floor',
    roomNumber: 'Room 501',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    bio: 'Expert in clinical neurophysiology, chronic migraines, epilepsy, neuromuscular disorders, Parkinson\'s disease, and post-stroke rehabilitation.',
    education: [
      'MBBS & MD - AIIMS',
      'Advanced Clinical Neurology Fellowship - University of Cambridge'
    ],
    languages: ['English', 'Hindi', 'Tamil'],
    availableSlots: [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '02:00 PM', '03:00 PM', '04:00 PM'
    ],
    isAvailableToday: true,
  },
  {
    id: 'doc-6',
    name: 'Dr. David Morales',
    title: 'Senior General Physician & Internist',
    specialty: 'General Medicine',
    qualification: 'MD, FACP - UCLA David Geffen School of Medicine',
    experienceYears: 15,
    rating: 4.89,
    reviewCount: 230,
    consultationFee: 80,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    clinicAddress: 'Central Outpatient Clinic, Ground Floor',
    roomNumber: 'Room 105',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    bio: 'Primary care physician focusing on chronic disease prevention, type 2 diabetes management, lipid disorders, comprehensive annual health checkups, and acute illnesses.',
    education: [
      'MD - UCLA David Geffen School of Medicine',
      'Internal Medicine Residency - Cedars-Sinai Medical Center'
    ],
    languages: ['English', 'Spanish'],
    availableSlots: [
      '08:45 AM', '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM',
      '01:30 PM', '02:15 PM', '03:00 PM', '03:45 PM', '04:30 PM'
    ],
    isAvailableToday: true,
  },
  {
    id: 'doc-7',
    name: 'Dr. Sophia Lindqvist',
    title: 'Consultant Clinical Psychiatrist',
    specialty: 'Psychiatry & Mental Health',
    qualification: 'MD, MRCPsych - Karolinska Institute',
    experienceYears: 10,
    rating: 4.96,
    reviewCount: 84,
    consultationFee: 130,
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
    clinicAddress: 'Wellness & Behavioral Health Center, Suite 305',
    roomNumber: 'Room 305-C',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    bio: 'Dedicated to empathetic, evidence-based psychiatric evaluations, medication management, and supportive psychotherapy for anxiety, depression, OCD, and stress burnout.',
    education: [
      'Medical Degree - Karolinska Institute',
      'Psychiatry Specialty Training - Oxford Deanery'
    ],
    languages: ['English', 'Swedish', 'German'],
    availableSlots: [
      '10:00 AM', '11:15 AM', '01:00 PM', '02:15 PM', '03:30 PM', '04:45 PM'
    ],
    isAvailableToday: true,
  },
  {
    id: 'doc-8',
    name: 'Dr. Robert Harrison',
    title: 'Senior Eye Surgeon & Ophthalmologist',
    specialty: 'Ophthalmology',
    qualification: 'MD, FACS - Baylor College of Medicine',
    experienceYears: 18,
    rating: 4.93,
    reviewCount: 167,
    consultationFee: 105,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
    clinicAddress: 'Vision Specialist Hospital, 2nd Floor',
    roomNumber: 'Room 202',
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    bio: 'Specialist in modern refractive surgery, cataract phacoemulsification, diabetic retinopathy, and comprehensive pediatric and adult vision disorders.',
    education: [
      'MD - Baylor College of Medicine',
      'Ophthalmology Residency - Wills Eye Hospital'
    ],
    languages: ['English'],
    availableSlots: [
      '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
      '02:00 PM', '02:45 PM', '03:30 PM'
    ],
    isAvailableToday: false,
  },
];

export const INITIAL_USERS: User[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

