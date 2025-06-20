import React, { useState } from 'react';
import { Fab, Tooltip, Snackbar, Alert } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import axios from 'axios';

export default function SOSButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSOS = async () => {
    setFeedback('');
    // Try to get location (optional, can skip if not needed)
    let location = 'Unknown';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          location = `Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`;
          sendSOS(location);
        },
        () => sendSOS(location),
        { timeout: 5000 }
      );
    } else {
      sendSOS(location);
    }
  };

  const sendSOS = async (location) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/incidents/sos',
        { location, description: 'SOS Emergency!' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback('SOS sent! Your contacts have been notified.');
      setOpen(true);
      // Optionally: play a sound here
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
          onClick={handleSOS}
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
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity={feedback.startsWith('SOS') ? 'success' : 'error'} sx={{ width: '100%' }}>
          {feedback}
        </Alert>
      </Snackbar>
    </>
  );
}
