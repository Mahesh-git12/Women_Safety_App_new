import React, { useEffect, useState, useRef } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, useMediaQuery, IconButton,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function Profile() {
  const [profile, setProfile] = useState({ name: '', email: '', avatarUrl: '' });
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(
          `${API_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setProfile({
          name: res.data.name,
          email: res.data.email,
          avatarUrl: res.data.avatarUrl || '',
        });
      } catch (err) {
        setMessage('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `${API_URL}/api/users/profile`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage(res.data.message || 'Profile updated!');
      setEditing(false);
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  const handleAvatarClick = () => {
    if (!editing) return;
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${API_URL}/api/users/profile/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProfile((prev) => ({ ...prev, avatarUrl: res.data.avatarUrl }));
      setMessage('Profile photo updated!');
    } catch (err) {
      setMessage('Failed to upload profile photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg,#e0c3fc 0%,#8ec5fc 100%)',
        p: isMobile ? 2 : 4,
      }}
    >
      <Card
        sx={{
          maxWidth: isMobile ? '100%' : 440,
          width: '100%',
          p: isMobile ? 2 : 3,
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(106,130,251,0.25)',
          position: 'relative',
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: isMobile ? 1.5 : 3,
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={profile.avatarUrl ? `${API_URL}${profile.avatarUrl}` : ''}
                alt={profile.name || 'Profile'}
                sx={{
                  bgcolor: 'primary.main',
                  width: isMobile ? 72 : 90,
                  height: isMobile ? 72 : 90,
                  boxShadow: '0 6px 32px #6a82fb44',
                  fontSize: isMobile ? 40 : 56,
                  cursor: editing ? 'pointer' : 'default',
                }}
                onClick={handleAvatarClick}
              >
                {!profile.avatarUrl && profile.name
                  ? profile.name.charAt(0).toUpperCase()
                  : <AccountCircleIcon sx={{ fontSize: isMobile ? 48 : 72 }} />}
              </Avatar>
              {editing && (
                <IconButton
                  onClick={handleAvatarClick}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    border: '1.5px solid',
                    borderColor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.light' },
                  }}
                  disabled={uploading}
                  aria-label="upload profile photo"
                >
                  <PhotoCamera color="primary" />
                </IconButton>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleAvatarUpload}
              />
            </Box>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              color="primary"
              sx={{
                fontWeight: 700,
                letterSpacing: '0.06em',
                textShadow: '0 2px 10px #6a82fb44',
              }}
              gutterBottom
            >
              User Profile
            </Typography>

            {editing ? (
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                  name="name"
                  label="Name"
                  value={profile.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  size={isMobile ? 'small' : 'medium'}
                />
                <TextField
                  name="email"
                  label="Email"
                  value={profile.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  size={isMobile ? 'small' : 'medium'}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 2,
                    borderRadius: 20,
                    py: isMobile ? 1 : 1.2,
                    fontSize: isMobile ? '0.85rem' : '1rem',
                  }}
                >
                  Save
                </Button>
              </Box>
            ) : (
              <Box sx={{ width: '100%' }}>
                <Typography sx={{ fontSize: isMobile ? '0.95rem' : '1.1rem', mb: 1 }}>
                  <strong>Name:</strong> {profile.name}
                </Typography>
                <Typography sx={{ fontSize: isMobile ? '0.95rem' : '1.1rem' }}>
                  <strong>Email:</strong> {profile.email}
                </Typography>
                <Button
                  onClick={() => setEditing(true)}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 3,
                    borderRadius: 20,
                    py: isMobile ? 1 : 1.2,
                    fontSize: isMobile ? '0.85rem' : '1rem',
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            )}
            {message && (
              <Alert
                severity="info"
                sx={{
                  mt: 3,
                  width: '100%',
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  color: 'primary.main',
                  fontSize: isMobile ? '0.85rem' : '1rem',
                }}
              >
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
//   Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, useMediaQuery
// } from '@mui/material';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// export default function Profile() {
//   const [profile, setProfile] = useState({ name: '', email: '' });
//   const [message, setMessage] = useState('');
//   const [editing, setEditing] = useState(false);
//   const isMobile = useMediaQuery('(max-width:600px)'); // Detect mobile

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const res = await axios.get(
//           `${API_URL}/api/users/profile`,
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
//         `${API_URL}/api/users/profile`,
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
//       background: 'linear-gradient(120deg,#e0c3fc 0%,#8ec5fc 100%)',
//       p: isMobile ? 2 : 4 // smaller padding for mobile
//     }}>
//       <Card sx={{
//         maxWidth: isMobile ? '100%' : 420,
//         width: '100%',
//         p: isMobile ? 2 : 3,
//         borderRadius: 3,
//         boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
//       }}>
//         <CardContent>
//           <Box sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             gap: isMobile ? 1.5 : 2
//           }}>
//             <Avatar sx={{
//               bgcolor: 'primary.main',
//               width: isMobile ? 56 : 62,
//               height: isMobile ? 56 : 62,
//               boxShadow: '0 4px 32px #6a82fb44',
//             }}>
//               <AccountCircleIcon fontSize={isMobile ? 'medium' : 'large'} />
//             </Avatar>
//             <Typography variant={isMobile ? 'h6' : 'h5'} color="primary" sx={{
//               fontWeight: 700,
//               letterSpacing: '0.06em',
//               mb: 1,
//               textShadow: '0 2px 8px #6a82fb33',
//             }} gutterBottom>
//               User Profile
//             </Typography>
//             {editing ? (
//               <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//                 <TextField
//                   name="name"
//                   label="Name"
//                   value={profile.name}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                   size={isMobile ? 'small' : 'medium'}
//                 />
//                 <TextField
//                   name="email"
//                   label="Email"
//                   value={profile.email}
//                   onChange={handleChange}
//                   fullWidth
//                   margin="normal"
//                   required
//                   size={isMobile ? 'small' : 'medium'}
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   sx={{
//                     mt: 2,
//                     borderRadius: 20,
//                     py: isMobile ? 1 : 1.2,
//                     fontSize: isMobile ? '0.85rem' : '1rem'
//                   }}
//                 >
//                   Save
//                 </Button>
//               </Box>
//             ) : (
//               <Box sx={{ width: '100%' }}>
//                 <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
//                   <strong>Name:</strong> {profile.name}
//                 </Typography>
//                 <Typography sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
//                   <strong>Email:</strong> {profile.email}
//                 </Typography>
//                 <Button
//                   onClick={() => setEditing(true)}
//                   variant="outlined"
//                   color="primary"
//                   fullWidth
//                   sx={{
//                     mt: 2,
//                     borderRadius: 20,
//                     py: isMobile ? 1 : 1.2,
//                     fontSize: isMobile ? '0.85rem' : '1rem'
//                   }}
//                 >
//                   Edit Profile
//                 </Button>
//               </Box>
//             )}
//             {message && (
//               <Alert severity="info" sx={{
//                 mt: 2,
//                 width: '100%',
//                 borderRadius: 2,
//                 bgcolor: 'rgba(255,255,255,0.7)',
//                 color: 'primary.main',
//                 fontSize: isMobile ? '0.85rem' : '1rem'
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


