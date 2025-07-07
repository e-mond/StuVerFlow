import api from "./index";

// Advanced search for questions with filters and sorting
export const searchQuestions = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add search parameters
    if (params.query) queryParams.append('q', params.query);
    if (params.tags) queryParams.append('tags', params.tags);
    if (params.userId) queryParams.append('user_id', params.userId);
    if (params.sortBy) queryParams.append('sort_by', params.sortBy);
    if (params.dateRange) queryParams.append('date_range', params.dateRange);
    if (params.hasAnswer) queryParams.append('has_answer', params.hasAnswer);
    if (params.minVotes) queryParams.append('min_votes', params.minVotes);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    const response = await api.get(`/search/questions/?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to search questions" };
  }
};

// Search for users by various criteria
export const searchUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.append('q', params.query);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    
    const response = await api.get(`/search/users/?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to search users" };
  }
};

// Get search suggestions for autocomplete
export const getSearchSuggestions = async (query, limit = 10) => {
  try {
    if (!query || query.length < 2) {
      return { questions: [], tags: [], users: [], communities: [] };
    }
    
    const response = await api.get(`/search/suggestions/?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    // Ensure we return the expected structure
    const data = response.data.data || response.data;
    return {
      questions: data.questions || [],
      tags: data.tags || [],
      users: data.users || [],
      communities: data.communities || []
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to get search suggestions" };
  }
};

// Get search analytics and statistics
export const getSearchAnalytics = async (days = 30) => {
  try {
    const response = await api.get(`/search/analytics/?days=${days}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get search analytics" };
  }
};

// Simple community search function to avoid circular imports
const searchCommunitiesLocal = async (query, options = {}) => {
  try {
    const params = new URLSearchParams();
    params.append('q', query.trim());
    
    if (options.limit) params.append('limit', options.limit);
    if (options.sortBy) params.append('sort', options.sortBy);
    
    const response = await api.get(`/api/communities/search/?${params.toString()}`);
    
    return {
      data: (response.data?.data || []).map((community) => ({
        id: community.id || `${Date.now()}`,
        name: community.name || "",
        description: community.description || "",
        members: community.members?.length || community.memberCount || 0,
        category: community.category || "General",
        created_at: community.created_at || new Date().toISOString(),
        isJoined: community.isJoined || false,
        creator: community.creator || null,
        tags: community.tags || []
      })),
      total: response.data?.total || 0
    };
      } catch (error) {
      return { data: [], total: 0 };
    }
};

// Combined search across all content types
export const searchAll = async (query, options = {}) => {
  try {
    const limit = options.limit || 10;
    
    const [questions, users, communities, suggestions] = await Promise.all([
      searchQuestions({ 
        query, 
        limit,
        sortBy: options.sortBy || 'relevance'
      }),
      searchUsers({ 
        query, 
        limit: Math.ceil(limit / 3) 
      }),
      searchCommunitiesLocal(query, { 
        limit: Math.ceil(limit / 3),
        sortBy: options.sortBy || 'relevance'
      }),
      getSearchSuggestions(query, limit)
    ]);
    
    return {
      questions: questions.data || [],
      users: users.data || [],
      communities: communities.data || [],
      suggestions: suggestions,
      meta: {
        questions_total: questions.meta?.total_count || 0,
        users_total: users.meta?.total_count || 0,
        communities_total: communities.total || 0
      }
    };
      } catch (error) {
      throw error.response?.data || { message: "Failed to perform search" };
    }
};

// Search with debouncing for real-time search
export const createDebouncedSearch = (searchFunction, delay = 300) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await searchFunction(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

// Debounced search functions
export const debouncedSearchQuestions = createDebouncedSearch(searchQuestions);
export const debouncedSearchUsers = createDebouncedSearch(searchUsers);
export const debouncedSearchAll = createDebouncedSearch(searchAll); 