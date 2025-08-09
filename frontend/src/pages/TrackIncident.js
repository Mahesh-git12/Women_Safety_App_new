import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function TrackIncident() {
  const { incidentId } = useParams();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/incidents/track-location/${incidentId}`);
        setLocation(res.data.latestLocation);
        setError('');
      } catch (err) {
        setError('No location available yet. Waiting for updates...');
      }
    };
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, [incidentId]);

  if (error) return <div style={{ textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!location) return <div style={{ textAlign: 'center', marginTop: 40 }}>Waiting for location...</div>;

  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h2>Live Location</h2>
      <p><strong>Latitude:</strong> {location.latitude}</p>
      <p><strong>Longitude:</strong> {location.longitude}</p>
      <p><strong>Last updated:</strong> {new Date(location.updatedAt).toLocaleString()}</p>
    </div>
  );
}

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// export default function TrackIncident() {
//   const { incidentId } = useParams();
//   const [location, setLocation] = useState(null);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchLocation = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/api/incidents/track-location/${incidentId}`);
//         setLocation(res.data.latestLocation);
//         setError('');
//       } catch (err) {
//         setError('No location available yet. Waiting for updates...');
//       }
//     };
//     fetchLocation();
//     const interval = setInterval(fetchLocation, 5000);
//     return () => clearInterval(interval);
//   }, [incidentId]);

//   if (error) return <div style={{ textAlign: 'center', marginTop: 40 }}>{error}</div>;
//   if (!location) return <div style={{ textAlign: 'center', marginTop: 40 }}>Waiting for location...</div>;

//   return (
//     <div style={{ textAlign: 'center', marginTop: 40 }}>
//       <h2>Live Location</h2>
//       <p><strong>Latitude:</strong> {location.latitude}</p>
//       <p><strong>Longitude:</strong> {location.longitude}</p>
//       <p><strong>Last updated:</strong> {new Date(location.updatedAt).toLocaleString()}</p>
//     </div>
//   );
// }
