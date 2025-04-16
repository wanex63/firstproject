// Только для серверных компонентов
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const serverApi = {
  getMovies: async () => {
    const res = await fetch(`${API_BASE}/movies/`);
    return await res.json();
  }
};