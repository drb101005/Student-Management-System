import { deleteApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { createSecondaryApp, db } from '../firebase/config';

const usersCollection = collection(db, 'users');

const mapProfile = (snapshot) => {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? data.updatedAt ?? null
  };
};

export const getUserProfile = async (uid) => {
  const snapshot = await getDoc(doc(usersCollection, uid));
  return mapProfile(snapshot);
};

export const subscribeToUserProfile = (uid, callback) =>
  onSnapshot(doc(usersCollection, uid), (snapshot) => {
    callback(mapProfile(snapshot));
  });

export const saveUserProfile = (uid, profile) =>
  setDoc(
    doc(usersCollection, uid),
    {
      ...profile,
      updatedAt: serverTimestamp(),
      createdAt: profile.createdAt ?? serverTimestamp()
    },
    { merge: true }
  );

const createManagedAccount = async ({ email, password, role, profile, extraWrites }) => {
  const secondaryApp = createSecondaryApp(`secondary-${role}-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const credentials = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const uid = credentials.user.uid;

    await saveUserProfile(uid, {
      email,
      role,
      ...profile
    });

    if (extraWrites) {
      await extraWrites(uid, email);
    }

    return credentials.user;
  } finally {
    await signOut(secondaryAuth).catch(() => undefined);
    await deleteApp(secondaryApp).catch(() => undefined);
  }
};

export const seedDefaultAdminAccount = () =>
  createManagedAccount({
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    profile: {
      fullName: 'Default Admin'
    }
  });

export { usersCollection, createManagedAccount };
