'use client';
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, handleSearch }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <>
      <input 
        type="text" 
        placeholder="Search employees..." 
        value={searchTerm}
        onKeyDown={handleKeyPress}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-80 border rounded px-2 py-1"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
    </>
  );
};

export default SearchBar;
