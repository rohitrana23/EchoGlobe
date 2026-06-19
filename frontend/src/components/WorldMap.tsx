import React, { useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Station {
  id: string;
  name: string;
  country?: string;
  language?: string;
  favicon?: string;
  geoLat: number;
  geoLong: number;
}

// Fix default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Single reusable icon
const stationIcon = L.divIcon({
  className: 'custom-icon',
  html: `
    <div style="
      width:36px;
      height:36px;
      background:#5fff59;
      border:2px solid #1e1e1e;
      box-shadow:3px 3px 0px #1e1e1e;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:bold;
      overflow:hidden;
    ">
      R
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

interface WorldMapProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({
  stations,
  onSelectStation,
}) => {
  const validStations = useMemo(() => {
    return stations.filter(
      (station) =>
        station.geoLat != null &&
        station.geoLong != null &&
        !isNaN(station.geoLat) &&
        !isNaN(station.geoLong)
    );
  }, [stations]);

  return (
    <div className="h-full w-full bg-neo-bg">
      <MapContainer
        center={[20, 0]}
        zoom={3}
        scrollWheelZoom
        style={{
          height: '100%',
          width: '100%',
          zIndex: 0,
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={40}
          removeOutsideVisibleBounds
          spiderfyOnMaxZoom={false}
          showCoverageOnHover={false}
        >
          {validStations.map((station) => (
            <Marker
              key={station.id}
              position={[station.geoLat, station.geoLong]}
              icon={stationIcon}
              eventHandlers={{
                click: () => onSelectStation(station),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg border-b-2 border-neo-dark mb-2 pb-1">
                    {station.name}
                  </h3>

                  <p className="text-sm">
                    <strong>Country:</strong>{' '}
                    {station.country || 'Unknown'}
                  </p>

                  <p className="text-sm">
                    <strong>Language:</strong>{' '}
                    {station.language || 'Unknown'}
                  </p>

                  <button
                    onClick={() => onSelectStation(station)}
                    className="
                      mt-3
                      w-full
                      bg-neo-blue
                      border-2
                      border-neo-dark
                      py-1
                      font-bold
                      shadow-neo
                      hover:shadow-neo-hover
                      active:translate-y-1
                      active:translate-x-1
                    "
                  >
                    Play Station
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default WorldMap;