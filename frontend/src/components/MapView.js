import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { getDistance } from "geolib";

// "You" marker styling
const myIcon = L.divIcon({
  className: "avatar-marker",
  html: `<div style="
      background:#ff9800;color:white;width:40px;height:40px;
      border-radius:50%;border:3px solid #fff;
      display:flex;align-items:center;justify-content:center;
      font-weight:700;font-size:14px;box-shadow:0 1px 5px #3333
    ">You</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Helper marker: avatar or initial
const createAvatarIcon = (avatarUrl, name) =>
  L.divIcon({
    className: "avatar-marker",
    html: avatarUrl
      ? `<div style="border-radius:50%;overflow:hidden;width:36px;height:36px;border:2px solid #6a82fb;box-shadow:0 1px 5px #2222"><img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover"/></div>`
      : `<div style="background:#6a82fb;color:#fff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:18px;border:2px solid #6a82fb;box-shadow:0 1px 5px #2222">${(name?.[0]||"U").toUpperCase()}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

function toLatLng(geoCoords) {
  if (!Array.isArray(geoCoords) || geoCoords.length !== 2) return [0, 0];
  return [geoCoords[1], geoCoords[0]];
}

function calcDistanceAndETA(userLat, userLng, helperLat, helperLng, walkSpeedKmh = 5) {
  const distanceMeters = getDistance(
    { latitude: userLat, longitude: userLng },
    { latitude: helperLat, longitude: helperLng }
  );
  const distanceKm = (distanceMeters / 1000).toFixed(2);
  const etaMin = Math.max(1, Math.round((distanceKm / walkSpeedKmh) * 60));
  return { distanceKm, etaMin };
}

export default function MapView({ userLocation, helpers = [] }) {
  if (!userLocation || userLocation.length < 2) {
    return <div style={{ color: "#888" }}>No map data available</div>;
  }
  const [userLat, userLng] = userLocation;

  return (
    <div
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.92)',
        padding: 18,
        borderRadius: 20,
        boxShadow: '0 6px 30px #6a82fb28',
        margin: '18px 0',
        minHeight: 300,
        maxWidth: 700,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <MapContainer
        center={userLocation}
        zoom={16}
        style={{
          height: "350px",
          width: "100%",
          borderRadius: 18,
          fontFamily: "inherit",
        }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userLocation} icon={myIcon}>
          <Popup>
            <b>You</b>
          </Popup>
        </Marker>
        {helpers.map((helper) => {
          const [lng, lat] = helper.location.coordinates;
          const pos = [lat, lng];
          const { distanceKm, etaMin } = calcDistanceAndETA(userLat, userLng, lat, lng);
          return (
            <React.Fragment key={helper._id}>
              <Polyline
                positions={[userLocation, pos]}
                pathOptions={{ color: "#1976d2", dashArray: "7,8", weight: 3, opacity: 0.7 }}
              />
              <Marker
                position={pos}
                icon={createAvatarIcon(helper.avatarUrl, helper.name)}
              >
                <Popup>
                  <b>{helper.name}</b>
                  <br />
                  <small style={{ color: "#666" }}>{helper.email}</small>
                  <br />
                  <Chip
                    label={`${distanceKm} km ? ${etaMin} min`}
                    color="info"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}&travelmode=walking`}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<DirectionsWalkIcon />}
                    sx={{ mt: 1, mb: 0.5 }}
                  >
                    Directions
                  </Button>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
      <div style={{ textAlign: "center", fontSize: 14, color: "#7a7a7a", marginTop: 10 }}>
        Your location and the SOS sender are shown. The line indicates their real distance from you.
      </div>
    </div>
  );
}


// // src/components/MapView.js
// import React from "react";
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
// import L from "leaflet";
// import Chip from "@mui/material/Chip";
// import Button from "@mui/material/Button";
// import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
// import PersonIcon from "@mui/icons-material/Person";
// import { getDistance } from "geolib";

// // Custom 'You' marker: big gold circle
// const myIcon = L.divIcon({
//   className: "avatar-marker",
//   html: `
//     <div style="
//       background:#ff9800;
//       color:white;
//       width:40px;height:40px;
//       border-radius:50%;
//       border:3px solid #fff;
//       display:flex;align-items:center;justify-content:center;
//       font-weight:700;font-size:14px;box-shadow:0 1px 5px #3333
//     ">You</div>`,
//   iconSize: [40, 40],
//   iconAnchor: [20, 40],
//   popupAnchor: [0, -40],
// });

// // Custom marker: avatar or initial for each helper
// const createAvatarIcon = (avatarUrl, name) =>
//   L.divIcon({
//     className: "avatar-marker",
//     html: avatarUrl
//       ? `<div style="border-radius:50%;overflow:hidden;width:36px;height:36px;border:2px solid #6a82fb;box-shadow:0 1px 5px #2222"><img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover"/></div>`
//       : `<div style="background:#6a82fb;color:#fff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:18px;border:2px solid #6a82fb;box-shadow:0 1px 5px #2222">${(name?.[0]||"U").toUpperCase()}</div>`,
//     iconSize: [36, 36],
//     iconAnchor: [18, 36],
//     popupAnchor: [0, -36],
//   });

// function toLatLng(geoCoords) {
//   if (!Array.isArray(geoCoords) || geoCoords.length !== 2) return [0, 0];
//   return [geoCoords[1], geoCoords[0]];
// }

// function calcDistanceAndETA(userLat, userLng, helperLat, helperLng, walkSpeedKmh = 5) {
//   const distanceMeters = getDistance(
//     { latitude: userLat, longitude: userLng },
//     { latitude: helperLat, longitude: helperLng }
//   );
//   const distanceKm = (distanceMeters / 1000).toFixed(2);
//   const etaMin = Math.max(1, Math.round((distanceKm / walkSpeedKmh) * 60));
//   return { distanceKm, etaMin };
// }

// export default function MapView({ userLocation, helpers = [] }) {
//   if (!userLocation || userLocation.length < 2) {
//     return <div style={{ color: "#888" }}>No map data available</div>;
//   }
//   const [userLat, userLng] = userLocation;

//   return (
//     <div
//       style={{
//         width: '100%',
//         background: 'rgba(255,255,255,0.92)',
//         padding: 18,
//         borderRadius: 20,
//         boxShadow: '0 6px 30px #6a82fb28',
//         margin: '18px 0',
//         minHeight: 300,
//         maxWidth: 700,
//         marginLeft: "auto",
//         marginRight: "auto",
//       }}
//     >
//       <MapContainer
//         center={userLocation}
//         zoom={16}
//         style={{
//           height: "350px",
//           width: "100%",
//           borderRadius: 18,
//           fontFamily: "inherit",
//         }}
//         scrollWheelZoom={false}
//       >
//         <TileLayer
//           attribution="&copy; OpenStreetMap"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {/* YOU marker */}
//         <Marker position={userLocation} icon={myIcon}>
//           <Popup>
//             <b>You</b>
//           </Popup>
//         </Marker>

//         {/* Helper markers and route lines */}
//         {helpers.map((helper) => {
//           const [lng, lat] = helper.location.coordinates;
//           const pos = [lat, lng];
//           const { distanceKm, etaMin } = calcDistanceAndETA(userLat, userLng, lat, lng);
//           return (
//             <React.Fragment key={helper._id}>
//               {/* Route line */}
//               <Polyline
//                 positions={[userLocation, pos]}
//                 pathOptions={{ color: "#1976d2", dashArray: "7,8", weight: 3, opacity: 0.7 }}
//               />
//               {/* Helper marker */}
//               <Marker
//                 position={pos}
//                 icon={createAvatarIcon(helper.avatarUrl, helper.name)}
//               >
//                 <Popup>
//                   <b>{helper.name}</b>
//                   <br />
//                   <small style={{ color: "#666" }}>{helper.email}</small>
//                   <br />
//                   <Chip
//                     label={`${distanceKm} km ? ${etaMin} min`}
//                     color="info"
//                     size="small"
//                     sx={{ mt: 1 }}
//                   />
//                   <Button
//                     size="small"
//                     variant="outlined"
//                     href={`https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}&travelmode=walking`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     startIcon={<DirectionsWalkIcon />}
//                     sx={{ mt: 1, mb: 0.5 }}
//                   >
//                     Directions
//                   </Button>
//                 </Popup>
//               </Marker>
//             </React.Fragment>
//           );
//         })}
//       </MapContainer>
//       <div style={{ textAlign: "center", fontSize: 14, color: "#7a7a7a", marginTop: 10 }}>
//         Your location and all active helpers nearby are shown on the map. Select a helper to see details and get route directions instantly.
//       </div>
//     </div>
//   );
// }

