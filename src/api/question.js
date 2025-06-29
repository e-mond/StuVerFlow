import api from "./index";

// Fetches a list of questions, optionally filtered by topic
export const fetchQuestions = async (topic = "") => {
  try {
    const endpoint = topic
      ? `/questions/?tag=${encodeURIComponent(topic)}`
      : "/questions/";
    const response = await api.get(endpoint, {
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
      isBookmarked: question.isBookmarked || false,
    })); // Returns array of question objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch questions" }; // Throws error with message
  }
};

// Fetches a single question by ID
export const fetchQuestionById = async (questionId) => {
  try {
    if (!questionId) throw new Error("Question ID is required");
    const response = await api.get(`/questions/${questionId}/`, {
      headers: { "Content-Type": "application/json" },
    });
    return {
      id: response.data.id || questionId,
      title: response.data.title || "",
      description: response.data.description || response.data.content || "",
      user: {
        id: response.data.user?.id || response.data.authorId || "",
        name: response.data.user?.name || response.data.author || "Anonymous",
        handle: response.data.user?.handle || "",
      },
      tags: (response.data.tags || []).map((tag) => ({
        id: tag.id || tag.name || "",
        name: tag.name || tag,
      })),
      created_at:
        response.data.created_at ||
        response.data.timestamp ||
        new Date().toISOString(),
      upvotes: response.data.upvotes || 0,
      downvotes: response.data.downvotes || 0,
      answers: (response.data.answers || []).map((answer) => ({
        id: answer.id || `${questionId}-${Date.now()}`,
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
      isBookmarked: response.data.isBookmarked || false,
    }; // Returns question object
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch question" }; // Throws error with message
  }
};

// Posts a new question
export const postQuestion = async (userId, questionData) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!questionData.title || !questionData.description) {
      throw new Error("Title and description are required");
    }
    const response = await api.post(
      "/questions/",
      { ...questionData, userId },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return {
      id: response.data.id || `${Date.now()}`,
      title: response.data.title || questionData.title,
      description: response.data.description || questionData.description,
      user: {
        id: response.data.user?.id || userId,
        name: response.data.user?.name || response.data.author || "Anonymous",
        handle: response.data.user?.handle || "",
      },
      tags: (response.data.tags || questionData.tags || []).map((tag) => ({
        id: tag.id || tag.name || "",
        name: tag.name || tag,
      })),
      created_at: response.data.created_at || new Date().toISOString(),
      upvotes: response.data.upvotes || 0,
      downvotes: response.data.downvotes || 0,
      answers: [],
      isBookmarked: false,
    }; // Returns created question object
  } catch (error) {
    throw error.response?.data || { message: "Failed to post question" }; // Throws error with message
  }
};

// Posts an answer to a question
export const postAnswer = async (questionId, userId, answerData) => {
  try {
    if (!questionId || !userId)
      throw new Error("Question ID and user ID are required");
    if (!answerData.content) throw new Error("Answer content is required");
    const response = await api.post(
      `/questions/${questionId}/answers/`,
      { ...answerData, userId },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return {
      id: response.data.id || `${questionId}-${Date.now()}`,
      content: response.data.content || answerData.content,
      user: {
        id: response.data.user?.id || userId,
        name: response.data.user?.name || response.data.author || "Anonymous",
        handle: response.data.user?.handle || "",
      },
      created_at: response.data.created_at || new Date().toISOString(),
      upvotes: response.data.upvotes || 0,
      downvotes: response.data.downvotes || 0,
    }; // Returns created answer object
  } catch (error) {
    throw error.response?.data || { message: "Failed to post answer" }; // Throws error with message
  }
};

// Fetches hot questions
export const fetchHotQuestions = async () => {
  try {
    const response = await api.get("/questions/hot/", {
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
      isBookmarked: question.isBookmarked || false,
    })); // Returns array of hot question objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch hot questions" }; // Throws error with message
  }
};

// Fetches questions based on user interests
export const fetchQuestionsByInterests = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.get(`/users/${userId}/questions/interests/`, {
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
      isBookmarked: question.isBookmarked || false,
    })); // Returns array of interest-based question objects
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch questions by interests",
      }
    ); // Throws error with message
  }
};

// Searches questions based on a query
export const searchQuestions = async (query) => {
  try {
    if (!query) throw new Error("Search query is required");
    const response = await api.get(
      `/questions/search/?q=${encodeURIComponent(query)}`,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
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
      isBookmarked: question.isBookmarked || false,
    })); // Returns array of search result question objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to search questions" }; // Throws error with message
  }
};

// Deletes a question
export const deleteQuestion = async (questionId, userId) => {
  try {
    if (!questionId || !userId)
      throw new Error("Question ID and user ID are required");
    await api.delete(`/questions/${questionId}/`, {
      headers: { "Content-Type": "application/json" },
      data: { userId },
    });
    return { message: "Question deleted successfully" }; // Returns success message
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete question" }; // Throws error with message
  }
};

// Edits a question
export const editQuestion = async (questionId, userId, updatedData) => {
  try {
    if (!questionId || !userId)
      throw new Error("Question ID and user ID are required");
    if (!updatedData.title || !updatedData.description) {
      throw new Error("Title and description are required");
    }
    const response = await api.put(
      `/questions/${questionId}/`,
      { ...updatedData, userId },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return {
      id: response.data.id || questionId,
      title: response.data.title || updatedData.title,
      description: response.data.description || updatedData.description,
      user: {
        id: response.data.user?.id || userId,
        name: response.data.user?.name || response.data.author || "Anonymous",
        handle: response.data.user?.handle || "",
      },
      tags: (response.data.tags || updatedData.tags || []).map((tag) => ({
        id: tag.id || tag.name || "",
        name: tag.name || tag,
      })),
      created_at: response.data.created_at || new Date().toISOString(),
      upvotes: response.data.upvotes || 0,
      downvotes: response.data.downvotes || 0,
      answers: (response.data.answers || []).map((answer) => ({
        id: answer.id || `${questionId}-${Date.now()}`,
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
      isBookmarked: response.data.isBookmarked || false,
    }; // Returns updated question object
  } catch (error) {
    throw error.response?.data || { message: "Failed to edit question" }; // Throws error with message
  }
};

// Archives a question
export const archiveQuestion = async (questionId, userId) => {
  try {
    if (!questionId || !userId)
      throw new Error("Question ID and user ID are required");
    const response = await api.post(
      `/questions/${questionId}/archive/`,
      { userId },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return {
      message: response.data.message || "Question archived successfully",
    }; // Returns success message
  } catch (error) {
    throw error.response?.data || { message: "Failed to archive question" }; // Throws error with message
  }
};

// Reports a question
export const reportQuestion = async (questionId, userId, reason) => {
  try {
    if (!questionId || !userId || !reason) {
      throw new Error("Question ID, user ID, and reason are required");
    }
    const response = await api.post(
      `/questions/${questionId}/report/`,
      { userId, reason },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return {
      message: response.data.message || "Question reported successfully",
    }; // Returns success message
  } catch (error) {
    throw error.response?.data || { message: "Failed to report question" }; // Throws error with message
  }
};
