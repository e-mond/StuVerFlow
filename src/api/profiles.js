import api from "./index";

export const updateUserProfile = async (userId, updatedData) => {
  if (!userId) throw new Error("User ID is required");

  // updatedData is FormData, so we need to access its entries
  const formData =
    updatedData instanceof FormData ? updatedData : new FormData();
  
  // Skip userType processing entirely for now since it's not implemented in backend
  // const userType = formData.get("userType"); // Get userType from FormData
  // console.log("Debug: Received userType:", userType);

  // Validation - Make it more lenient for profile updates
  // Skip userType validation for now as it's not implemented in backend
  if (formData.get("handle") && !formData.get("handle")?.startsWith("@")) {
    throw new Error("Handle must start with '@'");
  }
  if (!formData.get("institution")) {
    throw new Error("Institution is required");
  }
  
  // More lenient validation for profile updates
  // Only validate required fields if they are being updated
  const validTitles = [
    "Prof",
    "Dr",
    "Eng",
    "PhD",
    "MSc",
    "BSc",
    "MD",
    "JD",
    "MBA",
    "CPA",
    "PMP",
    "Other",
  ];
  
  // Skip professional title validation for now since userType is not implemented
  // Only validate title if it's provided and user is professional
  // if (
  //   userType.toLowerCase() === "professional" &&
  //   formData.get("title") &&
  //   !validTitles.includes(formData.get("title"))
  // ) {
  //   throw new Error("Invalid professional title");
  // }

  const response = await api.put(`users/${userId}/update/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    ...response.data,
    message: response.data.message || "Profile updated",
  };
};

// Rest of the exports (getUserProfile, etc.) remain unchanged
export const getUserProfile = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const response = await api.get(`/users/${userId}/profile/`);
  const data = response.data.data || {};

  return {
    id: data.id || userId,
    name: data.name || data.firstName || "Unknown",
    handle: data.handle || "",
    email: data.email || "",
    institution: data.institution || "",
    avatar: data.profile_picture || "https://via.placeholder.com/128",
    course: data.course || "",
    joinYear: data.joinYear || new Date().getFullYear().toString(),
    bio: data.bio || "",
    reputation: data.reputation || 0,
    title: data.title || "",
    interests: data.interests || "",
    expertise: data.expertise || "",
    // userType: data.userType || data.user_type || "student", // Commented out until backend support
    dob: data.dob || data.date_of_birth || "",
    date_joined: data.date_joined || "",
  };
};

export const fetchRecentActivity = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const response = await api.get(`/users/${userId}/recent-activity/`);
  return response.data.data || [];
};

export const fetchDrafts = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const response = await api.get(`/users/${userId}/drafts/`);
  return response.data.data || [];
};

export const fetchUserQuestions = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const response = await api.get(`/users/${userId}/questions/`);
  return response.data.data || [];
};

export const fetchNewUsers = async () => {
  const response = await api.get(`new_users/`);
  return response.data.data || [];
};

export const followUser = async (userId, targetUserId) => {
  if (!userId || !targetUserId) throw new Error("User IDs are required");

  const response = await api.post(`/users/${userId}/follow/${targetUserId}/`);
  return response.data.data || { message: "Follow action completed" };
};
