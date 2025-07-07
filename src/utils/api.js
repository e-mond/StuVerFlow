export {
  fetchQuestions,
  fetchQuestionById,
  postQuestion,
  postAnswer,
  fetchHotQuestions,
  fetchQuestionsByInterests,
  searchQuestions,
  deleteQuestion,
  editQuestion,
  archiveQuestion,
  reportQuestion,
} from "../api/question.js";

export { fetchTrendingTags, fetchTopic } from "../api/tags";
export {
  fetchStudyGroups,
  fetchCommunityDetails,
  fetchCommunityQuestions,
  joinCommunity,
  leaveCommunity,
  createCommunity,
  fetchCommunityMessages,
  postCommunityMessage,
  replyToCommunityMessage,
  likeCommunityMessage,
  deleteCommunityMessage,
  askCommunityQuestion,
  checkCurrentUserMembership,
  searchCommunities,
  getCommunityJoinRequests,
  approveJoinRequest,
  declineJoinRequest,
  getCommunityMembers,
  deleteCommunity,
} from "../api/communities";
export {
  getUserProfile,
  updateUserProfile,
  fetchRecentActivity,
  fetchDrafts,
  fetchUserQuestions,
  fetchNewUsers,
  followUser,
} from "../api/profiles";
export { voteOnQuestion, voteOnAnswer } from "../api/votes";
export { bookmarkQuestion, fetchBookmarks } from "../api/bookmarks";
export {
  login,
  signup,
  requestPasswordReset,
  resetPassword,
  logout,
} from "../api/auth"; // Re-export from auth.js instead of index.js
export {
  fetchNotifications,
  markAllNotificationsAsRead,
} from "../api/notifications";
export { fetchExperts } from "../api/experts";

// Enhanced Search & Trending exports
export {
  searchQuestions as advancedSearchQuestions,
  searchUsers,
  getSearchSuggestions,
  getSearchAnalytics,
  searchAll,
  debouncedSearchQuestions,
  debouncedSearchUsers,
  debouncedSearchAll,
} from "../api/search";

export {
  fetchTrendingTags as getTrendingTags,
  fetchTrendingTopics,
  fetchTrendingUsers,
  fetchTrendingDashboard,
  fetchHotQuestions as getHotQuestions,
  fetchRecentActivity as getUserActivity,
  fetchStudyGroups as getStudyGroups,
  fetchTrendingWithCache,
  clearTrendingCache,
  getTrendingInsights,
} from "../api/trending";
