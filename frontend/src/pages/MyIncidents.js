import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Box, Avatar, Alert, List, ListItem, ListItemAvatar, ListItemText, Chip, TextField, Button, IconButton
} from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import IncidentsMap from './IncidentsMap';

export default function MyIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [message, setMessage] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchIncidents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to view your incidents.');
        return;
      }
      try {
        const res = await axios.get('https://vigilant-74go.onrender.com/api/incidents/my-incidents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIncidents(res.data.incidents || []);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Failed to fetch incidents.');
      }
    };
    fetchIncidents();
  }, []);

  // Filtering logic
  const filteredIncidents = incidents.filter(incident => {
    if (filterType !== 'all' && incident.type !== filterType) return false;
    if (
      search &&
      !incident.location.toLowerCase().includes(search.toLowerCase()) &&
      !incident.description.toLowerCase().includes(search.toLowerCase())
    ) return false;
    return true;
  });

  const filteredIncidentsWithCoords = filteredIncidents.filter(i => i.latitude && i.longitude);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this incident?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/incidents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncidents((prev) => prev.filter((incident) => incident._id !== id));
      setMessage('Incident deleted successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete incident.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f3e7e9 0%, #e3eeff 100%)',
      py: 4,
    }}>
      <Card sx={{ maxWidth: 700, width: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              bgcolor: 'error.main', width: 62, height: 62, boxShadow: '0 4px 32px #fc5c7d44',
            }}>
              <ReportIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" color="error" sx={{
              fontWeight: 700, letterSpacing: '0.06em', mb: 1, textShadow: '0 2px 8px #fc5c7d33',
            }} gutterBottom>
              My Reported Incidents
            </Typography>
            {message && (
              <Alert severity={message.includes('deleted') ? "success" : "info"} sx={{
                mt: 2, width: '100%', borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.7)', color: 'error.main',
              }}>
                {message}
              </Alert>
            )}

            {/* Filter controls */}
            <Box sx={{ width: '100%', mb: 2, display: 'flex', gap: 2 }}>
              <TextField
                label="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                select
                label="Type"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                size="small"
                SelectProps={{ native: true }}
                sx={{ width: 120 }}
              >
                <option value="all">All</option>
                <option value="incident">Incident</option>
                <option value="sos">SOS</option>
              </TextField>
            </Box>

            {/* Map view */}
            {filteredIncidentsWithCoords.length > 0 && (
              <IncidentsMap incidents={filteredIncidentsWithCoords} />
            )}

            {/* Incident list */}
            <List sx={{ width: '100%' }}>
              {filteredIncidents.map((incident) => (
                <ListItem   
                  key={incident._id}
                  alignItems="flex-start"
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    background: incident.type === 'sos' ? 'linear-gradient(90deg, #fff3e0 0%, #ffe0e0 100%)' : '#fff',
                    boxShadow: incident.type === 'sos' ? '0 0 12px #fc5c7d33' : 1,
                    borderLeft: incident.type === 'sos' ? '6px solid #fc5c7d' : 'none',
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      onClick={() => handleDelete(incident._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: incident.type === 'sos' ? 'error.main' : 'error.light' }}>
                      {incident.type === 'sos' ? <WarningAmberIcon /> : <ReportIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <strong>Location:</strong> {incident.location}{' '}
                        {incident.type === 'sos' && (
                          <Chip label="SOS" color="error" size="small" sx={{ ml: 1, fontWeight: 'bold' }} />
                        )}
                      </>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          <strong>Description:</strong> {incident.description}
                        </Typography>
                        <br />
                        <strong>Date:</strong> {new Date(incident.date).toLocaleString()}
                        {incident.latitude && incident.longitude && (
                          <>
                            <br />
                            <strong>Lat:</strong> {incident.latitude.toFixed(4)}{' '}
                            <strong>Lng:</strong> {incident.longitude.toFixed(4)}
                          </>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
              {filteredIncidents.length === 0 && !message && (
                <Typography sx={{ mt: 2 }}>No incidents match your filter.</Typography>
              )}
            </List>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
