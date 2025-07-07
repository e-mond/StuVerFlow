import { useState } from "react";
import { Link } from "react-router-dom";
import { FaComment, FaEllipsisV, FaBookmark } from "react-icons/fa";
import CommentsModal from "./CommentsModal";
import Reactions from "./Reactions";
import {
  bookmarkQuestion,
  deleteQuestion,
  editQuestion,
  archiveQuestion,
  reportQuestion,
} from "../../utils/api";
import { useUser } from "../../context/UserContext";

const QuestionCard = ({ question, onBookmarkToggle, onVoteUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const isRecommended = question.upvotes > 5;
  const [isBookmarked, setIsBookmarked] = useState(
    question.isBookmarked || false,
  );

  const handleReply = (replyText) => {
    console.log(`Replying to question ${question.id}: ${replyText}`);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/question/${question.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Link copied to clipboard!"));
    setIsMenuOpen(false);
  };

  const handleReport = async () => {
    if (!user?.id) {
      alert("Please log in to report a question.");
      return;
    }
    try {
      await reportQuestion(question.id, user.id, "Inappropriate content");
      alert("Question reported successfully.");
      setIsMenuOpen(false);
    } catch (error) {
      alert(`Failed to report question: ${error.message || "Unknown error"}`);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/question/${question.id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Link copied to clipboard!"));
    setIsMenuOpen(false);
  };

  const handleDelete = async () => {
    if (!user?.id) {
      alert("Please log in to delete a question.");
      return;
    }
    try {
      await deleteQuestion(question.id, user.id);
      alert("Question deleted successfully.");
      setIsMenuOpen(false);
    } catch (error) {
      alert(`Failed to delete question: ${error.message || "Unknown error"}`);
    }
  };

  const handleEdit = async () => {
    if (!user?.id) {
      alert("Please log in to edit a question.");
      return;
    }
    try {
      const updatedData = {
        title: question.title,
        description: question.description,
      };
      await editQuestion(question.id, user.id, updatedData);
      alert("Question edited successfully.");
      setIsMenuOpen(false);
    } catch (error) {
      alert(`Failed to edit question: ${error.message || "Unknown error"}`);
    }
  };

  const handleArchive = async () => {
    if (!user?.id) {
      alert("Please log in to archive a question.");
      return;
    }
    try {
      await archiveQuestion(question.id, user.id);
      alert("Question archived successfully.");
      setIsMenuOpen(false);
    } catch (error) {
      alert(`Failed to archive question: ${error.message || "Unknown error"}`);
    }
  };

  const handleBookmark = async () => {
    if (!user?.id) {
      alert("Please log in to bookmark a question.");
      return;
    }
    try {
      const result = await bookmarkQuestion(question.id);
      setIsBookmarked(result.isBookmarked);
      if (onBookmarkToggle) {
        onBookmarkToggle(question.id, result.isBookmarked);
      }
    } catch (error) {
      alert(`Failed to bookmark question: ${error.message || "Unknown error"}`);
    }
  };

  const isPoster = user?.handle === question.user.handle;

  return (
    <div className="p-4 rounded-lg border border-kiwi-200 bg-white shadow-sm hover:shadow-md transition relative sm:p-5">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="absolute top-4 right-4 text-kiwi-500 hover:text-kiwi-700 focus:outline-none"
        aria-label="Open menu"
      >
        <FaEllipsisV className="text-xl sm:text-2xl" />
      </button>
      {isMenuOpen && (
        <div className="absolute top-10 right-4 bg-white border border-kiwi-200 rounded-lg shadow-lg z-10">
          <ul className="py-2">
            {isPoster ? (
              <>
                <li>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-kiwi-100"
                  >
                    Delete
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleEdit}
                    className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-kiwi-100"
                  >
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleArchive}
                    className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-kiwi-100"
                  >
                    Archive
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={handleShare}
                    className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-kiwi-100"
                  >
                    Share
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleReport}
                    className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-kiwi-100"
                  >
                    Report
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleCopyLink}
                    className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-kiwi-100"
                  >
                    Copy Link
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
      <div className="flex space-x-3 sm:space-x-4">
        <div className="w-10 h-10 rounded-full bg-kiwi-300 sm:w-12 sm:h-12" />
        <div className="flex-1">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="font-semibold text-gray-900 text-sm sm:text-base">
              {question.user.name}
            </span>
            <span className="text-gray-600 text-xs sm:text-sm">
              @{question.user.handle}
            </span>
            <span className="text-gray-600 text-xs sm:text-sm">
              • {new Date(question.created_at).toLocaleDateString()}
            </span>
          </div>
          <Link to={`/question/${question.id}`}>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-kiwi-700 mt-1">
              {question.title}
            </h3>
          </Link>
          <p className="text-gray-700 text-sm sm:text-base mt-2 line-clamp-3">
            {question.description}
          </p>
          {isRecommended && (
            <span className="inline-block bg-orange-500 text-white text-xs sm:text-sm font-medium px-2 py-1 rounded-full mt-2">
              Recommended
            </span>
          )}
          <div className="flex space-x-2 mt-2 flex-wrap">
            {question.tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/topics/${tag.name.toLowerCase()}`}
                className="text-sm text-kiwi-700 bg-kiwi-100 px-2 py-1 rounded-full hover:bg-kiwi-200 transition sm:text-sm"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
          <div className="flex space-x-4 mt-3 items-center">
            <Reactions
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              questionId={question.id}
              onVoteUpdate={onVoteUpdate}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center text-kiwi-600 text-sm hover:text-kiwi-800 font-medium"
            >
              <FaComment className="mr-2 text-lg sm:text-xl" />
              {question.answers.length} Comments
            </button>
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
      </div>
      <CommentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        answers={question.answers}
        onReply={handleReply}
        questionId={question.id}
      />
    </div>
  );
};

export default QuestionCard;
