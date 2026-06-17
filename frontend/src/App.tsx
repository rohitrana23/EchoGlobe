import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorldMap from './components/WorldMap';
//side bar and audio streaming componennts will be added here

function App() {
  const [stations, setStations] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:5000/api/stations/search?limit=1000').then(res => setStations(res.data));
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <WorldMap stations={stations} />
      </div>
    </div>
  );
}
export default App;