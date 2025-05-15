import axios from "axios";

// Creating an Axios instance configured for API requests to the Django backend
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Base URL for Django backend API endpoints
  headers: {
    "Content-Type": "multipart/form-data", // Supports file uploads (e.g., images)
  },
});

// Adding request interceptor to include authentication token from local storage
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`; // Add token to headers
    }
    return config;
  },
  (error) => Promise.reject(error), // Handle request errors
);

// Logging in a user with email and password
export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/auth/login/", { email, password });
    return response.data; // Return token and user data on success
  } catch (error) {
    throw error.response?.data || { message: "Login failed" }; // Throw error with message
  }
};

// Registering a new user with username, handle, email, and password
export const signup = async ({ username, handle, email, password }) => {
  try {
    const response = await api.post("/auth/signup/", {
      username,
      handle, // Include handle in the signup payload
      email,
      password,
    });
    return response.data; // Return user data on success
  } catch (error) {
    throw error.response?.data || { message: "Failed to sign up" }; // Throw error with message
  }
};

// Fetching all questions from the backend
export const fetchQuestions = async () => {
  try {
    const response = await api.get("/questions/");
    return response.data; // Return array of question objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch questions" }; // Throw error with message
  }
};

// Posting a new question to the backend with image upload support
export const postQuestion = async (formData) => {
  try {
    const response = await api.post("/questions/", formData);
    return response.data; // Return created question object
  } catch (error) {
    throw error.response?.data || { message: "Failed to post question" }; // Throw error with message
  }
};

// Fetching a list of experts for the ExpertSpotlight component
export const fetchExperts = async () => {
  try {
    const response = await api.get("/experts/");
    return response.data; // Return array of expert objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch experts" }; // Throw error with message
  }
};

// Fetching trending tags
export const fetchTrendingTags = async () => {
  try {
    const response = await api.get("/tags/trending/");
    return response.data; // Return array of tag strings
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch trending tags" }; // Throw error with message
  }
};

// Fetching hot questions
export const fetchHotQuestions = async () => {
  try {
    const response = await api.get("/questions/hot/");
    return response.data; // Return array of hot question objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch hot questions" }; // Throw error with message
  }
};

// Fetching new users
export const fetchNewUsers = async () => {
  try {
    const response = await api.get("/users/new/");
    return response.data; // Return array of new user objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch new users" }; // Throw error with message
  }
};

// Fetching study groups
export const fetchStudyGroups = async () => {
  try {
    const response = await api.get("/study-groups/");
    return response.data.map((group) => ({
      ...group,
      members: group.members || [], // Ensure members is an array of user IDs
      memberCount: Array.isArray(group.members)
        ? group.members.length
        : group.memberCount || 0, // Add member count for display
    })); // Return array of study group objects with members as array
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch study groups" }; // Throw error with message
  }
};

// Fetching questions for a specific community
export const fetchCommunityQuestions = async (communityId) => {
  try {
    const response = await api.get(`/study-groups/${communityId}/questions/`);
    return response.data; // Return array of question objects
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch community questions" }
    ); // Throw error with message
  }
};

// Joining a community
export const joinCommunity = async (communityId, userId) => {
  try {
    const response = await api.post(`/study-groups/${communityId}/join/`, {
      userId,
    });
    return response.data; // Return success message
  } catch (error) {
    throw error.response?.data || { message: "Failed to join community" }; // Throw error with message
  }
};

// Leaving a community
export const leaveCommunity = async (communityId, userId) => {
  try {
    const response = await api.delete(`/study-groups/${communityId}/leave/`, {
      data: { userId },
    });
    return response.data; // Return success message
  } catch (error) {
    throw error.response?.data || { message: "Failed to leave community" }; // Throw error with message
  }
};

// Fetching a user's bookmarked questions
export const fetchBookmarks = async (userId) => {
  try {
    const response = await api.get(`/bookmarks/?user=${userId}`);
    return response.data.map((bookmark) => bookmark.question); // Return mapped question objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch bookmarks" }; // Throw error with message
  }
};

// Bookmarking or unbookmarking a question
export const bookmarkQuestion = async (questionId, userId, bookmark) => {
  try {
    if (!questionId || !userId) {
      throw { message: "Question ID and user ID are required" }; // Validate required parameters
    }
    if (bookmark) {
      const response = await api.post("/bookmarks/", {
        question: questionId,
        user: userId,
      });
      return response.data; // Return bookmark data
    } else {
      const bookmarks = await api.get(
        `/bookmarks/?user=${userId}&question=${questionId}`,
      );
      const bookmarkId = bookmarks.data[0]?.id;
      if (!bookmarkId) {
        throw { message: "Bookmark not found" }; // Check if bookmark exists
      }
      await api.delete(`/bookmarks/${bookmarkId}/`);
      return { success: true, message: "Bookmark removed" }; // Return success message
    }
  } catch (error) {
    throw error.response?.data || { message: "Failed to bookmark question" }; // Throw error with message
  }
};

// Voting on a question (upvote or downvote)
export const voteOnQuestion = async (questionId, userId, voteType) => {
  try {
    const response = await api.post(`/questions/${questionId}/vote/`, {
      userId,
      voteType,
    });
    return response.data; // Return updated vote counts
  } catch (error) {
    throw error.response?.data || { message: "Failed to vote" }; // Throw error with message
  }
};

// Voting on an answer (upvote or downvote)
export const voteOnAnswer = async (answerId, userId, voteType) => {
  try {
    const response = await api.post(`/answers/${answerId}/vote/`, {
      userId,
      voteType,
    });
    return response.data; // Return updated vote counts
  } catch (error) {
    throw error.response?.data || { message: "Failed to vote on answer" }; // Throw error with message
  }
};

// Initiating a password reset by sending a reset link to the user’s email
export const requestPasswordReset = async ({ email }) => {
  try {
    const response = await api.post("/auth/forgot-password/", { email });
    return response.data; // Return success message
  } catch (error) {
    throw error.response?.data || { message: "Failed to send reset link" }; // Throw error with message
  }
};

// Resetting a user’s password using a reset token
export const resetPassword = async ({ token, newPassword }) => {
  try {
    const response = await api.post("/auth/reset-password/", {
      token,
      newPassword,
    });
    return response.data; // Return success message
  } catch (error) {
    throw error.response?.data || { message: "Failed to reset password" }; // Throw error with message
  }
};

// Fetching a user’s profile data
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/profile/`);
    return response.data; // Return user profile data
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user profile" }; // Throw error with message
  }
};

// Updating a user’s profile data, including handle
export const updateUserProfile = async (
  userId,
  { firstName, surname, handle, dob, contact, institution, course, bio },
) => {
  try {
    const response = await api.put(`/users/${userId}/profile/`, {
      firstName,
      surname,
      handle,
      dob,
      contact,
      institution,
      course,
      bio,
    });
    return response.data; // Return updated profile data
  } catch (error) {
    throw error.response?.data || { message: "Failed to update user profile" }; // Throw error with message
  }
};

// Fetching a user’s notifications
export const fetchNotifications = async (userId) => {
  try {
    const response = await api.get(`/notifications/?user=${userId}`);
    return response.data; // Return array of notification objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch notifications" }; // Throw error with message
  }
};

// Marking all notifications as read for a user
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const response = await api.put(`/notifications/mark-read/?user=${userId}`);
    return response.data; // Return success message
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to mark notifications as read",
      }
    ); // Throw error with message
  }
};

// Fetching a user’s recent activity (posts and comments)
export const fetchRecentActivity = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/activity/`);
    return response.data; // Return array of activity objects
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch recent activity" }
    ); // Throw error with message
  }
};

// Fetching a user’s drafts
export const fetchDrafts = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/drafts/`);
    return response.data; // Return array of draft objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch drafts" }; // Throw error with message
  }
};

// Fetching questions asked by a specific user
export const fetchUserQuestions = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/questions/`);
    return response.data; // Return array of question objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user questions" }; // Throw error with message
  }
};

// Exporting the Axios instance for custom requests if needed
export default api;
