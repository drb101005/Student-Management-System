import { apiRequest } from './apiClient';

const studentListeners = new Set();

const notifyStudentListeners = async () => {
  const students = await apiRequest('/students');
  studentListeners.forEach((listener) => listener(students));
};

export const subscribeToStudents = (callback) => {
  studentListeners.add(callback);

  notifyStudentListeners().catch((error) => {
    console.error(error);
    callback([]);
  });

  return () => {
    studentListeners.delete(callback);
  };
};

export const createStudent = async (studentData) => {
  const student = await apiRequest('/students', {
    method: 'POST',
    body: studentData
  });

  await notifyStudentListeners();
  return student;
};

export const updateStudent = async (studentDocId, studentData) => {
  const student = await apiRequest(`/students/${studentDocId}`, {
    method: 'PATCH',
    body: studentData
  });

  await notifyStudentListeners();
  return student;
};

export const deleteStudent = async (studentDocId) => {
  const result = await apiRequest(`/students/${studentDocId}`, {
    method: 'DELETE'
  });

  await notifyStudentListeners();
  return result;
};

export const getStudentsCount = async () => apiRequest('/students/count');

export const getCurrentStudentRecord = () => apiRequest('/students/me');
