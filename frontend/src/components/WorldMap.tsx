import React, { useMemo } from 'react';
import "./worldMap.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export interface Station {
  id: string;
  stationuuid?: string;
  name: string;
  urlResolved?: string;
  favicon?: string;
  tags?: string;
  country?: string;
  language?: string;
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
const iconCache = new Map<string, L.DivIcon>();
const getStationIcon = (
  favicon?: string,
  selected = false
) => {
  const imageUrl =
    favicon && favicon.trim().length > 0
      ? favicon
      : 'https://placehold.co/36x36?text=R';

  const cacheKey = `${imageUrl}|${selected}`;

  if (!iconCache.has(cacheKey)) {
    iconCache.set(
      cacheKey,
      L.divIcon({
        className: '',
        html: `
<div class="${selected ? 'marker-selected' : 'marker'}">
  <img
    src="${imageUrl}"
    onerror="this.src='https://placehold.co/36x36?text=R'"
  />
</div>
`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })
    );
  }

  return iconCache.get(cacheKey)!;
};

interface WorldMapProps {
  stations: Station[];
  selectedStationId?: string;
  onSelectStation: (station: Station) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({
  stations,
  selectedStationId,
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
        zoom={2}
        style={{ height: "100%", width:"100%" }}
        maxBounds={[
        [-90, -180],
        [90, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
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
              icon={getStationIcon(
              station.favicon,
              station.id === selectedStationId
            )}
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