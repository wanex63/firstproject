import { useEffect, useState } from 'react';
import api from '../utils/api';  // Подключаем ваш API

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);  // Состояние для индикатора загрузки
  const [error, setError] = useState(null);  // Состояние для ошибки

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/movies/');
        setMovies(response.data.movies);  // Убедитесь, что в response.data есть movies
        setLoading(false);  // Завершаем загрузку
      } catch (error) {
        setError(error.message);  // Сохраняем ошибку
        setLoading(false);  // Завершаем загрузку даже в случае ошибки
      }
    };

    fetchMovies();
  }, []);

  // Если идет загрузка, показываем индикатор
  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Если произошла ошибка, показываем сообщение об ошибке
  if (error) {
    return <div>Ошибка при загрузке фильмов: {error}</div>;
  }

  return (
    <div>
      <h1>Список фильмов</h1>
      <ul>
        {movies.length > 0 ? (
          movies.map(movie => (
            <li key={movie.id}>{movie.title}</li>
          ))
        ) : (
          <li>Нет доступных фильмов.</li>
        )}
      </ul>
    </div>
  );
};

export default HomePage;
