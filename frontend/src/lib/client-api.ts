const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const clientApi = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await res.json();
  },

  getProfile: async () => {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${API_BASE}/auth/profile/`, {
      headers: { Authorization: `Token ${token}` }
    });
    return await res.json();
  }
};