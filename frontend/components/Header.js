import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Movie App
            </Link>
          </Typography>
          {user ? (
            <>
              <Button color="inherit" component={Link} href="/profile">
                Profile
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} href="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;