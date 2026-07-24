import React from 'react';
import { Menu, Radio, Shuffle, Globe } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
  onRandomStation: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, onRandomStation }) => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-4 mt-3 pointer-events-auto">
        <div className="flex items-center justify-between rounded-[1rem] border-[2.5px] border-black bg-[#FFD84D] px-4 py-2.5 shadow-[5px_5px_0px_0px_#000]">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="rounded-lg border-[2.5px] border-black bg-white p-2 text-black shadow-[3px_3px_0px_0px_#000] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Menu className="h-4 w-4" strokeWidth={2} />
            </button>

            <div className="h-7 w-[2px] rounded-full bg-black/20" />

            <div className="flex items-center gap-2.5">
              <div className="rounded-lg border-[2.5px] border-black bg-black p-1.5">
                <Radio className="h-4 w-4 text-[#FFD84D]" strokeWidth={2.2} />
              </div>

              <div className="leading-none">
                <h1 className="text-xl font-black tracking-tight text-black">
                  EchoGlobe
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-lg border-[2px] border-black bg-white/80 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-black sm:flex">
              <Globe className="h-3 w-3" strokeWidth={2} />
              <span>1.5k+ stations</span>
            </div>

            <button
              onClick={onRandomStation}
              className="hidden items-center gap-2 rounded-lg border-[2.5px] border-black bg-white px-3.5 py-2 text-sm font-black text-black shadow-[3px_3px_0px_0px_#000] transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none md:flex"
            >
              <Shuffle className="h-3.5 w-3.5" strokeWidth={2} />
              Random
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;