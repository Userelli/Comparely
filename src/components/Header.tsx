import React from 'react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#0056b3] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">COMPARELY</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-700 hover:text-[#0056b3] transition-colors">Home</a>
          <a href="#" className="text-gray-700 hover:text-[#0056b3] transition-colors">How It Works</a>
          <a href="#" className="text-gray-700 hover:text-[#0056b3] transition-colors">Pricing</a>
          <a href="#" className="text-gray-700 hover:text-[#0056b3] transition-colors">About Us</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-700">
            Log In
          </Button>
          <select className="bg-transparent border-none text-gray-700 text-sm">
            <option>EN</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
