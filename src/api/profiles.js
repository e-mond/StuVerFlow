import api from "./index";

export const updateUserProfile = async (userId, updatedData) => {
  if (!userId) throw new Error("User ID is required");

  // updatedData is FormData, so we need to access its entries
  const formData =
    updatedData instanceof FormData ? updatedData : new FormData();
  const userType = formData.get("userType"); // Get userType from FormData
  console.log("Debug: Received userType:", userType);

  // Validation
  if (
    !userType ||
    !["student", "professional"].includes(userType.toLowerCase().trim())
  ) {
    throw new Error("Invalid userType");
  }
  if (!formData.get("handle")?.startsWith("@")) {
    throw new Error("Handle must start with '@'");
  }
  if (!formData.get("institution")) {
    throw new Error("Institution is required");
  }
  if (userType.toLowerCase() === "student" && !formData.get("interests")) {
    throw new Error("Students must provide interests");
  }
  if (
    userType.toLowerCase() === "professional" &&
    (!formData.get("title") ||
      !formData.get("expertise") ||
      !formData.get("bio") ||
      !formData.get("certifications") ||
      !formData.getAll("certificateFiles").length)
  ) {
    throw new Error(
      "Professionals must provide title, expertise, bio, certifications, and at least one certificate file",
    );
  }

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
  if (
    userType.toLowerCase() === "professional" &&
    !validTitles.includes(formData.get("title"))
  ) {
    throw new Error("Invalid professional title");
  }

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
    institution: data.institution || "",
    avatar: data.profile_picture || "https://via.placeholder.com/128",
    course: data.course || "",
    joinYear: data.joinYear || new Date().getFullYear().toString(),
    bio: data.bio || "",
    reputation: data.reputation || 0,
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
  const response = await api.get(`/users/new/`);
  return response.data.data || [];
};

export const followUser = async (userId, targetUserId) => {
  if (!userId || !targetUserId) throw new Error("User IDs are required");

  const response = await api.post(`/users/${userId}/follow/${targetUserId}/`);
  return response.data.data || { message: "Follow action completed" };
};
