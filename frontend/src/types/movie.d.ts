export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  is_favorite: boolean;
};

interface User {
  id: number;
  username: string;
  email: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}