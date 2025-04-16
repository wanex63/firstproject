import { Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';

interface MovieListProps {
  movies: Movie[] | undefined;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function MovieList({ movies, currentPage, totalPages, onPageChange }: MovieListProps) {
  if (!movies) {
    return <div className="text-red-500 p-4">Данные не загружены</div>;
  }

  if (movies.length === 0) {
    return <div className="text-gray-500 p-4">Фильмы не найдены</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id ?? movie.movie_id ?? Math.random().toString(36).substring(2, 9)}
            movie={movie}
          />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Назад
        </button>

        <span className="text-sm text-gray-600">
          Страница {currentPage} из {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Вперёд
        </button>
      </div>
    </>
  );
}
