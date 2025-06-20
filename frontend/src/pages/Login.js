import React, { useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        form
      );
      setMessage('Login successful!');
      localStorage.setItem('token', res.data.token);
      window.location.href = '/report';
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)',
    }}>
      <Card sx={{ maxWidth: 420, width: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              bgcolor: 'secondary.main', width: 62, height: 62, boxShadow: '0 4px 32px #fc5c7d44',
            }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" color="secondary" sx={{
              fontWeight: 700, letterSpacing: '0.06em', mb: 1, textShadow: '0 2px 8px #fc5c7d33',
            }} gutterBottom>
              Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
              <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
              <Button type="submit" variant="contained" color="secondary" fullWidth sx={{
                mt: 3, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem',
                background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
                boxShadow: '0 2px 16px #6a82fb33', borderRadius: 20,
              }}>
                Login
              </Button>
            </Box>
            {message && (
              <Alert severity="info" sx={{
                mt: 2, width: '100%', borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.7)', color: 'secondary.main',
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
