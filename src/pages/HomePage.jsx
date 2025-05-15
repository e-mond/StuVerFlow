import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import QuestionCard from "../components/feed/QuestionCard";
import SearchBar from "../components/common/SearchBar";
import Sidebar from "../components/common/Sidebar";
// import WhatsHappening from "../components/feed/WhatsHappening";
import TrendingDiscussions from "../components/feed/TrendingDiscussions";
import ExpertSpotlight from "../components/feed/ExpertSpotlight";

// Fallback mock data for development
const mockQuestions = [
  {
    id: 1,
    title: "How does StuVerFlow handle user authentication?",
    description:
      "I'm curious about the security measures in place for user data on StuVerFlow.",
    tags: [
      { id: 1, name: "StuVerFlow" },
      { id: 2, name: "Security" },
    ],
    topic: "Platform",
    user: { name: "Eddie", handle: "eddie" },
    upvotes: 10,
    downvotes: 2,
    answers: [{}, {}],
    created_at: new Date().toISOString(),
    isRecommended: true,
  },
  {
    id: 2,
    title: "What is the Pythagorean theorem?",
    description: "Can someone explain how to apply it in geometry problems?",
    tags: [
      { id: 3, name: "Math" },
      { id: 4, name: "Geometry" },
    ],
    topic: "Geometry",
    user: { name: "Sarah", handle: "sarah" },
    upvotes: 5,
    downvotes: 0,
    answers: [{}],
    created_at: new Date().toISOString(),
    isRecommended: false,
  },
  {
    id: 3,
    title: "How to solve a quadratic equation?",
    description:
      "I'm struggling with factoring quadratics in Algebra II. Any tips?",
    tags: [
      { id: 5, name: "Math" },
      { id: 6, name: "Algebra" },
    ],
    topic: "Algebra II",
    user: { name: "Alex", handle: "alex" },
    upvotes: 3,
    downvotes: 1,
    answers: [],
    created_at: new Date().toISOString(),
    isRecommended: false,
  },
];

// Mock tags for "Trending Topics" section
const mockTags = [
  { id: 1, name: "Math", count: 120 },
  { id: 2, name: "Algebra", count: 85 },
  { id: 3, name: "Physics", count: 60 },
];

// Mock data for Expert Spotlight
const mockExperts = [
  {
    id: 1,
    name: "Dr. Jane Doe",
    title: "Professor",
    course: "Calculus I",
    expertise: "Math",
  },
  {
    id: 2,
    name: "Dr. John Smith",
    title: "Researcher",
    course: "Physics II",
    expertise: "Physics",
  },
  {
    id: 3,
    name: "Dr. Maria Lopez",
    title: "Educator",
    course: "Data Science",
    expertise: "AI",
  },
];

// Component rendering the main homepage with academic content
const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("latest");

  useEffect(() => {
    const loadQuestions = () => {
      try {
        setQuestions(mockQuestions);
        setFilteredQuestions(mockQuestions);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError(err.message || "Failed to load questions");
        setQuestions(mockQuestions);
        setFilteredQuestions(mockQuestions);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleSearch = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = questions.filter(
      (q) =>
        q.title.toLowerCase().includes(lowerQuery) ||
        q.tags.some((tag) => tag.name.toLowerCase().includes(lowerQuery)),
    );
    setFilteredQuestions(filtered);
  };

  return (
    <div className="flex min-h-screen bg-white border-4">
      <Sidebar />
      <div className="flex-1 w-full border-x border-kiwi-200 ">
        <div className="p-4 bg-white text-kiwi-700 shadow-md ">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Academic Pulse
          </motion.h1>
          <div className="mt-4 w-full">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="flex bg-kiwi-100">
          <button
            className={`flex-1 text-center py-3 font-semibold text-base hover:bg-kiwi-200 ${
              activeTab === "latest"
                ? "bg-white text-kiwi-800 font-bold border-b-2 border-kiwi-700"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("latest")}
          >
            {activeTab === "latest" && <span className="mr-1">📅</span>}
            Latest
          </button>
          <button
            className={`flex-1 text-center py-3 font-semibold text-base hover:bg-kiwi-200 ${
              activeTab === "myInterests"
                ? "bg-white text-kiwi-800 font-bold border-b-2 border-kiwi-700"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("myInterests")}
          >
            {activeTab === "myInterests" && <span className="mr-1">⭐</span>}
            My Interests
          </button>
          <button
            className={`flex-1 text-center py-3 font-semibold text-base hover:bg-kiwi-200 ${
              activeTab === "bookmarked"
                ? "bg-white text-kiwi-800 font-bold border-b-2 border-kiwi-700"
                : "text-gray-700"
            }`}
            onClick={() => setActiveTab("bookmarked")}
          >
            {activeTab === "bookmarked" && <span className="mr-1">📌</span>}
            Bookmarked
          </button>
        </div>

        <div className="p-4 bg-white border border-kiwi-200 rounded-lg shadow-sm">
          <div className="flex space-x-3">
            <div className="w-12 h-12 rounded-full bg-kiwi-300" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Ask a Question
              </h3>
              <p className="text-sm text-gray-600">
                Share your academic queries with a global community of learners
                and experts.
              </p>
              <div className="mt-4 flex justify-end">
                <Link to="/ask">
                  <button className="bg-kiwi-700 hover:bg-kiwi-800 text-white rounded-lg px-6 py-2 font-medium transition">
                    Ask Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-kiwi-50">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Trending Topics
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {mockTags.map((tag) => (
              <motion.div
                key={tag.id}
                className="bg-kiwi-200 text-gray-900 rounded-lg p-3 text-center cursor-pointer hover:bg-kiwi-300 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={`/topics/${tag.name.toLowerCase()}`}>
                  <span className="text-base font-medium">#{tag.name}</span>
                </Link>
                <p className="text-sm text-gray-700 mt-1">
                  {tag.count} Questions
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading && (
            <p className="text-gray-600 text-base p-4">Loading questions...</p>
          )}
          {error && (
            <p className="text-red-600 text-base p-4">Error: {error}</p>
          )}
          <div className="p-4 space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            ) : (
              <p className="text-gray-600 text-base p-4">
                No questions found. Try adjusting your search.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="p-4 w-80 hidden lg:block bg-white">
        <TrendingDiscussions tags={mockTags} />
        <ExpertSpotlight experts={mockExperts} />
      </div>
    </div>
  );
};

export default HomePage;
