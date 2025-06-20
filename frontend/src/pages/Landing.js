import React from 'react';
import { Box, Typography, Button, Paper, Stack, Avatar, Fade } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

export default function Landing() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #fc5c7d 0%, #6a82fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Fade in timeout={1200}>
        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 7,
            textAlign: 'center',
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(16px)',
            minWidth: { xs: '90vw', sm: 420 },
            maxWidth: 540,
            boxShadow: '0 8px 40px 0 rgba(31, 38, 135, 0.18)',
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              boxShadow: '0 4px 32px #6a82fb44',
            }}
          >
            <SecurityIcon sx={{ fontSize: 48 }} />
          </Avatar>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: 'primary.main',
              mb: 1,
              textShadow: '0 2px 16px #6a82fb33',
              fontSize: { xs: '2.1rem', sm: '2.7rem' },
            }}
          >
            Vigilant
          </Typography>
          <Typography
            variant="h5"
            color="secondary"
            sx={{
              mb: 3,
              fontWeight: 600,
              letterSpacing: '0.03em',
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
            }}
          >
            Your universal safety & emergency companion.<br />
            Stay secure, stay connected, stay Vigilant.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              href="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: 20,
                px: 5,
                fontWeight: 700,
                fontSize: '1.1rem',
                background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
                boxShadow: '0 2px 16px #fc5c7d33',
                letterSpacing: '0.03em',
              }}
            >
              Register
            </Button>
            <Button
              href="/login"
              variant="outlined"
              color="secondary"
              size="large"
              sx={{
                borderRadius: 20,
                px: 5,
                fontWeight: 700,
                fontSize: '1.1rem',
                background: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.03em',
                borderWidth: 2,
                '&:hover': {
                  background: 'rgba(255,255,255,0.7)',
                  borderColor: '#fc5c7d',
                },
              }}
            >
              Login
            </Button>
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
}
