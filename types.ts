export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  ADMIN = 'ADMIN'
}

export type MessName = 'Alder' | 'Oak' | 'Pine' | 'Peepal' | 'Tulsi';

export interface MessMenu {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  semester?: number;
  teachingSubjectPrefix?: string; // e.g. 'CS', 'MA', 'PH'
}

export enum GrievanceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export interface Grievance {
  id: string;
  category: string;
  description: string;
  status: GrievanceStatus;
  submittedBy: string; // User ID
  date: string;
  adminComment?: string; // New: Direct reply from admin
}

export interface Announcement {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  elaboration: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  targetAudience: 'GLOBAL' | 'STUDENT' | 'FACULTY';
  targetSemester?: number; 
  targetUserId?: string;   
  courseCode?: string;     
}

export interface Carpool {
  id: string;
  author: string;
  from: string;
  to: string;
  time: string;
  carType: string;
  joined: number;
  max: number;
  totalPrice: number;
  status: 'OPEN' | 'FILLED';
  joinedUserIds: string[]; // Track who joined
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  materialsCount: number;
  progress?: number;
  semester: number;
  grade?: string; // For GPA calculation
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: 'INTERNSHIP' | 'RESEARCH' | 'JOB' | 'VOLUNTEER';
  location: string;
  deadline: string;
  tags: string[];
}

export interface Contest {
  id: string;
  platform: string;
  title: string;
  startTime: string; 
  rawStartTime: string; 
  endTime: string; 
  duration: string;
  link: string;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
}

export interface ResidentialRequest {
  id: string;
  type: 'ROOM_CHANGE' | 'LATE_PASS' | 'GUEST_BOOKING' | 'MESS_CHANGE' | 'OUT_PASS';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  details: any;
}

export interface ComplaintHistoryItem {
  id: string;
  category: string;
  description: string;
  status: string;
  date: string;
  adminComment?: string;
}
