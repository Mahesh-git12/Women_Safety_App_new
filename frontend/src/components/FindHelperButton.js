import React, { useState, useEffect } from "react";
import {
  Tooltip, Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Snackbar, Alert, Typography, List, ListItem, ListItemText, Checkbox, Chip, Avatar
} from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import axios from "axios";
import MapView from "./MapView";
import { getDistance } from "geolib";

const API_URL = process.env.REACT_APP_API_URL;

function calcDistanceAndETA(userLat, userLng, helperLat, helperLng, walkSpeedKmh = 5) {
  const distanceMeters = getDistance(
    { latitude: userLat, longitude: userLng },
    { latitude: helperLat, longitude: helperLng }
  );
  const distanceKm = (distanceMeters / 1000).toFixed(2);
  const etaMin = Math.max(1, Math.round((distanceKm / walkSpeedKmh) * 60));
  return { distanceKm, etaMin };
}

export default function FindHelperButton() {
  const [helpers, setHelpers] = useState([]);
  const [selectedHelpers, setSelectedHelpers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const token = localStorage.getItem("token");
  const [currentCoords, setCurrentCoords] = useState({ latitude: null, longitude: null });
  const [profile, setProfile] = useState({ name: "", email: "" });

  useEffect(() => {
    async function fetchUserProfile() {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile({ name: res.data.name, email: res.data.email });
      } catch (err) {}
    }
    fetchUserProfile();
  }, [token]);

  const fetchNearestUsers = (latitude, longitude) => {
    setCurrentCoords({ latitude, longitude });
    axios
      .get(`${API_URL}/api/users/nearest?latitude=${latitude}&longitude=${longitude}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setHelpers(res.data);
        setSelectedHelpers(res.data.slice(0, 1).map(u => u._id));
        setShowDialog(true);
      })
      .catch((error) => {
        setHelpers([]);
        setSelectedHelpers([]);
        if (error.response && error.response.status === 404) {
          setFeedback("No nearby helpers found.");
        } else {
          setFeedback("Failed to find nearby helpers.");
        }
        setOpen(true);
        setShowDialog(false);
      });
  };

  // Always get fresh device location on every Find Helper click!
  const handleFindHelperClick = () => {
    if (!navigator.geolocation) {
      setFeedback("Geolocation not supported.");
      setOpen(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Debug: see which location is being used
        console.log("Current user location for find helpers:", latitude, longitude);
        fetchNearestUsers(latitude, longitude);
      },
      () => {
        setFeedback("Unable to retrieve your location.");
        setOpen(true);
      }
    );
  };

  const handleToggle = (id) => {
    setSelectedHelpers((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleNotify = () => {
    if (selectedHelpers.length === 0) return;
    Promise.all(selectedHelpers.map(helperId =>
      axios.post(
        `${API_URL}/api/users/notify`,
        {
          userId: helperId,
          message: `SOS alert from ${profile.name || "Unknown"}`,
          latitude: currentCoords.latitude,
          longitude: currentCoords.longitude
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ))
      .then(() => {
        setFeedback("Notification(s) sent to selected helpers.");
        setOpen(true);
        setShowDialog(false);
      })
      .catch(() => {
        setFeedback("Failed to send notifications.");
        setOpen(true);
      });
  };

  const leafletUserCoords =
    typeof currentCoords.latitude === "number" && typeof currentCoords.longitude === "number"
      ? [currentCoords.latitude, currentCoords.longitude]
      : null;

  const getHelperDistanceChip = (helper) => {
    if (
      !currentCoords.latitude ||
      !currentCoords.longitude ||
      !helper.location?.coordinates
    ) {
      return "";
    }
    const [lng, lat] = helper.location.coordinates;
    const { distanceKm, etaMin } = calcDistanceAndETA(
      currentCoords.latitude,
      currentCoords.longitude,
      lat,
      lng
    );
    return `${distanceKm} km ? ${etaMin} min`;
  };

  return (
    <>
      <Tooltip title="Find Nearby Helpers" placement="left">
        <Fab
          color="primary"
          onClick={handleFindHelperClick}
          sx={{
            position: "fixed",
            bottom: 112,
            right: 32,
            zIndex: 1200
          }}
        >
          <PersonSearchIcon />
        </Fab>
      </Tooltip>

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nearby Helpers</DialogTitle>
        <DialogContent>
          {leafletUserCoords && helpers.length > 0 && (
            <MapView userLocation={leafletUserCoords} helpers={helpers} />
          )}
          <List>
            {helpers.map((user) => (
              <ListItem key={user._id} dense divider sx={{ alignItems: "flex-start" }}>
                <Checkbox
                  checked={selectedHelpers.includes(user._id)}
                  onChange={() => handleToggle(user._id)}
                />
                <Avatar sx={{ bgcolor: "#6a82fb", mr: 2 }}>
                  {(user.avatarUrl && (
                    <img src={user.avatarUrl} alt={user.name} style={{ width: "100%" }} />
                  )) ||
                    (user.name?.[0] || "U").toUpperCase()}
                </Avatar>
                <ListItemText
                  primary={user.name || "N/A"}
                  secondary={user.email || ""}
                />
                <Chip
                  label={getHelperDistanceChip(user)}
                  color="primary"
                  size="small"
                  sx={{ ml: 1, mt: 1 }}
                />
              </ListItem>
            ))}
            {helpers.length === 0 && (
              <Typography color="text.secondary">
                No helpers found nearby.
              </Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedHelpers.length === 0}
            onClick={handleNotify}
          >
            Notify Selected
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity={feedback.startsWith("Failed") ? "error" : "success"} onClose={() => setOpen(false)}>
          {feedback}
        </Alert>
      </Snackbar>
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import {
//   Tooltip, Fab, Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, Snackbar, Alert, Typography, List, ListItem, ListItemText, Checkbox, Chip, Avatar
// } from "@mui/material";
// import PersonSearchIcon from "@mui/icons-material/PersonSearch";
// import axios from "axios";
// import MapView from "./MapView";
// import { getDistance } from "geolib";

// const API_URL = process.env.REACT_APP_API_URL;

// function calcDistanceAndETA(userLat, userLng, helperLat, helperLng, walkSpeedKmh = 5) {
//   const distanceMeters = getDistance(
//     { latitude: userLat, longitude: userLng },
//     { latitude: helperLat, longitude: helperLng }
//   );
//   const distanceKm = (distanceMeters / 1000).toFixed(2);
//   const etaMin = Math.max(1, Math.round((distanceKm / walkSpeedKmh) * 60));
//   return { distanceKm, etaMin };
// }

// export default function FindHelperButton() {
//   const [helpers, setHelpers] = useState([]);
//   const [selectedHelpers, setSelectedHelpers] = useState([]);
//   const [showDialog, setShowDialog] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const token = localStorage.getItem("token");
//   const [currentCoords, setCurrentCoords] = useState({ latitude: null, longitude: null });
//   const [profile, setProfile] = useState({ name: "", email: "" });

//   useEffect(() => {
//     async function fetchUserProfile() {
//       if (!token) return;
//       try {
//         const res = await axios.get(`${API_URL}/api/users/profile`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setProfile({ name: res.data.name, email: res.data.email });
//       } catch (err) {}
//     }
//     fetchUserProfile();
//   }, [token]);

  
//   const fetchNearestUsers = (latitude, longitude) => {
//     setCurrentCoords({ latitude, longitude });
//     axios
//       .get(`${API_URL}/api/users/nearest?latitude=${latitude}&longitude=${longitude}&limit=5`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then((res) => {
//         setHelpers(res.data);
//         setSelectedHelpers(res.data.slice(0, 1).map(u => u._id));
//         setShowDialog(true);
//       })
//       .catch((error) => {
//         setHelpers([]);
//         setSelectedHelpers([]);
//         if (error.response && error.response.status === 404) {
//           setFeedback("No nearby helpers found.");
//         } else {
//           setFeedback("Failed to find nearby helpers.");
//         }
//         setOpen(true);
//         setShowDialog(false);
//       });
//   };

//   const handleFindHelperClick = () => {
//     if (!navigator.geolocation) {
//       setFeedback("Geolocation not supported.");
//       setOpen(true);
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         fetchNearestUsers(latitude, longitude);
//       },
//       () => {
//         setFeedback("Unable to retrieve your location.");
//         setOpen(true);
//       }
//     );
//   };

//   const handleToggle = (id) => {
//     setSelectedHelpers((prev) =>
//       prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
//     );
//   };

//   const handleNotify = () => {
//     if (selectedHelpers.length === 0) return;
//     Promise.all(selectedHelpers.map(helperId =>
//       axios.post(
//         `${API_URL}/api/users/notify`,
//         {
//           userId: helperId,
//           message: `SOS alert from ${profile.name || "Unknown"}`,
//           latitude: currentCoords.latitude,
//           longitude: currentCoords.longitude
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//     ))
//       .then(() => {
//         setFeedback("Notification(s) sent to selected helpers.");
//         setOpen(true);
//         setShowDialog(false);
//       })
//       .catch(() => {
//         setFeedback("Failed to send notifications.");
//         setOpen(true);
//       });
//   };

//   const leafletUserCoords =
//     typeof currentCoords.latitude === "number" && typeof currentCoords.longitude === "number"
//       ? [currentCoords.latitude, currentCoords.longitude]
//       : null;

//   const getHelperDistanceChip = (helper) => {
//     if (
//       !currentCoords.latitude ||
//       !currentCoords.longitude ||
//       !helper.location?.coordinates
//     ) {
//       return "";
//     }
//     const [lng, lat] = helper.location.coordinates;
//     const { distanceKm, etaMin } = calcDistanceAndETA(
//       currentCoords.latitude,
//       currentCoords.longitude,
//       lat,
//       lng
//     );
//     return `${distanceKm} km ? ${etaMin} min`;
//   };

//   return (
//     <>
//       <Tooltip title="Find Nearby Helpers" placement="left">
//         <Fab
//           color="primary"
//           onClick={handleFindHelperClick}
//           sx={{
//             position: "fixed",
//             bottom: 112,
//             right: 32,
//             zIndex: 1200
//           }}
//         >
//           <PersonSearchIcon />
//         </Fab>
//       </Tooltip>

//       <Dialog open={showDialog} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Nearby Helpers</DialogTitle>
//         <DialogContent>
//           {leafletUserCoords && helpers.length > 0 && (
//             <MapView userLocation={leafletUserCoords} helpers={helpers} />
//           )}
//           <List>
//             {helpers.map((user) => (
//               <ListItem key={user._id} dense divider sx={{ alignItems: "flex-start" }}>
//                 <Checkbox
//                   checked={selectedHelpers.includes(user._id)}
//                   onChange={() => handleToggle(user._id)}
//                 />
//                 <Avatar sx={{ bgcolor: "#6a82fb", mr: 2 }}>
//                   {/* If you have avatarUrl later, use that instead: */}
//                   {(user.avatarUrl && (
//                     <img src={user.avatarUrl} alt={user.name} style={{ width: "100%" }} />
//                   )) ||
//                     (user.name?.[0] || "U").toUpperCase()}
//                 </Avatar>
//                 <ListItemText
//                   primary={user.name || "N/A"}
//                   secondary={user.email || ""}
//                 />
//                 <Chip
//                   label={getHelperDistanceChip(user)}
//                   color="primary"
//                   size="small"
//                   sx={{ ml: 1, mt: 1 }}
//                 />
//               </ListItem>
//             ))}
//             {helpers.length === 0 && (
//               <Typography color="text.secondary">
//                 No helpers found nearby.
//               </Typography>
//             )}
//           </List>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowDialog(false)}>Cancel</Button>
//           <Button
//             variant="contained"
//             color="primary"
//             disabled={selectedHelpers.length === 0}
//             onClick={handleNotify}
//           >
//             Notify Selected
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
//         <Alert severity={feedback.startsWith("Failed") ? "error" : "success"} onClose={() => setOpen(false)}>
//           {feedback}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }
