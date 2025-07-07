import api from "./index";

// Bookmarks a question (toggles bookmark status)
export const bookmarkQuestion = async (questionId) => {
  try {
    if (!questionId) throw new Error("Question ID is required");
    
    const response = await api.post(
      `/questions/${questionId}/bookmark/`,
      {},
      {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem('token')}`
        },
      },
    );
    
    return {
      isBookmarked: response.data.isBookmarked,
      message: response.data.message
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to bookmark question" };
  }
};

// Fetches bookmarked questions for a user
export const fetchBookmarks = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    
    const response = await api.get(`/users/${userId}/bookmarks/`, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`
      },
    });
    
    return response.data.data.map((question) => ({
      id: question.id,
      title: question.title || "",
      description: question.description || "",
      user: {
        id: question.user?.id || "",
        name: question.user?.name || "Anonymous",
        handle: question.user?.handle || "",
      },
      tags: (question.tags || []).map((tag) => ({
        id: tag.id || tag.name || "",
        name: tag.name || tag,
      })),
      created_at: question.created_at || new Date().toISOString(),
      upvotes: question.upvotes || 0,
      downvotes: question.downvotes || 0,
      answers: (question.question_answers || []).map((answer) => ({
        id: answer.id,
        content: answer.content || "",
        user: {
          id: answer.user?.id || "",
          name: answer.user?.name || "Anonymous",
          handle: answer.user?.handle || "",
        },
        created_at: answer.created_at || new Date().toISOString(),
        upvotes: answer.upvotes || 0,
        downvotes: answer.downvotes || 0,
      })),
      isBookmarked: true, // Always true for bookmarked questions
    }));
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch bookmarked questions" };
  }
};
