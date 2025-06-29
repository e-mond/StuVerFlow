import api from "./index";

// Bookmarks a question
export const bookmarkQuestion = async (questionId, userId, isBookmarked) => {
  try {
    if (!questionId || !userId)
      throw new Error("Question ID and user ID are required");
    const response = await api.post(
      `/questions/${questionId}/bookmark/`,
      { userId, isBookmarked },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return {
      id: response.data.id || questionId,
      isBookmarked: response.data.isBookmarked || isBookmarked,
    }; // Returns bookmark status
  } catch (error) {
    throw error.response?.data || { message: "Failed to bookmark question" }; // Throws error with message
  }
};

// Fetches bookmarked questions for a user
export const fetchBookmarks = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.get(`/users/${userId}/bookmarks/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.map((question) => ({
      id: question.id || `${Date.now()}`,
      title: question.title || "",
      description: question.description || question.content || "",
      user: {
        id: question.user?.id || question.authorId || "",
        name: question.user?.name || question.author || "Anonymous",
        handle: question.user?.handle || "",
      },
      tags: (question.tags || []).map((tag) => ({
        id: tag.id || tag.name || "",
        name: tag.name || tag,
      })),
      created_at:
        question.created_at || question.timestamp || new Date().toISOString(),
      upvotes: question.upvotes || 0,
      downvotes: question.downvotes || 0,
      answers: (question.answers || []).map((answer) => ({
        id: answer.id || `${question.id}-${Date.now()}`,
        content: answer.content || "",
        user: {
          id: answer.user?.id || answer.authorId || "",
          name: answer.user?.name || answer.author || "Anonymous",
          handle: answer.user?.handle || "",
        },
        created_at:
          answer.created_at || answer.timestamp || new Date().toISOString(),
        upvotes: answer.upvotes || 0,
        downvotes: answer.downvotes || 0,
      })),
      isBookmarked: true,
    })); // Returns array of bookmarked question objects
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch bookmarked questions",
      }
    ); // Throws error with message
  }
};
