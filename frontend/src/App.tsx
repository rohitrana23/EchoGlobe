import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import WorldMap from './components/WorldMap';
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
      const res = await axios.get(`http://localhost:5000/api/stations/search?q=${query || 'news'}&limit=1000`);
      setStations(res.data);
    } catch (error) {
      console.error('Error fetching stations', error);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-neo-bg">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        
        <main className="flex-1 relative border-l-4 border-neo-dark">
          <WorldMap 
            stations={stations} 
            onSelectStation={(station) => setSelectedStation(station)} 
          />
        </main>
      </div>

      {selectedStation && (
        <AudioPlayer station={selectedStation} />
      )}
    </div>
  );
}

export default App;
