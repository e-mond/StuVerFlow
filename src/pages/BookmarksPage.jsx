import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import Sidebar from "../components/common/Sidebar";
import QuestionCard from "../components/feed/QuestionCard";
import { fetchBookmarks, bookmarkQuestion } from "../utils/api";
import { toast } from "react-toastify";

// Component for displaying and managing bookmarked questions
const BookmarksPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    answered: 0,
    unanswered: 0,
    recent: 0
  });

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch bookmarks
  useEffect(() => {
    const loadBookmarks = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        const bookmarkData = await fetchBookmarks(user.id);
        setBookmarks(bookmarkData);
        
        // Calculate statistics
        const total = bookmarkData.length;
        const answered = bookmarkData.filter(q => q.answers && q.answers.length > 0).length;
        const unanswered = total - answered;
        const recent = bookmarkData.filter(q => {
          const bookmarkDate = new Date(q.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return bookmarkDate >= weekAgo;
        }).length;

        setStats({ total, answered, unanswered, recent });
      } catch (err) {
        setError(err.message || "Failed to fetch bookmarks.");
        toast.error("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };

      loadBookmarks();
  }, [user]);

  // Handle bookmark toggle
  const handleBookmarkToggle = async (questionId, isBookmarked) => {
    try {
      const result = await bookmarkQuestion(questionId);
      
      // Since we're on the bookmarks page and the user clicked to unbookmark,
      // remove it from the list regardless of the API response
      setBookmarks(prev => prev.filter(q => q.id !== questionId));
      setStats(prev => ({
        ...prev,
        total: prev.total - 1
      }));
      toast.success("Question removed from bookmarks");
    } catch (err) {
      toast.error("Failed to update bookmark");
    }
  };

  // Filter and sort bookmarks
  useEffect(() => {
    let filtered = [...bookmarks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(question => 
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    switch (filter) {
      case "answered":
        filtered = filtered.filter(q => q.answers && q.answers.length > 0);
        break;
      case "unanswered":
        filtered = filtered.filter(q => !q.answers || q.answers.length === 0);
        break;
      case "recent":
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(q => new Date(q.created_at) >= weekAgo);
        break;
      default:
        // "all" - no additional filtering
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "most_votes":
        filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchQuery, filter, sortBy]);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kiwi-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookmarks...</p>
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
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bookmarks</h2>
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
                <span className="text-2xl">📌</span>
                My Bookmarks
        </h1>
              <p className="text-gray-600 text-sm mt-1">
                Questions you've saved for later reference
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {stats.total} bookmark{stats.total !== 1 ? 's' : ''}
              </div>
              <Link to="/home">
                <button className="bg-kiwi-700 text-white px-4 py-2 rounded-lg hover:bg-kiwi-800 transition text-sm">
                  Explore Questions
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="text-blue-500 text-xl">📚</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Answered</p>
                <p className="text-2xl font-bold text-green-600">{stats.answered}</p>
              </div>
              <div className="text-green-500 text-xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unanswered</p>
                <p className="text-2xl font-bold text-orange-600">{stats.unanswered}</p>
              </div>
              <div className="text-orange-500 text-xl">❓</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent</p>
                <p className="text-2xl font-bold text-purple-600">{stats.recent}</p>
              </div>
              <div className="text-purple-500 text-xl">🕒</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search bookmarks..."
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
                  { key: "all", label: "All", count: stats.total },
                  { key: "answered", label: "Answered", count: stats.answered },
                  { key: "unanswered", label: "Unanswered", count: stats.unanswered },
                  { key: "recent", label: "Recent", count: stats.recent }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      filter === key
                        ? "bg-kiwi-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="min-w-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kiwi-500 focus:border-transparent text-sm"
            >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most_votes">Most Votes</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
        {filteredBookmarks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {filteredBookmarks.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
              <QuestionCard
                question={question}
                onBookmarkToggle={handleBookmarkToggle}
              />
                </motion.div>
            ))}
            </motion.div>
          ) : bookmarks.length === 0 ? (
            // No bookmarks at all
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📌</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Bookmarks Yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Start bookmarking questions you want to save for later. Click the bookmark icon on any question to add it here.
              </p>
              <Link to="/home">
                <button className="bg-kiwi-700 text-white px-6 py-3 rounded-lg hover:bg-kiwi-800 transition">
                  Explore Questions
                </button>
              </Link>
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
                  ? `No bookmarks match "${searchQuery}". Try different keywords.`
                  : `No bookmarks match the selected filter. Try a different category.`
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
                  onClick={() => setFilter("all")}
                  className="bg-kiwi-700 text-white px-4 py-2 rounded-lg hover:bg-kiwi-800 transition"
                >
                  Show All
                </button>
              </div>
            </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;
