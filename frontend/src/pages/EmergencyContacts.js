import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, Grid, Paper,
  IconButton, Chip, Stack, Fade
} from '@mui/material';
import ContactsIcon from '@mui/icons-material/Contacts';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function stringToInitials(email = "") {
  const [name] = email.split("@");
  return (name ? name.charAt(0).toUpperCase() : "?");
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [message, setMessage] = useState('');
  const [unsaved, setUnsaved] = useState(false);
  const [error, setError] = useState('');
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
        setUnsaved(false);
      } catch {
        setMessage('Failed to fetch contacts.');
      }
    };
    setShow(true);
    fetchContacts();
  }, []);

  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = phone =>
    !phone || /^\d{7,15}$/.test(phone);

  const handleAdd = () => {
    setError('');
    if (!validateEmail(newEmail)) return setError('Enter a valid email address.');
    if (newPhone && !validatePhone(newPhone)) return setError('Phone must be 7-15 digits.');
    if (contacts.some(c => c.email === newEmail)) return setError('Email already exists.');
    setContacts([...contacts, { email: newEmail, phone: newPhone }]);
    setNewEmail(''); setNewPhone('');
    setUnsaved(true);
    setMessage('Contact added. Don\'t forget to save!');
  };

  const handleRemove = (idx) => {
    setContacts(contacts.filter((_, i) => i !== idx));
    setUnsaved(true);
    setMessage('Contact removed. Don\'t forget to save!');
  };

  const handleSave = async () => {
    setError(''); setMessage('');
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${API_URL}/api/users/emergency-contacts`,
        { emergencyContacts: contacts },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Contacts saved!');
      setUnsaved(false);
    } catch {
      setError('Failed to save contacts.');
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
        <Paper elevation={4} sx={{ maxWidth: 560, width: '100%', p: 3, borderRadius: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'info.main', width: 72, height: 72, mb: 2 }}><ContactsIcon fontSize="large" /></Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '.03em', mb: 2 }}>
              Emergency Contacts
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  fullWidth
                  size="small"
                  error={!!error && !validateEmail(newEmail)}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="Phone (optional)"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  fullWidth
                  size="small"
                  error={!!error && newPhone && !validatePhone(newPhone)}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button
                  onClick={handleAdd}
                  variant="contained"
                  color="info"
                  sx={{ borderRadius: 10, height: '100%', minWidth: 44 }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
            <Box sx={{ width: '100%' }}>
              <Stack spacing={2} sx={{ width: '100%' }}>
                {contacts.length === 0 && (
                  <Typography color="text.secondary" align="center">No emergency contacts added yet.</Typography>
                )}
                {contacts.map((contact, idx) => (
                  <Fade in key={contact.email}>
                    <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                        {contact.email ? stringToInitials(contact.email) : <PersonIcon />}
                      </Avatar>
                      <Box flex={1}>
                        <Typography fontWeight="bold">{contact.email}</Typography>
                        {contact.phone && (
                          <Chip
                            label={contact.phone}
                            size="small"
                            sx={{ mt: .5 }}
                            icon={<PersonIcon fontSize="small" />}
                          />
                        )}
                      </Box>
                      <IconButton color="error" onClick={() => handleRemove(idx)}>
                        <DeleteIcon />
                      </IconButton>
                    </Card>
                  </Fade>
                ))}
              </Stack>
            </Box>
            <Button
              onClick={handleSave}
              variant="contained"
              color="info"
              fullWidth
              sx={{ mt: 2, py: 1.5, borderRadius: 10, fontWeight: 'bold', fontSize: '1rem' }}
              disabled={!unsaved}
            >Save All</Button>
            {unsaved && (
              <Typography color="warning.main" sx={{ mt: 1, fontSize: 14 }}>
                You have unsaved changes.
              </Typography>
            )}
            {message && (
              <Fade in>
                <Alert severity={message.includes('saved') ? 'success' : 'info'} sx={{ mt: 2, width: '100%' }}>
                  {message}
                </Alert>
              </Fade>
            )}
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}


// import React, { useEffect, useState } from 'react';
// import {
//   Card, CardContent, Typography, TextField, Button, Box, Avatar, Alert, Grid, Paper,
//   IconButton, Chip, Stack, Fade
// } from '@mui/material';
// import ContactsIcon from '@mui/icons-material/Contacts';
// import DeleteIcon from '@mui/icons-material/Delete';
// import PersonIcon from '@mui/icons-material/Person';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// function stringToInitials(email = "") {
//   const [name] = email.split("@");
//   return (name ? name.charAt(0).toUpperCase() : "?");
// }

// export default function EmergencyContacts() {
//   const [contacts, setContacts] = useState([]);
//   const [newEmail, setNewEmail] = useState('');
//   const [newPhone, setNewPhone] = useState('');
//   const [message, setMessage] = useState('');
//   const [unsaved, setUnsaved] = useState(false);
//   const [error, setError] = useState('');
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
//         setUnsaved(false);
//       } catch {
//         setMessage('Failed to fetch contacts.');
//       }
//     };
//     setShow(true);
//     fetchContacts();
//   }, []);

//   const validateEmail = email =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const validatePhone = phone =>
//     !phone || /^\d{7,15}$/.test(phone);

//   const handleAdd = () => {
//     setError('');
//     if (!validateEmail(newEmail)) return setError('Enter a valid email address.');
//     if (newPhone && !validatePhone(newPhone)) return setError('Phone must be 7-15 digits.');
//     if (contacts.some(c => c.email === newEmail)) return setError('Email already exists.');
//     setContacts([...contacts, { email: newEmail, phone: newPhone }]);
//     setNewEmail(''); setNewPhone('');
//     setUnsaved(true);
//     setMessage('Contact added. Don\'t forget to save!');
//   };

//   const handleRemove = (idx) => {
//     setContacts(contacts.filter((_, i) => i !== idx));
//     setUnsaved(true);
//     setMessage('Contact removed. Don\'t forget to save!');
//   };

//   const handleSave = async () => {
//     setError(''); setMessage('');
//     const token = localStorage.getItem('token');
//     try {
//       await axios.put(
//         `${API_URL}/api/users/emergency-contacts`,
//         { emergencyContacts: contacts },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessage('Contacts saved!');
//       setUnsaved(false);
//     } catch {
//       setError('Failed to save contacts.');
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
//         <Paper elevation={4} sx={{ maxWidth: 560, width: '100%', p: 3, borderRadius: 4 }}>
//           <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
//             <Avatar sx={{ bgcolor: 'info.main', width: 72, height: 72, mb: 2 }}><ContactsIcon fontSize="large" /></Avatar>
//             <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '.03em', mb: 2 }}>
//               Emergency Contacts
//             </Typography>
//             <Grid container spacing={1}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   label="Email"
//                   value={newEmail}
//                   onChange={e => setNewEmail(e.target.value)}
//                   fullWidth
//                   size="small"
//                   error={!!error && !validateEmail(newEmail)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={5}>
//                 <TextField
//                   label="Phone (optional)"
//                   value={newPhone}
//                   onChange={e => setNewPhone(e.target.value)}
//                   fullWidth
//                   size="small"
//                   error={!!error && newPhone && !validatePhone(newPhone)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={1}>
//                 <Button
//                   onClick={handleAdd}
//                   variant="contained"
//                   color="info"
//                   sx={{ borderRadius: 10, height: '100%', minWidth: 44 }}
//                 >
//                   Add
//                 </Button>
//               </Grid>
//             </Grid>
//             {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
//             <Box sx={{ width: '100%' }}>
//               <Stack spacing={2} sx={{ width: '100%' }}>
//                 {contacts.length === 0 && (
//                   <Typography color="text.secondary" align="center">No emergency contacts added yet.</Typography>
//                 )}
//                 {contacts.map((contact, idx) => (
//                   <Fade in key={contact.email}>
//                     <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
//                       <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
//                         {contact.email ? stringToInitials(contact.email) : <PersonIcon />}
//                       </Avatar>
//                       <Box flex={1}>
//                         <Typography fontWeight="bold">{contact.email}</Typography>
//                         {contact.phone && (
//                           <Chip
//                             label={contact.phone}
//                             size="small"
//                             sx={{ mt: .5 }}
//                             icon={<PersonIcon fontSize="small" />}
//                           />
//                         )}
//                       </Box>
//                       <IconButton color="error" onClick={() => handleRemove(idx)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </Card>
//                   </Fade>
//                 ))}
//               </Stack>
//             </Box>
//             <Button
//               onClick={handleSave}
//               variant="contained"
//               color="info"
//               fullWidth
//               sx={{ mt: 2, py: 1.5, borderRadius: 10, fontWeight: 'bold', fontSize: '1rem' }}
//               disabled={!unsaved}
//             >Save All</Button>
//             {unsaved && (
//               <Typography color="warning.main" sx={{ mt: 1, fontSize: 14 }}>
//                 You have unsaved changes.
//               </Typography>
//             )}
//             {message && (
//               <Fade in>
//                 <Alert severity={message.includes('saved') ? 'success' : 'info'} sx={{ mt: 2, width: '100%' }}>
//                   {message}
//                 </Alert>
//               </Fade>
//             )}
//           </Box>
//         </Paper>
//       </Fade>
//     </Box>
//   );
// }
