import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaThumbsUp,
  FaAt,
  FaFlag,
  FaQuestionCircle,
  FaUsers,
} from "react-icons/fa";

// Returns an appropriate icon based on the message content
const getIcon = (message) => {
  if (message.toLowerCase().includes("answer"))
    return <FaCheckCircle className="text-green-500" />;
  if (message.toLowerCase().includes("upvote"))
    return <FaThumbsUp className="text-green-500" />;
  if (message.toLowerCase().includes("mention"))
    return <FaAt className="text-green-500" />;
  if (message.toLowerCase().includes("flag"))
    return <FaFlag className="text-green-500" />;
  if (message.toLowerCase().includes("question"))
    return <FaQuestionCircle className="text-green-500" />;
  if (message.toLowerCase().includes("invited"))
    return <FaUsers className="text-green-500" />;
  return <FaCheckCircle className="text-green-500" />;
};

// A single notification item component
const NotificationItem = ({ message, timestamp, isRead, link }) => {
  // Formats the timestamp for display
  const formattedDate = new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Handles keyboard accessibility (Enter or Space to activate link)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      window.location.href = link; // Fallback for keyboard navigation
    }
  };

  return (
    <Link
      to={link}
      className="block focus:outline-none focus:ring-2 focus:ring-kiwi-500 rounded-lg"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${
          isRead ? "bg-white" : "bg-kiwi-50"
        } hover:bg-kiwi-100`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-kiwi-100 rounded-full flex items-center justify-center">
            {getIcon(message)}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{message}</p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>
        <div className="text-xl text-gray-400 hover:text-gray-600">›</div>
      </div>
    </Link>
  );
};

// Defines prop types for type checking
NotificationItem.propTypes = {
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  isRead: PropTypes.bool.isRequired,
  link: PropTypes.string.isRequired,
};

export default NotificationItem;
