import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import Sidebar from "../components/common/Sidebar";
import { 
  fetchNotifications, 
  fetchNotificationSummary,
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification,
  createTestNotification
} from "../api/notifications";
import { toast } from "react-toastify";

const NotificationPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Notification type configurations
  const notificationTypes = {
    answer: { icon: "💬", label: "Answers", color: "bg-blue-100 text-blue-800" },
    question_vote: { icon: "👍", label: "Question Votes", color: "bg-green-100 text-green-800" },
    answer_vote: { icon: "⭐", label: "Answer Votes", color: "bg-yellow-100 text-yellow-800" },
    answer_accepted: { icon: "✅", label: "Accepted Answers", color: "bg-emerald-100 text-emerald-800" },
    mention: { icon: "@", label: "Mentions", color: "bg-purple-100 text-purple-800" },
    follow: { icon: "👥", label: "Followers", color: "bg-pink-100 text-pink-800" },
    bookmark: { icon: "📌", label: "Bookmarks", color: "bg-orange-100 text-orange-800" },
    community_invite: { icon: "🏛️", label: "Community Invites", color: "bg-indigo-100 text-indigo-800" },
    community_question: { icon: "❓", label: "Community Questions", color: "bg-cyan-100 text-cyan-800" },
    system: { icon: "⚙️", label: "System", color: "bg-gray-100 text-gray-800" },
  };

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch notifications and summary
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        
        const filters = {};
        if (filter === "unread") filters.unread_only = true;
        if (selectedType) filters.type = selectedType;
        filters.limit = 50;

        const [notificationsData, summaryData] = await Promise.all([
          fetchNotifications(filters),
          fetchNotificationSummary()
        ]);

        setNotifications(notificationsData.notifications);
        setSummary(summaryData);
      } catch (err) {
        setError(err.message || "Failed to load notifications");
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, filter, selectedType]);

  // Handle mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
      setSummary(prev => ({
        ...prev,
        unread_count: Math.max(0, prev.unread_count - 1)
      }));
    } catch (err) {
      toast.error("Failed to mark notification as read");
    }
  };

  // Handle mark all as read
  const handleMarkAllRead = async () => {
    try {
      setActionLoading(true);
      const result = await markAllNotificationsAsRead();
      
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
      setSummary(prev => ({ ...prev, unread_count: 0 }));
      
      toast.success(`Marked ${result.updated_count} notifications as read`);
    } catch (err) {
      toast.error("Failed to mark all notifications as read");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      setSummary(prev => ({
        ...prev,
        total_count: prev.total_count - 1
      }));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }
    
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  // Filter notifications based on search
  const filteredNotifications = notifications.filter(notification => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      notification.title.toLowerCase().includes(searchLower) ||
      notification.message.toLowerCase().includes(searchLower) ||
      (notification.sender?.name || "").toLowerCase().includes(searchLower)
    );
  });

  // Create test notification (for development)
  const handleCreateTestNotification = async () => {
    try {
      await createTestNotification();
      // Reload notifications
      const notificationsData = await fetchNotifications();
      setNotifications(notificationsData.notifications);
      toast.success("Test notification created");
    } catch (err) {
      toast.error("Failed to create test notification");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kiwi-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">🔔</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Notifications</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-kiwi-700 text-white px-4 py-2 rounded-lg hover:bg-kiwi-800 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🔔</span>
                Notifications
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Stay updated with your academic activities
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {summary.unread_count || 0} unread
              </div>
              <button
            onClick={handleMarkAllRead}
                disabled={actionLoading || !summary.unread_count}
                className="bg-kiwi-700 text-white px-4 py-2 rounded-lg hover:bg-kiwi-800 transition text-sm disabled:opacity-50"
          >
                {actionLoading ? "Marking..." : "Mark All Read"}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total_count || 0}</p>
              </div>
              <div className="text-blue-500 text-xl">📧</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{summary.unread_count || 0}</p>
              </div>
              <div className="text-orange-500 text-xl">🔴</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">Types</p>
                <p className="text-2xl font-bold text-purple-600">{summary.type_counts?.length || 0}</p>
              </div>
              <div className="text-purple-500 text-xl">📝</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kiwi-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "unread", label: "Unread" }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      filter === key
                        ? "bg-kiwi-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <div className="min-w-0">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kiwi-500 focus:border-transparent text-sm"
                >
                  <option value="">All Types</option>
                  {Object.entries(notificationTypes).map(([key, type]) => (
                    <option key={key} value={key}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="px-6 pb-6">
          {filteredNotifications.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {filteredNotifications.map((notification, index) => {
                const typeConfig = notificationTypes[notification.notification_type] || notificationTypes.system;
                
                return (
        <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                      !notification.is_read ? "ring-2 ring-kiwi-200" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${typeConfig.color}`}>
                          {typeConfig.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium ${!notification.is_read ? "text-gray-900" : "text-gray-700"}`}>
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-kiwi-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{notification.time_ago}</span>
                            {notification.sender && (
                              <span>from {notification.sender.name}</span>
                            )}
                            {notification.related_question_title && (
                              <span>re: {notification.related_question_title}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-2">
                        {!notification.is_read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-kiwi-600 transition"
                            title="Mark as read"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition"
                          title="Delete notification"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : notifications.length === 0 ? (
            // No notifications at all
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Notifications Yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                You'll receive notifications when people interact with your questions, answers, and when you get mentioned.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/home">
                  <button className="bg-kiwi-700 text-white px-6 py-3 rounded-lg hover:bg-kiwi-800 transition">
                    Explore Questions
                  </button>
                </Link>
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={handleCreateTestNotification}
                    className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    Create Test Notification
                  </button>
                )}
              </div>
            </div>
          ) : (
            // No results for current filter/search
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchQuery 
                  ? `No notifications match "${searchQuery}". Try different keywords.`
                  : `No notifications match the selected filters.`
                }
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSearchQuery("")}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Clear Search
                </button>
                <button
                  onClick={() => {
                    setFilter("all");
                    setSelectedType("");
                  }}
                  className="bg-kiwi-700 text-white px-4 py-2 rounded-lg hover:bg-kiwi-800 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
