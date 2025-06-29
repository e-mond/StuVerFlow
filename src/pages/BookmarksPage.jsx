import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import Sidebar from "../components/common/Sidebar";
import QuestionCard from "../components/feed/QuestionCard";
import Button from "../components/common/Button";
import { fetchBookmarks, bookmarkQuestion } from "../utils/api";

// Component for displaying and managing bookmarked questions
const BookmarksPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch bookmarks
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookmarkData = await fetchBookmarks(user.id);
        setBookmarks(bookmarkData);
      } catch (err) {
        setError(err.message || "Failed to fetch bookmarks.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      loadBookmarks();
    }
  }, [user]);

  // Handle bookmark toggle
  const handleBookmarkToggle = async (questionId, isBookmarked) => {
    try {
      await bookmarkQuestion(questionId, user.id, !isBookmarked);
      setBookmarks((prev) =>
        isBookmarked
          ? prev.filter((q) => q.id !== questionId)
          : [...prev, { id: questionId, isBookmarked: true }],
      );
    } catch (err) {
      setError(err.message || "Failed to update bookmark.");
    }
  };

  // Filter bookmarks based on answered/unanswered status
  const filteredBookmarks = bookmarks.filter((question) => {
    if (filter === "All") return true;
    if (filter === "Unanswered") return question.answers.length === 0;
    if (filter === "Answered") return question.answers.length > 0;
    return true;
  });

  // Render loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6">
          <p className="text-gray-600 text-sm sm:text-base">
            Loading bookmarks...
          </p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6">
          <p className="text-red-500 text-sm sm:text-base" role="alert">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Bookmarks
        </h1>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "All" ? "kiwi" : "outline"}
              size="xs"
              smSize="sm"
              onClick={() => setFilter("All")}
              className="text-xs sm:text-sm"
            >
              All
            </Button>
            <Button
              variant={filter === "Unanswered" ? "kiwi" : "outline"}
              size="xs"
              smSize="sm"
              onClick={() => setFilter("Unanswered")}
              className="text-xs sm:text-sm"
            >
              Unanswered
            </Button>
            <Button
              variant={filter === "Answered" ? "kiwi" : "outline"}
              size="xs"
              smSize="sm"
              onClick={() => setFilter("Answered")}
              className="text-xs sm:text-sm"
            >
              Answered
            </Button>
          </div>
        </div>
        {filteredBookmarks.length > 0 ? (
          <div className="space-y-4">
            {filteredBookmarks.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm sm:text-base">
            No bookmarked questions found.
          </p>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
