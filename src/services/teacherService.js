import { apiRequest } from './apiClient';

const teacherListeners = new Set();

const notifyTeacherListeners = async () => {
  const teachers = await apiRequest('/teachers');
  teacherListeners.forEach((listener) => listener(teachers));
};

export const createTeacherAccount = async (payload) => {
  const teacher = await apiRequest('/teachers', {
    method: 'POST',
    body: payload
  });

  await notifyTeacherListeners();
  return teacher;
};

export const subscribeToTeachers = (callback) => {
  teacherListeners.add(callback);

  notifyTeacherListeners().catch((error) => {
    console.error(error);
    callback([]);
  });

  return () => {
    teacherListeners.delete(callback);
  };
};
