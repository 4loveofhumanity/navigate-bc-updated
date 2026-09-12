import type {
  AcademicTerm,
  CampusAlert,
  CampusEvent,
  CampusLocation,
  CareerTaskGroup,
  Catalog,
  Contact,
  Department,
  Employee,
  HelpArticle,
  LibraryInfo,
  Profile,
  ServiceStatus,
  StudentCard,
} from '@/types/domain';

export const DEMO_PROFILE: Profile = {
  name: 'DEMO, STUDENT',
  role: 'Undergraduate',
  emplid: '1234XXXX',
  transactions: 3,
  appointments: 1,
  holds: 1,
  holdsNote: 'Immunization records are required. Contact the Health Clinic for next steps.',
  balanceDue: '$--.--',
  webcentralId: 'pugliese_id',
  email: 'PUG123@student.pugliese.edu',
  wifiUser: 'PUG123',
  wifiNote: 'Use your current Pugliese College network credentials. Never share your password.',
  helpPhone: '718-951-5787',
  helpUrl: 'https://students.pugliese.edu/',
};

export const DEMO_CATALOG: Catalog = {
  dept: 'Biology (BIOL)',
  term: 'Fall 2026',
  count: 12,
  courses: [
    { no: 'BIOL. 1001', ti: 'General Biology I', mode: 'In person', seats: 8 },
    { no: 'BIOL. 1002', ti: 'General Biology II', mode: 'Hybrid', seats: 3 },
    { no: 'BIOL. 1010', ti: "Biology for Today's World", mode: 'Online', seats: 16 },
    { no: 'BIOL. 2001', ti: 'Organismic Biology II: Zoology', mode: 'In person', seats: 5 },
    { no: 'BIOL. 2002', ti: 'Animal Form and Function Lab', mode: 'In person', seats: 2 },
    { no: 'BIOL. 2010', ti: 'Advanced Cell and Molecular Biology', mode: 'Hybrid', seats: 9 },
    {
      no: 'BIOL. 2020',
      ti: 'Neurobiology',
      mode: 'In person',
      seats: 6,
      detailData: {
        credits: '3.00',
        section: 'MW11',
        prereq: 'Biology 1001 and 1002, or permission from the instructor.',
        hours: '3 hours; 3 credits',
        desc: 'An introduction to nervous-system structure and function across molecular, cellular, systems, and behavioral levels.',
        meet: { type: 'Lecture', code: 'MW11', room: 'IH 1141', times: 'Mon/Wed 11:00 AM - 12:15 PM' },
        instructor: {
          name: 'Faculty assignment pending',
          title: 'Instructor',
          dept: 'Biology',
          email: 'biology@pugliese.cuny.edu',
          phone: '718-951-5000',
          office: 'Ingersoll Hall',
        },
      },
    },
    { no: 'BIOL. 3003', ti: 'Microbiology', mode: 'In person', seats: 4 },
    { no: 'BIOL. 3011', ti: 'Genetics', mode: 'Hybrid', seats: 11 },
    { no: 'BIOL. 3021', ti: 'Ecology', mode: 'In person', seats: 7 },
    { no: 'BIOL. 4010', ti: 'Molecular Biology Research', mode: 'In person', seats: 1 },
    { no: 'BIOL. 5010', ti: 'Seminar in Contemporary Biology', mode: 'Online', seats: 20 },
  ],
};

export const DEMO_LOCATION: CampusLocation = {
  name: 'Financial Aid',
  room: '308',
  building: 'West Quad Center',
  buildingLabel: 'West Quad Center - Floor 3',
  floor: '3rd Floor',
};

export const DEMO_LIBRARY: LibraryInfo = {
  name: 'Pugliese Library',
  location: 'Library Cafe Level',
  website: 'https://library.pugliese.cuny.edu/',
  libraryId: '29085012345678',
  resources: [
    {
      id: 'onesearch',
      title: 'OneSearch',
      description: 'Search books, articles, media, and other library materials.',
      url: 'https://library.pugliese.cuny.edu/search/',
      icon: 'search',
    },
    {
      id: 'databases',
      title: 'Databases',
      description: 'Browse research databases available through the library.',
      url: 'https://libguides.pugliese.cuny.edu/az/databases',
      icon: 'database',
    },
    {
      id: 'research-guides',
      title: 'Research Guides',
      description: 'Find subject guides created by Pugliese College librarians.',
      url: 'https://libguides.pugliese.cuny.edu/',
      icon: 'guides',
    },
    {
      id: 'ask-a-librarian',
      title: 'Ask a Librarian',
      description: 'Get research help from a Pugliese College librarian.',
      url: 'https://cuny.libanswers.com/CUNYPugliese/',
      icon: 'help',
    },
    {
      id: 'hours',
      title: 'Library Hours',
      description: 'Check current building and service hours before visiting.',
      url: 'https://library.pugliese.cuny.edu/hours/',
      icon: 'hours',
    },
  ],
};

export const DEMO_STUDENT_CARD: StudentCard = {
  college: 'Brooklyn College',
  name: 'Nahid, C',
  role: 'Undergraduate',
  emplid: '1234567',
  hotline: 'Mental-health support: call or text 988 for free, confidential support 24/7.',
  security: {
    lamp: 'blue',
    mode: 'breathing',
    periodMs: 3200,
    issuedAt: Date.now(),
    reason: 'live-screen verification',
  },
};

export const DEPARTMENTS: Department[] = [
  { id: 'academic-assessment', name: 'Academic Assessment', room: '3118 Boylan Hall' },
  { id: 'ait', name: 'Academic Information Technologies', room: '382 Library' },
  { id: 'accounting', name: 'Accounting', room: '202 Whitehead Hall', phone: '718-951-5158' },
  { id: 'admissions-grad', name: 'Graduate Admissions', room: '222 West Quad Center' },
  { id: 'admissions-undergrad', name: 'Undergraduate Admissions', room: '222 West Quad Center' },
  { id: 'africana', name: 'Africana Studies', room: '3105 James Hall' },
  { id: 'alumni', name: 'Alumni Engagement', room: '1239 Ingersoll Hall' },
  { id: 'biology', name: 'Biology', room: '200 Ingersoll Hall Extension', phone: '718-951-5392' },
  { id: 'career', name: 'Magner Career Center', room: '1303 James Hall', phone: '718-951-5696' },
  { id: 'financial-aid', name: 'Financial Aid', room: '308 West Quad Center', phone: '718-951-5051' },
  { id: 'library', name: 'Pugliese College Library', room: 'Library Cafe Level' },
  { id: 'public-safety', name: 'Public Safety', room: '0202 Ingersoll Hall', phone: '718-951-5511' },
];

export const EMPLOYEES: Employee[] = [
  { id: 'alvarez', name: 'Alvarez, Elena', title: 'Academic Advisor', department: 'Center for Academic Advisement', email: 'advisement@pugliese.cuny.edu' },
  { id: 'benjamin', name: 'Benjamin, Marcus', title: 'College Laboratory Technician', department: 'Biology' },
  { id: 'chen', name: 'Chen, Lian', title: 'Associate Professor', department: 'Computer and Information Science' },
  { id: 'davis', name: 'Davis, Simone', title: 'Student Services Specialist', department: 'Financial Aid' },
  { id: 'elias', name: 'Elias, Robert', title: 'Reference Librarian', department: 'Pugliese College Library' },
  { id: 'fernandez', name: 'Fernandez, Maya', title: 'Career Counselor', department: 'Magner Career Center' },
  { id: 'green', name: 'Green, Anthony', title: 'Assistant Director', department: 'Public Safety', phone: '718-951-5511' },
  { id: 'hassan', name: 'Hassan, Noor', title: 'Enrollment Services Coordinator', department: 'Registrar' },
];

function dateOffset(days: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export const CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: 'welcome-desk',
    date: dateOffset(0),
    time: '10:00 AM - 2:00 PM',
    title: 'Student Services Welcome Desk',
    location: 'West Quad Center Lobby',
    category: 'Student Life',
    description: 'Get help locating advising, financial aid, registrar, and campus services.',
  },
  {
    id: 'career-lab',
    date: dateOffset(0),
    time: '3:00 PM - 4:00 PM',
    title: 'Resume Lab',
    location: '1303 James Hall',
    category: 'Career',
    description: 'Drop in for a focused resume review with the Magner Career Center.',
  },
  {
    id: 'library-tour',
    date: dateOffset(1),
    time: '12:30 PM - 1:15 PM',
    title: 'Library Research Tour',
    location: 'Library Cafe Level',
    category: 'Academic',
    description: 'Learn how to find course reserves, databases, study rooms, and research support.',
  },
  {
    id: 'pugliese-social',
    date: dateOffset(4),
    time: '4:30 PM - 6:00 PM',
    title: 'Pugliese Community Social',
    location: 'East Quad',
    category: 'Community',
    description: 'Meet student organizations and campus program representatives.',
  },
];

export const SERVICE_STATUSES: ServiceStatus[] = [
  { id: 'general', name: 'General IT Services', status: 'operational', message: 'No reported issues' },
  { id: 'cunyfirst', name: 'CUNYfirst', status: 'operational', message: 'No reported issues' },
  { id: 'brightspace', name: 'Brightspace', status: 'operational', message: 'No reported issues' },
  { id: 'student-email', name: 'Pugliese Student Email', status: 'operational', message: 'No reported issues' },
  { id: 'staff-email', name: 'Pugliese Faculty/Staff Email', status: 'operational', message: 'No reported issues' },
  { id: 'website', name: 'Pugliese College Website', status: 'operational', message: 'No reported issues' },
  { id: 'wifi', name: 'Pugliese Wi-Fi', status: 'degraded', message: 'Intermittent coverage reported in the Library basement' },
  { id: 'printing', name: 'Student Printing', status: 'operational', message: 'No reported issues' },
];

export const CAMPUS_ALERTS: CampusAlert[] = [
  {
    id: 'demo-notice',
    severity: 'info',
    title: 'Demo alert feed',
    body: 'Live CUNY Alert integration is not connected yet. Production alerts will replace this sample feed.',
    timestamp: 'Now',
  },
  {
    id: 'summer-hours',
    severity: 'warning',
    title: 'Confirm summer office hours',
    body: 'Some campus offices may use reduced summer schedules. Contact the office before visiting.',
    timestamp: 'Today',
  },
];

export const HELP_ARTICLES: HelpArticle[] = [
  { id: 'lost-item', question: 'How do I report a lost or stolen item?', answer: 'Contact Pugliese College Public Safety. For an emergency, call 911 first.', tags: ['lost', 'stolen', 'public safety'] },
  { id: 'tuition', question: 'Where can I check my tuition balance?', answer: 'Use CUNYfirst Student Center. This app will deep-link to the official student portal while account integration is being built.', tags: ['tuition', 'balance', 'cunyfirst'] },
  { id: 'internship', question: 'How do I find an internship?', answer: 'Visit the Magner Career Center in 1303 James Hall and use the official career services resources.', tags: ['internship', 'career', 'job'] },
  { id: 'email', question: 'How do I access my student email?', answer: 'Open the Pugliese College student portal and select the student email service.', tags: ['email', 'account'] },
  { id: 'wifi', question: 'How do I connect to campus Wi-Fi?', answer: 'Use your Pugliese College network credentials. Contact the ITS Help Desk if your password does not work.', tags: ['wifi', 'internet', 'password'] },
  { id: 'advising', question: 'How do I make an advising appointment?', answer: 'Start with the Center for Academic Advisement and Student Success or your major department.', tags: ['advising', 'appointment', 'caass'] },
];

export const IMPORTANT_CONTACTS: Contact[] = [
  { id: 'public-safety', name: 'Public Safety', detail: 'Campus Security Operations', phone: '7189515511' },
  { id: 'emergency-campus', name: 'Campus Emergency Line', detail: 'Urgent on-campus response', phone: '7189515444' },
  { id: 'help-desk', name: 'ITS Help Desk', detail: 'Technology support', phone: '7189514357' },
  { id: 'advisement', name: 'Academic Advisement', detail: 'Center for Academic Advisement and Student Success', url: 'https://students.pugliese.edu/' },
  { id: 'student-portal', name: 'Student Portal', detail: 'Official Pugliese College student knowledge base', url: 'https://students.pugliese.edu/portal/' },
];

export const CAREER_TASK_GROUPS: CareerTaskGroup[] = [
  {
    id: 'engage',
    title: 'Engage with the Career Center',
    tasks: ['Complete the Magner Career Center orientation', 'Visit 1303 James Hall', 'Set up your career profile'],
  },
  {
    id: 'strengths',
    title: 'Explore strengths and career interests',
    tasks: ['Review career-readiness competencies', 'Identify three fields to explore', 'Meet with a career counselor'],
  },
  {
    id: 'network',
    title: 'Build your professional network',
    tasks: ['Join the alumni mentor program', 'Attend a career panel', 'Connect with two professionals'],
  },
  {
    id: 'experience',
    title: 'Develop relevant experience',
    tasks: ['Research target employers', 'Attend a workshop', 'Apply for an internship or campus role'],
  },
];

// Deprecated partial snapshot retained for compatibility with older builds.
// The active app uses data/academic-calendar.json through the calendar API.
export const LEGACY_ACADEMIC_TERMS: AcademicTerm[] = [
  {
    id: 'summer-2026',
    name: 'Summer 2026',
    span: 'June 1 – August 18, 2026',
    entries: [
      { id: 'su-reg', date: '2026-03-16', label: 'Registration & ePermit application opens', kind: 'registration' },
      { id: 'su-s1-start', date: '2026-06-01', label: 'First day of Summer Session 1 classes', kind: 'classes' },
      { id: 'su-s1-add', date: '2026-06-02', label: 'Last day to add a course (5W1, 8W, 10W)', kind: 'deadline' },
      { id: 'su-pf', date: '2026-06-09', label: 'Last day to file a Pass/Fail elective request', kind: 'deadline' },
      { id: 'su-juneteenth', date: '2026-06-19', label: 'College closed (Juneteenth observed)', kind: 'closed' },
      { id: 'su-w-5w1', date: '2026-06-23', label: 'Last day to withdraw with a grade of W (5W1)', kind: 'deadline' },
      { id: 'su-w-8w', date: '2026-06-30', label: 'Last day to withdraw with a grade of W (8W)', kind: 'deadline' },
      { id: 'su-closed-703', date: '2026-07-03', label: 'College closed', kind: 'closed' },
      { id: 'su-july4', date: '2026-07-04', label: 'College closed (Independence Day)', kind: 'closed' },
      { id: 'su-s1-exams', date: '2026-07-06', endDate: '2026-07-07', label: 'Summer Session 1 final examinations', kind: 'exams' },
      { id: 'su-s2-start', date: '2026-07-13', label: 'First day of Summer Session 2 classes', kind: 'classes' },
      { id: 'su-s2-add', date: '2026-07-14', label: 'Last day to add a course (5W2)', kind: 'deadline' },
      { id: 'su-w-10w', date: '2026-07-17', label: 'Last day to withdraw with a grade of W (10W)', kind: 'deadline' },
      { id: 'su-w-5w2', date: '2026-08-07', label: 'Last day to withdraw with a grade of W (5W2)', kind: 'deadline' },
      { id: 'su-s2-exams', date: '2026-08-17', endDate: '2026-08-18', label: 'Summer final examinations (5W2 & 10W)', kind: 'exams' },
      { id: 'su-conferral', date: '2026-09-01', label: 'Summer 2026 degree conferral date', kind: 'classes' },
    ],
  },
  {
    id: 'fall-2026',
    name: 'Fall 2026',
    span: 'August 28 – December 21, 2026',
    entries: [
      { id: 'fa-reg', date: '2026-03-25', label: 'Registration opens', kind: 'registration' },
      { id: 'fa-refund', date: '2026-08-27', label: 'Last day to drop for 100% tuition refund', kind: 'deadline' },
      { id: 'fa-start', date: '2026-08-28', label: 'Start of Fall term — classes begin', kind: 'classes' },
      { id: 'fa-add', date: '2026-09-03', label: 'Last day to add a course', kind: 'deadline' },
      { id: 'fa-labor', date: '2026-09-07', label: 'College closed (Labor Day)', kind: 'closed' },
      { id: 'fa-pf', date: '2026-09-09', label: 'Last day to file a Pass/Fail elective', kind: 'deadline' },
      { id: 'fa-no-911', date: '2026-09-11', endDate: '2026-09-13', label: 'No classes scheduled', kind: 'closed' },
      { id: 'fa-grad', date: '2026-09-15', label: 'Last day to file for December 2026 graduation', kind: 'deadline' },
      { id: 'fa-no-921', date: '2026-09-21', label: 'No classes scheduled', kind: 'closed' },
      { id: 'fa-closed-1012', date: '2026-10-12', label: 'College closed', kind: 'closed' },
      { id: 'fa-mon', date: '2026-10-13', label: 'Classes follow a Monday schedule', kind: 'classes' },
      { id: 'fa-w', date: '2026-11-06', label: 'Last day to withdraw with a grade of W', kind: 'deadline' },
      { id: 'fa-no-1125', date: '2026-11-25', label: 'No classes scheduled', kind: 'closed' },
      { id: 'fa-thanks', date: '2026-11-26', endDate: '2026-11-27', label: 'College closed (Thanksgiving)', kind: 'closed' },
      { id: 'fa-no-1128', date: '2026-11-28', label: 'No classes scheduled', kind: 'closed' },
      { id: 'fa-exams', date: '2026-12-15', endDate: '2026-12-21', label: 'Final examinations', kind: 'exams' },
      { id: 'fa-end', date: '2026-12-21', label: 'End of Fall term', kind: 'classes' },
      { id: 'fa-winter-closed', date: '2026-12-24', endDate: '2026-12-25', label: 'College closed', kind: 'closed' },
      { id: 'fa-conferral', date: '2026-12-31', label: 'Fall 2026 degree conferral date', kind: 'classes' },
    ],
  },
  {
    id: 'winter-2027',
    name: 'Winter 2027',
    span: 'January 4 – 25, 2027',
    entries: [
      { id: 'wi-permit', date: '2026-12-28', label: 'Last day to file a permit request', kind: 'deadline' },
      { id: 'wi-refund', date: '2027-01-03', label: 'Last day to drop for 100% tuition refund', kind: 'deadline' },
      { id: 'wi-start', date: '2027-01-04', label: 'Start of Winter Session — classes begin', kind: 'classes' },
      { id: 'wi-refund-25', date: '2027-01-06', label: 'Last day to drop for 25% tuition refund', kind: 'deadline' },
      { id: 'wi-w', date: '2027-01-17', label: 'Last day to withdraw with a grade of W', kind: 'deadline' },
      { id: 'wi-mlk', date: '2027-01-18', label: 'College closed (Martin Luther King Jr. Day)', kind: 'closed' },
      { id: 'wi-exams', date: '2027-01-25', label: 'Final examinations & end of Winter Session', kind: 'exams' },
      { id: 'wi-conferral', date: '2027-02-01', label: 'Winter Session 2027 degree conferral date', kind: 'classes' },
    ],
  },
];
