import { getCurrentSession, subscribeToSessionChanges } from './authService';

export const getUserProfile = async (id) => {
  const session = getCurrentSession();

  if (session.profile?.id === id) {
    return session.profile;
  }

  return null;
};

export const subscribeToUserProfile = (id, callback) =>
  subscribeToSessionChanges((session) => {
    callback(session.profile?.id === id ? session.profile : null);
  });
