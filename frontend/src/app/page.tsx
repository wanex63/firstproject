import { serverApi } from '@/lib/server-api';
import { MovieList } from '@/components/movies/MovieList';

export default async function Home() {
  let movies;

  try {
    movies = await serverApi.getMovies();
  } catch (error) {
    console.error('Failed to load movies:', error);
    movies = [];
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Popular Movies</h1>
      <MovieList movies={movies} />
    </main>
  );
}