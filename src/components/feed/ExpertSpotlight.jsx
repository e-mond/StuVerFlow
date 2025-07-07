import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChevronDown, 
  FaChevronUp,
  FaStar, 
  FaTrophy, 
  FaFire, 
  FaGraduationCap,
  FaClock,
  FaUser,
  FaChartBar,
  FaStar as FaSparkles,
  FaCheckCircle
} from "react-icons/fa";

// Component displaying a spotlight of academic experts
const ExpertSpotlight = ({ experts = [] }) => {
  const [viewMode, setViewMode] = useState("Featured");
  const [timeFilter, setTimeFilter] = useState("Week");
  const [isExpanded, setIsExpanded] = useState(false);
  const [expertData, setExpertData] = useState([]);

  const viewModes = ["Featured", "Trending", "Achievements"];
  const timeFilters = ["Week", "Month", "Quarter"];

  useEffect(() => {
    // Enhanced expert data with levels and achievements
    const enhancedExperts = experts.map(expert => ({
      ...expert,
      level: getExpertLevel(expert.reputation || 0),
      achievements: generateAchievements(expert),
      trendingScore: Math.floor(Math.random() * 100) + 50,
      recentAnswers: Math.floor(Math.random() * 20) + 5,
      helpfulVotes: Math.floor(Math.random() * 100) + 20,
      specialties: expert.specialties || [expert.course || "General"],
      responseTime: Math.floor(Math.random() * 60) + 10 + " min",
      badge: getExpertBadge(expert.reputation || 0)
    }));
    setExpertData(enhancedExperts);
  }, [experts, timeFilter]);

  const getExpertLevel = (reputation) => {
    if (reputation >= 1000) return { name: "Master", color: "text-purple-600", icon: "🎯" };
    if (reputation >= 500) return { name: "Expert", color: "text-blue-600", icon: "🏆" };
    if (reputation >= 200) return { name: "Advanced", color: "text-green-600", icon: "⭐" };
    if (reputation >= 50) return { name: "Skilled", color: "text-yellow-600", icon: "🌟" };
    return { name: "Rising", color: "text-gray-600", icon: "🌱" };
  };

  const getExpertBadge = (reputation) => {
    if (reputation >= 1000) return { name: "Platinum Expert", color: "bg-purple-100 text-purple-800" };
    if (reputation >= 500) return { name: "Gold Expert", color: "bg-yellow-100 text-yellow-800" };
    if (reputation >= 200) return { name: "Silver Expert", color: "bg-gray-100 text-gray-800" };
    return { name: "Bronze Expert", color: "bg-orange-100 text-orange-800" };
  };

  const generateAchievements = (expert) => {
    const achievements = [];
    const reputation = expert.reputation || 0;
    
    if (reputation >= 100) achievements.push({ name: "Helpful Helper", icon: "🤝", color: "text-green-600" });
    if (reputation >= 300) achievements.push({ name: "Knowledge Guru", icon: "📚", color: "text-blue-600" });
    if (reputation >= 500) achievements.push({ name: "Solution Master", icon: "💡", color: "text-yellow-600" });
    if (reputation >= 1000) achievements.push({ name: "Academic Legend", icon: "🏛️", color: "text-purple-600" });
    
    return achievements;
  };

  const getFilteredExperts = () => {
    if (!expertData || expertData.length === 0) return [];
    
    let filtered = [...expertData];
    
    switch (viewMode) {
      case "Featured":
        filtered = filtered.sort((a, b) => (b.reputation || 0) - (a.reputation || 0));
        break;
      case "Trending":
        filtered = filtered.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
        break;
      case "Achievements":
        filtered = filtered.sort((a, b) => (b.achievements?.length || 0) - (a.achievements?.length || 0));
        break;
    }
    
    switch (timeFilter) {
      case "Week":
        return filtered.slice(0, 3);
      case "Month":
        return filtered.slice(0, 5);
      case "Quarter":
        return filtered.slice(0, 8);
      default:
        return filtered.slice(0, 3);
    }
  };

  const getDisplayCount = () => {
    return isExpanded ? getFilteredExperts().length : Math.min(3, getFilteredExperts().length);
  };

  const renderFeaturedView = () => {
    const displayExperts = getFilteredExperts().slice(0, getDisplayCount());
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="featured"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {displayExperts.map((expert, index) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group hover:bg-kiwi-50 rounded-lg p-4 transition-colors duration-200 border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-kiwi-400 to-kiwi-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {expert.name?.charAt(0)?.toUpperCase() || "E"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/profile/${expert.id}`}
                      className="font-semibold text-kiwi-700 hover:text-kiwi-800 transition-colors duration-200"
                    >
                      {expert.name}
                    </Link>
                    <span className={`text-xs px-2 py-1 rounded-full ${expert.badge.color}`}>
                      {expert.badge.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm">{expert.level.icon}</span>
                    <span className={`text-sm font-medium ${expert.level.color}`}>
                      {expert.level.name}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{expert.title}</span>
                  </div>
                                     <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                     <div className="flex items-center gap-1">
                       <FaTrophy className="h-3 w-3" />
                       <span>{expert.reputation || 0} rep</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <FaChartBar className="h-3 w-3" />
                       <span>{expert.recentAnswers} answers</span>
                     </div>
                     <div className="flex items-center gap-1">
                       <FaClock className="h-3 w-3" />
                       <span>{expert.responseTime}</span>
                     </div>
                   </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {expert.specialties?.slice(0, 2).map((specialty, i) => (
                      <span
                        key={i}
                        className="text-xs bg-kiwi-100 text-kiwi-700 px-2 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderTrendingView = () => {
    const displayExperts = getFilteredExperts().slice(0, getDisplayCount());
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="trending"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {displayExperts.map((expert, index) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                      {expert.name?.charAt(0)?.toUpperCase() || "E"}
                    </div>
                                         <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                       <FaFire className="h-2 w-2 text-white" />
                     </div>
                  </div>
                  <div>
                    <Link
                      to={`/profile/${expert.id}`}
                      className="font-semibold text-gray-900 hover:text-kiwi-700 transition-colors duration-200 text-sm"
                    >
                      {expert.name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>🔥 {expert.trendingScore} trending</span>
                      <span>•</span>
                      <span>👍 {expert.helpfulVotes} helpful</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-orange-600">
                    #{index + 1}
                  </div>
                  <div className="text-xs text-gray-500">trending</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderAchievementsView = () => {
    const displayExperts = getFilteredExperts().slice(0, getDisplayCount());
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="achievements"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {displayExperts.map((expert, index) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {expert.name?.charAt(0)?.toUpperCase() || "E"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/profile/${expert.id}`}
                      className="font-semibold text-gray-900 hover:text-kiwi-700 transition-colors duration-200"
                    >
                      {expert.name}
                    </Link>
                                         <FaCheckCircle className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{expert.title}</div>
                  <div className="flex flex-wrap gap-1">
                    {expert.achievements?.slice(0, 3).map((achievement, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 bg-white bg-opacity-70 px-2 py-1 rounded-full text-xs"
                      >
                        <span>{achievement.icon}</span>
                        <span className={`font-medium ${achievement.color}`}>
                          {achievement.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
          <FaStar className="h-5 w-5 text-yellow-500" />
          Expert Spotlight
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
        {viewMode === "Featured" && renderFeaturedView()}
        {viewMode === "Trending" && renderTrendingView()}
        {viewMode === "Achievements" && renderAchievementsView()}
      </div>

      {/* Expand/Collapse button */}
      {getFilteredExperts().length > 3 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 text-sm text-kiwi-700 hover:text-kiwi-800 font-medium transition-colors duration-200"
        >
          {isExpanded ? "Show Less" : `Show ${getFilteredExperts().length - 3} More`}
        </motion.button>
      )}
    </motion.div>
  );
};

export default ExpertSpotlight;
