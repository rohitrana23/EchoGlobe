import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import WorldMap, { type Station } from './components/WorldMap';
import SearchSidebar from './components/SearchSidebar';
import AudioPlayer, { type AudioPlayerHandle } from './components/AudioPlayer';

function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const audioPlayerRef = useRef<AudioPlayerHandle | null>(null);

  const fetchStations = async (query = '') => {
    try {
      const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const base = /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:\/\/)/.test(rawBase)
        ? rawBase
        : `https://${rawBase.replace(/^\/+/, '')}`;
      const url = `${base.replace(/\/$/, '')}/api/stations/search?q=${query || 'music'}&limit=5000`;
      console.log('Fetching stations from:', url);
      const res = await axios.get(url);
      console.log('Stations fetch status:', res.status);
      setStations(res.data);
    } catch (error) {
      // @ts-expect-error
      const status = error?.response?.status;
      // @ts-expect-error
      const reqUrl = error?.config?.url;
      console.error('Error fetching stations', { status, reqUrl, error });
    }
  };

  useEffect(() => {
    // Log which API base we're using and verify backend health
    const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const base = /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:\/\/)/.test(rawBase)
      ? rawBase
      : `https://${rawBase.replace(/^\/+/, '')}`;
    console.log('Using API base:', base);
    (async () => {
      try {
        const healthRes = await fetch(`${base.replace(/\/$/, '')}/health`);
        console.log('Backend /health status:', healthRes.status);
      } catch (err) {
        console.error('Backend health check failed', err);
      }
      await fetchStations();
    })();
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
    audioPlayerRef.current?.playStation(randomStation);
  };

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    audioPlayerRef.current?.playStation(station);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950/95">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_45%)]" />
        <WorldMap
          stations={stations}
          selectedStationId={selectedStation?.id}
          onSelectStation={handleStationSelect}
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
            onSelectStation={handleStationSelect}
            onClose={()=>setSidebarOpen(false)}
          />
        </div>
      )}

      {selectedStation && (
        <AudioPlayer ref={audioPlayerRef} station={selectedStation} />
      )}
    </div>
  );
}
export default App;