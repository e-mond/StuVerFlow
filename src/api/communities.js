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
      members: group.members?.length || group.memberCount || 0,
    })); // Returns array of study group objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch study groups" }; // Throws error with message
  }
};

// Fetches questions for a specific community
export const fetchCommunityQuestions = async (communityId) => {
  try {
    if (!communityId) throw new Error("Community ID is required");
    const response = await api.get(`/communities/${communityId}/questions/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.map((question) => ({
      id: question.id || `${communityId}-${Date.now()}`,
      title: question.title || "",
      description: question.description || question.content || "",
      user: {
        name: question.user?.name || question.author || "Anonymous",
        handle: question.user?.handle || "",
      },
      created_at: question.created_at || new Date().toISOString(),
      answers: (question.answers || []).map((answer) => ({
        id: answer.id || `${question.id}-${Date.now()}`,
        content: answer.content || "",
        user: {
          name: answer.user?.name || answer.author || "Anonymous",
          handle: answer.user?.handle || "",
        },
        created_at: answer.created_at || new Date().toISOString(),
        upvotes: answer.upvotes || 0,
        downvotes: answer.downvotes || 0,
      })),
      upvotes: question.upvotes || 0,
      downvotes: question.downvotes || 0,
      isBookmarked: question.isBookmarked || false,
      tags: (question.tags || []).map((tag) => ({
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
      members: response.data.members?.length || response.data.memberCount || 1,
    }; // Returns created community object
  } catch (error) {
    throw error.response?.data || { message: "Failed to create community" }; // Throws error with message
  }
};
