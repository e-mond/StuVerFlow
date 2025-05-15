import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionCard from "../components/feed/QuestionCard";
import AnswerCard from "../components/feed/AnswerCard";
import Sidebar from "../components/common/Sidebar";
import { fetchQuestions } from "../utils/api";

// QuestionDetailPage component to display a specific question and its answers
const QuestionDetailPage = () => {
  // Extract question ID from URL parameters
  const { id } = useParams();

  // State for the question data and loading status
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the specific question based on ID when the component mounts or ID changes
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);
        const questions = await fetchQuestions();
        const foundQuestion = questions.find((q) => q.id === parseInt(id));
        setQuestion(foundQuestion || null);
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuestion();
  }, [id]);

  return (
    // Main layout with sidebar and content area
    <div className="flex min-h-screen bg-[#F7F9F9]">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 mx-auto border-x border-white bg-white">
        {/* Header with page title */}
        <div className="top-0 border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold text-gray-900">Question Details</h1>
        </div>

        {/* Question and answers section */}
        <div className="p-4">
          {/* Loading state */}
          {loading && <div className="text-gray-600">Loading...</div>}

          {/* Question not found state */}
          {!loading && !question && (
            <div className="text-gray-600">Question not found.</div>
          )}

          {/* Display question and answers if found */}
          {question && (
            <>
              {/* Question card */}
              <QuestionCard question={question} />

              {/* Answers section */}
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
                Answers
              </h2>
              <div>
                {question.answers?.length > 0 ? (
                  // Map through answers and render each AnswerCard
                  question.answers.map((answer) => (
                    <AnswerCard key={answer.id} answer={answer} />
                  ))
                ) : (
                  // Display message if no answers exist
                  <p className="text-gray-600 dark:text-gray-300">
                    No answers yet.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
