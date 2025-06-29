import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionCard from "../components/feed/QuestionCard";
import AnswerCard from "../components/feed/AnswerCard";
import Sidebar from "../components/common/Sidebar";
import { fetchQuestionById } from "../utils/api";

// QuestionDetailPage component to display a specific question and its answers
const QuestionDetailPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        const questionData = await fetchQuestionById(id);
        setQuestion(questionData);
      } catch (error) {
        console.error("Error fetching question:", error);
        setError(error.message || "Failed to fetch question");
      } finally {
        setLoading(false);
      }
    };
    loadQuestion();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-[#F7F9F9]">
      <Sidebar />
      <div className="flex-1 mx-auto border-x border-white bg-white">
        <div className="top-0 border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold text-gray-900">Question Details</h1>
        </div>
        <div className="p-4">
          {loading && <div className="text-gray-600">Loading...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && !question && (
            <div className="text-gray-600">Question not found.</div>
          )}
          {question && (
            <>
              <QuestionCard question={question} />
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
                Answers
              </h2>
              <div>
                {question.answers?.length > 0 ? (
                  question.answers.map((answer) => (
                    <AnswerCard key={answer.id} answer={answer} />
                  ))
                ) : (
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
