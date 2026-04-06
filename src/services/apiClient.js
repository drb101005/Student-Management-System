import { loadStoredSession } from './sessionStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const buildHeaders = ({ auth, headers }) => {
  const session = loadStoredSession();
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  if (auth && session.accessToken) {
    requestHeaders.Authorization = `Bearer ${session.accessToken}`;
  }

  return requestHeaders;
};

export const apiRequest = async (path, options = {}) => {
  const { auth = true, body, headers, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: buildHeaders({ auth, headers }),
    body: body ? JSON.stringify(body) : undefined
  });

  const rawBody = await response.text();
  const data = rawBody ? JSON.parse(rawBody) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? 'Something went wrong while talking to the local backend.');
  }

  return data;
};
