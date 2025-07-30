import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Avatar, Grid, Alert,
  CardHeader, CardActions, Button, IconButton, Dialog, DialogTitle,
  DialogContent, TextField, Chip
} from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteIcon from '@mui/icons-material/Delete';
import MapIcon from '@mui/icons-material/Map';
import axios from 'axios';

// Map component using react-leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const API_URL = process.env.REACT_APP_API_URL;

// Custom marker icons for Leaflet (to work with MUI icons)
const sosIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [27, 41],
  iconAnchor: [13, 41],
});
const incidentIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [27, 41],
  iconAnchor: [13, 41],
});

export default function MyIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [delId, setDelId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchIncidents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to view your incidents.');
        return;
      }
      try {
        const res = await axios.get(`${API_URL}/api/incidents/my-incidents`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIncidents(res.data.incidents || []);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Failed to fetch incidents.');
      }
    };
    fetchIncidents();
  }, []);

  // Filtering (optional)
  const filteredIncidents = incidents.filter(incident =>
    (!search ||
      incident.location.toLowerCase().includes(search.toLowerCase()) ||
      incident.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Map center: average of all points, fallback if none
  const mapCenter = (() => {
    const points = filteredIncidents
      .filter(i => i.latitude && i.longitude)
      .map(i => [i.latitude, i.longitude]);
    if (!points.length) return [20.5, 78.9]; // India center fallback
    const lat = points.reduce((s, c) => s + c[0], 0) / points.length;
    const lng = points.reduce((s, c) => s + c[1], 0) / points.length;
    return [lat, lng];
  })();

  const handleDelete = async id => {
    setDelId(null);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/incidents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncidents(old => old.filter(i => i._id !== id));
    } catch {
      setMessage("Failed to delete incident.");
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      py: 5,
      background: 'linear-gradient(120deg,#e0c3fc 0%,#8ec5fc 100%)'
    }}>
      <Typography variant="h4" fontWeight={800} color="primary" align="center" mb={4}>
        My Incidents
      </Typography>
      {message && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}
      <Box display="flex" justifyContent="center" mb={3}>
        <TextField
          label="Search (location/desc)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ width: 320 }}
          size="small"
        />
      </Box>
      {/* Map */}
      <Box sx={{
        mx: 'auto',
        width: { xs: "98vw", sm: '660px' },
        height: { xs: 250, md: 350 },
        borderRadius: 3,
        overflow: 'hidden',
        mb: 4,
        boxShadow: '0 6px 32px #6a82fb22',
        bgcolor: "#fff"
      }}>
        <MapContainer center={mapCenter} zoom={filteredIncidents.length ? 5 : 4} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredIncidents
            .filter(i => i.latitude && i.longitude)
            .map(incident => (
              <Marker
                key={incident._id}
                position={[incident.latitude, incident.longitude]}
                icon={incident.type === 'sos' ? sosIcon : incidentIcon}
                eventHandlers={{
                  click: () => setSelectedId(incident._id)
                }}
              >
                <Popup>
                  <Typography fontWeight="bold">{incident.type === 'sos' ? 'SOS' : 'Incident'}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{incident.description}</Typography>
                  <Typography variant="caption">{incident.location}</Typography>
                  <Box mt={1}>
                    <Button
                      size="small"
                      startIcon={<MapIcon />}
                      href={`/track/${incident._id}`}
                    >
                      Track
                    </Button>
                  </Box>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </Box>
      {/* Card grid */}
      <Grid container spacing={3} justifyContent="center" mb={4}>
        {filteredIncidents.map(inc => (
          <Grid item xs={12} sm={6} md={4} key={inc._id}>
            <Card elevation={3} sx={{ borderLeft: inc.type === "sos" ? "6px solid #fc5c7d" : "6px solid #6a82fb" }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: inc.type === 'sos' ? 'error.main' : 'info.main' }}>
                    {inc.type === 'sos' ? <WarningAmberIcon /> : <ReportIcon />}
                  </Avatar>
                }
                title={<Typography fontWeight={700}>{inc.location}</Typography>}
                subheader={new Date(inc.date).toLocaleString()}
              />
              <CardContent>
                <Typography color="text.secondary" fontWeight="500">{inc.description}</Typography>
                {inc.latitude && inc.longitude && (
                  <Typography variant="caption">Lat: {inc.latitude}, Lon: {inc.longitude}</Typography>
                )}
                <Box mt={1}>
                  <Chip size="small" color={inc.type === "sos" ? "error" : "info"} label={inc.type.toUpperCase()} />
                </Box>
              </CardContent>
              <CardActions>
                <Button startIcon={<MapIcon />} href={`/track/${inc._id}`}>Track</Button>
                <IconButton color="error" onClick={() => setDelId(inc._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Delete Dialog */}
      <Dialog open={!!delId} onClose={() => setDelId(null)}>
        <DialogTitle>Delete Incident?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this incident?</Typography>
          <Box mt={2} textAlign="right">
            <Button onClick={() => setDelId(null)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              sx={{ ml: 2 }}
              onClick={() => handleDelete(delId)}
            >
              Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
