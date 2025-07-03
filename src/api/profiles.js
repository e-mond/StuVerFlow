import api from "./index";

// PROFILE HELPERS
export const updateUserProfile = async (userId, updatedData) => {
  if (!userId) throw new Error("User ID is required");

  const {
    userType,
    handle,
    institution,
    profilePicture,
    certificateFiles,
    dob,
    bio,
    interests,
    title,
    expertise,
    certifications,
    name,
    firstName,
    lastName,
  } = updatedData;

  // Validation
  if (!userType || !["student", "professional"].includes(userType)) {
    throw new Error("Invalid user type");
  }
  if (!handle?.startsWith("@")) {
    throw new Error("Handle must start with '@'");
  }
  if (!institution) {
    throw new Error("Institution is required");
  }
  if (userType === "student" && !interests) {
    throw new Error("Students must provide interests");
  }
  if (
    userType === "professional" &&
    (!title ||
      !expertise ||
      !bio ||
      !certifications ||
      !certificateFiles?.length)
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
  if (userType === "professional" && !validTitles.includes(title)) {
    throw new Error("Invalid professional title");
  }

  // Construct FormData
  const formData = new FormData();
  formData.append("userType", userType);
  formData.append("handle", handle);
  formData.append("institution", institution);
  if (dob) formData.append("dob", dob);
  if (bio) formData.append("bio", bio);

  if (userType === "student") {
    formData.append("interests", interests);
  }

  if (userType === "professional") {
    formData.append("title", title);
    formData.append("expertise", expertise);
    formData.append("certifications", certifications);
    certificateFiles.forEach((file, i) => {
      if (file.type !== "application/pdf") {
        throw new Error(`Certificate file ${i + 1} must be a PDF`);
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`Certificate file ${i + 1} must be under 5MB`);
      }
      formData.append(`certificateFiles[${i}]`, file);
    });
  }

  if (profilePicture) {
    if (!["image/jpeg", "image/png"].includes(profilePicture.type)) {
      throw new Error("Profile picture must be JPEG or PNG");
    }
    if (profilePicture.size > 2 * 1024 * 1024) {
      throw new Error("Profile picture must be under 2MB");
    }
    formData.append("profilePicture", profilePicture);
  }

  formData.append(
    "name",
    name || `${firstName || ""} ${lastName || ""}`.trim(),
  );

  const response = await api.put(`/users/${userId}/`, formData);
  return {
    ...response.data,
    message: response.data.message || "Profile updated",
  };
};

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
