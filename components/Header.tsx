import React, { useState, useEffect, useRef } from 'react';
// Fix: Removed v9 'signOut' import
import { auth } from '../services/firebase';
import { BoxIcon, UsersIcon, UserIcon, ChevronDownIcon, LogOutIcon } from './icons';
import { AppUser } from '../types';

interface HeaderProps {
  user: AppUser | null;
  currentView: 'deliveries' | 'staff';
  onViewChange: (view: 'deliveries' | 'staff') => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentView, onViewChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      // Fix: Use signOut method from auth instance
      await auth.signOut();
    } catch (error) {
      console.error('Logout failed', error);
      alert('Failed to log out. Please try again.');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navButtonClasses = (view: 'deliveries' | 'staff') => 
    `flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-opacity-50 ${
      currentView === view 
        ? 'bg-brand-secondary text-brand-blue shadow-md' 
        : 'hover:bg-gray-200/50 text-brand-text-secondary'
    }`;

  return (
    <header className="bg-brand-secondary border-b border-brand-accent p-4 flex justify-between items-center sticky top-0 z-20">
      {/* Left Section: Logo and Title */}
      <div className="flex items-center gap-3">
        <img src="https://www.sardartvpvtltd.com/wp-content/uploads/2025/02/SARDAR-TV-LOGO-1980x929.png" className="h-10" alt="Sardar TV Logo"/>
        <h1 className="text-xl font-bold text-brand-text hidden sm:block">Sardar TV Staff Portal</h1>
      </div>

      {/* Center Section: Navigation */}
      <nav className="flex items-center gap-2 bg-brand-primary p-1 rounded-xl">
        <button onClick={() => onViewChange('deliveries')} className={navButtonClasses('deliveries')}>
          <BoxIcon className="w-4 h-5" />
          <span className="font-semibold text-sm">Deliveries</span>
        </button>
        <button onClick={() => onViewChange('staff')} className={navButtonClasses('staff')}>
          <UsersIcon className="w-4 h-5" />
          <span className="font-semibold text-sm">Staff</span>
        </button>
      </nav>

      {/* Right Section: User Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-accent transition-colors duration-200"
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold">
            {user?.email?.charAt(0).toUpperCase() ?? <UserIcon className="w-5 h-5"/>}
          </div>
          <span className="hidden md:block font-semibold text-sm text-brand-text">{user?.email}</span>
          <ChevronDownIcon className={`w-5 h-5 text-brand-text-secondary transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-brand-secondary rounded-lg shadow-xl py-1 z-30 border border-brand-accent">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-brand-red hover:bg-red-50 transition-colors duration-200"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;