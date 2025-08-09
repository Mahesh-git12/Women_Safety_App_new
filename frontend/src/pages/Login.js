import React, { useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, Fade
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  React.useEffect(() => { setShow(true); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(
        `${API_URL}/api/users/login`,
        form
      );
      setMessage('Login successful!');
      localStorage.setItem('token', res.data.token);
      window.location.href = '/report';
      window.location.href = '/home';
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
      background: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)'
    }}>
      <Fade in={show} timeout={900}>
        <Card sx={{ maxWidth: 420, width: '100%', p: 3, borderRadius: 5, boxShadow: '0 4px 28px #6a82fb22' }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{
                bgcolor: 'secondary.main', width: 70, height: 70, boxShadow: '0 4px 32px #fc5c7d44',
              }}>
                <LockOutlinedIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" color="secondary" sx={{ fontWeight: 700, letterSpacing: '0.07em', mb: 2 }}>
                Welcome Back
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
                <Button type="submit" variant="contained" color="secondary" fullWidth
                  sx={{
                    mt: 3, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem',
                    background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
                    borderRadius: 20,
                  }}>
                  Login
                </Button>
              </Box>
              {message && (
                <Fade in>
                  <Alert severity={message.includes('success') ? "success" : "error"} sx={{ width: '100%' }}>
                    {message}
                  </Alert>
                </Fade>
              )}
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Don't have an account? <a href="/register">Register</a>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}



// import React, { useState } from 'react';
// import {
//   Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, Fade
// } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import axios from 'axios';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [message, setMessage] = useState('');
//   const [show, setShow] = useState(false);

//   React.useEffect(() => { setShow(true); }, []);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/users/login`,
//         form
//       );
//       setMessage('Login successful!');
//       localStorage.setItem('token', res.data.token);
//       window.location.href = '/report';
//       window.location.href = '/home';
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Login failed.');
//     }
//   };

//   return (
//     <Box sx={{
//       minHeight: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       background: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)'
//     }}>
//       <Fade in={show} timeout={900}>
//         <Card sx={{ maxWidth: 420, width: '100%', p: 3, borderRadius: 5, boxShadow: '0 4px 28px #6a82fb22' }}>
//           <CardContent>
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//               <Avatar sx={{
//                 bgcolor: 'secondary.main', width: 70, height: 70, boxShadow: '0 4px 32px #fc5c7d44',
//               }}>
//                 <LockOutlinedIcon fontSize="large" />
//               </Avatar>
//               <Typography variant="h4" color="secondary" sx={{ fontWeight: 700, letterSpacing: '0.07em', mb: 2 }}>
//                 Welcome Back
//               </Typography>
//               <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//                 <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth margin="normal" required />
//                 <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" required />
//                 <Button type="submit" variant="contained" color="secondary" fullWidth
//                   sx={{
//                     mt: 3, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem',
//                     background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
//                     borderRadius: 20,
//                   }}>
//                   Login
//                 </Button>
//               </Box>
//               {message && (
//                 <Fade in>
//                   <Alert severity={message.includes('success') ? "success" : "error"} sx={{ width: '100%' }}>
//                     {message}
//                   </Alert>
//                 </Fade>
//               )}
//               <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
//                 Don't have an account? <a href="/register">Register</a>
//               </Typography>
//             </Box>
//           </CardContent>
//         </Card>
//       </Fade>
//     </Box>
//   );
// }

