import { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import HotQuestionCard from "../components/explore/HotQuestionCard";
import StudyGroupCard from "../components/explore/StudyGroupCard";
import Button from "../components/common/Button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Mock data for trending tags
const mockTrendingTags = [
  "math",
  "ai",
  "biology",
  "history",
  "coding",
  "physics",
];

// Mock data for hot questions
const mockHotQuestions = [
  {
    id: 1,
    title: "How to solve this calculus problem?",
    askedBy: "Jamie Lee",
    answers: 12,
  },
  {
    id: 2,
    title: "Best AI tools for students?",
    askedBy: "Priya S.",
    answers: 8,
  },
  {
    id: 3,
    title: "Tips for group study success?",
    askedBy: "Omar R.",
    answers: 5,
  },
];

// Mock data for new users
const mockNewUsers = [
  {
    id: 1,
    name: "Maya Patel",
    avatar: "https://via.placeholder.com/40?text=M",
    joined: "2h ago",
  },
  {
    id: 2,
    name: "Ethan Zhou",
    avatar: "https://via.placeholder.com/40?text=E",
    joined: "1h ago",
  },
  {
    id: 3,
    name: "Sara Gomez",
    avatar: "https://via.placeholder.com/40?text=S",
    joined: "5m ago",
  },
];

// Mock data for study groups
const mockStudyGroups = [
  {
    id: 1,
    name: "Math Study Group",
    description: "A group for students preparing for calculus exams.",
    members: 25,
  },
  {
    id: 2,
    name: "AI Enthusiasts",
    description: "Discussing the latest in AI and machine learning.",
    members: 18,
  },
];

// Component for searching and displaying various sections
const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTopics, setFilteredTopics] = useState(mockTrendingTags);
  const [filterCategory, setFilterCategory] = useState("All");

  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();
    const topicResults = mockTrendingTags.filter((tag) =>
      tag.toLowerCase().includes(lowerQuery),
    );
    setFilteredTopics(topicResults);
  };

  const handleFilterChange = (category) => {
    setFilterCategory(category);
    if (category === "All") {
      setFilteredTopics(mockTrendingTags);
    } else {
      setFilteredTopics(
        mockTrendingTags.filter(
          (tag) => tag.toLowerCase() === category.toLowerCase(),
        ),
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search</h1>

        {/* Search Bar with Filter Buttons */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for topics..."
            className="flex-1 p-2 rounded-lg bg-kiwi-50 text-gray-900 placeholder-gray-500 border border-kiwi-200 focus:outline-none focus:ring-2 focus:ring-kiwi-700"
          />
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant={filterCategory === "All" ? "kiwi" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("All")}
            >
              All
            </Button>
            <Button
              variant={filterCategory === "Math" ? "kiwi" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("Math")}
            >
              Math
            </Button>
            <Button
              variant={filterCategory === "AI" ? "kiwi" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("AI")}
            >
              AI
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          {/* Trending Tags Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Trending Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-kiwi-50 text-kiwi-700 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-gray-600">No tags found.</p>
              )}
            </div>
          </div>

          {/* Hot Questions Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Hot Questions
            </h2>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              <FaChevronLeft className="text-kiwi-700 cursor-pointer hidden sm:block" />
              {mockHotQuestions.map((question) => (
                <HotQuestionCard key={question.id} question={question} />
              ))}
              <FaChevronRight className="text-kiwi-700 cursor-pointer hidden sm:block" />
            </div>
          </div>

          {/* New Users Section (Single Card) */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">New Users</h2>
            <div className="bg-kiwi-50 p-4 rounded-lg shadow-md">
              {mockNewUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 mb-4 last:mb-0"
                >
                  <img
                    src={user.avatar}
                    alt={`${user.name}'s avatar`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined {user.joined}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Groups Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Study Groups
            </h2>
            {mockStudyGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
