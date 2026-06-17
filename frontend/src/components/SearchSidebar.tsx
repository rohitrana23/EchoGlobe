import React, { useState } from 'react';
import { Search, MapPin, Globe } from 'lucide-react';

type Station = any;

interface SearchSidebarProps {
  stations: Station[];
  onSearch: (query: string) => void;
  onSelectStation: (station: Station) => void;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({ stations, onSearch, onSelectStation }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <aside className="w-80 bg-neo-pink h-full flex flex-col border-r-4 border-neo-dark z-10 relative">
      <div className="p-4 border-b-4 border-neo-dark bg-white">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <input
            type="text"
            placeholder="Search stations..."
            className="flex-1 border-2 border-neo-dark p-2 focus:outline-none focus:ring-2 focus:ring-neo-blue shadow-neo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="p-2 bg-neo-yellow border-2 border-neo-dark shadow-neo hover:shadow-neo-hover active:translate-y-1 active:translate-x-1"
          >
            <Search className="w-6 h-6 text-neo-dark" />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neo-bg">
        {stations.map(station => (
          <div 
            key={station.id}
            onClick={() => onSelectStation(station)}
            className="bg-white border-2 border-neo-dark p-3 cursor-pointer shadow-neo hover:shadow-neo-hover hover:-translate-y-1 transition-transform"
          >
            <div className="flex items-center space-x-3">
              {station.favicon ? (
                <img src={station.favicon} alt={station.name} className="w-10 h-10 border-2 border-neo-dark object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40')} />
              ) : (
                <div className="w-10 h-10 border-2 border-neo-dark bg-neo-blue flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-lg truncate" title={station.name}>{station.name}</h3>
                <div className="flex items-center text-sm text-gray-700 space-x-2 truncate">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{station.country || 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {stations.length === 0 && (
          <div className="text-center font-bold p-4 text-neo-dark border-2 border-neo-dark bg-white shadow-neo">
            No stations found.
          </div>
        )}
      </div>
    </aside>
  );
};

export default SearchSidebar;
