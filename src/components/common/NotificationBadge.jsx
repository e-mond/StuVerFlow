import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { fetchNotificationSummary } from '../../api/notifications';

const NotificationBadge = ({ className = "", showLabel = true }) => {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotificationCount = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const summary = await fetchNotificationSummary();
        setUnreadCount(summary.unread_count || 0);
      } catch (error) {
        console.error('Failed to load notification count:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotificationCount();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(loadNotificationCount, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  if (!user || loading) {
    return null;
  }

  return (
    <Link 
      to="/notifications" 
      className={`relative flex items-center gap-2 text-gray-700 hover:text-kiwi-700 transition-colors ${className}`}
    >
      <div className="relative">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V7a5 5 0 00-10 0v5l-5 5h5m10 0a3 3 0 01-3 3 3 3 0 01-3-3m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
      {showLabel && (
        <span className="text-sm font-medium">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-1 text-red-500">({unreadCount})</span>
          )}
        </span>
      )}
    </Link>
  );
};

export default NotificationBadge; 