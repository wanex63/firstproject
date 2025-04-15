import axios from 'axios';

// Создаем экземпляр Axios с базовым URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Убедитесь, что это правильный URL вашего API
});

// Добавляем интерсептор для добавления токена в заголовки
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Получаем токен из localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // Добавляем токен в заголовки
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
