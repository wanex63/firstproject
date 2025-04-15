import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, mt: 'auto', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          Movie App © {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;