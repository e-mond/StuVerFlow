import { Link } from "react-router-dom";
import Button from "../common/Button";
import { useState } from "react";
import { bookmarkQuestion } from "../../utils/api";
import { useUser } from "../../context/useUser";
import { FaBookmark } from "react-icons/fa";
import Reactions from "../feed/Reactions";

// Component for displaying individual hot questions with bookmark and reaction functionality
const HotQuestionCard = ({ question, onBookmarkToggle }) => {
  // State to track bookmark status
  const [isBookmarked, setIsBookmarked] = useState(
    question.isBookmarked || false,
  );
  // Accessing user context for user ID
  const { user } = useUser();

  // Handling bookmark toggle with API integration
  const handleBookmark = async () => {
    if (!user?.id) {
      console.error("User not logged in");
      return;
    }
    try {
      // Toggling bookmark status via API
      await bookmarkQuestion(question.id, user.id, !isBookmarked);
      setIsBookmarked(!isBookmarked);
      if (onBookmarkToggle) {
        onBookmarkToggle(question.id, !isBookmarked);
      }
      console.log(
        `Question ${question.id} ${isBookmarked ? "removed from" : "added to"} bookmarks`,
      );
    } catch (err) {
      console.error("Failed to update bookmark:", err.message);
    }
  };

  return (
    <div
      className="bg-kiwi-50 p-3 sm:p-4 rounded-lg shadow-md flex-1 min-w-[180px] max-w-[220px] sm:min-w-[200px] sm:max-w-[250px]"
      role="article"
      aria-label={`Hot question: ${question.title}`}
    >
      {/* Question title with truncation */}
      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
        {question.title}
      </p>
      {/* Question metadata */}
      <p className="text-[10px] sm:text-xs text-gray-500 mb-2">
        Asked by {question.askedBy} • {question.answers} answers
      </p>
      {/* Action buttons and reactions */}
      <div className="flex space-x-4 mt-3 items-center">
        <Reactions
          upvotes={question.upvotes || 0}
          downvotes={question.downvotes || 0}
        />
        <Button
          variant="kiwi"
          size="xs"
          smSize="sm"
          as={Link}
          to={`/question/${question.id}`}
          className="text-[10px] sm:text-sm"
        >
          View
        </Button>
        <button
          onClick={handleBookmark}
          className="flex items-center text-kiwi-600 text-sm hover:text-kiwi-800 font-medium"
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <FaBookmark
            className={`text-lg sm:text-xl ${isBookmarked ? "text-yellow-500" : ""}`}
          />
        </button>
      </div>
    </div>
  );
};

export default HotQuestionCard;
