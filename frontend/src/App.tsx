import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import WorldMap, { type Station } from './components/WorldMap';
import SearchSidebar from './components/SearchSidebar';
import AudioPlayer from './components/AudioPlayer';

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

  const handleRandomStation=()=>{
    if(stations.length===0) return;
    const playableStations=stations.filter((station) => station.urlResolved);
    let pool: Station[]=[];
    if(playableStations.length>0){
      pool=playableStations;
    }else{
      pool=stations;
    }
    const randomIndex=crypto.getRandomValues(new Uint32Array(1))[0] % pool.length;
    const randomStation=pool[randomIndex];
    setSelectedStation(randomStation);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <WorldMap
    stations={stations}
    selectedStationId={selectedStation?.id}
    onSelectStation={(station) => setSelectedStation(station)}
/>
      </div>

      <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onRandomStation={handleRandomStation}
        />
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