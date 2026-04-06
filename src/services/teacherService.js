import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { createManagedAccount } from './userService';

const teachersCollection = collection(db, 'teachers');

const mapTeacher = (snapshot) => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? null
  };
};

export const createTeacherAccount = async ({ fullName, email, password, phone, department }) =>
  createManagedAccount({
    email,
    password,
    role: 'teacher',
    profile: {
      fullName,
      phone,
      department
    },
    extraWrites: (uid) =>
      setDoc(doc(db, 'teachers', uid), {
        authUid: uid,
        fullName,
        email,
        phone,
        department,
        role: 'teacher',
        createdAt: serverTimestamp()
      })
  });

export const subscribeToTeachers = (callback) => {
  const teachersQuery = query(teachersCollection, orderBy('createdAt', 'desc'));

  return onSnapshot(teachersQuery, (snapshot) => {
    callback(snapshot.docs.map(mapTeacher));
  });
};

export const getTeachersCount = async () => {
  const snapshot = await getDocs(teachersCollection);
  return snapshot.size;
};
