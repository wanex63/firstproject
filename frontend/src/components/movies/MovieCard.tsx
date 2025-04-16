'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { clientApi } from '@/lib/client-api';

interface MovieCardProps {
  movie: {
    id?: string | number;
    movie_id?: string | number;
    title: string;
    poster_path?: string;
    is_favorite?: boolean;
  };
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const { user } = useAuth() || {};
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsFavorite(movie.is_favorite ?? false);
  }, [movie.is_favorite]);

  const toggleFavorite = async () => {
    try {
      const movieId = movie.id ?? movie.movie_id;
      if (!movieId) return;

      await clientApi.toggleFavorite(movieId);
      setIsFavorite(prev => !prev);
    } catch (error) {
      console.error('Ошибка при переключении избранного:', error);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="relative aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden">
        {movie.poster_path && !imageError ? (
          <img
            src={movie.poster_path}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Нет изображения
          </div>
        )}
      </div>

      <h3 className="mt-2 text-lg font-semibold line-clamp-2">
        {movie.title || 'Без названия'}
      </h3>

      {user && (
        <button
          onClick={toggleFavorite}
          className="mt-2 p-1 rounded-full hover:bg-yellow-50 transition-colors"
          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          {isFavorite ? (
            <span className="text-2xl text-yellow-500">★</span>
          ) : (
            <span className="text-2xl text-gray-300">☆</span>
          )}
        </button>
      )}
    </div>
  );
};