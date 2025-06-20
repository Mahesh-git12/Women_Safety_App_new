import React, { useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert,
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', emergencyContacts: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const contactsArray = form.emergencyContacts.split(',').map((c) => c.trim());
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        {
          ...form,
          emergencyContacts: contactsArray,
        }
      );
      setMessage(res.data.message || 'Registered successfully!');
      setForm({ name: '', email: '', password: '', emergencyContacts: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)',
    }}>
      <Card sx={{ maxWidth: 420, width: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              bgcolor: 'primary.main', width: 62, height: 62, boxShadow: '0 4px 32px #6a82fb44',
            }}>
              <PersonAddAltIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" color="primary" sx={{
              fontWeight: 700, letterSpacing: '0.06em', mb: 1, textShadow: '0 2px 8px #6a82fb33',
            }} gutterBottom>
              Create Account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label="Emergency Contacts (comma separated)" name="emergencyContacts" value={form.emergencyContacts} onChange={handleChange} fullWidth margin="normal" required />
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{
                mt: 3, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem',
                background: 'linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)',
                boxShadow: '0 2px 16px #fc5c7d33', borderRadius: 20,
              }}>
                Register
              </Button>
            </Box>
            {message && (
              <Alert severity="info" sx={{
                mt: 2, width: '100%', borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.7)', color: 'primary.main',
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
