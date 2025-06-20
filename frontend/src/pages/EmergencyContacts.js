import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert,
} from '@mui/material';
import ContactsIcon from '@mui/icons-material/Contacts';
import axios from 'axios';

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/users/emergency-contacts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContacts(res.data.emergencyContacts.join(', '));
      } catch (err) {
        setMessage('Failed to fetch contacts.');
      }
    };
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const contactsArray = contacts.split(',').map((c) => c.trim());
      const res = await axios.put(
        'http://localhost:5000/api/users/emergency-contacts',
        { emergencyContacts: contactsArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || 'Contacts updated!');
    } catch (err) {
      setMessage('Failed to update contacts.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    }}>
      <Card sx={{ maxWidth: 420, width: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              bgcolor: 'info.main', width: 62, height: 62, boxShadow: '0 4px 32px #6a82fb44',
            }}>
              <ContactsIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" color="info" sx={{
              fontWeight: 700, letterSpacing: '0.06em', mb: 1, textShadow: '0 2px 8px #6a82fb33',
            }} gutterBottom>
              Emergency Contacts
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField label="Contacts (comma separated)" value={contacts} onChange={e => setContacts(e.target.value)} fullWidth margin="normal" required />
              <Button type="submit" variant="contained" color="info" fullWidth sx={{
                mt: 3, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem',
                background: 'linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%)',
                boxShadow: '0 2px 16px #8ec5fc33', borderRadius: 20,
              }}>
                Update
              </Button>
            </Box>
            {message && (
              <Alert severity="info" sx={{
                mt: 2, width: '100%', borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.7)', color: 'info.main',
              }}>
                {message}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
