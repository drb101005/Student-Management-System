import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

const studentsCollection = collection(db, 'students');

const mapDocument = (snapshot) => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null
  };
};

export const subscribeToStudents = (callback) => {
  const studentsQuery = query(studentsCollection, orderBy('createdAt', 'desc'));

  return onSnapshot(studentsQuery, (snapshot) => {
    callback(snapshot.docs.map(mapDocument));
  });
};

export const createStudent = (studentData) =>
  addDoc(studentsCollection, {
    ...studentData,
    createdAt: serverTimestamp()
  });

export const updateStudent = (studentDocId, studentData) =>
  updateDoc(doc(db, 'students', studentDocId), studentData);

export const deleteStudent = (studentDocId) => deleteDoc(doc(db, 'students', studentDocId));

export const getStudentsCount = async () => {
  const snapshot = await getDocs(studentsCollection);
  return snapshot.size;
};

