import api from "./index";

// Fetches notifications for the authenticated user
export const fetchNotifications = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    // Add filter parameters
    if (filters.unread_only) params.append('unread_only', 'true');
    if (filters.type) params.append('type', filters.type);
    if (filters.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/notifications/?${queryString}` : '/notifications/';
    
    const response = await api.get(url, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`
      },
    });
    
    return {
      notifications: response.data.data || [],
      meta: response.data.meta || {}
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch notifications" };
  }
};

// Fetches notification summary (counts and recent notifications)
export const fetchNotificationSummary = async () => {
  try {
    const response = await api.get('/notifications/summary/', {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`
      },
    });
    
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch notification summary" };
  }
};

// Marks a specific notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    if (!notificationId) throw new Error("Notification ID is required");
    
    const response = await api.post(`/notifications/${notificationId}/read/`, {}, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`
      },
    });
    
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to mark notification as read" };
  }
};

// Marks all notifications as read for the authenticated user
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.post('/notifications/mark-all-read/', {}, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`
      },
    });
    
    return {
      message: response.data.message,
      updated_count: response.data.updated_count
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to mark all notifications as read" };
  }
};

// Deletes a specific notification
export const deleteNotification = async (notificationId) => {
  try {
    if (!notificationId) throw new Error("Notification ID is required");
    
    const response = await api.delete(`/notifications/${notificationId}/delete/`, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`
      },
    });
    
    return { message: response.data.message };
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete notification" };
  }
};

// Creates a test notification (for development/testing purposes)
export const createTestNotification = async (type = 'system', title = 'Test Notification', message = 'This is a test notification') => {
  try {
    // This would typically be handled by backend triggers, but useful for testing
    const response = await api.post('/notifications/', {
      notification_type: type,
      title: title,
      message: message
    }, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`
      },
    });
    
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create test notification" };
  }
};
