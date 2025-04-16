import { Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';

export function MovieList({ movies }: { movies: Movie[] | undefined }) {
  if (!movies) {
    return <div className="text-red-500 p-4">Данные не загружены</div>;
  }

  if (movies.length === 0) {
    return <div className="text-gray-500 p-4">Фильмы не найдены</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id ?? movie.movie_id ?? Math.random().toString(36).substring(2,9)}
          movie={movie}
        />
      ))}
    </div>
  );
}