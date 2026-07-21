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
  const [page, setPage] = useState(1);
  const [developerRecsOnly, setDeveloperRecsOnly] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const isDeveloperRec = (station: Station) => {
    const haystack = `${station.name || ''} ${station.tags || ''} ${station.language || ''}`.toLowerCase();
    const keywords = [
      "america's country",
      "japan hits",
      "country music",
    ];

    return keywords.some((keyword) => haystack.includes(keyword));
  };

  const filteredStations = developerRecsOnly
    ? stations.filter(isDeveloperRec)
    : stations;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredStations.length / ITEMS_PER_PAGE)
  );

  const visibleStations = filteredStations.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    onSearch(query);
  };

  return (
    <aside
      className={`
        relative z-40 flex h-full max-h-full w-72 flex-col overflow-hidden
        rounded-[1rem] border-[2.5px] border-black bg-white shadow-[5px_5px_0px_0px_#000]
        transition-transform duration-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b-[2.5px] border-black bg-[#FFD84D] px-4 py-3 text-black">
        <span className="text-sm font-black uppercase tracking-[0.24em]">
          Stations
        </span>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg border-[2px] border-black bg-white p-1.5 text-black shadow-[2px_2px_0px_0px_#000] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="border-b-[2px] border-black bg-white px-3 py-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search stations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 min-w-0 rounded-lg border-[2px] border-black bg-white px-3 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_#000] placeholder:text-black/40 focus:outline-none"
          />

          <button
            type="submit"
            aria-label="Search"
            className="rounded-lg border-[2px] border-black bg-black p-2 text-[#FFD84D] shadow-[2px_2px_0px_0px_#444] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#444] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Search className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setDeveloperRecsOnly((value) => !value);
            setPage(1);
          }}
          className={`mt-2 inline-flex items-center rounded-lg border-[2px] border-black px-2.5 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-100 ${
            developerRecsOnly
              ? 'bg-[#FFD84D] text-black shadow-[2px_2px_0px_0px_#000]'
              : 'bg-white text-black/70 shadow-[2px_2px_0px_0px_#000]'
          }`}
        >
          <Radio className="mr-1.5 h-3 w-3" strokeWidth={2.2} />
          Developer&apos;s Recs
        </button>
      </div>

      {/* Results count */}
      {filteredStations.length > 0 && (
        <div className="border-b-[2px] border-black/10 bg-black/[0.03] px-4 py-2">
          <span className="text-[11px] font-black uppercase tracking-[0.24em] text-black/60">
            {filteredStations.length} result{filteredStations.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Station list */}
      <div className="flex-1 overflow-y-auto">
        {filteredStations.length === 0 ? (
          <div className="m-3 rounded-xl border-[2px] border-dashed border-black/30 bg-white p-4 text-center">
            <Radio
              className="w-8 h-8 mx-auto mb-2 opacity-25"
              strokeWidth={1.5}
            />
            <p className="text-sm font-black text-black/40">
              {developerRecsOnly ? 'No developer recs found' : 'No stations found'}
            </p>
            <p className="mt-0.5 text-xs text-black/30">
              {developerRecsOnly ? 'Try turning the filter off' : 'Try a different search'}
            </p>
          </div>
        ) : (
          <ul className="p-3 space-y-2">
            {visibleStations.map((station) => (
              <li key={station.id}>
                <button
                  onClick={() => onSelectStation(station)}
                  className="group flex w-full items-center gap-3 rounded-xl border-[2px] border-black bg-white p-2.5 text-left shadow-[3px_3px_0px_0px_#000] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#FFFBEA] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border-[2px] border-black bg-[#FFD84D]"
                  >
                    {station.favicon ? (
  <img
    src={station.favicon}
    alt={station.name}
    className="w-full h-full object-cover"
  />
) : (
  <Globe className="w-4 h-4" />
)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-black leading-tight text-black">
                      {station.name}
                    </p>

                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin
                        className="w-3 h-3 shrink-0 text-black/40"
                        strokeWidth={2}
                      />
                      <span className="truncate text-xs font-semibold text-black/60">
                        {station.country || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <Radio
                    className="h-3.5 w-3.5 shrink-0 text-black/20 transition-colors group-hover:text-black/60"
                    strokeWidth={2}
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {stations.length > 0 && (
        <div className="flex items-center justify-between border-t-[2px] border-black bg-white px-3 py-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="
              px-3 py-1
              border-[2px]
              border-black
              rounded-md
              bg-[#FFD84D]
              font-bold
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            Prev
          </button>

          <span className="text-sm font-black text-black/70">
            {page} / {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={page === totalPages}
            className="
              px-3 py-1
              border-[2px]
              border-black
              rounded-md
              bg-[#FFD84D]
              font-bold
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            Next
          </button>
        </div>
      )}
    </aside>
  );
};

export default SearchSidebar;