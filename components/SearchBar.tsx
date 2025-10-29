import React from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, value, onChange }) => {
  return (
    <div className="relative mb-6">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="w-5 h-5 text-brand-text-secondary" />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-brand-secondary text-brand-text p-3 pl-10 rounded-lg border border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue"
        aria-label="Search deliveries"
      />
    </div>
  );
};

export default SearchBar;
