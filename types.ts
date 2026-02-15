
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
}

export enum GrievanceStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export interface Grievance {
  id: string;
  title: string;
  description: string;
  category: string;
  status: GrievanceStatus;
  submittedBy: string;
  submittedDate: string;
  resolution?: string;
}

export interface UserCourse {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  materialsCount: number;
  progress?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  materialsCount: number;
  progress?: number;
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
  startTime: string; // Formatted string
  rawStartTime: string; // ISO string
  endTime: string; // ISO string
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
}
