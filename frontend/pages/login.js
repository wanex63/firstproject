import { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      toast.success('Login successful!');
      router.push('/profile');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="sm" sx={{ py: 4, flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Login
          </Button>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await login(username, password); // или register()
    if (result.success) {
      toast.success('Success!');
      router.push('/profile');
    }
  } catch (error) {
    console.error('Error:', error);
    let errorMessage = 'An error occurred';

    if (error.response) {
      // Сервер ответил с кодом ошибки
      if (error.response.data) {
        errorMessage = typeof error.response.data === 'object'
          ? JSON.stringify(error.response.data)
          : error.response.data;
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      errorMessage = 'No response from server';
    }

    toast.error(errorMessage);
  }
};