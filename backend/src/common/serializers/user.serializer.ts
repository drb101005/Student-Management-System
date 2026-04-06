import type { User } from '../../entities/user.entity';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface SanitizedUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
}

export interface SanitizedProfile extends SanitizedUser {
  fullName: string;
  phone: string | null;
  department: string | null;
  studentId: string | null;
  class: string | null;
  section: string | null;
  rollNumber: string | null;
  parentName: string | null;
  status: string | null;
}

const toIso = (value: Date | string | null | undefined) => {
  if (!value) {
    return new Date().toISOString();
  }

  return value instanceof Date ? value.toISOString() : value;
};

export const serializeUser = (user: User): SanitizedUser => ({
  id: user.id,
  email: user.email,
  role: user.role,
  createdAt: toIso(user.createdAt),
  lastLoginAt: toIso(user.lastLoginAt ?? user.updatedAt ?? user.createdAt)
});

export const serializeProfile = (user: User): SanitizedProfile => ({
  ...serializeUser(user),
  fullName: user.fullName,
  phone: user.phone,
  department: user.department,
  studentId: user.studentId,
  class: user.className,
  section: user.section,
  rollNumber: user.rollNumber,
  parentName: user.parentName,
  status: user.status
});
