import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(
          `${API_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile({ name: res.data.name, email: res.data.email });
      } catch (err) {
        setMessage('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `${API_URL}/api/users/profile`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || 'Profile updated!');
      setEditing(false);
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg,#e0c3fc 0%,#8ec5fc 100%)'
    }}>
      <Card sx={{ maxWidth: 420, width: '100%', p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              bgcolor: 'primary.main', width: 62, height: 62, boxShadow: '0 4px 32px #6a82fb44',
            }}>
              <AccountCircleIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" color="primary" sx={{
              fontWeight: 700, letterSpacing: '0.06em', mb: 1, textShadow: '0 2px 8px #6a82fb33',
            }} gutterBottom>
              User Profile
            </Typography>
            {editing ? (
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField name="name" label="Name" value={profile.name} onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="email" label="Email" value={profile.email} onChange={handleChange} fullWidth margin="normal" required />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{
                  mt: 2, borderRadius: 20,
                }}>
                  Save
                </Button>
              </Box>
            ) : (
              <Box sx={{ width: '100%' }}>
                <Typography><strong>Name:</strong> {profile.name}</Typography>
                <Typography><strong>Email:</strong> {profile.email}</Typography>
                <Button onClick={() => setEditing(true)} variant="outlined" color="primary" fullWidth sx={{
                  mt: 2, borderRadius: 20,
                }}>
                  Edit Profile
                </Button>
              </Box>
            )}
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

// import React, { useEffect, useState } from 'react';
// import {
//   Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert,
// } from '@mui/material';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import axios from 'axios';

// export default function Profile() {
//   const [profile, setProfile] = useState({ name: '', email: '' });
//   const [message, setMessage] = useState('');
//   const [editing, setEditing] = useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const res = await axios.get(
//           `${process.env.REACT_APP_API_URL}/api/users/profile`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setProfile({ name: res.data.name, email: res.data.email });
//       } catch (err) {
//         setMessage('Failed to load profile');
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleChange = (e) =>
//     setProfile({ ...profile, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     const token = localStorage.getItem('token');
//     try {
//       const res = await axios.put(
//         `${process.env.REACT_APP_API_URL}/api/users/profile`,
//         profile,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessage(res.data.message || 'Profile updated!');
//       setEditing(false);
//     } catch (err) {
//       setMessage('Failed to update profile');
//     }
//   };

//   return (
//     <Box sx={{
//       minHeight: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       background: 'linear-gradient(120deg,#e0c3fc 0%,#8ec5fc 100%)'
//     }}>
//       <Card sx={{ maxWidth: 420, width: '100%', p: 2 }}>
//         <CardContent>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//             <Avatar sx={{
//               bgcolor: 'primary.main', width: 62, height: 62, boxShadow: '0 4px 32px #6a82fb44',
//             }}>
//               <AccountCircleIcon fontSize="large" />
//             </Avatar>
//             <Typography variant="h5" color="primary" sx={{
//               fontWeight: 700, letterSpacing: '0.06em', mb: 1, textShadow: '0 2px 8px #6a82fb33',
//             }} gutterBottom>
//               User Profile
//             </Typography>
//             {editing ? (
//               <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//                 <TextField name="name" label="Name" value={profile.name} onChange={handleChange} fullWidth margin="normal" required />
//                 <TextField name="email" label="Email" value={profile.email} onChange={handleChange} fullWidth margin="normal" required />
//                 <Button type="submit" variant="contained" color="primary" fullWidth sx={{
//                   mt: 2, borderRadius: 20,
//                 }}>
//                   Save
//                 </Button>
//               </Box>
//             ) : (
//               <Box sx={{ width: '100%' }}>
//                 <Typography><strong>Name:</strong> {profile.name}</Typography>
//                 <Typography><strong>Email:</strong> {profile.email}</Typography>
//                 <Button onClick={() => setEditing(true)} variant="outlined" color="primary" fullWidth sx={{
//                   mt: 2, borderRadius: 20,
//                 }}>
//                   Edit Profile
//                 </Button>
//               </Box>
//             )}
//             {message && (
//               <Alert severity="info" sx={{
//                 mt: 2, width: '100%', borderRadius: 2,
//                 bgcolor: 'rgba(255,255,255,0.7)', color: 'primary.main',
//               }}>
//                 {message}
//               </Alert>
//             )}
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

