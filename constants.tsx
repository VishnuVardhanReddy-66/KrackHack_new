
import React from 'react';

export const COLORS = {
  primary: '#1e293b', // slate-800
  secondary: '#334155', // slate-700
  accent: '#3b82f6', // blue-500
  success: '#10b981', // emerald-500
  danger: '#ef4444', // red-500
  warning: '#f59e0b', // amber-500
};

export const MOCK_USER: Record<string, any> = {
  STUDENT: {
    id: 's-001',
    name: 'Alex Johnson',
    email: 'alex.j@campus.edu',
    role: 'STUDENT',
    department: 'Computer Science',
    avatar: 'https://picsum.photos/seed/alex/100/100'
  },
  FACULTY: {
    id: 'f-001',
    name: 'Dr. Sarah Smith',
    email: 's.smith@campus.edu',
    role: 'FACULTY',
    department: 'Software Engineering',
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  },
  ADMIN: {
    id: 'a-001',
    name: 'Admin Central',
    email: 'admin@campus.edu',
    role: 'ADMIN',
    department: 'Operations',
    avatar: 'https://picsum.photos/seed/admin/100/100'
  }
};
