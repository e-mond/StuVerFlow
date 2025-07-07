import api from "./index";

// Fetches trending tags
export const fetchTrendingTags = async () => {
  try {
    const response = await api.get("trending/tags/", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.data.map((tag) => ({
      id: tag.id || tag.name || `${Date.now()}`,
      name: tag.name || "",
      description: tag.description || "",
      count: tag.count || tag.questionCount || tag.questions || 0,
    })); // Returns array of tag objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch trending tags" }; // Throws error with message
  }
};

// Fetches a specific topic by name
export const fetchTopic = async (topicName) => {
  try {
    if (!topicName) throw new Error("Topic name is required");
    const response = await api.get(`/tags/${topicName}/`, {
      headers: { "Content-Type": "application/json" },
    });
    return {
      name: response.data.name || topicName,
      description: response.data.description || "No description available.",
      count: response.data.count || response.data.questionCount || 0,
    }; // Returns topic object
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch topic data" }; // Throws error with message
  }
};
