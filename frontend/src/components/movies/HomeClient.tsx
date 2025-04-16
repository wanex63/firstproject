'use client';

import { useEffect, useState } from 'react';
import { serverApi } from '@/lib/server-api';
import { Movie } from '@/types/movie';
import { MovieList } from '@/components/movies/MovieList';

export default function HomeClient() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await serverApi.getMovies(page);
        setMovies(data.results); // если backend отдаёт { results: [...], count: 100 }
        setTotalPages(Math.ceil(data.count / 20)); // если 20 фильмов на страницу
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      }
    }

    fetchMovies();
  }, [page]);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Popular Movies</h1>
      <MovieList movies={movies} />

      {/* Пагинация */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Назад
        </button>
        <span>Страница {page} из {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Вперёд
        </button>
      </div>
    </main>
  );
}
