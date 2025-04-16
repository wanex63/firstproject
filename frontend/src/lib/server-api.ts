// Только для серверных компонентов
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const serverApi = {
  async getMovies(page = 1) {
    const res = await fetch(`http://127.0.0.1:8000/api/movies/?page=${page}`);
    if (!res.ok) throw new Error('Ошибка загрузки фильмов');
    return res.json();
  },
};