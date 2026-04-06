const SESSION_KEY = 'student-management.local.session';

export const emptySession = {
  accessToken: null,
  user: null,
  profile: null
};

export const loadStoredSession = () => {
  if (typeof window === 'undefined') {
    return emptySession;
  }

  try {
    const rawSession = window.localStorage.getItem(SESSION_KEY);

    if (!rawSession) {
      return emptySession;
    }

    const parsed = JSON.parse(rawSession);

    return {
      accessToken: parsed.accessToken ?? null,
      user: parsed.user ?? null,
      profile: parsed.profile ?? null
    };
  } catch (error) {
    console.warn('Unable to restore the local session.', error);
    return emptySession;
  }
};

export const saveStoredSession = (session) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!session?.accessToken) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};
