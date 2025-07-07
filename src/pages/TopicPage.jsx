import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../context/UserContext";
import Sidebar from "../components/common/Sidebar";
import QuestionCard from "../components/feed/QuestionCard";
import { fetchQuestions, fetchTopic } from "../utils/api";

const TopicPage = () => {
  const { topic } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch topic data and questions
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [questions, topicInfo] = await Promise.all([
          fetchQuestions(topic),
          fetchTopic(topic),
        ]);
        setFilteredQuestions(questions);
        setTopicData(topicInfo);
      } catch (err) {
        setError(err.message || "Failed to load topic data");
        setTopicData({
          name: topic,
          description: "No description available.",
          count: 0,
        });
        setFilteredQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      loadData();
    }
  }, [topic, user]);

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
          {error && (
            <p className="text-red-600 p-4" role="alert">
              Error: {error}
            </p>
          )}
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
