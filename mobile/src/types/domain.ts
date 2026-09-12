export type UserType = 'student' | 'employee';

export type UserPreferences = {
  onboardingComplete: boolean;
  loginComplete: boolean;
  politicalParty?: 'democratic' | 'republican' | 'pugliese' | 'not-interested';
  selectedSports: string[];
  identity?: 'lgbtq' | 'heterosexual';
  userType: UserType;
  privacyMode: boolean;
  autoLogin: boolean;
  showCourses: boolean;
  showTransactions: boolean;
  showAppointments: boolean;
  showHolds: boolean;
  showCareer: boolean;
  showTimeAndPayroll: boolean;
  safetyAlerts: boolean;
  eventReminders: boolean;
  puglieseIntroSeen: boolean;
};

export type Profile = {
  name: string;
  role: string;
  emplid: string;
  transactions: number;
  appointments: number;
  holds: number;
  holdsNote: string;
  balanceDue: string;
  webcentralId: string;
  email: string;
  wifiUser: string;
  wifiNote: string;
  helpPhone: string;
  helpUrl: string;
};

export type Course = {
  no: string;
  ti: string;
  mode?: 'In person' | 'Hybrid' | 'Online';
  seats?: number;
  detailData?: {
    credits: string;
    section: string;
    prereq: string;
    hours: string;
    desc: string;
    meet: {
      type: string;
      code: string;
      room: string;
      times: string;
    };
    instructor: {
      name: string;
      title: string;
      dept: string;
      email: string;
      phone: string;
      office: string;
    };
  };
};

export type Catalog = {
  dept: string;
  term: string;
  count: number;
  courses: Course[];
};

export type CampusLocation = {
  name: string;
  room: string;
  building: string;
  buildingLabel: string;
  floor: string;
};

export type LibraryResource = {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: 'search' | 'database' | 'guides' | 'help' | 'hours';
};

export type LibraryInfo = {
  name: string;
  location: string;
  website: string;
  libraryId: string;
  resources: LibraryResource[];
};

export type StudentCard = {
  college: string;
  name: string;
  role: string;
  emplid: string;
  hotline: string;
  security: {
    lamp: string;
    mode: string;
    periodMs: number;
    issuedAt: number;
    reason: string;
  };
};

export type Department = {
  id: string;
  name: string;
  room: string;
  phone?: string;
};

export type Employee = {
  id: string;
  name: string;
  title: string;
  department: string;
  email?: string;
  phone?: string;
};

export type CampusEvent = {
  id: string;
  date: string;
  time: string;
  title: string;
  location: string;
  category: string;
  description: string;
};

export type ServiceStatus = {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  message: string;
};

export type CampusAlert = {
  id: string;
  severity: 'info' | 'warning' | 'urgent';
  title: string;
  body: string;
  timestamp: string;
};

export type HelpArticle = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
};

export type Contact = {
  id: string;
  name: string;
  detail: string;
  phone?: string;
  url?: string;
};

export type CareerTaskGroup = {
  id: string;
  title: string;
  tasks: string[];
};

export type AcademicEntryKind = 'classes' | 'deadline' | 'closed' | 'exams' | 'registration';

export type AcademicEntryPriority = 'high';

export type AcademicEntry = {
  id: string;
  date: string;
  endDate?: string;
  label: string;
  kind: AcademicEntryKind;
  priority?: AcademicEntryPriority;
};

export type AcademicTerm = {
  id: string;
  name: string;
  span: string;
  entries: AcademicEntry[];
};

export type AcademicCalendarSource = {
  name: string;
  url: string;
  verifiedOn: string;
  sourceUpdatedAt: string;
  notice: string;
};

export type AcademicCalendar = {
  source: AcademicCalendarSource;
  terms: AcademicTerm[];
};
