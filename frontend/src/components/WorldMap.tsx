import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

type Station = any;

// Fix for default marker icon in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Neo-Brutalism Icon
const createCustomIcon = (favicon: string | undefined) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div style="
        width: 36px; 
        height: 36px; 
        background-color: #5fff59; 
        border: 2px solid #1e1e1e; 
        box-shadow: 3px 3px 0px #1e1e1e;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      ">
        ${favicon ? `<img src="${favicon}" onerror="this.style.display='none'" style="width:100%;height:100%;object-fit:cover;" />` : '<div style="font-weight:bold;">R</div>'}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

interface WorldMapProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ stations, onSelectStation }) => {
  const validStations = useMemo(() => {
    return stations.filter(s => s.geoLat != null && s.geoLong != null && !isNaN(s.geoLat) && !isNaN(s.geoLong));
  }, [stations]);

  return (
    <div className="h-full w-full bg-neo-bg">
      <MapContainer 
        center={[20, 0]} 
        zoom={3} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        {/* We can use react-leaflet-cluster for clustering markers */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
        >
          {validStations.map(station => (
            <Marker 
              key={station.id} 
              position={[station.geoLat, station.geoLong]}
              icon={createCustomIcon(station.favicon)}
              eventHandlers={{
                click: () => onSelectStation(station),
              }}
            >
              <Popup className="neo-popup">
                <div className="p-2">
                  <h3 className="font-bold text-lg border-b-2 border-neo-dark mb-2 pb-1">{station.name}</h3>
                  <p className="text-sm"><strong>Country:</strong> {station.country || 'Unknown'}</p>
                  <p className="text-sm"><strong>Language:</strong> {station.language || 'Unknown'}</p>
                  <button 
                    onClick={() => onSelectStation(station)}
                    className="mt-3 w-full bg-neo-blue border-2 border-neo-dark py-1 font-bold shadow-neo hover:shadow-neo-hover active:translate-y-1 active:translate-x-1"
                  >
                    Play Station
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      
      {/* Small inject of custom css for map popup to look brutalist */}
      <style>{`
        .leaflet-popup-content-wrapper {
          border: 3px solid #1e1e1e !important;
          border-radius: 0 !important;
          box-shadow: 4px 4px 0px #1e1e1e !important;
          background-color: #fdf6e3 !important;
          padding: 0 !important;
        }
        .leaflet-popup-tip-container {
          display: none !important;
        }
        .map-tiles {
          filter: grayscale(20%) contrast(1.1) brightness(1.1);
        }
      `}</style>
    </div>
  );
};

export default WorldMap;
