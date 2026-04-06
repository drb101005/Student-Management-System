import { apiRequest } from './apiClient';

const attendanceListeners = new Set();
const attendanceByStudentListeners = new Map();

const notifyAttendanceListeners = async () => {
  const records = await apiRequest('/attendance');

  attendanceListeners.forEach((listener) => listener(records));

  const studentEntries = Array.from(attendanceByStudentListeners.entries());
  await Promise.all(
    studentEntries.map(async ([studentId, listeners]) => {
      const studentRecords = await apiRequest(`/attendance/student/${studentId}`);
      listeners.forEach((listener) => listener(studentRecords));
    })
  );
};

export const subscribeToAttendance = (callback) => {
  attendanceListeners.add(callback);

  notifyAttendanceListeners().catch((error) => {
    console.error(error);
    callback([]);
  });

  return () => {
    attendanceListeners.delete(callback);
  };
};

export const saveAttendanceRecord = async (attendanceData) => {
  const record = await apiRequest('/attendance', {
    method: 'POST',
    body: attendanceData
  });

  await notifyAttendanceListeners();
  return record;
};

export const deleteAttendanceRecord = async (recordId) => {
  const result = await apiRequest(`/attendance/${recordId}`, {
    method: 'DELETE'
  });

  await notifyAttendanceListeners();
  return result;
};

export const getAttendanceCount = async () => apiRequest('/attendance/count');

export const subscribeToAttendanceByStudentId = (studentId, callback) => {
  const listeners = attendanceByStudentListeners.get(studentId) ?? new Set();
  listeners.add(callback);
  attendanceByStudentListeners.set(studentId, listeners);

  apiRequest(`/attendance/student/${studentId}`)
    .then((records) => callback(records))
    .catch((error) => {
      console.error(error);
      callback([]);
    });

  return () => {
    const currentListeners = attendanceByStudentListeners.get(studentId);

    if (!currentListeners) {
      return;
    }

    currentListeners.delete(callback);

    if (!currentListeners.size) {
      attendanceByStudentListeners.delete(studentId);
    }
  };
};
