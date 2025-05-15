import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/common/Sidebar";
import QuestionCard from "../components/feed/QuestionCard";

// Mock data for development (same as HomePage for consistency)
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
    user: { id: 1, name: "Eddie", handle: "eddie" },
    upvotes: 10,
    downvotes: 2,
    answers: [
      { id: 1, content: "Mock answer" },
      { id: 2, content: "Another mock answer" },
    ],
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
    user: { id: 2, name: "Sarah", handle: "sarah" },
    upvotes: 5,
    downvotes: 0,
    answers: [{ id: 3, content: "Mock answer" }],
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
    user: { id: 3, name: "Alex", handle: "alex" },
    upvotes: 3,
    downvotes: 1,
    answers: [],
    created_at: new Date().toISOString(),
    isRecommended: false,
  },
];

// Mock topic data for stats and description
const mockTopics = [
  {
    name: "Math",
    description: "All about mathematics, from algebra to calculus.",
    count: 120,
  },
  {
    name: "Algebra",
    description: "Explore algebraic concepts and equations.",
    count: 85,
  },
  {
    name: "Geometry",
    description: "Dive into shapes, angles, and theorems.",
    count: 50,
  },
  {
    name: "StuVerFlow",
    description: "Questions about the StuVerFlow platform.",
    count: 30,
  },
  {
    name: "Security",
    description: "Learn about cybersecurity and data protection.",
    count: 25,
  },
  {
    name: "Physics",
    description: "Physics concepts and problem-solving.",
    count: 60,
  },
];

// Component rendering a topic-specific page with related questions
const TopicPage = () => {
  const { topic } = useParams();
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const filtered = mockQuestions.filter((q) =>
          q.tags.some((tag) => tag.name.toLowerCase() === topic.toLowerCase()),
        );
        setFilteredQuestions(filtered);

        const selectedTopic = mockTopics.find(
          (t) => t.name.toLowerCase() === topic.toLowerCase(),
        );
        if (!selectedTopic) throw new Error("Topic not found");
        setTopicData(selectedTopic);
      } catch (err) {
        console.error("Error loading topic data:", err);
        setError(err.message || "Failed to load topic data");
        setFilteredQuestions(
          mockQuestions.filter((q) =>
            q.tags.some(
              (tag) => tag.name.toLowerCase() === topic.toLowerCase(),
            ),
          ),
        );
        const selectedTopic = mockTopics.find(
          (t) => t.name.toLowerCase() === topic.toLowerCase(),
        );
        setTopicData(
          selectedTopic || {
            name: topic,
            description: "No description available.",
            count: 0,
          },
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [topic]);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 max-w-2xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 capitalize">
            {topicData?.name || topic}
          </h1>
          <p className="text-gray-600 mt-2">
            {topicData?.description || "No description available."}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {topicData?.count || filteredQuestions.length} questions
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {loading && <p className="text-gray-600 p-4">Loading questions...</p>}
          {error && <p className="text-red-600 p-4">Error: {error}</p>}
          <div>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))
            ) : (
              <p className="text-gray-600 p-4">
                No questions found for this topic.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TopicPage;
