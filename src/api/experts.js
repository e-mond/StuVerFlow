import api from "./index";

// Fetches a list of academic experts
export const fetchExperts = async () => {
  try {
    const response = await api.get("/experts/", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data.map((expert) => ({
      id: expert.id || `${Date.now()}`,
      name: expert.name || expert.fullName || "Anonymous",
      title: expert.title || "",
      course: expert.course || expert.field || "",
      expertise: expert.expertise || "",
    })); // Returns array of expert objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch experts" }; // Throws error with message
  }
};
