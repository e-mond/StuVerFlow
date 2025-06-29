import api from "./index";

// Fetches a user’s notifications
export const fetchNotifications = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.get(`/notifications/?user=${userId}`);
    return response.data.map((notification) => ({
      id: notification.id || `${userId}-${Date.now()}`,
      message:
        notification.message || notification.content || "New notification",
      created_at:
        notification.created_at ||
        notification.timestamp ||
        new Date().toISOString(),
      isRead: notification.isRead || notification.read || false,
      link:
        notification.link ||
        notification.url ||
        `/question/${notification.questionId || ""}`,
    })); // Returns array of notification objects with required fields
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch notifications" }; // Throws error with message
  }
};

// Marks all notifications as read for a user
export const markAllNotificationsAsRead = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const response = await api.put(`/notifications/mark-read/?user=${userId}`);
    return response.data; // Returns success message
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to mark notifications as read",
      }
    ); // Throws error with message
  }
};
