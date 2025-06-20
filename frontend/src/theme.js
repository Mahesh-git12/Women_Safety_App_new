import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6a82fb' },      // Soft blue
    secondary: { main: '#fc5c7d' },    // Soft pink
    background: { default: '#f7fafd' },
  },
  typography: {
    fontFamily: "'Quicksand', 'Roboto', sans-serif",
    h5: { fontWeight: 700, letterSpacing: '0.03em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 20 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 16px rgba(106,130,251,0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          border: '1px solid rgba(255,255,255,0.18)',
        },
      },
    },
  },
});

export default theme;
