import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { FaBookmark } from "react-icons/fa";
import { bookmarkQuestion } from "../../utils/api";
import { useUser } from "../../context/useUser";
import Reactions from "../feed/Reactions";

const HotQuestionCard = ({ question, onBookmarkToggle }) => {
  const [isBookmarked, setIsBookmarked] = useState(
    question.isBookmarked || false,
  );
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const touchStartX = useRef(null);
  const { user } = useUser();

  // Bookmark toggle handler
  const handleBookmark = async () => {
    if (!user?.id) {
      alert("Please log in to bookmark questions.");
      return;
    }
    try {
      await bookmarkQuestion(question.id, user.id, !isBookmarked);
      setIsBookmarked(!isBookmarked);
      if (onBookmarkToggle) onBookmarkToggle(question.id, !isBookmarked);
    } catch (err) {
      console.error("Bookmark failed:", err.message);
      alert(err.message || "Failed to bookmark question.");
    }
  };

  // Swipe handling
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) < 100) setSwipeOffset(deltaX);
  };
  const handleTouchEnd = () => setSwipeOffset(0);

  return (
    <div
      className="flex-shrink-0 snap-start relative"
      style={{ minWidth: "190px", maxWidth: "220px" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div
        className="bg-kiwi-50 rounded-lg p-4 text-sm sm:text-sm flex flex-col justify-between shadow border border-[#d2eee6] h-full transition-transform duration-200"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        <Link
          to={`/question/${question.id}`}
          className="font-medium text-gray-800 hover:underline line-clamp-2 mb-2"
          title={question.title}
        >
          {question.title}
        </Link>
        <p className="text-xs text-gray-500 mb-3">
          <span className="font-semibold">{question.askedBy}</span> •{" "}
          {question.answers} answers
        </p>
        <div className="flex items-center justify-between mt-auto pt-1">
          <Reactions
            upvotes={question.upvotes || 0}
            downvotes={question.downvotes || 0}
            small
          />
          <button
            onClick={handleBookmark}
            className="text-xl transition-transform duration-300 hover:scale-110"
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <FaBookmark
              className={`transition-colors duration-300 ${
                isBookmarked ? "text-yellow-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>
      </div>
      {showPreview && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white border border-gray-300 shadow-lg rounded-md p-3 z-50 w-64 text-sm hidden md:block">
          <h3 className="font-semibold text-gray-800 mb-1">{question.title}</h3>
          <p className="text-xs text-gray-600 mb-1">
            Asked by: <span className="font-medium">{question.askedBy}</span>
          </p>
          <p className="text-xs text-gray-600 mb-2">
            {question.answers} Answers | {question.upvotes || 0} Upvotes |{" "}
            {question.downvotes || 0} Downvotes
          </p>
          <Link
            to={`/question/${question.id}`}
            className="text-xs text-blue-600 hover:underline"
          >
            View full question →
          </Link>
        </div>
      )}
    </div>
  );
};

export default HotQuestionCard;
