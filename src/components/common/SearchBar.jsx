import { useState } from "react";
import { FaSearch } from "react-icons/fa";

/**
 * SearchBar Component
 * @param {function} onSearch - Callback to handle search query updates
 */
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-kiwi-500" />
      </div>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search"
        className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-gray-900 placeholder-kiwi-500 border border-kiwi-200 focus:outline-none focus:ring-2 focus:ring-kiwi-700 transition-all"
      />
    </div>
  );
};

export default SearchBar;
