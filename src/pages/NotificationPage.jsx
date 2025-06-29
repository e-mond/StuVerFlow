import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../context/useUser";
import NotificationItem from "../components/common/NotificationItem";
import { fetchNotifications, markAllNotificationsAsRead } from "../utils/api";
import Sidebar from "../components/common/Sidebar";
import Button from "../components/common/Button";

// Displays a list of user notifications with a sidebar and interactive features
const NotificationPage = () => {
  const { user } = useUser(); // Access authenticated user ID
  const navigate = useNavigate(); // For redirecting unauthenticated users
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetches notifications when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchNotifications(user.id);
        setNotifications(response);
      } catch (err) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  // Marks all notifications as read
  const handleMarkAllRead = async () => {
    try {
      setError(null);
      await markAllNotificationsAsRead(user.id);
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

  // Renders loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p
            className="text-gray-600 text-sm sm:text-base animate-pulse"
            role="status"
          >
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  // Renders error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p className="text-red-600 text-sm sm:text-base" role="alert">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <Sidebar />
      <div className="flex-1 px-4 py-6 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Notifications</h1>
          <Button
            onClick={handleMarkAllRead}
            className="mt-2 sm:mt-0 text-green-600 font-medium bg-green-50 px-3 py-1 rounded hover:bg-green-100 text-sm transition-colors"
          >
            Mark all read
          </Button>
        </div>
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
                link={notification.link}
              />
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationPage;
