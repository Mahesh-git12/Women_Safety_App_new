import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function TrackIncident() {
  const { incidentId } = useParams();
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    const fetchIncident = async () => {
      const res = await fetch(`http://localhost:5000/api/incidents/track/${incidentId}`);
      const data = await res.json();
      setIncident(data);
    };
    fetchIncident();

    // Optional: Poll every 10 seconds for live updates
    const interval = setInterval(fetchIncident, 10000);
    return () => clearInterval(interval);
  }, [incidentId]);

  if (!incident || !incident.latitude || !incident.longitude) return <div>Loading map...</div>;

  return (
    <div>
      <h2>Live Location</h2>
      <MapContainer center={[incident.latitude, incident.longitude]} zoom={15} style={{ height: 400, width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[incident.latitude, incident.longitude]}>
          <Popup>
            {incident.type === 'sos' ? 'SOS' : 'Incident'}<br />
            {incident.location}<br />
            {incident.description}
          </Popup>
        </Marker>
      </MapContainer>
      <p>Last updated: {new Date(incident.date).toLocaleString()}</p>
    </div>
  );
}
