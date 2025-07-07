import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import Sidebar from "../components/common/Sidebar";
import QuestionCard from "../components/feed/QuestionCard";
import {
  searchAll, 
  getSearchSuggestions,
  debouncedSearchAll,
  getTrendingTags,
  searchQuestions,
  searchUsers,
  searchCommunities
} from "../utils/api";
import { toast } from "react-toastify";

const SearchPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState({ questions: [], users: [], communities: [], suggestions: {} });
  const [suggestions, setSuggestions] = useState({ questions: [], tags: [], users: [], communities: [] });
  const [loading, setLoading] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [dateRange, setDateRange] = useState(searchParams.get('date') || 'all');
  const [hasAnswer, setHasAnswer] = useState(searchParams.get('answered') || 'all');
  const [minVotes, setMinVotes] = useState(parseInt(searchParams.get('votes')) || 0);
  const [selectedTags, setSelectedTags] = useState(searchParams.get('tags')?.split(',').filter(Boolean) || []);
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [trendingTags, setTrendingTags] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  
  // Refs
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load trending tags and search history
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [tags, history] = await Promise.all([
          getTrendingTags(7, 15),
          Promise.resolve(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
        ]);
        setTrendingTags(tags);
        setSearchHistory(history.slice(0, 10)); // Keep last 10 searches
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };
    loadInitialData();
  }, []);

  // Perform search when query or filters change
  useEffect(() => {
    if (query.trim()) {
      performSearch();
      updateURL();
    } else {
      setResults({ questions: [], users: [], communities: [], suggestions: {} });
    }
  }, [query, activeTab, sortBy, dateRange, hasAnswer, minVotes, selectedTags]);

  // Get search suggestions
  useEffect(() => {
    if (query.length >= 2) {
      getSuggestions();
    } else {
      setSuggestions({ questions: [], tags: [], users: [] });
    }
  }, [query]);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (activeTab !== 'all') params.set('tab', activeTab);
    if (sortBy !== 'relevance') params.set('sort', sortBy);
    if (dateRange !== 'all') params.set('date', dateRange);
    if (hasAnswer !== 'all') params.set('answered', hasAnswer);
    if (minVotes > 0) params.set('votes', minVotes.toString());
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    
    setSearchParams(params);
  }, [query, activeTab, sortBy, dateRange, hasAnswer, minVotes, selectedTags, setSearchParams]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      let searchResults;
      
      if (activeTab === 'questions') {
        const result = await searchQuestions({
          query,
          tags: selectedTags.join(','),
          sortBy,
          dateRange,
          hasAnswer: hasAnswer !== 'all' ? hasAnswer : undefined,
          minVotes: minVotes > 0 ? minVotes : undefined,
          limit: 20
        });
        searchResults = { questions: result.data, users: [], communities: [], suggestions: {} };
      } else if (activeTab === 'users') {
        const result = await searchUsers({ query, limit: 20 });
        searchResults = { questions: [], users: result.data, communities: [], suggestions: {} };
      } else if (activeTab === 'communities') {
        const result = await searchCommunities(query, { limit: 20, sortBy });
        searchResults = { questions: [], users: [], communities: result?.data || [], suggestions: {} };
      } else {
        searchResults = await searchAll(query, { sortBy, limit: 15 });
      }

      // Ensure results always have the expected structure
      const safeResults = {
        questions: searchResults?.questions || [],
        users: searchResults?.users || [],
        communities: searchResults?.communities || [],
        suggestions: searchResults?.suggestions || {}
      };
      
      setResults(safeResults);
      
      // Save to search history
      saveToHistory(query);
      
    } catch (err) {
      setError(err.message || 'Search failed');
      toast.error('Search failed. Please try again.');
      // Set safe empty results on error
      setResults({ questions: [], users: [], communities: [], suggestions: {} });
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async () => {
    try {
      setSuggestionLoading(true);
      const results = await getSearchSuggestions(query, 8);
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
      setSuggestionLoading(false);
    }
  };

  const saveToHistory = (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const newHistory = [searchQuery, ...history.filter(h => h !== searchQuery)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setSearchHistory(newHistory);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      performSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const clearAllFilters = () => {
    setSortBy('relevance');
    setDateRange('all');
    setHasAnswer('all');
    setMinVotes(0);
    setSelectedTags([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabOptions = [
    { key: 'all', label: 'All', count: (results?.questions?.length || 0) + (results?.users?.length || 0) + (results?.communities?.length || 0) },
    { key: 'questions', label: 'Questions', count: results?.questions?.length || 0 },
    { key: 'users', label: 'Users', count: results?.users?.length || 0 },
    { key: 'communities', label: 'Communities', count: results?.communities?.length || 0 }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'most_votes', label: 'Most Votes' },
    { value: 'most_answers', label: 'Most Answers' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const answerOptions = [
    { value: 'all', label: 'All Questions' },
    { value: 'true', label: 'Has Answers' },
    { value: 'false', label: 'No Answers' },
    { value: 'accepted', label: 'Accepted Answer' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                Search
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Find questions, answers, experts, and communities
              </p>
            </div>
            
            {/* Quick Stats */}
            {query && !loading && (
              <div className="text-sm text-gray-600">
                Found {(results?.questions?.length || 0) + (results?.users?.length || 0) + (results?.communities?.length || 0)} results
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-6">
          <div className="relative max-w-4xl mx-auto" ref={suggestionsRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search questions, users, communities, topics..."
                  className="w-full pl-12 pr-16 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-kiwi-500 focus:border-transparent shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute inset-y-0 right-12 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-kiwi-600 hover:text-kiwi-700"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && (query.length >= 2 || searchHistory.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                >
                  {query.length >= 2 ? (
                    <>
                      {/* Live Suggestions */}
                      {suggestions.questions && suggestions.questions.length > 0 && (
                        <div className="p-3 border-b border-gray-100">
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Questions</h4>
                          {suggestions.questions.slice(0, 3).map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {suggestions.tags && suggestions.tags.length > 0 && (
                        <div className="p-3 border-b border-gray-100">
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-1">
                            {suggestions.tags.slice(0, 6).map((tag, index) => (
                              <button
                                key={index}
                                onClick={() => addTag(tag)}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {suggestions.users && suggestions.users.length > 0 && (
                        <div className="p-3 border-b border-gray-100">
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Users</h4>
                          {suggestions.users.slice(0, 3).map((user, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(user)}
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                            >
                              {user}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {suggestions.communities && suggestions.communities.length > 0 && (
                        <div className="p-3">
                          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Communities</h4>
                          {suggestions.communities.slice(0, 3).map((community, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(community)}
                              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-kiwi-600">🏛️</span>
                                {community}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Search History */
                    searchHistory.length > 0 && (
                      <div className="p-3">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Recent Searches</h4>
                        {searchHistory.map((historyItem, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(historyItem)}
                            className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                          >
                            <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {historyItem}
                          </button>
                        ))}
                      </div>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Tags */}
          {trendingTags.length > 0 && !query && (
            <div className="max-w-4xl mx-auto mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Trending Tags</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTags.slice(0, 10).map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => addTag(tag.name)}
                    className="px-3 py-1 text-sm bg-kiwi-100 text-kiwi-800 rounded-full hover:bg-kiwi-200 transition"
                  >
                    #{tag.name} ({tag.count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters and Results */}
        {query && (
          <div className="px-6 pb-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {showFilters ? 'Hide' : 'Show'} Advanced
                  </button>
                  {(sortBy !== 'relevance' || dateRange !== 'all' || hasAnswer !== 'all' || minVotes > 0 || selectedTags.length > 0) && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-4">
                {tabOptions.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                      activeTab === tab.key
                        ? 'bg-kiwi-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 border-t border-gray-200 pt-4"
                  >
                    {/* Sort and Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kiwi-500"
                        >
                          {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                        <select
                          value={dateRange}
                          onChange={(e) => setDateRange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kiwi-500"
                        >
                          {dateOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Answers</label>
                        <select
                          value={hasAnswer}
                          onChange={(e) => setHasAnswer(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kiwi-500"
                        >
                          {answerOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Votes</label>
                        <input
                          type="number"
                          min="0"
                          value={minVotes}
                          onChange={(e) => setMinVotes(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kiwi-500"
                        />
                      </div>
                    </div>

                    {/* Selected Tags */}
                    {selectedTags.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Selected Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-3 py-1 text-sm bg-kiwi-100 text-kiwi-800 rounded-full"
                            >
                              #{tag}
                              <button
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-kiwi-600 hover:text-kiwi-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kiwi-700 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Error</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={performSearch}
                  className="bg-kiwi-700 text-white px-6 py-3 rounded-lg hover:bg-kiwi-800 transition"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Questions Results */}
                {(activeTab === 'all' || activeTab === 'questions') && results?.questions && results.questions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Questions ({results.questions.length})
                    </h3>
                    <div className="space-y-4">
                      {results.questions.map((question) => (
                        <motion.div
                          key={question.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                          <QuestionCard question={question} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Users Results */}
                {(activeTab === 'all' || activeTab === 'users') && results?.users && results.users.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Users ({results.users.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.users.map((user) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <Link to={`/profile/${user.id}`} className="block">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-kiwi-100 rounded-full flex items-center justify-center">
                                <span className="text-kiwi-700 font-semibold">
                                  {user.name?.charAt(0) || user.username?.charAt(0) || '?'}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {user.name || user.username}
                                </h4>
                                {user.handle && (
                                  <p className="text-sm text-gray-600">{user.handle}</p>
                                )}
                                {user.institution && (
                                  <p className="text-xs text-gray-500 truncate">{user.institution}</p>
                                )}
                              </div>
                            </div>
                            {user.expertise && (
                              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{user.expertise}</p>
                            )}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Communities Results */}
                {(activeTab === 'all' || activeTab === 'communities') && results?.communities && results.communities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Communities ({results.communities.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.communities.map((community) => (
                        <motion.div
                          key={community.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <Link to={`/communities/${community.id}`} className="block">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-purple-600 text-xl">🏛️</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {community.name}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {community.description}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      👥 {community.members} members
                                    </span>
                                  </div>
                                  {community.category && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      {community.category}
                                    </span>
                                  )}
                                </div>
                                {community.isJoined && (
                                  <div className="mt-2">
                                    <span className="text-xs bg-kiwi-100 text-kiwi-700 px-2 py-1 rounded-full">
                                      ✓ Joined
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {!loading && (!results?.questions || results.questions.length === 0) && (!results?.users || results.users.length === 0) && (!results?.communities || results.communities.length === 0) && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      We couldn't find anything matching your search. Try different keywords or remove some filters.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => setQuery('')}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                      >
                        Clear Search
                      </button>
                      <button
                        onClick={clearAllFilters}
                        className="bg-kiwi-700 text-white px-4 py-2 rounded-lg hover:bg-kiwi-800 transition"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="px-6 pb-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start Your Search
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Search through thousands of questions and connect with experts in your field.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/ask">
                  <button className="bg-kiwi-700 text-white px-6 py-3 rounded-lg hover:bg-kiwi-800 transition">
                    Ask a Question
                  </button>
                </Link>
                <Link to="/trending">
                  <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition">
                    View Trending
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
