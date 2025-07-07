import api from "./index";

// Cache for trending data
let trendingCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch trending tags
 */
export const fetchTrendingTags = async () => {
  try {
    const response = await api.get("trending/tags/");
    return response.data.data.map((tag) => ({
      id: tag.id || tag.name || `${Date.now()}`,
      name: tag.name || "",
      description: tag.description || "",
      count: tag.count || tag.questionCount || tag.questions || 0,
    }));
  } catch (error) {
    console.error("Error fetching trending tags:", error);
    throw error.response?.data || { message: "Failed to fetch trending tags" };
  }
};

/**
 * Fetch trending topics
 */
export const fetchTrendingTopics = async () => {
  try {
    const response = await api.get("trending/topics/");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    throw error.response?.data || { message: "Failed to fetch trending topics" };
  }
};

/**
 * Fetch trending users
 */
export const fetchTrendingUsers = async () => {
  try {
    const response = await api.get("trending/users/");
    return response.data;
  } catch (error) {
    console.error("Error fetching trending users:", error);
    throw error;
  }
};

/**
 * Fetch trending dashboard data
 */
export const fetchTrendingDashboard = async () => {
  try {
    const response = await api.get("trending/dashboard/");
    return response.data;
  } catch (error) {
    console.error("Error fetching trending dashboard:", error);
    throw error;
  }
};

/**
 * Fetch hot questions (alias for trending questions)
 */
export const fetchHotQuestions = async () => {
  try {
    const response = await api.get("questions/hot/");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching hot questions:", error);
    throw error.response?.data || { message: "Failed to fetch hot questions" };
  }
};

/**
 * Fetch recent activity for a user
 */
export const fetchRecentActivity = async (userId) => {
  try {
    const response = await api.get(`users/${userId}/activity/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    throw error;
  }
};

/**
 * Fetch study groups
 */
export const fetchStudyGroups = async () => {
  try {
    const response = await api.get("study-groups/");
    return response.data;
  } catch (error) {
    console.error("Error fetching study groups:", error);
    throw error;
  }
};

/**
 * Fetch trending data with caching
 */
export const fetchTrendingWithCache = async (endpoint) => {
  const cacheKey = `trending_${endpoint}`;
  const now = Date.now();
  
  // Check if we have cached data that's still valid
  if (trendingCache[cacheKey] && 
      (now - trendingCache[cacheKey].timestamp < CACHE_DURATION)) {
    return trendingCache[cacheKey].data;
  }
  
  try {
    const response = await api.get(`trending/${endpoint}/`);
    const data = response.data.data || response.data;
    
    // Cache the response
    trendingCache[cacheKey] = {
      data: data,
      timestamp: now
    };
    
    return data;
  } catch (error) {
    console.error(`Error fetching trending ${endpoint}:`, error);
    throw error.response?.data || { message: `Failed to fetch trending ${endpoint}` };
  }
};

/**
 * Clear trending cache
 */
export const clearTrendingCache = () => {
  trendingCache = {};
};

/**
 * Get trending insights
 */
export const getTrendingInsights = async () => {
  try {
    const response = await api.get("trending/insights/");
    return response.data;
  } catch (error) {
    console.error("Error fetching trending insights:", error);
    throw error;
  }
}; 