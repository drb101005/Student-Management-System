import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const resultsCollection = collection(db, 'results');

export const subscribeToResults = (callback) => {
  const resultsQuery = query(resultsCollection, orderBy('createdAt', 'desc'));

  return onSnapshot(resultsQuery, (snapshot) => {
    callback(
      snapshot.docs.map((record) => {
        const data = record.data();

        return {
          id: record.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null
        };
      })
    );
  });
};

export const createResult = (resultData) =>
  addDoc(resultsCollection, {
    ...resultData,
    createdAt: serverTimestamp()
  });

export const deleteResult = (resultId) => deleteDoc(doc(db, 'results', resultId));

export const getResultsCount = async () => {
  const snapshot = await getDocs(resultsCollection);
  return snapshot.size;
};

