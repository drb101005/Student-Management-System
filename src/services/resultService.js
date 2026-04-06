import { apiRequest } from './apiClient';

const resultListeners = new Set();
const resultByStudentListeners = new Map();

const notifyResultListeners = async () => {
  const records = await apiRequest('/results');

  resultListeners.forEach((listener) => listener(records));

  const studentEntries = Array.from(resultByStudentListeners.entries());
  await Promise.all(
    studentEntries.map(async ([studentId, listeners]) => {
      const studentRecords = await apiRequest(`/results/student/${studentId}`);
      listeners.forEach((listener) => listener(studentRecords));
    })
  );
};

export const subscribeToResults = (callback) => {
  resultListeners.add(callback);

  notifyResultListeners().catch((error) => {
    console.error(error);
    callback([]);
  });

  return () => {
    resultListeners.delete(callback);
  };
};

export const createResult = async (resultData) => {
  const result = await apiRequest('/results', {
    method: 'POST',
    body: resultData
  });

  await notifyResultListeners();
  return result;
};

export const deleteResult = async (resultId) => {
  const result = await apiRequest(`/results/${resultId}`, {
    method: 'DELETE'
  });

  await notifyResultListeners();
  return result;
};

export const getResultsCount = async () => apiRequest('/results/count');

export const subscribeToResultsByStudentId = (studentId, callback) => {
  const listeners = resultByStudentListeners.get(studentId) ?? new Set();
  listeners.add(callback);
  resultByStudentListeners.set(studentId, listeners);

  apiRequest(`/results/student/${studentId}`)
    .then((records) => callback(records))
    .catch((error) => {
      console.error(error);
      callback([]);
    });

  return () => {
    const currentListeners = resultByStudentListeners.get(studentId);

    if (!currentListeners) {
      return;
    }

    currentListeners.delete(callback);

    if (!currentListeners.size) {
      resultByStudentListeners.delete(studentId);
    }
  };
};
