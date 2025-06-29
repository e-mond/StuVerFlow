import api from "./index";

// Voting on a question (upvote or downvote)
export const voteOnQuestion = async (questionId, userId, voteType) => {
  try {
    if (!questionId || !userId || !["upvote", "downvote"].includes(voteType)) {
      throw { message: "Invalid question ID, user ID, or vote type" };
    }
    const response = await api.post(`/questions/${questionId}/vote/`, {
      userId,
      voteType,
    });
    return response.data; // Return updated vote counts
  } catch (error) {
    throw error.response?.data || { message: "Failed to vote on question" }; // Throw error with message
  }
};

// Voting on an answer (upvote or downvote)
export const voteOnAnswer = async (answerId, userId, voteType) => {
  try {
    if (!answerId || !userId || !["upvote", "downvote"].includes(voteType)) {
      throw { message: "Invalid answer ID, user ID, or vote type" };
    }
    const response = await api.post(`/answers/${answerId}/vote/`, {
      userId,
      voteType,
    });
    return response.data; // Return updated vote counts
  } catch (error) {
    throw error.response?.data || { message: "Failed to vote on answer" }; // Throw error with message
  }
};
