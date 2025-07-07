import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import QuestionCard from "../components/feed/QuestionCard";
import SearchBar from "../components/common/SearchBar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import TrendingDiscussions from "../components/feed/TrendingDiscussions";
import ExpertSpotlight from "../components/feed/ExpertSpotlight";
import NewUsers from "../components/feed/NewUsers";
import EnhancedSearchBar from "../components/common/EnhancedSearchBar";

import {
  fetchQuestions,
  fetchQuestionsByInterests,
  fetchBookmarks,
  searchQuestions,
} from "../utils/api";
import { fetchTrendingTags } from "../utils/api";
import { fetchExperts } from "../utils/api";
import Statements from "../components/feed/Statements";

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [experts, setExperts] = useState([]);
  const [activeTab, setActiveTab] = useState("latest");
  const [isMobile, setIsMobile] = useState(false);
  const [randomExpert, setRandomExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
      if (!user?.id) {
        navigate("/login");
      return;
      }
  }, [user, navigate]);

  // Load initial data (tags, experts)
  useEffect(() => {
    if (!user?.id) return;

    const loadInitialData = async () => {
      try {
        const [tagsData, expertsData] = await Promise.all([
          fetchTrendingTags(),
          fetchExperts(),
        ]);
        setTags(tagsData);
        setExperts(expertsData);
        setRandomExpert(
          expertsData[Math.floor(Math.random() * expertsData.length)],
        );
        setIsMobile(window.innerWidth < 1024);
      } catch (err) {
        console.error("Failed to load initial data:", err);
        setTags([]);
        setExperts([]);
        setRandomExpert(null);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    const resizeHandler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [user]);

  // Load questions when tab changes
  useEffect(() => {
    if (!user?.id || loading) return;

    const loadQuestions = async () => {
      try {
        setTabLoading(true);
        setError(null);
        let questionsData = [];

        switch (activeTab) {
          case "latest":
            questionsData = await fetchQuestions(); // Get latest questions
            break;
          case "myInterests":
            if (user.interests) {
              questionsData = await fetchQuestionsByInterests(user.id);
            } else {
              questionsData = [];
              setError("Please update your profile with interests to see personalized questions.");
            }
            break;
          case "bookmarked":
            try {
              questionsData = await fetchBookmarks(user.id);
            } catch (err) {
              // If bookmarks endpoint doesn't exist, filter from all questions
              const allQuestions = await fetchQuestions();
              questionsData = allQuestions.filter(q => q.isBookmarked);
            }
            break;
          default:
            questionsData = [];
        }

        setQuestions(questionsData);
        setFilteredQuestions(questionsData);
      } catch (err) {
        setError(err.message || `Failed to load ${activeTab} questions`);
        setQuestions([]);
        setFilteredQuestions([]);
      } finally {
        setTabLoading(false);
      }
    };

    loadQuestions();
  }, [activeTab, user, loading]);

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredQuestions(questions);
      return;
    }
    try {
      const searchResults = await searchQuestions(query);
      setFilteredQuestions(searchResults);
    } catch (err) {
      setError(err.message || "Failed to search questions");
      setFilteredQuestions([]);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null); // Clear any previous errors
  };

  const injectExpertIntoFeed = () => {
    if (!isMobile || !randomExpert || filteredQuestions.length === 0) {
      return filteredQuestions;
    }
    const copy = [...filteredQuestions];
    copy.splice(
      1,
      0,
      <motion.div
        key="mobile-expert"
        className="bg-white border border-kiwi-300 p-4 rounded-xl shadow-md relative overflow-hidden mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-kiwi-400 via-kiwi-500 to-kiwi-700 rounded-t-xl" />
        <h3 className="text-kiwi-800 font-bold text-lg mb-1 mt-2 flex items-center gap-2">
          🌟 Expert Spotlight
        </h3>
        <p className="text-sm text-gray-600 mb-2">Featured academic expert</p>
        <div className="bg-kiwi-100 p-3 rounded-lg">
          <h4 className="text-gray-900 font-semibold">{randomExpert.name}</h4>
          <p className="text-sm text-gray-600">{randomExpert.title}</p>
          <p className="text-xs text-gray-500 italic">
            Teaches: {randomExpert.course}
          </p>
        </div>
      </motion.div>,
    );
    return copy;
  };

  const feed = injectExpertIntoFeed();

  const getTabMessage = () => {
    switch (activeTab) {
      case "latest":
        return {
          title: "Latest Questions",
          subtitle: "Most recent questions from the community",
          emptyMessage: "No recent questions found. Be the first to ask something!",
          icon: "📅"
        };
      case "myInterests":
        return {
          title: "Questions for You",
          subtitle: "Questions matching your interests and expertise",
          emptyMessage: user.interests 
            ? "No questions matching your interests yet. Check back later!"
            : "Update your profile with interests to see personalized questions.",
          icon: "⭐"
        };
      case "bookmarked":
        return {
          title: "Bookmarked Questions",
          subtitle: "Questions you've saved for later",
          emptyMessage: "You haven't bookmarked any questions yet. Bookmark questions to find them here!",
          icon: "📌"
        };
      default:
        return {
          title: "Questions",
          subtitle: "Academic questions and discussions",
          emptyMessage: "No questions found.",
          icon: "❓"
        };
    }
  };

  const tabInfo = getTabMessage();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kiwi-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your academic feed...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
      <Sidebar />
        <div className="flex-1 w-full border-x border-gray-200">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <motion.h1
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Academic Pulse
          </motion.h1>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name || user?.username || "Student"}! 👋
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Discover questions, share knowledge, and connect with peers
              </p>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="lg:w-96">
              <EnhancedSearchBar 
                size="default"
                placeholder="Search questions, topics, users..."
                showSuggestions={true}
                showHistory={true}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-50 border-b border-gray-200">
          {["latest", "myInterests", "bookmarked"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 text-center py-4 font-medium text-sm relative transition-colors ${
                activeTab === tab
                  ? "bg-white text-kiwi-700 border-b-2 border-kiwi-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              <span className="flex items-center justify-center gap-2">
                <span>
                  {tab === "latest"
                    ? "📅"
                    : tab === "myInterests"
                      ? "⭐"
                      : "📌"}
                </span>
              {tab === "latest"
                ? "Latest"
                : tab === "myInterests"
                  ? "My Interests"
                  : "Bookmarked"}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Tags */}
        <div className="lg:hidden px-4 py-3 overflow-x-auto bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-3">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/topics/${tag.name.toLowerCase()}`}
                className="whitespace-nowrap bg-white text-kiwi-700 px-3 py-1 rounded-full border border-kiwi-200 hover:bg-kiwi-50 text-sm font-medium transition"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Ask Question Section */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex space-x-3">
            <div className="w-10 h-10 rounded-full bg-kiwi-300 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Ask a Question
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Share your academic queries with the community.
              </p>
                <Link to="/ask">
                <button className="bg-kiwi-700 hover:bg-kiwi-800 text-white rounded-lg px-4 py-2 font-medium transition">
                    Ask Now
                  </button>
                </Link>
              </div>
            </div>
          </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Tab Info Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{tabInfo.icon}</span>
              <h2 className="text-xl font-semibold text-gray-900">{tabInfo.title}</h2>
            </div>
            <p className="text-gray-600 text-sm">{tabInfo.subtitle}</p>
          </div>

          {/* Loading State for Tab Content */}
          {tabLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kiwi-700 mx-auto mb-3"></div>
              <p className="text-gray-600">Loading questions...</p>
            </div>
          )}

          {/* Error State */}
          {error && !tabLoading && (
            <div className="text-center py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              {activeTab === "myInterests" && !user.interests && (
                <Link to="/profile">
                  <button className="bg-kiwi-700 text-white px-4 py-2 rounded-lg hover:bg-kiwi-800 transition">
                    Update Profile
                  </button>
                </Link>
              )}
        </div>
          )}

          {/* Questions Feed */}
          {!tabLoading && !error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-4">
                {feed.length > 0 ? (
                  feed.map((item, i) =>
                  typeof item === "object" && item?.props ? (
                    item
                  ) : (
                      <QuestionCard 
                        key={item.id || i} 
                        question={item}
                        onBookmarkToggle={() => {
                          // Refresh questions if we're on bookmarked tab
                          if (activeTab === "bookmarked") {
                            handleTabChange("bookmarked");
                          }
                        }}
                      />
                  ),
                )
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">{tabInfo.icon}</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {tabInfo.title.replace("Questions", "").trim() || "Questions"}
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      {tabInfo.emptyMessage}
                    </p>
                    {activeTab === "myInterests" && !user.interests ? (
                      <Link to="/profile">
                        <button className="bg-kiwi-700 text-white px-4 py-2 rounded-lg hover:bg-kiwi-800 transition">
                          Add Interests
                        </button>
                      </Link>
                    ) : activeTab === "latest" ? (
                      <Link to="/ask">
                        <button className="bg-kiwi-700 text-white px-4 py-2 rounded-lg hover:bg-kiwi-800 transition">
                          Ask First Question
                        </button>
                      </Link>
                    ) : (
                      <Link to="/ask">
                        <button className="bg-kiwi-700 text-white px-4 py-2 rounded-lg hover:bg-kiwi-800 transition">
                          Ask a Question
                        </button>
                      </Link>
                )}
                  </div>
                )}
              </div>

              {/* Mobile Components */}
            {isMobile && (
                <div className="mt-8 space-y-6">
                <TrendingDiscussions tags={tags} />
                <ExpertSpotlight experts={experts} />
                <NewUsers />
                <Statements />
              </div>
              )}
            </motion.div>
            )}
          </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="p-4 w-80 hidden lg:block bg-gray-50 border-l border-gray-200">
        <div className="sticky top-4 space-y-6">
          <TrendingDiscussions tags={tags} />
          <ExpertSpotlight experts={experts} />
          <NewUsers />
          <Statements />
        </div>
      </div>
      </div>
    
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
