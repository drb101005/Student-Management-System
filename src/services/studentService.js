import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  updateDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { saveUserProfile } from './userService';

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

export const registerStudentAccount = async ({ password, ...studentData }) => {
  const credentials = await createUserWithEmailAndPassword(auth, studentData.email, password);
  const uid = credentials.user.uid;

  await saveUserProfile(uid, {
    role: 'student',
    fullName: studentData.fullName,
    email: studentData.email,
    studentId: studentData.studentId,
    studentDocId: uid
  });

  await setDoc(doc(db, 'students', uid), {
    ...studentData,
    authUid: uid,
    role: 'student',
    createdAt: serverTimestamp()
  });

  return credentials.user;
};

export const updateStudent = (studentDocId, studentData) =>
  updateDoc(doc(db, 'students', studentDocId), studentData);

export const deleteStudent = (studentDocId) => deleteDoc(doc(db, 'students', studentDocId));

export const getStudentsCount = async () => {
  const snapshot = await getDocs(studentsCollection);
  return snapshot.size;
};

export const getStudentRecordByAuthUid = async (uid) => {
  const studentDoc = await getDoc(doc(db, 'students', uid));

  if (studentDoc.exists()) {
    return mapDocument(studentDoc);
  }

  const fallbackQuery = query(studentsCollection, where('authUid', '==', uid));
  const fallbackSnapshot = await getDocs(fallbackQuery);

  return fallbackSnapshot.docs[0] ? mapDocument(fallbackSnapshot.docs[0]) : null;
};
