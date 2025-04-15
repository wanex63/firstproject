import { Card, CardMedia, CardContent, Typography, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { useState } from 'react';
import { toast } from 'react-toastify';

const MovieCard = ({ movie, isFavorite: initialIsFavorite, onFavoriteChange }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${movie.movie_id}/`);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/favorites/${movie.movie_id}/`);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
      onFavoriteChange && onFavoriteChange();
    } catch (err) {
      toast.error('Error updating favorites');
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Link href={`/movie/${movie.movie_id}`} passHref>
        <CardMedia
          component="img"
          image={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/no-image.jpg'
          }
          alt={movie.title}
          sx={{ height: 300, objectFit: 'cover', cursor: 'pointer' }}
        />
      </Link>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h6" component="div">
            {movie.title}
          </Typography>
          <IconButton onClick={toggleFavorite} color={isFavorite ? 'error' : 'default'}>
            <FavoriteIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Rating: {movie.vote_average}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.release_date}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;