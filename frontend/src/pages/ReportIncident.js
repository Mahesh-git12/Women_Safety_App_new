import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Alert, Typography, Paper } from '@mui/material';

// Geocode function using OpenStreetMap Nominatim API
const geocodeLocation = async (locationName) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`);
  const data = await res.json();
  if (data && data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon)
    };
  }
  return null;
};

export default function ReportIncident() {
  const [form, setForm] = useState({ location: '', description: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          await sendReport({ ...form, latitude, longitude });
        },
        async () => {
          // If denied, try geocoding the location name
          const coords = await geocodeLocation(form.location);
          if (coords) {
            setMessage('Location access denied. Using geocoded coordinates.');
            await sendReport({ ...form, ...coords });
          } else {
            setMessage('Location access denied and geocoding failed. Reporting without coordinates.');
            await sendReport(form);
          }
        }
      );
    } else {
      // If geolocation not supported, try geocoding
      const coords = await geocodeLocation(form.location);
      if (coords) {
        setMessage('Geolocation not supported. Using geocoded coordinates.');
        await sendReport({ ...form, ...coords });
      } else {
        setMessage('Geolocation not supported and geocoding failed. Reporting without coordinates.');
        await sendReport(form);
      }
    }
  };

  const sendReport = async (data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/incidents/report`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Incident reported successfully!');
      setForm({ location: '', description: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to report incident.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e3eeff 0%, #f3e7e9 100%)',
    }}>
      <Paper sx={{ p: 4, borderRadius: 4, minWidth: 340 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Report an Incident</Typography>
        {message && <Alert severity={message.includes('success') ? "success" : "error"} sx={{ mb: 2 }}>{message}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            required
            multiline
            minRows={3}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
            {loading ? 'Reporting...' : 'Report Incident'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
