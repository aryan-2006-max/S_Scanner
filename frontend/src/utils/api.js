// In production, set VITE_API_URL to your deployed backend URL (e.g. https://your-backend.onrender.com/api)
// In development, Vite proxy forwards /api to localhost:3000
const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('sc_token');
}

function getUser() {
  const raw = localStorage.getItem('sc_user');
  return raw ? JSON.parse(raw) : null;
}

function setAuth(token, user) {
  localStorage.setItem('sc_token', token);
  localStorage.setItem('sc_user', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('sc_token');
  localStorage.removeItem('sc_user');
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new Error('Network error — could not reach server.');
  }

  // Handle empty responses
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Server error (${res.status}): ${text.substring(0, 100)}`);
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export { apiFetch, getToken, getUser, setAuth, clearAuth };
