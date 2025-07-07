import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getSearchSuggestions, getTrendingTags } from "../../utils/api";

const EnhancedSearchBar = ({ 
  placeholder = "Search questions, users, communities, topics...",
  size = "default", // "small", "default", "large"
  showFilters = false,
  onSearch,
  className = "",
  autoFocus = false,
  showHistory = true,
  showSuggestions = true
}) => {
  const navigate = useNavigate();
  
  // State
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState({ questions: [], tags: [], users: [], communities: [] });
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Refs
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  
  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [history, tags] = await Promise.all([
          Promise.resolve(JSON.parse(localStorage.getItem('searchHistory') || '[]')),
          getTrendingTags(7, 10)
        ]);
        setSearchHistory(history.slice(0, 8));
        setTrendingTags(tags);
      } catch (error) {
        console.error('Failed to load search data:', error);
      }
    };
    loadInitialData();
  }, []);
  
  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Get suggestions with debouncing
  const getSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions({ questions: [], tags: [], users: [], communities: [] });
      return;
    }
    
    try {
      setLoading(true);
      const results = await getSearchSuggestions(searchQuery, 6);
      // Ensure all expected properties exist with default values
      setSuggestions({
        questions: results.questions || [],
        tags: results.tags || [],
        users: results.users || [],
        communities: results.communities || []
      });
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      // Set empty arrays on error
      setSuggestions({ questions: [], tags: [], users: [], communities: [] });
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Debounced suggestion fetching
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (showSuggestions) {
      debounceRef.current = setTimeout(() => {
        getSuggestions(query);
      }, 300);
    }
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, getSuggestions, showSuggestions]);
  
  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch(query);
  };
  
  const performSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    // Save to history
    saveToHistory(searchQuery);
    
    // Hide suggestions
    setShowSuggestionsDropdown(false);
    
    // Call parent callback or navigate
    if (onSearch) {
      onSearch(searchQuery, selectedFilter);
    } else {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (selectedFilter !== 'all') {
        params.set('tab', selectedFilter);
      }
      navigate(`/search?${params.toString()}`);
    }
  };
  
  const saveToHistory = (searchQuery) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newHistory = [searchQuery, ...history.filter(h => h !== searchQuery)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setSearchHistory(newHistory.slice(0, 8));
  };
  
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };
  
  const handleTagClick = (tag) => {
    const tagQuery = `#${tag}`;
    setQuery(tagQuery);
    performSearch(tagQuery);
  };
  
  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestionsDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Size classes
  const sizeClasses = {
    small: "text-sm py-2 px-3 pl-10 pr-8",
    default: "text-base py-3 px-4 pl-12 pr-16",
    large: "text-lg py-4 px-6 pl-14 pr-20"
  };
  
  const iconSizes = {
    small: "h-4 w-4",
    default: "h-5 w-5", 
    large: "h-6 w-6"
  };
  
  const iconPositions = {
    small: "left-3",
    default: "left-4",
    large: "left-5"
  };
  
  const clearPositions = {
    small: "right-8",
    default: "right-12",
    large: "right-16"
  };
  
  const buttonPositions = {
    small: "right-1",
    default: "right-2",
    large: "right-3"
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'questions', label: 'Questions' },
    { value: 'users', label: 'Users' },
    { value: 'communities', label: 'Communities' },
    { value: 'tags', label: 'Tags' }
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestionsDropdown(true)}
              placeholder={placeholder}
              className={`w-full border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-kiwi-500 focus:border-transparent shadow-sm ${sizeClasses[size]} ${showFilters ? 'rounded-l-xl' : 'rounded-xl'}`}
            />
            
            {/* Search Icon */}
            <div className={`absolute inset-y-0 ${iconPositions[size]} flex items-center`}>
              <svg className={`${iconSizes[size]} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className={`absolute inset-y-0 ${clearPositions[size]} flex items-center text-gray-400 hover:text-gray-600`}
              >
                <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* Search Button */}
            <button
              type="submit"
              className={`absolute inset-y-0 ${buttonPositions[size]} flex items-center text-kiwi-600 hover:text-kiwi-700`}
            >
              <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          
          {/* Filter Dropdown */}
          {showFilters && (
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className={`border-l-0 border-gray-300 rounded-r-xl focus:ring-2 focus:ring-kiwi-500 focus:border-transparent bg-white ${sizeClasses[size].replace('pl-12 pr-16', 'px-4')}`}
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </form>
      
      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestionsDropdown && (query.length >= 2 || (showHistory && searchHistory.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {loading && query.length >= 2 && (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-kiwi-600 mx-auto"></div>
              </div>
            )}
            
            {!loading && (
              <>
                {query.length >= 2 ? (
                  <>
                    {/* Live Suggestions */}
                    {suggestions.questions && suggestions.questions.length > 0 && (
                      <div className="p-3 border-b border-gray-100">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          📝 Questions
                        </h4>
                        {suggestions.questions.slice(0, 3).map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded transition"
                          >
                            <span className="line-clamp-1">{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {suggestions.tags && suggestions.tags.length > 0 && (
                      <div className="p-3 border-b border-gray-100">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          🏷️ Tags
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {suggestions.tags.slice(0, 6).map((tag, index) => (
                            <button
                              key={index}
                              onClick={() => handleTagClick(tag)}
                              className="px-2 py-1 text-xs bg-kiwi-100 text-kiwi-700 rounded hover:bg-kiwi-200 transition"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {suggestions.users && suggestions.users.length > 0 && (
                      <div className="p-3 border-b border-gray-100">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          👥 Users
                        </h4>
                        {suggestions.users.slice(0, 3).map((user, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(user)}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded transition"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {user.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="line-clamp-1">{user}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {suggestions.communities && suggestions.communities.length > 0 && (
                      <div className="p-3">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          🏛️ Communities
                        </h4>
                        {suggestions.communities.slice(0, 3).map((community, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(community)}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded transition"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                                <span className="text-xs text-purple-600">🏛️</span>
                              </div>
                              <span className="line-clamp-1">{community}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* Search History and Trending */
                  <div className="p-3">
                    {showHistory && searchHistory.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          🕒 Recent Searches
                        </h4>
                        {searchHistory.map((historyItem, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(historyItem)}
                            className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded transition"
                          >
                            <svg className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="line-clamp-1">{historyItem}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {trendingTags.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          🔥 Trending Tags
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {trendingTags.slice(0, 8).map((tag, index) => (
                            <button
                              key={index}
                              onClick={() => handleTagClick(tag.name)}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                            >
                              #{tag.name} ({tag.count})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* No results */}
                {query.length >= 2 && !loading && 
                 (!suggestions.questions || suggestions.questions.length === 0) && 
                 (!suggestions.tags || suggestions.tags.length === 0) && 
                 (!suggestions.users || suggestions.users.length === 0) && 
                 (!suggestions.communities || suggestions.communities.length === 0) && (
                  <div className="p-4 text-center text-gray-500">
                    <div className="text-2xl mb-2">🔍</div>
                    <p className="text-sm">No suggestions found</p>
                    <p className="text-xs">Try different keywords</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearchBar; 