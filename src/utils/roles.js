export const ROLE_LABELS = {
  admin: 'Admin',
  teacher: 'Teacher',
  student: 'Student'
};

export const getHomePath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin-dashboard';
    case 'teacher':
      return '/teacher-dashboard';
    case 'student':
      return '/student-dashboard';
    default:
      return '/login';
  }
};
