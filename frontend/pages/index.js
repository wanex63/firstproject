import { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import api from '../utils/api';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/movies/', {
          params: { page },
        });
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
        toast.error('Failed to load movies');
      }
    };

    const fetchFavorites = async () => {
      try {
        const { data } = await api.get('/favorites/');
        setFavorites(data.map(movie => movie.movie_id));
      } catch (err) {
        console.error(err);
        toast.error('Failed to load favorites');
      }
    };

    fetchData();
    fetchFavorites();
  }, [page]);

  const handleFavoriteChange = async () => {
    try {
      const { data } = await api.get('/favorites/');
      setFavorites(data.map(movie => movie.movie_id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to update favorites');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item key={movie.movie_id} xs={12} sm={6} md={4} lg={3}>
              <MovieCard
                movie={movie}
                isFavorite={favorites.includes(movie.movie_id)}
                onFavoriteChange={handleFavoriteChange}
              />
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </Container>
      <Footer />
    </div>
  );
}