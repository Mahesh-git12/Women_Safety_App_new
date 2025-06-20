import React, { useState, useEffect, useRef } from 'react';
import { Fab, Tooltip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function SOSButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const watchIdRef = useRef(null);
  const incidentIdRef = useRef(null);

  useEffect(() => {
    // Fetch emergency contacts when the button is rendered
    const fetchContacts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get(
          `${API_URL}/api/users/emergency-contacts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setContacts(res.data.emergencyContacts || []);
        setSelected(res.data.emergencyContacts || []);
      } catch (err) {
        setFeedback('Failed to load contacts for SOS.');
        setOpen(true);
      }
    };
    fetchContacts();
    // Cleanup on unmount
    return () => stopLocationTracking();
    // eslint-disable-next-line
  }, []);

  const handleSOSClick = () => {
    setDialogOpen(true);
  };

  const handleCheckbox = (email) => {
    setSelected((prev) =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  // Start tracking location after SOS is sent
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
          } catch (err) {
            // Optionally handle location update error
          }
        },
        (err) => { /* Optionally handle geolocation error */ },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }
  };

  // Stop tracking (optional, e.g. on SOS resolution)
  const stopLocationTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const handleSendSOS = async () => {
    setDialogOpen(false);
    setFeedback('');
    let location = 'Unknown';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          location = `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`;
          sendSOS(location, pos.coords);
        },
        () => sendSOS(location),
        { timeout: 5000 }
      );
    } else {
      sendSOS(location);
    }
  };

  const sendSOS = async (location, coords) => {
    try {
      const token = localStorage.getItem('token');
      // Send SOS and get the incidentId from the backend
      const res = await axios.post(
        `${API_URL}/api/incidents/sos`,
        {
          location,
          description: 'SOS Emergency!',
          contacts: selected,
          latitude: coords?.latitude,
          longitude: coords?.longitude
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback('SOS sent! Your selected contacts have been notified.');
      setOpen(true);

      // Start real-time location tracking
      if (res.data.incidentId) {
        incidentIdRef.current = res.data.incidentId;
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
          <FormGroup>
            {contacts.map(email => (
              <FormControlLabel
                key={email}
                control={
                  <Checkbox
                    checked={selected.includes(email)}
                    onChange={() => handleCheckbox(email)}
                  />
                }
                label={email}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSendSOS} variant="contained" color="error">Send SOS</Button>
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
