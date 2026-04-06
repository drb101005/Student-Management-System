import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

const attendanceCollection = collection(db, 'attendance');

export const subscribeToAttendance = (callback) => {
  const attendanceQuery = query(attendanceCollection, orderBy('date', 'desc'));

  return onSnapshot(attendanceQuery, (snapshot) => {
    callback(
      snapshot.docs.map((record) => ({
        id: record.id,
        ...record.data()
      }))
    );
  });
};

export const saveAttendanceRecord = async (attendanceData) => {
  const recordId = `${attendanceData.studentId}_${attendanceData.date}`;

  return setDoc(
    doc(db, 'attendance', recordId),
    {
      ...attendanceData,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
};

export const deleteAttendanceRecord = (recordId) => deleteDoc(doc(db, 'attendance', recordId));

export const getAttendanceCount = async () => {
  const snapshot = await getDocs(attendanceCollection);
  return snapshot.size;
};

