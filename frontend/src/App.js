// import React from 'react';

// import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
// import Register from './pages/Register';
// import Login from './pages/Login';
// import ReportIncident from './pages/ReportIncident';
// import MyIncidents from './pages/MyIncidents';
// import EmergencyContacts from './pages/EmergencyContacts';
// import Profile from './pages/Profile';
// import Landing from './pages/Landing';
// import HomePage from './pages/HomePage';
// import Notifications from './pages/Notifications';
// import NotFound from './pages/NotFound';
// import ProtectedRoute from './components/ProtectedRoute';
// import SOSButton from './components/SOSButton';
// import TrackIncident from './pages/TrackIncident';
// import FindHelperButton from "./components/FindHelperButton";
// import { AppBar, Toolbar, Button, Box, Container, Avatar } from '@mui/material';
// import SecurityIcon from '@mui/icons-material/Security';


// // import VoiceSOS from './VoiceSOS';
// function App() {
//   const isLoggedIn = !!localStorage.getItem('token');

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/login';
//   };

//   const RedirectIfLoggedIn = ({ children }) =>
//     isLoggedIn ? <Navigate to="/home" /> : children;

//   return (
//     <Router>
//       <AppBar
//         position="static"
//         elevation={0}
//         sx={{
//           background: 'rgba(255,255,255,0.35)',
//           backdropFilter: 'blur(12px)',
//           boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
//           borderBottom: '1px solid rgba(255,255,255,0.18)',
//         }}
//       >
//         <Container maxWidth="lg">
//           <Toolbar disableGutters sx={{ minHeight: 72 }}>
//             <Avatar
//               sx={{
//                 bgcolor: 'primary.main',
//                 mr: 2,
//                 width: 44,
//                 height: 44,
//                 boxShadow: '0 2px 12px #6a82fb55',
//               }}
//             >
//               <SecurityIcon fontSize="large" />
//             </Avatar>
//             <Box sx={{ flexGrow: 1 }}>
//               <Button
//                 component={Link}
//                 to={isLoggedIn ? "/home" : "/"}
//                 sx={{
//                   color: 'primary.main',
//                   fontWeight: 700,
//                   fontSize: '1.3rem',
//                   letterSpacing: '0.08em',
//                   background: 'none',
//                   boxShadow: 'none',
//                   '&:hover': { background: 'none', textDecoration: 'underline' },
//                 }}
//               >
//                 Vigilant
//               </Button>
//             </Box>
//             {!isLoggedIn ? (
//               <>
//                 <Button component={Link} to="/register" color="primary" sx={{ mx: 1 }}>
//                   Register
//                 </Button>
//                 <Button component={Link} to="/login" color="secondary" sx={{ mx: 1 }}>
//                   Login
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Button component={Link} to="/home" color="primary" sx={{ mx: 1 }}>
//                   Home
//                 </Button>
//                 <Button component={Link} to="/notifications" color="primary" sx={{ mx: 1 }}>
//                   Notifications
//                 </Button>
//                 <Button component={Link} to="/report" color="primary" sx={{ mx: 1 }}>
//                   Report
//                 </Button>
//                 <Button component={Link} to="/my-incidents" color="primary" sx={{ mx: 1 }}>
//                   My Incidents
//                 </Button>
//                 <Button component={Link} to="/emergency-contacts" color="primary" sx={{ mx: 1 }}>
//                   Emergency Contacts
//                 </Button>
//                 <Button component={Link} to="/profile" color="primary" sx={{ mx: 1 }}>
//                   Profile
//                 </Button>
//                 <Button
//                   onClick={handleLogout}
//                   color="secondary"
//                   sx={{
//                     mx: 1,
//                     fontWeight: 700,
//                     borderRadius: 20,
//                     background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
//                     color: '#fff',
//                     px: 3,
//                     boxShadow: '0 2px 16px #fc5c7d33',
//                     '&:hover': {
//                       background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
//                     },
//                   }}
//                 >
//                   Logout
//                 </Button>
//               </>
//             )}
//           </Toolbar>
//         </Container>
//       </AppBar>

//       {isLoggedIn && <SOSButton />}
//       {isLoggedIn && <FindHelperButton />}

//       <Routes>
//         <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Landing />} />
//         <Route
//           path="/register"
//           element={
//             <RedirectIfLoggedIn>
//               <Register />
//             </RedirectIfLoggedIn>
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             <RedirectIfLoggedIn>
//               <Login />
//             </RedirectIfLoggedIn>
//           }
//         />
//         <Route
//           path="/notifications"
//           element={
//             <ProtectedRoute>
//               <Notifications />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <HomePage />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/report"
//           element={
//             <ProtectedRoute>
//               <ReportIncident />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/my-incidents"
//           element={
//             <ProtectedRoute>
//               <MyIncidents />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/emergency-contacts"
//           element={
//             <ProtectedRoute>
//               <EmergencyContacts />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           }
//         />
//         {/* Public tracking page for emergency contacts */}
//         <Route path="/track/:incidentId" element={<TrackIncident />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//       <Analytics/>
//     </Router>
//   );
// }

// export default App;
import React, { useState } from 'react';
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
import VoiceListener from "./components/VoiceListener";
import VoiceSOSConsentModal from './components/VoiceSOSConsentModal';
import VoiceSOSFab from './components/VoiceSOSFab';
import { AppBar, Toolbar, Button, Box, Container, Avatar, Snackbar, Alert } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SafetyResources from './pages/SafetyResources';
import axios from "axios";

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  const [voiceConsent, setVoiceConsent] = useState(() => localStorage.getItem('voiceSOSConsent') === 'true');
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [open, setOpen] = useState(false);

  const handleAllowVoiceSOS = () => {
    setVoiceConsent(true);
    localStorage.setItem('voiceSOSConsent', 'true');
    setListening(true);
  };

  const handleDenyVoiceSOS = () => {
    setVoiceConsent(false);
    localStorage.setItem('voiceSOSConsent', 'false');
    setListening(false);
  };

  const toggleVoiceSOS = () => {
    setListening((prev) => !prev);
  };

  const handleSendSOS = async () => {
    try {
      await axios.post("/api/incidents/sos", {/* your SOS payload here */});
      setFeedback('SOS sent! Your selected contacts have been notified.');
      setOpen(true);
    } catch (error) {
      setFeedback('Failed to send SOS.');
      setOpen(true);
      console.error('SOS error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const RedirectIfLoggedIn = ({ children }) => (isLoggedIn ? <Navigate to="/home" /> : children);

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
                <Button component={Link} to="/resources" color="primary" sx={{ mx: 1 }}>
                Safety Resources
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

      {/* Voice SOS Consent Modal */}
      {!voiceConsent && isLoggedIn && (
        <VoiceSOSConsentModal
          open={!voiceConsent}
          onAllow={handleAllowVoiceSOS}
          onDeny={handleDenyVoiceSOS}
        />
      )}

      {/* Floating Buttons and Voice Listener */}
      {isLoggedIn && (
        <>
          {/* Red SOS Button */}
          <SOSButton sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }} />
          
          {/* Find Helper Button */}
          <FindHelperButton sx={{ position: 'fixed', bottom: 100, right: 32, zIndex: 1300 }} />

          {/* Voice SOS Floating Action Button (Mic) */}
          <VoiceSOSFab
            listening={listening}
            onToggle={toggleVoiceSOS}
            sx={{ position: 'fixed', bottom: 170, right: 32, zIndex: 1400 }}
          />

          {/* Voice Listener Indicator */}
          {listening && (
            <VoiceListener
              onTrigger={handleSendSOS}
              setFeedback={setFeedback}
              setOpen={setOpen}
              sx={{ position: 'fixed', bottom: 210, right: 32, zIndex: 1400 }}
            />
          )}
        </>
      )}

      {/* Your routes */}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Landing />} />
        <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />
        <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportIncident /></ProtectedRoute>} />
        <Route path="/my-incidents" element={<ProtectedRoute><MyIncidents /></ProtectedRoute>} />
        <Route path="/emergency-contacts" element={<ProtectedRoute><EmergencyContacts /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/track/:incidentId" element={<TrackIncident />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/resources" element={<SafetyResources />} />
      </Routes>

      <Analytics />

      {/* Feedback Snackbar */}
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity={feedback.startsWith('Failed') ? 'error' : 'success'} sx={{ width: '100%' }}>
          {feedback}
        </Alert>
      </Snackbar>
    </Router>
  );
}

export default App;
