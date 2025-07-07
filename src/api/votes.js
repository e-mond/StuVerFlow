import api from "./index";

// Voting on a question (upvote or downvote)
export const voteOnQuestion = async (questionId, userId, voteType) => {
  try {
    if (!questionId || !userId || !["upvote", "downvote"].includes(voteType)) {
      throw { message: "Invalid question ID, user ID, or vote type" };
    }
    const response = await api.post(`/questions/${questionId}/vote/`, {
      vote_type: voteType, // Backend expects vote_type, not voteType
    });
    
    if (response.data.status === 'success') {
      return {
        upvotes: response.data.data.upvotes,
        downvotes: response.data.data.downvotes,
      };
    } else {
      throw new Error(response.data.message || "Failed to vote on question");
    }
  } catch (error) {
    console.error("Vote question error:", error);
    throw error.response?.data || { message: "Failed to vote on question" };
  }
};

// Voting on an answer (upvote or downvote)
export const voteOnAnswer = async (answerId, userId, voteType) => {
  try {
    if (!answerId || !userId || !["upvote", "downvote"].includes(voteType)) {
      throw { message: "Invalid answer ID, user ID, or vote type" };
    }
    const response = await api.post(`/answers/${answerId}/vote/`, {
      vote_type: voteType, // Backend expects vote_type, not voteType
    });
    
    if (response.data.status === 'success') {
      return {
        upvotes: response.data.data.upvotes,
        downvotes: response.data.data.downvotes,
      };
    } else {
      throw new Error(response.data.message || "Failed to vote on answer");
    }
  } catch (error) {
    console.error("Vote answer error:", error);
    throw error.response?.data || { message: "Failed to vote on answer" };
  }
};
