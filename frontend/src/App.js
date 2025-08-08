//hi
import React from 'react';

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ReportIncident from './pages/ReportIncident';
import MyIncidents from './pages/MyIncidents';
import EmergencyContacts from './pages/EmergencyContacts';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import HomePage from './pages/HomePage';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import SOSButton from './components/SOSButton';
import TrackIncident from './pages/TrackIncident';
import FindHelperButton from "./components/FindHelperButton";
import { AppBar, Toolbar, Button, Box, Container, Avatar } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const RedirectIfLoggedIn = ({ children }) =>
    isLoggedIn ? <Navigate to="/home" /> : children;

  return (
    <Router>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'rgba(255,255,255,0.35)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          borderBottom: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 72 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                mr: 2,
                width: 44,
                height: 44,
                boxShadow: '0 2px 12px #6a82fb55',
              }}
            >
              <SecurityIcon fontSize="large" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Button
                component={Link}
                to={isLoggedIn ? "/home" : "/"}
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '1.3rem',
                  letterSpacing: '0.08em',
                  background: 'none',
                  boxShadow: 'none',
                  '&:hover': { background: 'none', textDecoration: 'underline' },
                }}
              >
                Vigilant
              </Button>
            </Box>
            {!isLoggedIn ? (
              <>
                <Button component={Link} to="/register" color="primary" sx={{ mx: 1 }}>
                  Register
                </Button>
                <Button component={Link} to="/login" color="secondary" sx={{ mx: 1 }}>
                  Login
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/home" color="primary" sx={{ mx: 1 }}>
                  Home
                </Button>
                <Button component={Link} to="/notifications" color="primary" sx={{ mx: 1 }}>
                  Notifications
                </Button>
                <Button component={Link} to="/report" color="primary" sx={{ mx: 1 }}>
                  Report
                </Button>
                <Button component={Link} to="/my-incidents" color="primary" sx={{ mx: 1 }}>
                  My Incidents
                </Button>
                <Button component={Link} to="/emergency-contacts" color="primary" sx={{ mx: 1 }}>
                  Emergency Contacts
                </Button>
                <Button component={Link} to="/profile" color="primary" sx={{ mx: 1 }}>
                  Profile
                </Button>
                <Button
                  onClick={handleLogout}
                  color="secondary"
                  sx={{
                    mx: 1,
                    fontWeight: 700,
                    borderRadius: 20,
                    background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
                    color: '#fff',
                    px: 3,
                    boxShadow: '0 2px 16px #fc5c7d33',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {isLoggedIn && <SOSButton />}
      {isLoggedIn && <FindHelperButton />}

      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Landing />} />
        <Route
          path="/register"
          element={
            <RedirectIfLoggedIn>
              <Register />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfLoggedIn>
              <Login />
            </RedirectIfLoggedIn>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportIncident />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-incidents"
          element={
            <ProtectedRoute>
              <MyIncidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emergency-contacts"
          element={
            <ProtectedRoute>
              <EmergencyContacts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Public tracking page for emergency contacts */}
        <Route path="/track/:incidentId" element={<TrackIncident />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
