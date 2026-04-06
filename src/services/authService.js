import { apiRequest } from './apiClient';
import { emptySession, loadStoredSession, saveStoredSession } from './sessionStore';

let currentSession = loadStoredSession();
const sessionListeners = new Set();

const emitSession = () => {
  sessionListeners.forEach((listener) => listener(currentSession));
};

const updateSession = (session) => {
  currentSession = session?.accessToken
    ? {
        accessToken: session.accessToken,
        user: session.user,
        profile: session.profile
      }
    : emptySession;

  saveStoredSession(currentSession);
  emitSession();
};

export const loginUser = async (email, password) => {
  const session = await apiRequest('/auth/login', {
    auth: false,
    method: 'POST',
    body: { email, password }
  });

  updateSession(session);
  return session;
};

export const registerStudentAccount = async (payload) => {
  const session = await apiRequest('/auth/register/student', {
    auth: false,
    method: 'POST',
    body: payload
  });

  updateSession(session);
  return session;
};

export const logoutAdmin = async () => {
  updateSession(emptySession);
};

export const restoreSession = async () => {
  if (!currentSession.accessToken) {
    updateSession(emptySession);
    return emptySession;
  }

  try {
    const session = await apiRequest('/auth/me');
    updateSession({
      accessToken: currentSession.accessToken,
      ...session
    });
    return currentSession;
  } catch (error) {
    updateSession(emptySession);
    throw error;
  }
};

export const subscribeToSessionChanges = (callback) => {
  sessionListeners.add(callback);
  callback(currentSession);

  return () => {
    sessionListeners.delete(callback);
  };
};

export const subscribeToAuthChanges = (callback) =>
  subscribeToSessionChanges((session) => {
    callback(session.user);
  });

export const getCurrentSession = () => currentSession;
