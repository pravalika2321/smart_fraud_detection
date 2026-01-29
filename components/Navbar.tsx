
import React, { useState } from 'react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', view: 'home' },
    { name: 'About Us', view: 'about' },
    { name: 'How It Works', view: 'how-it-works' },
    { name: 'Contact Us', view: 'contact' },
  ];

  return (
    <nav className="fixed w-full z-50 glass-morphism shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <i className="fas fa-shield-halved text-blue-600 text-2xl mr-2"></i>
            <span className="text-xl font-bold text-slate-800 tracking-tight">FraudGuard</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <button
                key={link.view}
                onClick={() => onNavigate(link.view)}
                className={`text-sm font-medium transition-colors ${
                  currentView === link.view ? 'text-blue-600' : 'text-slate-600 hover:text-blue-500'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => onNavigate('analyze')}
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition transform hover:scale-105"
            >
              Analyze Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-slideDown">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  onNavigate(link.view);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => {
                onNavigate('analyze');
                setIsOpen(false);
              }}
              className="w-full mt-4 bg-blue-600 text-white px-3 py-3 rounded-md text-base font-semibold"
            >
              Analyze Job Offer
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
