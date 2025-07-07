import { useState } from "react";
import Button from "./Button";

/**
 * Filter Component
 * Handles filters as buttons for larger screens and a dropdown for mobile.
 *
 * @param {string} currentFilter - The currently selected filter.
 * @param {function} onFilterChange - Callback to handle filter changes.
 */
const Filter = ({ currentFilter, onFilterChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filters = ["All", "Questions", "Experts", "Groups", "Trends"];

  return (
    <div className="flex items-center gap-2 relative">
      {/* Mobile Dropdown */}
      <div className="relative sm:hidden ml-auto">
        <button
          className="bg-kiwi-500 text-white px-4 py-2 rounded-md"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {currentFilter}
        </button>
        {isDropdownOpen && (
          <ul className="absolute right-0 bg-white shadow-lg rounded-md mt-2 z-10 w-40">
            {filters.map((filter) => (
              <li
                key={filter}
                className="px-4 py-2 text-sm hover:bg-kiwi-100 cursor-pointer"
                onClick={() => {
                  onFilterChange(filter);
                  setIsDropdownOpen(false); // Close dropdown after selection
                }}
              >
                {filter}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop Buttons */}
      <div className="hidden sm:flex flex-wrap gap-1">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={currentFilter === filter ? "kiwi" : "outline"}
            size="xs"
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Filter;
