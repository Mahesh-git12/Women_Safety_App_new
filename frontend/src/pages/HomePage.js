import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Avatar, Button, Stack, Fade, Grid, CircularProgress, Alert, Chip, IconButton
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContactsIcon from '@mui/icons-material/Contacts';
import ReportIcon from '@mui/icons-material/Report';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTips, setShowTips] = useState(true);  // Added state for tips banner

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const [prof, conts, incs] = await Promise.all([
          axios.get(`${API_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/users/emergency-contacts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/incidents/my-incidents`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(prof.data);
        setContacts(conts.data.emergencyContacts || []);
        setIncidents(incs.data.incidents || []);
      } catch (err) {
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    };
    fetchHomeData();
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)',
      py: 5, px: { xs: 1, sm: 4 },
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>

      {/* Header row: Avatar, Greeting, Profile */}
      <Box display="flex" alignItems="center" gap={3} mb={3} width="100%" maxWidth={540} justifyContent="space-between">
        <Avatar sx={{
          bgcolor: 'primary.main', width: 60, height: 60, fontSize: 32
        }}>
          {user?.name ? user.name.charAt(0).toUpperCase() : <SecurityIcon />}
        </Avatar>
        <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
          Welcome, {user?.name || "User"}!
        </Typography>
        <Button href="/profile" variant="text" startIcon={<SecurityIcon />}>Profile</Button>
      </Box>

      {/* Main Actions Area */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} width="100%" maxWidth={540} mb={4}>
        <Button href="/report" variant="contained" color="error" size="large" fullWidth startIcon={<WarningAmberIcon />}>
          Report Incident
        </Button>
        <Button href="/emergency-contacts" variant="contained" color="primary" size="large" fullWidth startIcon={<ContactsIcon />}>
          Add Contact
        </Button>
        <Button href="/my-incidents" variant="contained" color="info" size="large" fullWidth startIcon={<ReportIcon />}>
          My Incidents
        </Button>
      </Stack>

      {/* Status Overview Cards */}
      <Grid container spacing={2} mb={3} justifyContent="center" maxWidth={540}>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: '#eef9ff' }}>
            <Typography variant="body2">Contacts</Typography>
            <Typography fontWeight="bold" color="primary" fontSize={26}>{contacts.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: '#fff5f5' }}>
            <Typography variant="body2">Incidents</Typography>
            <Typography fontWeight="bold" color="error" fontSize={26}>{incidents.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: '#fff5f2' }}>
            <Typography variant="body2">Active SOS</Typography>
            <Chip color="default" label="No active SOS" size="small" />
            {/* You can update the above line if you add live SOS status */}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity Feed */}
      <Box width="100%" maxWidth={540}>
        <Typography fontWeight={700} fontSize={17} mb={1}>Recent Activity</Typography>
        <Stack spacing={2} mb={3}>
          {loading ? (
            <CircularProgress />
          ) : (incidents.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No incidents reported yet.</Typography>
          ) : (
            incidents.slice(0, 4).map(inc => (
              <Paper key={inc._id} sx={{
                p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <Box>
                  <Typography fontWeight="bold">{inc.location}</Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>{inc.description}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(inc.date).toLocaleString()}</Typography>
                </Box>
                <Chip
                  label={inc.type?.toUpperCase() || "INCIDENT"}
                  color={inc.type === "sos" ? "error" : "info"}
                  sx={{ fontWeight: 700 }}
                  size="small"
                />
              </Paper>
            ))
          ))}
        </Stack>
        <Button href="/my-incidents" variant="outlined" fullWidth>View All</Button>
      </Box>

      {/* Onboarding or Tips (dismissible) */}
      {showTips && (
        <Paper sx={{
          mt: 3, p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.95)',
          display: 'flex', alignItems: 'center', gap: 2
        }}>
          <InfoIcon color="primary" />
          <Box flex={1}>
            <Typography fontWeight={600}>Get Started:</Typography>
            <Typography variant="body2" color="text.secondary">
              Add your first emergency contact.<br />
              Submit a test incident to see alerts in action.<br />
              Review your profile information.
            </Typography>
          </Box>
          <IconButton onClick={() => setShowTips(false)}>
            <CloseIcon />
          </IconButton>
        </Paper>
      )}

      {/* Error handling */}
      {error && (
        <Alert severity="error" sx={{ mt: 3, width: '100%', maxWidth: 540 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
