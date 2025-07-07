import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChevronDown, 
  FaChevronUp,
  FaFire, 
  FaChartBar, 
  FaTag, 
  FaArrowUp,
  FaClock,
  FaEye,
  FaComments
} from "react-icons/fa";

// Component displaying trending discussion topics based on tag data
const TrendingDiscussions = ({ tags = [] }) => {
  const [viewMode, setViewMode] = useState("Topics");
  const [timeFilter, setTimeFilter] = useState("Today");
  const [isExpanded, setIsExpanded] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    totalQuestions: 0,
    activeUsers: 0,
    trendingScore: 0
  });

  const viewModes = ["Topics", "Tags", "Analytics"];
  const timeFilters = ["Today", "Week", "Month"];

  useEffect(() => {
    // Generate mock analytics data
    setAnalyticsData({
      totalQuestions: Math.floor(Math.random() * 500) + 100,
      activeUsers: Math.floor(Math.random() * 200) + 50,
      trendingScore: Math.floor(Math.random() * 100) + 50
    });
  }, [timeFilter]);

  const getFilteredTags = () => {
    if (!tags || tags.length === 0) return [];
    
    switch (timeFilter) {
      case "Today":
        return tags.slice(0, 3);
      case "Week":
        return tags.slice(0, 5);
      case "Month":
        return tags.slice(0, 8);
      default:
        return tags.slice(0, 3);
    }
  };

  const getDisplayCount = () => {
    return isExpanded ? getFilteredTags().length : Math.min(3, getFilteredTags().length);
  };

  const renderTopicsView = () => {
    const displayTags = getFilteredTags().slice(0, getDisplayCount());
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="topics"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {displayTags.map((tag, index) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group hover:bg-kiwi-50 rounded-lg p-3 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                                     <div className="flex items-center gap-2">
                     <FaFire className="h-4 w-4 text-orange-500" />
                     <span className="text-xs text-gray-500 font-medium">
                       Trending in {tag.category || "General"}
                     </span>
                   </div>
                  <Link
                    to={`/topics/${tag.name.toLowerCase()}`}
                    className="font-semibold text-kiwi-700 hover:text-kiwi-800 transition-colors duration-200 block mt-1"
                  >
                    #{tag.name}
                  </Link>
                                     <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                     <div className="flex items-center gap-1">
                       <FaComments className="h-3 w-3" />
                       <span>{tag.count || 0} Questions</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <FaEye className="h-3 w-3" />
                       <span>{tag.views || 0} Views</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <FaArrowUp className="h-3 w-3" />
                       <span>{tag.growth || "+0%"}</span>
                     </div>
                   </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {tag.engagement || Math.floor(Math.random() * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">engagement</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderTagsView = () => {
    const displayTags = getFilteredTags().slice(0, getDisplayCount());
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="tags"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-2"
        >
          {displayTags.map((tag, index) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
                             <Link
                 to={`/topics/${tag.name.toLowerCase()}`}
                 className="inline-flex items-center gap-2 bg-kiwi-100 hover:bg-kiwi-200 text-kiwi-700 px-3 py-2 rounded-full text-sm font-medium transition-colors duration-200"
               >
                 <FaTag className="h-3 w-3" />
                 {tag.name}
                 <span className="text-xs bg-kiwi-200 text-kiwi-800 px-2 py-0.5 rounded-full">
                   {tag.count || 0}
                 </span>
               </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderAnalyticsView = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="analytics"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Total Questions
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {analyticsData.totalQuestions}
                  </div>
                </div>
                                 <FaChartBar className="h-8 w-8 text-blue-500" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Active Users
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {analyticsData.activeUsers}
                  </div>
                </div>
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">👥</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Trending Score
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {analyticsData.trendingScore}
                  </div>
                </div>
                                 <FaArrowUp className="h-8 w-8 text-purple-500" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-4 border border-kiwi-200 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FaFire className="h-5 w-5 text-orange-500" />
          Trending Discussions
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          {isExpanded ? (
            <FaChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <FaChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </motion.button>
      </div>

      {/* View Mode Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {viewModes.map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 text-xs font-medium py-2 px-3 rounded-md transition-all duration-200 ${
              viewMode === mode
                ? "bg-white text-kiwi-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Time Filter */}
      <div className="flex items-center gap-2 mb-4">
        <FaClock className="h-4 w-4 text-gray-500" />
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-kiwi-500 focus:border-transparent"
        >
          {timeFilters.map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="min-h-[120px]">
        {viewMode === "Topics" && renderTopicsView()}
        {viewMode === "Tags" && renderTagsView()}
        {viewMode === "Analytics" && renderAnalyticsView()}
      </div>

      {/* Expand/Collapse button */}
      {getFilteredTags().length > 3 && viewMode !== "Analytics" && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 text-sm text-kiwi-700 hover:text-kiwi-800 font-medium transition-colors duration-200"
        >
          {isExpanded ? "Show Less" : `Show ${getFilteredTags().length - 3} More`}
        </motion.button>
      )}
    </motion.div>
  );
};

export default TrendingDiscussions;
