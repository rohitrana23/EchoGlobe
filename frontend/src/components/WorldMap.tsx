import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

const WorldMap = ({ stations }: { stations: { id: string | number; geoLat: number; geoLong: number; name: string }[] }) => {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup>
        {stations.map(station => (
           <Marker key={station.id} position={[station.geoLat, station.geoLong]}>
             <Popup>{station.name}</Popup>
           </Marker>        
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};
export default WorldMap;