const BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// ── Auth ──
export const register = (data) =>
  fetch(`${BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

export const login = (data) =>
  fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

// ── Questions ──
export const getTodayQuestion = () =>
  fetch(`${BASE_URL}/questions/today`, { headers: headers() }).then(r => r.json());

// ── Entries ──
export const createEntry = (data) =>
  fetch(`${BASE_URL}/entries`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const getMyEntries = () =>
  fetch(`${BASE_URL}/entries/mine`, { headers: headers() }).then(r => r.json());

export const getFriendsFeed = () =>
  fetch(`${BASE_URL}/entries/friends-feed`, { headers: headers() }).then(r => r.json());

export const reactToEntry = (id, emoji) =>
  fetch(`${BASE_URL}/entries/${id}/react`, { method: 'POST', headers: headers(), body: JSON.stringify({ emoji }) }).then(r => r.json());

// ── Report ──
export const generateReport = () =>
  fetch(`${BASE_URL}/report/generate`, { headers: headers() }).then(r => r.json());

// ── Friends ──
export const searchFriends = (nickname) =>
  fetch(`${BASE_URL}/friends/search?nickname=${nickname}`, { headers: headers() }).then(r => r.json());

export const addFriend = (friendId) =>
  fetch(`${BASE_URL}/friends/add/${friendId}`, { method: 'POST', headers: headers() }).then(r => r.json());

export const getMyFriends = () =>
  fetch(`${BASE_URL}/friends`, { headers: headers() }).then(r => r.json());
