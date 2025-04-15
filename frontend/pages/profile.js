import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Button } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await api.get('/favorites/');
        setFavorites(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavoriteChange = () => {
    fetchFavorites();
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4, flex: 1, textAlign: 'center' }}>
          <Typography variant="h5">Please login to view your profile</Typography>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.username}!
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Your Favorites
        </Typography>
        {favorites.length === 0 ? (
          <Typography>No favorites yet</Typography>
        ) : (
          <Grid container spacing={3}>
            {favorites.map((movie) => (
              <Grid item key={movie.movie_id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard
                  movie={movie}
                  isFavorite={true}
                  onFavoriteChange={handleFavoriteChange}
                />
              </Grid>
            ))}
          </Grid>
        )}
        <Button
          variant="contained"
          color="error"
          onClick={logout}
          sx={{ mt: 3 }}
        >
          Logout
        </Button>
      </Container>
      <Footer />
    </div>
  );
}