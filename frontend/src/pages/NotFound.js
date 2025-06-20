import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function NotFound() {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)',
      flexDirection: 'column'
    }}>
      <Typography variant="h2" color="primary" fontWeight={700} gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="secondary" gutterBottom>
        Page Not Found
      </Typography>
      <Button href="/" variant="contained" color="primary" sx={{ borderRadius: 20, mt: 2 }}>
        Go Home
      </Button>
    </Box>
  );
}
