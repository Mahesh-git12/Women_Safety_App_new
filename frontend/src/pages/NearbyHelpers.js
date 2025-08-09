import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Button, CircularProgress, Stack } from '@mui/material';

export default function NearbyHelpers() {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/users/nearest-users`,
            {
              params: {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
              },
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setHelpers(res.data.nearestUsers || []);
        } catch (err) {
          setError('Failed to find nearby helpers.');
        }
        setLoading(false);
      },
      () => {
        setError('Unable to get your location.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 500, margin: '40px auto' }}>
      <Typography variant="h5" fontWeight={700} mb={3}>Nearest Helpers</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : helpers.length === 0 ? (
        <Typography color="text.secondary">No nearby helpers found right now.</Typography>
      ) : (
        <Stack spacing={2}>
          {helpers.map((h) => (
            <Paper key={h._id || h.name} sx={{ p: 2 }}>
              <Typography fontWeight={600}>{h.name}</Typography>
              <Typography variant="body2">
                Distance: 
                {/* Optionally, compute and show distance using haversine formula with your and helper's coordinates */}
              </Typography>
              {/* Add your contact or alert buttons here */}
            </Paper>
          ))}
        </Stack>
      )}
      <Button variant="contained" sx={{ mt: 3 }} href="/home">Back to Home</Button>
    </Box>
  );
}
