import React, { useState, useRef } from 'react';
import {
  Fab, Tooltip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Checkbox, FormControlLabel, FormGroup, CircularProgress, Box
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function SOSButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const watchIdRef = useRef(null);

  // Fetch user's emergency contacts
  const fetchContacts = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `${API_URL}/api/users/emergency-contacts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts(res.data.emergencyContacts || []);
      setSelected((res.data.emergencyContacts || []).map(c => c.email));
    } catch (err) {
      setFeedback('Failed to load contacts for SOS.');
      setOpen(true);
    }
    setLoading(false);
  };

  // Show dialog to select contacts for SOS
  const handleSOSClick = async () => {
    await fetchContacts();
    setDialogOpen(true);
  };

  // Handle contact selection
  const handleCheckbox = (email) => {
    setSelected((prev) =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  // Start live location tracking for incident (optional)
  const startLocationTracking = (incidentId, token) => {
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (pos) => {
          try {
            await axios.post(
              `${API_URL}/api/incidents/update-location/${incidentId}`,
              { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (err) {}
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  // Main function to trigger the SOS flow
  const handleSendSOS = async () => {
    setDialogOpen(false);
    setFeedback('');
    // Request geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sendSOS(
            `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`,
            { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
          );
        },
        (err) => {
          setFeedback('Location permission denied or unavailable. SOS sent without coordinates.');
          sendSOS('Unknown', { latitude: undefined, longitude: undefined });
        },
        { timeout: 5000 }
      );
    } else {
      setFeedback('Geolocation not supported. SOS sent without location.');
      sendSOS('Unknown', { latitude: undefined, longitude: undefined });
    }
  };

  // Send SOS to backend API
  const sendSOS = async (location, coords) => {
    try {
      const token = localStorage.getItem('token');
      const selectedContacts = contacts.filter(c => selected.includes(c.email));
      if (selectedContacts.length === 0) {
        setFeedback('Please select at least one contact.');
        setOpen(true);
        return;
      }
      const res = await axios.post(
        `${API_URL}/api/incidents/sos`,
        {
          location,
          description: 'SOS Emergency!',
          contacts: selectedContacts,
          latitude: coords?.latitude,
          longitude: coords?.longitude
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback('SOS sent! Your selected contacts have been notified.');
      setOpen(true);
      if (res.data.incidentId) {
        startLocationTracking(res.data.incidentId, token);
      }
    } catch (err) {
      setFeedback('Failed to send SOS. Try again.');
      setOpen(true);
    }
  };

  return (
    <>
      <Tooltip title="Send SOS" placement="left">
        <Fab
          color="error"
          onClick={handleSOSClick}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1200,
            boxShadow: '0 6px 32px #fc5c7d88',
            width: 72,
            height: 72,
          }}
        >
          <WarningAmberIcon sx={{ fontSize: 40 }} />
        </Fab>
      </Tooltip>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Select Contacts for SOS</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <FormGroup>
              {contacts.length === 0 && (
                <div style={{ color: '#888', marginBottom: 8 }}>
                  No emergency contacts found. Please add contacts first.
                </div>
              )}
              {contacts.map(contact => (
                <FormControlLabel
                  key={contact.email}
                  control={
                    <Checkbox
                      checked={selected.includes(contact.email)}
                      onChange={() => handleCheckbox(contact.email)}
                    />
                  }
                  label={`${contact.email}${contact.phone ? ' | ' + contact.phone : ''}`}
                />
              ))}
            </FormGroup>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSendSOS}
            variant="contained"
            color="error"
            disabled={contacts.length === 0 || selected.length === 0}
          >
            Send SOS
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity={feedback.startsWith('SOS') ? 'success' : 'error'} sx={{ width: '100%' }}>
          {feedback}
        </Alert>
      </Snackbar>
    </>
  );
}

// import React, { useState, useRef } from 'react';
// import {
//   Fab, Tooltip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, Checkbox, FormControlLabel, FormGroup, CircularProgress, Box
// } from '@mui/material';
// import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// export default function SOSButton() {
//   const [open, setOpen] = useState(false);
//   const [feedback, setFeedback] = useState('');
//   const [contacts, setContacts] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const watchIdRef = useRef(null);

//   const fetchContacts = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await axios.get(
//         `${API_URL}/api/users/emergency-contacts`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setContacts(res.data.emergencyContacts || []);
//       setSelected((res.data.emergencyContacts || []).map(c => c.email));
//     } catch (err) {
//       setFeedback('Failed to load contacts for SOS.');
//       setOpen(true);
//     }
//     setLoading(false);
//   };

//   const handleSOSClick = async () => {
//     await fetchContacts(); // Always get the latest contacts before opening
//     setDialogOpen(true);
//   };

//   const handleCheckbox = (email) => {
//     setSelected((prev) =>
//       prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
//     );
//   };

//   const startLocationTracking = (incidentId, token) => {
//     if ('geolocation' in navigator) {
//       watchIdRef.current = navigator.geolocation.watchPosition(
//         async (pos) => {
//           try {
//             await axios.post(
//               `${API_URL}/api/incidents/update-location/${incidentId}`,
//               { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
//               { headers: { Authorization: `Bearer ${token}` } }
//             );
//           } catch (err) {}
//         },
//         (err) => {},
//         { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
//       );
//     }
//   };

//   const stopLocationTracking = () => {
//     if (watchIdRef.current !== null) {
//       navigator.geolocation.clearWatch(watchIdRef.current);
//       watchIdRef.current = null;
//     }
//   };

//   const handleSendSOS = async () => {
//     setDialogOpen(false);
//     setFeedback('');
//     let location = 'Unknown';
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           location = `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`;
//           sendSOS(location, pos.coords);
//         },
//         () => sendSOS(location),
//         { timeout: 5000 }
//       );
//     } else {
//       sendSOS(location);
//     }
//   };

//   const sendSOS = async (location, coords) => {
//     try {
//       const token = localStorage.getItem('token');
//       const selectedContacts = contacts.filter(c => selected.includes(c.email));
//       if (selectedContacts.length === 0) {
//         setFeedback('Please select at least one contact.');
//         setOpen(true);
//         return;
//       }
//       const res = await axios.post(
//         `${API_URL}/api/incidents/sos`,
//         {
//           location,
//           description: 'SOS Emergency!',
//           contacts: selectedContacts,
//           latitude: coords?.latitude,
//           longitude: coords?.longitude
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setFeedback('SOS sent! Your selected contacts have been notified.');
//       setOpen(true);

//       if (res.data.incidentId) {
//         startLocationTracking(res.data.incidentId, token);
//       }
//     } catch (err) {
//       setFeedback('Failed to send SOS. Try again.');
//       setOpen(true);
//     }
//   };

//   return (
//     <>
//       <Tooltip title="Send SOS" placement="left">
//         <Fab
//           color="error"
//           onClick={handleSOSClick}
//           sx={{
//             position: 'fixed',
//             bottom: 32,
//             right: 32,
//             zIndex: 1200,
//             boxShadow: '0 6px 32px #fc5c7d88',
//             width: 72,
//             height: 72,
//           }}
//         >
//           <WarningAmberIcon sx={{ fontSize: 40 }} />
//         </Fab>
//       </Tooltip>
//       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
//         <DialogTitle>Select Contacts for SOS</DialogTitle>
//         <DialogContent>
//           {loading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <FormGroup>
//               {contacts.length === 0 && (
//                 <div style={{ color: '#888', marginBottom: 8 }}>
//                   No emergency contacts found. Please add contacts first.
//                 </div>
//               )}
//               {contacts.map(contact => (
//                 <FormControlLabel
//                   key={contact.email}
//                   control={
//                     <Checkbox
//                       checked={selected.includes(contact.email)}
//                       onChange={() => handleCheckbox(contact.email)}
//                     />
//                   }
//                   label={`${contact.email}${contact.phone ? ' | ' + contact.phone : ''}`}
//                 />
//               ))}
//             </FormGroup>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
//           <Button
//             onClick={handleSendSOS}
//             variant="contained"
//             color="error"
//             disabled={contacts.length === 0 || selected.length === 0}
//           >
//             Send SOS
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
//         <Alert severity={feedback.startsWith('SOS') ? 'success' : 'error'} sx={{ width: '100%' }}>
//           {feedback}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }
