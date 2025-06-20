import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function IncidentsMap({ incidents }) {
  const validIncidents = incidents.filter(i => i.latitude && i.longitude);
  const defaultPosition = validIncidents.length
    ? [validIncidents[0].latitude, validIncidents[0].longitude]
    : [20.5937, 78.9629]; // fallback: India

  return (
    <MapContainer center={defaultPosition} zoom={5} style={{ height: "350px", width: "100%", marginBottom: 24, borderRadius: 16 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validIncidents.map((incident) => (
        <Marker key={incident._id} position={[incident.latitude, incident.longitude]}>
          <Popup>
            <strong>{incident.type === 'sos' ? 'SOS' : 'Incident'}</strong><br />
            {incident.location}<br />
            {incident.description}<br />
            {new Date(incident.date).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
