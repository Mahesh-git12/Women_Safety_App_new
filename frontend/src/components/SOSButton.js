import React, { useState, useEffect } from 'react';
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
  }, []);

  const handleSOSClick = () => {
    setDialogOpen(true);
  };

  const handleCheckbox = (email) => {
    setSelected((prev) =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleSendSOS = async () => {
    setDialogOpen(false);
    setFeedback('');
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
        `${API_URL}/api/incidents/sos`,
        { location, description: 'SOS Emergency!', contacts: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback('SOS sent! Your selected contacts have been notified.');
      setOpen(true);
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
