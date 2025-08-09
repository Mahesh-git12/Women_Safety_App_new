import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography, Box, Card, CardContent, Button, CircularProgress,
  Alert, Avatar, Stack
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MapView from '../components/MapView';

const API_URL = process.env.REACT_APP_API_URL;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // New: Track recipient's live location
  const [myCoords, setMyCoords] = useState({ latitude: null, longitude: null });

  // Get user geolocation once on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setMyCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    } 
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not logged in');
          setLoading(false);
          return;
        }
        const res = await axios.get(`${API_URL}/api/users/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.notifications || []);
      } catch (err) {
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>{error}</Alert>;
  }
  if (!notifications.length) {
    return <Typography variant="h6" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>No notifications available.</Typography>;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%)",
        py: 4
      }}
    >
      <Box sx={{ mx: "auto", maxWidth: 650, p: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          color="#fff"
          sx={{ textAlign: "center", fontWeight: 700, textShadow: "0 1px 8px #3338" }}
        >
          Notifications
        </Typography>
        <Stack spacing={3}>
          {notifications.map((n, i) => {
            // Get sender info (from notification)
            const senderLat = typeof n.location.latitude === "number" ? n.location.latitude : 0;
            const senderLng = typeof n.location.longitude === "number" ? n.location.longitude : 0;
            const recipientLat = myCoords.latitude ?? senderLat; // if geolocation not available, fallback to sender
            const recipientLng = myCoords.longitude ?? senderLng;

            // Build single-item helper array for sender
            const mapHelpers = [{
              _id: n.fromUserId || "sender",
              name: n.fromUserName || "Sender",
              email: n.fromUserEmail,
              location: { coordinates: [senderLng, senderLat] }
            }];

            return (
              <Card
                key={i}
                variant="outlined"
                sx={{
                  bgcolor: n.read === false ? "#fcf8e8" : "#fff",
                  borderLeft: n.read === false ? '5px solid #ff9800' : '5px solid transparent',
                  boxShadow: "0 2px 8px #bbb5"
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {n.title || 'Notification'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <EmailIcon fontSize="inherit" sx={{ verticalAlign: "middle", mr: 0.5 }} />
                        {n.fromUserName} ({n.fromUserEmail})
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {n.message}
                  </Typography>
                  {n.location &&
                    typeof n.location.latitude === "number" &&
                    typeof n.location.longitude === "number" && (
                      <Box sx={{ my: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <LocationOnIcon color="primary" fontSize="small" />
                          <Typography component="span" variant="body2">
                            {n.location.latitude}, {n.location.longitude}
                          </Typography>
                          <Button
                            variant="text"
                            size="small"
                            href={`https://www.google.com/maps?q=${n.location.latitude},${n.location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<LocationOnIcon />}
                            sx={{ ml: 2 }}
                          >
                            View on Map
                          </Button>
                        </Stack>
                        {/* Embedded map preview: both sender & recipient shown, separated by a line */}
                        <MapView
                          userLocation={[recipientLat, recipientLng]}
                          helpers={mapHelpers}
                        />
                      </Box>
                    )}
                  <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                    <AccessTimeIcon fontSize="small" color="disabled" />
                    <Typography variant="caption" color="text.secondary">
                      {n.date && !isNaN(new Date(n.date).getTime())
                        ? new Date(n.date).toLocaleString()
                        : 'N/A'}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Typography, Box, List, ListItem, ListItemText, CircularProgress, Alert, Link as MuiLink } from '@mui/material';

// const API_URL = process.env.REACT_APP_API_URL;

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchNotifications() {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setError('User not logged in');
//           setLoading(false);
//           return;
//         }
//         const res = await axios.get(`${API_URL}/api/users/notifications`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setNotifications(res.data.notifications || []);
//       } catch (err) {
//         setError('Failed to load notifications');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchNotifications();
//   }, []);

//   if (loading) {
//     return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
//   }
//   if (error) {
//     return <Alert severity="error" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>{error}</Alert>;
//   }
//   if (!notifications.length) {
//     return <Typography variant="h6" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>No notifications available.</Typography>;
//   }

//   return (
//     <Box sx={{ mx: 'auto', maxWidth: 600, mt: 4, p: 2 }}>
//       <Typography variant="h4" gutterBottom>Notifications</Typography>
//       <List>
//         {notifications.map((n, i) => (
//           <ListItem key={i} divider>
//             <ListItemText
//               primary={n.title || 'Notification'}
//               secondary={
//                 <>
//                   <div>{n.message}</div>
//                   {n.fromUserName &&
//                     <div>
//                       <b>From:</b> {n.fromUserName} ({n.fromUserEmail})
//                     </div>
//                   }
//                   {n.location && typeof n.location.latitude === 'number' && typeof n.location.longitude === 'number' && (
//                     <div>
//                       <b>Location:</b> {n.location.latitude}, {n.location.longitude}
//                       <MuiLink
//                         href={`https://www.google.com/maps?q=${n.location.latitude},${n.location.longitude}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         sx={{ marginLeft: 1 }}
//                       >
//                         View on Map
//                       </MuiLink>
//                     </div>
//                   )}
//                   <div>
//                     <b>Time:</b>{' '}
//                     {n.date && !isNaN(new Date(n.date).getTime())
//                       ? new Date(n.date).toLocaleString()
//                       : 'N/A'}
//                   </div>
//                 </>
//               }
//             />
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );
// }
