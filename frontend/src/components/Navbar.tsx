import React from 'react';
import { Menu, Radio, Shuffle, Globe } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
  <div className="mx-4 mt-3 pointer-events-auto">
        <div className="
          flex items-center justify-between
          px-4 py-1
          bg-[#FFD84D]
          border-[2.5px] border-black
          rounded-xl
          shadow-[5px_5px_0px_0px_#000]
        ">

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="
                p-2
                bg-white
                border-[2.5px] border-black
                rounded-lg
                shadow-[3px_3px_0px_0px_#000]
                hover:-translate-x-0.5 hover:-translate-y-0.5
                hover:shadow-[4px_4px_0px_0px_#000]
                active:translate-x-0.5 active:translate-y-0.5
                active:shadow-none
                transition-all duration-100
              "
            >
              <Menu className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <div className="w-[2px] h-7 bg-black/20 rounded-full" />

            <div className="flex items-center gap-2.5">
              <div className="
                p-1.5
                bg-black
                rounded-lg
                border-[2.5px] border-black
              ">
                <Radio className="w-4 h-4 text-[#FFD84D]" strokeWidth={2.5} />
              </div>

              <div className="leading-none">
                <h1 className="text-3xl font-extrabold color-black">
                  EchoGlobe
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="
              hidden sm:flex items-center gap-1.5
              px-3 py-1.5
              bg-black/10
              border-[2px] border-black/30
              rounded-lg
              font-bold text-xs tracking-tight
            ">
              <Globe className="w-3 h-3" strokeWidth={2.5} />
              <span>1k+ stations</span>
            </div>

            <button className="
              hidden md:flex items-center gap-2
              px-3.5 py-2
              bg-white
              border-[2.5px] border-black
              rounded-lg
              font-bold text-sm
              shadow-[3px_3px_0px_0px_#000]
              hover:-translate-x-0.5 hover:-translate-y-0.5
              hover:shadow-[4px_4px_0px_0px_#000]
              active:translate-x-0.5 active:translate-y-0.5
              active:shadow-none
              transition-all duration-100
            ">
              <Shuffle className="w-3.5 h-3.5" strokeWidth={2.5} />
              Random
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;