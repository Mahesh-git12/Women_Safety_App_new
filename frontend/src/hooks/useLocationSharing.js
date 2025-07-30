// import { useEffect } from "react";
// import axios from "axios";

// export default function useLocationSharing(isLoggedIn) {
//   useEffect(() => {
//     if (!isLoggedIn) return;
//     let watchId;

//     function sendLocation(lat, lng) {
//       const token = localStorage.getItem("token");
//       if (!token) return;
//       axios.post(
//         `${process.env.REACT_APP_API_URL}/api/users/update-location`,
//         { latitude: lat, longitude: lng },
//         { headers: { Authorization: `Bearer ${token}` } }
//       ).catch(() => {});
//     }

//     if ("geolocation" in navigator) {
//       watchId = navigator.geolocation.watchPosition(
//         pos => sendLocation(pos.coords.latitude, pos.coords.longitude),
//         () => {},
//         { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
//       );
//     }

//     return () => {
//       if (watchId) navigator.geolocation.clearWatch(watchId);
//     };
//   }, [isLoggedIn]);
// }
