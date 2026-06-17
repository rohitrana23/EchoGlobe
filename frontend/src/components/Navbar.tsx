import React from 'react';
import { Menu, Radio } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="flex items-center justify-between bg-neo-yellow border-b-4 border-neo-dark shadow-neo z-20 relative">
      <div className="flex items-center space-x-4">
        {/* <button 
          onClick={toggleSidebar}
          className="p-2 bg-white border-2 border-neo-dark shadow-neo hover:shadow-neo-hover active:translate-y-1 active:translate-x-1 transition-all"
        >
          <Menu className="w-6 h-6 text-neo-dark" />
        </button> */}
        <div className="flex items-center space-x-2">
          <Radio className="w-8 h-8 text-neo-dark" />
          <h1 className="text-2xl font-black tracking-wider text-neo-dark">EchoGlobe</h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
