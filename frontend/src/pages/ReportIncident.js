import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, TextField, Button, Alert, Typography, Paper, Avatar, Checkbox, Stack, Fade
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const API_URL = process.env.REACT_APP_API_URL;

export default function ReportIncident() {
  const [form, setForm] = useState({ location: '', description: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [show, setShow] = useState(false);

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
      } catch {
        setContacts([]);
      }
    };
    setShow(true);
    fetchContacts();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckbox = email => {
    setSelected(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    let latitude, longitude;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
          await sendReport({ ...form, latitude, longitude });
        },
        async () => {
          await sendReport(form);
        }
      );
    } else {
      await sendReport(form);
    }
  };

  const sendReport = async (data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/incidents/report`,
        {
          ...data,
          contacts: contacts.filter(c => selected.includes(c.email))
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Incident reported and contacts notified!');
      setForm({ location: '', description: '' });
      setSelected([]);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to report incident.');
    } finally {
      setLoading(false);
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
      <Fade in={show} timeout={900}>
        <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 480 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
              <WarningAmberIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={700}>Report an Incident</Typography>
          </Box>
          {message && <Fade in><Alert severity={message.includes('notified') ? "success" : "error"} sx={{ mb: 2 }}>{message}</Alert></Fade>}
          <form onSubmit={handleSubmit} autoComplete="off">
            <TextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              minRows={3}
              sx={{ mb: 2 }}
            />
            <Typography sx={{ mb: 1, mt: 2 }} fontWeight="bold">Select Contacts to Notify:</Typography>
            <Stack spacing={1} mb={2}>
              {contacts.length === 0 &&
                <Fade in><Typography color="text.secondary">No emergency contacts saved.</Typography></Fade>
              }
              {contacts.map(contact => (
                <Fade in key={contact.email}>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      checked={selected.includes(contact.email)}
                      onChange={() => handleCheckbox(contact.email)}
                      disabled={loading}
                      color="info"
                    />
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 30, height: 30, mr: 1, fontSize: 16 }}>
                      {contact.email ? contact.email.charAt(0).toUpperCase() : "?"}
                    </Avatar>
                    <Typography variant="body1">{contact.email}</Typography>
                    {contact.phone && <Typography ml={1} variant="caption" color="text.secondary">| {contact.phone}</Typography>}
                  </Box>
                </Fade>
              ))}
            </Stack>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={loading || selected.length === 0}
              fullWidth
              sx={{ py: 1.2, fontWeight: 'bold', fontSize: 18 }}
            >
              {loading ? 'Reporting...' : 'Report Incident'}
            </Button>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box, TextField, Button, Alert, Typography, Paper, Avatar, Checkbox, Stack, Fade
// } from '@mui/material';
// import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// const API_URL = process.env.REACT_APP_API_URL;

// export default function ReportIncident() {
//   const [form, setForm] = useState({ location: '', description: '' });
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [contacts, setContacts] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     const fetchContacts = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;
//       try {
//         const res = await axios.get(
//           `${API_URL}/api/users/emergency-contacts`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setContacts(res.data.emergencyContacts || []);
//       } catch {
//         setContacts([]);
//       }
//     };
//     setShow(true);
//     fetchContacts();
//   }, []);

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleCheckbox = email => {
//     setSelected(prev =>
//       prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
//     );
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     let latitude, longitude;
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async pos => {
//           latitude = pos.coords.latitude;
//           longitude = pos.coords.longitude;
//           await sendReport({ ...form, latitude, longitude });
//         },
//         async () => {
//           await sendReport(form);
//         }
//       );
//     } else {
//       await sendReport(form);
//     }
//   };

//   const sendReport = async (data) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `${API_URL}/api/incidents/report`,
//         {
//           ...data,
//           contacts: contacts.filter(c => selected.includes(c.email))
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessage('Incident reported and contacts notified!');
//       setForm({ location: '', description: '' });
//       setSelected([]);
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Failed to report incident.');
//     } finally {
//       setLoading(false);
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
//       <Fade in={show} timeout={900}>
//         <Paper sx={{ p: 4, borderRadius: 4, maxWidth: 480 }}>
//           <Box display="flex" alignItems="center" gap={2} mb={3}>
//             <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
//               <WarningAmberIcon />
//             </Avatar>
//             <Typography variant="h5" fontWeight={700}>Report an Incident</Typography>
//           </Box>
//           {message && <Fade in><Alert severity={message.includes('notified') ? "success" : "error"} sx={{ mb: 2 }}>{message}</Alert></Fade>}
//           <form onSubmit={handleSubmit} autoComplete="off">
//             <TextField
//               label="Location"
//               name="location"
//               value={form.location}
//               onChange={handleChange}
//               fullWidth
//               required
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               label="Description"
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               fullWidth
//               required
//               multiline
//               minRows={3}
//               sx={{ mb: 2 }}
//             />
//             <Typography sx={{ mb: 1, mt: 2 }} fontWeight="bold">Select Contacts to Notify:</Typography>
//             <Stack spacing={1} mb={2}>
//               {contacts.length === 0 &&
//                 <Fade in><Typography color="text.secondary">No emergency contacts saved.</Typography></Fade>
//               }
//               {contacts.map(contact => (
//                 <Fade in key={contact.email}>
//                   <Box display="flex" alignItems="center">
//                     <Checkbox
//                       checked={selected.includes(contact.email)}
//                       onChange={() => handleCheckbox(contact.email)}
//                       disabled={loading}
//                       color="info"
//                     />
//                     <Avatar sx={{ bgcolor: 'secondary.main', width: 30, height: 30, mr: 1, fontSize: 16 }}>
//                       {contact.email ? contact.email.charAt(0).toUpperCase() : "?"}
//                     </Avatar>
//                     <Typography variant="body1">{contact.email}</Typography>
//                     {contact.phone && <Typography ml={1} variant="caption" color="text.secondary">| {contact.phone}</Typography>}
//                   </Box>
//                 </Fade>
//               ))}
//             </Stack>
//             <Button
//               type="submit"
//               variant="contained"
//               color="error"
//               disabled={loading || selected.length === 0}
//               fullWidth
//               sx={{ py: 1.2, fontWeight: 'bold', fontSize: 18 }}
//             >
//               {loading ? 'Reporting...' : 'Report Incident'}
//             </Button>
//           </form>
//         </Paper>
//       </Fade>
//     </Box>
//   );
// }

