import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NotificationItem from "../components/common/NotificationItem";
import { fetchNotifications, markAllNotificationsAsRead } from "../utils/api";
import Sidebar from "../components/common/Sidebar";
import Button from "../components/common/Button"; // Import the Button component

// NotificationPage component displays a list of user notifications with a sidebar and interactive features
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  // Fetch notifications when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 1; // Placeholder for authenticated user ID, to be replaced with context
        const response = await fetchNotifications(userId);
        setNotifications(response);
      } catch (err) {
        setError(err.message || "Failed to load notifications");
      }
    };
    fetchData();
  }, []);

  // Handle marking all notifications as read
  const handleMarkAllRead = async () => {
    try {
      const userId = 1; // Placeholder for authenticated user ID
      await markAllNotificationsAsRead(userId);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (err) {
      setError(err.message || "Failed to mark notifications as read");
    }
  };

  // Display error state if fetching fails
  if (error) {
    return (
      <div className="flex min-h-screen bg-white justify-center items-center p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      {/* Sidebar for navigation, collapsed on mobile */}
      <Sidebar />

      {/* Main content area with responsive padding and layout */}
      <div className="flex-1 px-4 py-6 sm:px-6 md:px-8">
        {/* Header section with title and action button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Notifications</h1>
          <Button
            onClick={handleMarkAllRead}
            className="mt-2 sm:mt-0 text-green-600 font-medium bg-green-50 px-3 py-1 rounded hover:bg-green-100 text-sm transition-colors"
          >
            Mark all read
          </Button>
        </div>

        {/* Highlight box for recent alerts */}
        <div className="bg-green-50 text-green-900 p-4 sm:p-6 rounded-lg mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-xl sm:text-2xl">🔔</div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">
                Recent Alerts
              </h2>
            </div>
          </div>
        </div>

        {/* Notifications list with animation */}
        <motion.div
          className="space-y-2 sm:space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center text-sm sm:text-base">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                message={notification.message}
                timestamp={notification.created_at}
                isRead={notification.isRead}
                link={notification.link} // Pass the link for navigation
              />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationPage;
