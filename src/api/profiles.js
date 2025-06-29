import api from "./index";

// Fetches a user’s profile data by user ID
export const getUserProfile = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.get(`/users/${userId}/`, {
      headers: { "Content-Type": "application/json" },
    });
    return {
      id: response.data.id || userId,
      name: response.data.name || response.data.firstName || "Unknown",
      handle: response.data.handle || "",
      institution: response.data.institution || "",
      avatar: response.data.avatar || "https://via.placeholder.com/128",
      course: response.data.course || "",
      joinYear: response.data.joinYear || new Date().getFullYear().toString(),
      bio: response.data.bio || "",
      reputation: response.data.reputation || 0,
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user profile" };
  }
};

// Updates a user’s profile data
export const updateUserProfile = async (userId, updatedData) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const { userType, handle, institution, profilePicture, certificateFiles } =
      updatedData;
    if (!userType || !["student", "professional"].includes(userType)) {
      throw new Error("Invalid user type");
    }
    if (!handle || !handle.startsWith("@")) {
      throw new Error("Handle is required and must start with @");
    }
    if (!institution) {
      throw new Error("Institution is required");
    }
    if (userType === "student" && !updatedData.interests) {
      throw new Error("Interests are required for students");
    }
    if (userType === "professional") {
      const { title, expertise, bio, certifications } = updatedData;
      if (
        !title ||
        !expertise ||
        !bio ||
        !certifications ||
        !certificateFiles?.length
      ) {
        throw new Error(
          "Title, expertise, bio, certifications, and at least one certificate file are required for professionals",
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
      if (!validTitles.includes(title)) {
        throw new Error("Invalid professional title");
      }
    }
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("userType", userType);
    formData.append("handle", handle);
    formData.append("institution", institution);
    if (updatedData.dob) formData.append("dob", updatedData.dob);
    if (updatedData.bio) formData.append("bio", updatedData.bio);
    if (userType === "student") {
      formData.append("interests", updatedData.interests);
    }
    if (userType === "professional") {
      formData.append("title", updatedData.title);
      formData.append("expertise", updatedData.expertise);
      formData.append("certifications", updatedData.certifications);
    }
    if (profilePicture) {
      if (!["image/jpeg", "image/png"].includes(profilePicture.type)) {
        throw new Error("Profile picture must be JPEG or PNG");
      }
      if (profilePicture.size > 2 * 1024 * 1024) {
        throw new Error("Profile picture must be less than 2MB");
      }
      formData.append("profilePicture", profilePicture);
    }
    if (certificateFiles?.length) {
      certificateFiles.forEach((file, index) => {
        if (file && file.type !== "application/pdf") {
          throw new Error(`Certificate file ${index + 1} must be a PDF`);
        }
        if (file && file.size > 5 * 1024 * 1024) {
          throw new Error(
            `Certificate file ${index + 1} must be less than 5MB`,
          );
        }
        if (file) formData.append(`certificateFile${index + 1}`, file);
      });
    }
    const response = await api.put(`/users/${userId}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return {
      id: response.data.id || userId,
      name: response.data.name || updatedData.name || "Unknown",
      handle: response.data.handle || updatedData.handle || "",
      institution: response.data.institution || updatedData.institution || "",
      avatar:
        response.data.avatar ||
        updatedData.avatar ||
        "https://via.placeholder.com/128",
      course: response.data.course || updatedData.course || "",
      joinYear:
        response.data.joinYear ||
        updatedData.joinYear ||
        new Date().getFullYear().toString(),
      bio: response.data.bio || updatedData.bio || "",
      reputation: response.data.reputation || updatedData.reputation || 0,
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to update user profile" };
  }
};

// Fetches a user’s recent activity (posts and comments)
export const fetchRecentActivity = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.get(`/users/${userId}/recent-activity/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.map((activity) => ({
      id: activity.id || `${userId}-${Date.now()}`,
      type: activity.type || activity.action || "post",
      content: activity.content || activity.description || "",
      timestamp:
        activity.created_at || activity.timestamp || new Date().toISOString(),
      link: activity.link || `/${activity.type}/${activity.id}`,
    }));
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to fetch recent activity" }
    );
  }
};

// Fetches a user’s drafts
export const fetchDrafts = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.get(`/users/${userId}/drafts/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.map((draft) => ({
      id: draft.id || `${userId}-${Date.now()}`,
      title: draft.title || "",
      description: draft.description || draft.content || "",
      tags: (draft.tags || []).map((tag) => tag.name || tag),
      timestamp:
        draft.created_at || draft.timestamp || new Date().toISOString(),
      link: draft.link || `/draft/${draft.id}`,
    }));
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch drafts" };
  }
};

// Fetches questions asked by a specific user
export const fetchUserQuestions = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.get(`/users/${userId}/questions/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.map((question) => ({
      id: question.id || `${userId}-${Date.now()}`,
      title: question.title || "",
      author: question.user?.name || question.author || "Anonymous",
      created_at:
        question.created_at || question.timestamp || new Date().toISOString(),
      answers: question.answers?.length || question.answerCount || 0,
      isBookmarked: question.isBookmarked || false,
      upvotes: question.upvotes || 0,
      downvotes: question.downvotes || 0,
    }));
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user questions" };
  }
};

// Fetches recently joined users
export const fetchNewUsers = async () => {
  try {
    const response = await api.get(`/users/new/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.map((user) => ({
      id: user.id || `${Date.now()}`,
      name: user.name || user.firstName || "Anonymous",
      handle: user.handle || "",
      course: user.course || "",
      joined: user.joined_at || user.created_at || new Date().toISOString(),
      questions: user.questions || 0,
      upvotes: user.upvotes || 0,
      downvotes: user.downvotes || 0,
      expert: user.expert || false,
      title: user.title || "",
      expertise: user.expertise || "",
      isFollowing: user.isFollowing || false,
    }));
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch new users" };
  }
};

// Follows a user
export const followUser = async (userId, followerId) => {
  try {
    if (!userId || !followerId)
      throw new Error("User ID and follower ID are required");
    const response = await api.post(
      `/users/${userId}/follow/`,
      { followerId },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return {
      id: response.data.id || userId,
      isFollowing: response.data.isFollowing || true,
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to follow user" };
  }
};
