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
    return response.data.data.map((question) => ({
      id: question.id || `${Date.now()}`,
      title: question.title || "",
      description: question.description || question.content || "",
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
        id: answer.id || `${question.id}-${Date.now()}`,
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
      isBookmarked: question.isBookmarked || false,
    }));
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch questions" };
  }
};

// Fetches a single question by ID
export const fetchQuestionById = async (questionId) => {
  try {
    if (!questionId) throw new Error("Question ID is required");
    const response = await api.get(`/questions/${questionId}/`, {
      headers: { "Content-Type": "application/json" },
    });
    const question = response.data.data;
    return {
      id: question.id || questionId,
      title: question.title || "",
      description: question.description || question.content || "",
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
        id: answer.id || `${questionId}-${Date.now()}`,
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
      isBookmarked: question.isBookmarked || false,
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch question" };
  }
};

// Posts a new question
// In your frontend API file
export const postQuestion = async (userId, questionData) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!questionData.title || !questionData.description) {
      throw new Error("Title and description are required");
    }
    
    const payload = {
      title: questionData.title,
      description: questionData.description,
      tags: questionData.tags || []  // Ensure tags is an array
    };

    const response = await api.post(
      "/questions/",
      payload,
      {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem('token')}`
        },
      },
    );
    
    return {
      id: response.data.id,
      title: response.data.title,
      description: response.data.description,
      user: {
        id: userId,
        name: response.data.user?.name || "Anonymous",
        handle: response.data.user?.handle || "",
      },
      tags: response.data.tags || [],
      created_at: response.data.created_at,
      upvotes: 0,
      downvotes: 0,
      answers: [],
      isBookmarked: false,
    };
  } catch (error) {
    console.error("Post question error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to post question" };
  }
};

// Posts an answer to a question
export const postAnswer = async (questionId, userId, content) => {
  try {
    if (!questionId || !userId)
      throw new Error("Question ID and user ID are required");
    if (!content || typeof content !== 'string' || !content.trim()) 
      throw new Error("Answer content is required");
    
    const response = await api.post(
      `/questions/${questionId}/answers/`,
      { content: content.trim() },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    
    if (response.data.status === 'success') {
      return {
        id: response.data.data.id,
        content: response.data.data.content,
        user: {
          id: response.data.data.user?.id || userId,
          name: response.data.data.user?.name || "Anonymous",
          handle: response.data.data.user?.handle || "",
        },
        created_at: response.data.data.created_at,
        upvotes: response.data.data.upvotes || 0,
        downvotes: response.data.data.downvotes || 0,
      };
    } else {
      throw new Error(response.data.message || "Failed to post answer");
    }
  } catch (error) {
    console.error("Post answer error:", error);
    throw error.response?.data || { message: "Failed to post answer" };
  }
};

// Fetches hot questions
export const fetchHotQuestions = async () => {
  try {
    const response = await api.get("/questions/hot/");
    return response.data.data.map((question) => ({
      id: question.id || `${Date.now()}`,
      title: question.title || "",
      description: question.description || question.content || "",
      user: {
        id: question.user?.id || "",
        name: question.user?.name || "Anonymous",
        handle: question.user?.handle || "",
      },
      askedBy: question.user?.name || "Anonymous",
      tags: (question.tags || []).map((tag) => ({
        id: tag.id || tag.name || "",
        name: tag.name || tag,
      })),
      created_at: question.created_at || new Date().toISOString(),
      upvotes: question.upvotes || 0,
      downvotes: question.downvotes || 0,
      answers: (question.question_answers || []).length, // Return count, not array
      answersList: (question.question_answers || []).map((answer) => ({
        id: answer.id || `${question.id}-${Date.now()}`,
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
      isBookmarked: question.isBookmarked || false,
    }));
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch hot questions" };
  }
};

// Fetches questions based on a user's interests
export const fetchQuestionsByInterests = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.get(`/users/${userId}/questions/interests/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.data.map((question) => ({
      id: question.id || `${Date.now()}`,
      title: question.title || "",
      description: question.description || question.content || "",
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
        id: answer.id || `${question.id}-${Date.now()}`,
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
      isBookmarked: question.isBookmarked || false,
    }));
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch questions by interests",
      }
    );
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
    return response.data.data.map((question) => ({
      id: question.id || `${Date.now()}`,
      title: question.title || "",
      description: question.description || question.content || "",
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
        id: answer.id || `${question.id}-${Date.now()}`,
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
      isBookmarked: question.isBookmarked || false,
    }));
  } catch (error) {
    throw error.response?.data || { message: "Failed to search questions" };
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
    return { message: "Question deleted successfully" };
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete question" };
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
    const question = response.data.data;
    return {
      id: question.id || questionId,
      title: question.title || updatedData.title,
      description: question.description || updatedData.description,
      user: {
        id: question.user?.id || userId,
        name: question.user?.name || "Anonymous",
        handle: question.user?.handle || "",
      },
      tags: (question.tags || updatedData.tags || []).map((tag) => ({
        id: tag.id || tag.name || "",
        name: tag.name || tag,
      })),
      created_at: question.created_at || new Date().toISOString(),
      upvotes: question.upvotes || 0,
      downvotes: question.downvotes || 0,
      answers: (question.question_answers || []).map((answer) => ({
        id: answer.id || `${questionId}-${Date.now()}`,
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
      isBookmarked: question.isBookmarked || false,
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to edit question" };
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
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to archive question" };
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
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to report question" };
  }
};
