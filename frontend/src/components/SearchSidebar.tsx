import React, { useState } from 'react';
import { Search, MapPin, Globe, Radio, X } from 'lucide-react';

type Station = any;

interface SearchSidebarProps {
  stations: Station[];
  onSearch: (query: string) => void;
  onSelectStation: (station: Station) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({
  stations,
  onSearch,
  onSelectStation,
  isOpen = true,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <aside
  className={`
    w-72 flex flex-col
    h-full max-h-full  
    bg-white
    border-[2.5px] border-black     
    rounded-xl                       
    shadow-[5px_5px_0px_0px_#000]    
    overflow-hidden           
    z-40 relative
    transition-transform duration-200
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `}
>
      {/* Header */}
      <div className="
        flex items-center justify-between
        px-4 py-3
        bg-[#FFD84D]
        border-b-[2.5px] border-black
      ">
        <span className="font-black text-sm uppercase tracking-widest">Stations</span>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="
              p-1.5
              bg-white
              border-[2px] border-black
              rounded-md
              shadow-[2px_2px_0px_0px_#000]
              hover:-translate-x-0.5 hover:-translate-y-0.5
              hover:shadow-[3px_3px_0px_0px_#000]
              active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
              transition-all duration-100
            "
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b-[2.5px] border-black bg-white">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search stations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              flex-1 min-w-0
              px-3 py-2
              bg-white
              border-[2px] border-black
              rounded-lg
              text-sm font-medium
              shadow-[2px_2px_0px_0px_#000]
              placeholder:text-black/40
              focus:outline-none focus:shadow-[3px_3px_0px_0px_#000]
              transition-shadow duration-100
            "
          />
          <button
            type="submit"
            aria-label="Search"
            className="
              p-2
              bg-black text-[#FFD84D]
              border-[2px] border-black
              rounded-lg
              shadow-[2px_2px_0px_0px_#666]
              hover:-translate-x-0.5 hover:-translate-y-0.5
              hover:shadow-[3px_3px_0px_0px_#666]
              active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
              transition-all duration-100
            "
          >
            <Search className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {/* Results count */}
      {stations.length > 0 && (
        <div className="px-4 py-2 border-b-[2px] border-black/10 bg-black/[0.03]">
          <span className="text-[11px] font-bold uppercase tracking-widest text-black/50">
            {stations.length} result{stations.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Station list */}
      <div className="flex-1 overflow-y-auto">
        {stations.length === 0 ? (
          <div className="m-3 p-4 text-center border-[2px] border-dashed border-black/30 rounded-xl">
            <Radio className="w-8 h-8 mx-auto mb-2 opacity-25" strokeWidth={1.5} />
            <p className="text-sm font-bold text-black/40">No stations found</p>
            <p className="text-xs text-black/30 mt-0.5">Try a different search</p>
          </div>
        ) : (
          <ul className="p-3 space-y-2">
            {stations.map((station) => (
              <li key={station.id}>
                <button
                  onClick={() => onSelectStation(station)}
                  className="
                    w-full text-left
                    flex items-center gap-3
                    p-2.5
                    bg-white
                    border-[2px] border-black
                    rounded-xl
                    shadow-[3px_3px_0px_0px_#000]
                    hover:-translate-x-0.5 hover:-translate-y-0.5
                    hover:shadow-[4px_4px_0px_0px_#000]
                    hover:bg-[#FFFBEA]
                    active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
                    transition-all duration-100
                    group
                  "
                >
                  <div className="
                    w-9 h-9 shrink-0
                    border-[2px] border-black
                    rounded-lg overflow-hidden
                    bg-[#FFD84D]
                    flex items-center justify-center
                  ">
                    {station.favicon ? (
                      <img
                        src={station.favicon}
                        alt={station.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.removeAttribute('hidden');
                        }}
                      />
                    ) : null}
                    <Globe className="w-4 h-4" strokeWidth={2} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate leading-tight">
                      {station.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0 text-black/40" strokeWidth={2} />
                      <span className="text-xs text-black/50 font-medium truncate">
                        {station.country || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {/* Play hint */}
                  <Radio
                    className="w-3.5 h-3.5 shrink-0 text-black/20 group-hover:text-black/60 transition-colors"
                    strokeWidth={2}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default SearchSidebar;