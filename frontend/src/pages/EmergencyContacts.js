import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, List, ListItem, IconButton, ListItemText
} from '@mui/material';
import ContactsIcon from '@mui/icons-material/Contacts';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ email: '', phone: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get(
          `${API_URL}/api/users/emergency-contacts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setContacts(res.data.emergencyContacts || []);
      } catch (err) {
        setMessage('Failed to fetch contacts.');
      }
    };
    fetchContacts();
  }, []);

  const handleAdd = () => {
    if (
      newContact.email &&
      newContact.phone &&
      !contacts.some(
        c => c.email === newContact.email && c.phone === newContact.phone
      )
    ) {
      setContacts([...contacts, newContact]);
      setNewContact({ email: '', phone: '' });
    }
  };

  const handleRemove = (idx) => {
    setContacts(contacts.filter((_, i) => i !== idx));
  };

  const handleChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `${API_URL}/api/users/emergency-contacts`,
        { emergencyContacts: contacts },
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
      <Card sx={{ maxWidth: 440, width: '100%', p: 2 }}>
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
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Email"
                  name="email"
                  value={newContact.email}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  type="email"
                  required
                />
                <TextField
                  label="Phone"
                  name="phone"
                  value={newContact.phone}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  type="tel"
                  required
                />
                <Button onClick={handleAdd} variant="contained" color="info" sx={{ borderRadius: 20 }}>
                  Add
                </Button>
              </Box>
              <List>
                {contacts.map((contact, idx) => (
                  <ListItem
                    key={idx}
                    secondaryAction={
                      <IconButton edge="end" color="error" onClick={() => handleRemove(idx)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={contact.email}
                      secondary={contact.phone}
                    />
                  </ListItem>
                ))}
              </List>
              <Button type="submit" variant="contained" color="info" fullWidth sx={{
                mt: 2, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem',
                background: 'linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%)',
                boxShadow: '0 2px 16px #8ec5fc33', borderRadius: 20,
              }}>
                Save Contacts
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
