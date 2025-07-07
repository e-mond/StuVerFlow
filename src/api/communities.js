import api from "./index";

// Fetches all study groups
export const fetchStudyGroups = async () => {
  try {
    const response = await api.get("/communities/", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.map((group) => ({
      id: group.id || `${Date.now()}`,
      name: group.name || "",
      description: group.description || "",
      members: group.member_count || group.memberCount || group.members?.length || 0,
    })); // Returns array of study group objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch study groups" }; // Throws error with message
  }
};

// Fetches individual community details
export const fetchCommunityDetails = async (communityId) => {
  try {
    const response = await api.get(`/communities/${communityId}/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data; // Returns raw community data with proper structure
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch community details" };
  }
};

// Fetches questions for a specific community
export const fetchCommunityQuestions = async (communityId) => {
  try {
    if (!communityId) throw new Error("Community ID is required");
    const response = await api.get(`/communities/${communityId}/questions/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.map((communityQuestion) => ({
      id: communityQuestion.question?.id || `${communityId}-${Date.now()}`,
      title: communityQuestion.question?.title || "",
      description: communityQuestion.question?.description || communityQuestion.question?.content || "",
      user: {
        name: communityQuestion.question?.user?.name || "Anonymous",
        handle: communityQuestion.question?.user?.handle || "",
      },
      created_at: communityQuestion.question?.created_at || new Date().toISOString(),
      answers: (communityQuestion.question?.question_answers || []).map((answer) => ({
        id: answer.id || `${communityQuestion.question?.id}-${Date.now()}`,
        content: answer.content || "",
        user: {
          name: answer.user?.name || "Anonymous",
          handle: answer.user?.handle || "",
        },
        created_at: answer.created_at || new Date().toISOString(),
        upvotes: answer.upvotes || 0,
        downvotes: answer.downvotes || 0,
      })),
      upvotes: communityQuestion.question?.upvotes || 0,
      downvotes: communityQuestion.question?.downvotes || 0,
      isBookmarked: communityQuestion.question?.isBookmarked || false,
      tags: (communityQuestion.question?.tags || []).map((tag) => ({
        id: tag.id || tag.name || "",
        name: tag.name || tag,
      })),
    })); // Returns array of question objects
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch community questions" }
    ); // Throws error with message
  }
};

// Joins a community
export const joinCommunity = async (communityId, userId) => {
  try {
    if (!communityId || !userId)
      throw new Error("Community ID and user ID are required");
    const response = await api.post(
      `/communities/${communityId}/join/`,
      { userId },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return {
      message: response.data.message || "Successfully joined community",
      members: response.data.members || response.data.memberCount || 0,
    }; // Returns success message and updated member count
  } catch (error) {
    throw error.response?.data || { message: "Failed to join community" }; // Throws error with message
  }
};

// Leaves a community
export const leaveCommunity = async (communityId, userId) => {
  try {
    if (!communityId || !userId)
      throw new Error("Community ID and user ID are required");
    const response = await api.post(
      `/communities/${communityId}/leave/`,
      { userId },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return {
      message: response.data.message || "Successfully left community",
      members: response.data.members || response.data.memberCount || 0,
    }; // Returns success message and updated member count
  } catch (error) {
    throw error.response?.data || { message: "Failed to leave community" }; // Throws error with message
  }
};

// Creates a new community
export const createCommunity = async (userId, communityData) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!communityData.name || !communityData.description) {
      throw new Error("Name and description are required");
    }
    if (communityData.name.length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }
    if (communityData.description.length < 10) {
      throw new Error("Description must be at least 10 characters long");
    }
    const response = await api.post(
      "/communities/",
      { ...communityData, userId },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return {
      id: response.data.id || `${Date.now()}`,
      name: response.data.name || communityData.name,
      description: response.data.description || communityData.description,
      members: response.data.member_count || response.data.memberCount || response.data.members?.length || 1,
    }; // Returns created community object
  } catch (error) {
    throw error.response?.data || { message: "Failed to create community" }; // Throws error with message
  }
};

// =============================================================================
// COMMUNITY MESSAGING API FUNCTIONS
// =============================================================================

// Get community messages with pagination
export const fetchCommunityMessages = async (communityId, page = 1, pageSize = 20) => {
  try {
    const response = await api.get(`/communities/${communityId}/messages/`, {
      params: { page, page_size: pageSize },
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch community messages" };
  }
};

// Post a new message to a community
export const postCommunityMessage = async (communityId, messageData) => {
  try {
    const response = await api.post(
      `/communities/${communityId}/messages/`,
      messageData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to post community message" };
  }
};

// Reply to a message in a community
export const replyToCommunityMessage = async (communityId, messageId, content) => {
  try {
    const response = await api.post(
      `/communities/${communityId}/messages/${messageId}/reply/`,
      { content },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to reply to message" };
  }
};

// Like/unlike a community message
export const likeCommunityMessage = async (communityId, messageId) => {
  try {
    const response = await api.post(
      `/communities/${communityId}/messages/${messageId}/like/`,
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to like message" };
  }
};

// Delete a community message
export const deleteCommunityMessage = async (communityId, messageId) => {
  try {
    const response = await api.delete(
      `/communities/${communityId}/messages/${messageId}/delete/`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete message" };
  }
};

// Ask a question directly in a community
export const askCommunityQuestion = async (communityId, questionData) => {
  try {
    const response = await api.post(
      `/communities/${communityId}/questions/ask/`,
      questionData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to ask community question" };
  }
};

// Check current user membership in a community
export const checkCurrentUserMembership = async (communityId) => {
  try {
    const response = await api.get(`/communities/${communityId}/membership/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to check membership status" };
  }
};

// Search communities
export const searchCommunities = async (query, options = {}) => {
  try {
    if (!query || query.trim().length === 0) {
      throw new Error("Search query is required");
    }
    
    const params = new URLSearchParams();
    params.append('q', query.trim());
    
    if (options.limit) params.append('limit', options.limit);
    if (options.sortBy) params.append('sort', options.sortBy);
    if (options.category) params.append('category', options.category);
    
    const response = await api.get(`/api/communities/search/?${params.toString()}`, {
      headers: { "Content-Type": "application/json" },
    });
    
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
    throw error.response?.data || { message: "Failed to search communities" };
  }
};

// =============================================================================
// COMMUNITY ADMIN API FUNCTIONS
// =============================================================================

// Get pending join requests for a community (admin only)
export const getCommunityJoinRequests = async (communityId) => {
  try {
    const response = await api.get(`/communities/${communityId}/admin/join-requests/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch join requests" };
  }
};

// Approve a join request (admin only)
export const approveJoinRequest = async (communityId, membershipId) => {
  try {
    const response = await api.post(
      `/communities/${communityId}/admin/join-requests/${membershipId}/approve/`,
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to approve join request" };
  }
};

// Decline a join request (admin only)
export const declineJoinRequest = async (communityId, membershipId) => {
  try {
    const response = await api.post(
      `/communities/${communityId}/admin/join-requests/${membershipId}/decline/`,
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to decline join request" };
  }
};

// Get all members of a community with their roles
export const getCommunityMembers = async (communityId) => {
  try {
    const response = await api.get(`/communities/${communityId}/members/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch community members" };
  }
};

// Delete a community (admin only)
export const deleteCommunity = async (communityId) => {
  try {
    const response = await api.delete(`/communities/${communityId}/delete/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete community" };
  }
};
