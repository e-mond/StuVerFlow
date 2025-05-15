import { useState, useEffect } from "react";
import { useUser } from "../context/useUser";
import { Link } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import HotQuestionCard from "../components/explore/HotQuestionCard";
import Button from "../components/common/Button";
import { fetchUserQuestions } from "../utils/api";

// Component for displaying questions asked by the logged-in user
const MyQuestionsPage = () => {
  // State for user questions, filter, loading, and error handling
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accessing user context for user ID
  const { user } = useUser();

  // Fetching user questions on component mount
  useEffect(() => {
    const loadUserQuestions = async () => {
      try {
        const userQuestions = await fetchUserQuestions(user.id);
        // Mapping API response to match HotQuestionCard props
        const formattedQuestions = userQuestions.map((q) => ({
          id: q.id,
          title: q.title,
          askedBy: user.name || q.author, // Fallback to API author if user name unavailable
          answers: q.answers?.length || 0,
          createdAt: q.created_at,
          isBookmarked: q.isBookmarked || false,
        }));
        setQuestions(formattedQuestions);
      } catch (err) {
        setError(err.message || "Failed to fetch your questions.");
      } finally {
        setLoading(false);
      }
    };
    loadUserQuestions();
  }, [user]);

  // Sorting questions based on filter
  const sortedQuestions = [...questions].sort((a, b) => {
    if (filter === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
    }
    if (filter === "mostAnswered") {
      return b.answers - a.answers; // Most answers first
    }
    return 0;
  });

  // Rendering loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6">
          <p className="text-gray-600 text-sm sm:text-base">
            Loading your questions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          My Questions
        </h1>

        {/* Error message display */}
        {error && (
          <p className="text-red-500 text-sm sm:text-base mb-4" role="alert">
            {error}
          </p>
        )}

        {/* Filter bar and Ask a Question button */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 mb-6">
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "newest" ? "kiwi" : "outline"}
              size="xs"
              smSize="sm"
              onClick={() => setFilter("newest")}
              className="text-xs sm:text-sm"
            >
              Newest
            </Button>
            <Button
              variant={filter === "mostAnswered" ? "kiwi" : "outline"}
              size="xs"
              smSize="sm"
              onClick={() => setFilter("mostAnswered")}
              className="text-xs sm:text-sm"
            >
              Most Answered
            </Button>
          </div>
          {/* Ask a Question button */}
          <Button
            as={Link}
            to="/ask"
            variant="kiwi"
            size="xs"
            smSize="sm"
            className="text-xs sm:text-sm"
          >
            Ask a Question
          </Button>
        </div>

        {/* Questions list */}
        {sortedQuestions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedQuestions.map((question) => (
              <HotQuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm sm:text-base">
            You haven&apos;t asked any questions yet.{" "}
            <Link
              to="/ask"
              className="text-kiwi hover:text-kiwi-dark underline"
            >
              Ask one now!
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default MyQuestionsPage;
