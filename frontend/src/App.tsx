import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import WorldMap from './components/WorldMap';
import SearchSidebar from './components/SearchSidebar';
import AudioPlayer from './components/AudioPlayer';

type Station = {
  id: string;
  stationuuid: string;
  name: string;
  urlResolved: string;
  favicon: string;
  tags: string;
  country: string;
  language: string;
  geoLat: number;
  geoLong: number;
};

function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchStations = async (query = '') => {
    try {
      const res = await axios.get(`http://localhost:5000/api/stations/search?q=${query || 'music'}&limit=5000`);
      setStations(res.data);
    } catch (error) {
      console.error('Error fetching stations', error);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">

      <div className="absolute inset-0 z-0">
        <WorldMap
    stations={stations}
    selectedStationId={selectedStation?.id}
    onSelectStation={setSelectedStation}
/>
      </div>

      <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {sidebarOpen && (
        <div className="absolute left-4 top-32 bottom-4 z-40">
          <SearchSidebar
            stations={stations}
            onSearch={fetchStations}
            onSelectStation={(station) => setSelectedStation(station)}
            onClose={()=>setSidebarOpen(false)}
          />
        </div>
      )}

      {selectedStation && (
        <AudioPlayer station={selectedStation} />
      )}
    </div>
  );
}

export default App;