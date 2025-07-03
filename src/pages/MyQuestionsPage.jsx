import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import HotQuestionCard from "../components/explore/HotQuestionCard";
import Button from "../components/common/Button";
import { fetchUserQuestions } from "../utils/api";

// Page component to display questions asked by the current user
const MyQuestionsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch questions created by the logged-in user
  useEffect(() => {
    const loadUserQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const userQuestions = await fetchUserQuestions(user.id);
        const formattedQuestions = userQuestions.map((q) => ({
          id: q.id,
          title: q.title,
          askedBy: q.author || user.name || "Anonymous",
          answers: q.answers || 0,
          createdAt: q.created_at,
          isBookmarked: q.isBookmarked || false,
          upvotes: q.upvotes || 0,
          downvotes: q.downvotes || 0,
        }));
        setQuestions(formattedQuestions);
      } catch (err) {
        setError(err.message || "Failed to fetch your questions.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      loadUserQuestions();
    }
  }, [user]);

  // Sort questions by newest or most answered
  const sortedQuestions = [...questions].sort((a, b) => {
    if (filter === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (filter === "mostAnswered") return b.answers - a.answers;
    return 0;
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <p className="text-gray-500 text-sm animate-pulse" role="status">
            Loading your questions...
          </p>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <p className="text-red-500 text-sm" role="alert">
            {error}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 max-w-6xl mx-auto w-full">
        <section className="mb-6">
          <h1
            className="text-2xl sm:text-3xl font-bold text-gray-900"
            role="heading"
            aria-level={1}
          >
            My Questions
          </h1>
        </section>
        <section className="bg-kiwi-50 rounded-xl p-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "newest" ? "kiwi" : "outline"}
              size="xs"
              smSize="sm"
              onClick={() => setFilter("newest")}
            >
              Newest
            </Button>
            <Button
              variant={filter === "mostAnswered" ? "kiwi" : "outline"}
              size="xs"
              smSize="sm"
              onClick={() => setFilter("mostAnswered")}
            >
              Most Answered
            </Button>
          </div>
          <Link to="/ask" className="w-full sm:w-auto">
            <Button
              variant="kiwi"
              size="xs"
              smSize="sm"
              className="w-full sm:w-auto text-center"
            >
              Ask a Question
            </Button>
          </Link>
        </section>
        {sortedQuestions.length > 0 ? (
          <section
            className="sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            aria-label="Your questions"
          >
            <div className="sm:hidden -mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 w-max pb-2">
                {sortedQuestions.map((question) => (
                  <HotQuestionCard key={question.id} question={question} />
                ))}
              </div>
            </div>
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedQuestions.map((question) => (
                <HotQuestionCard key={question.id} question={question} />
              ))}
            </div>
          </section>
        ) : (
          <p className="text-gray-600 text-sm sm:text-base">
            You haven&apos;t asked any questions yet.{" "}
            <Link
              to="/ask"
              className="text-kiwi-700 hover:text-kiwi-900 underline"
            >
              Ask one now
            </Link>
            .
          </p>
        )}
      </main>
    </div>
  );
};

export default MyQuestionsPage;
