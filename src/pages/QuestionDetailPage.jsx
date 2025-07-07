import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuestionCard from "../components/feed/QuestionCard";
import AnswerCard from "../components/feed/AnswerCard";
import Sidebar from "../components/common/Sidebar";
import Button from "../components/common/Button";
import { fetchQuestionById, postAnswer } from "../utils/api";
import { useUser } from "../context/UserContext";

// QuestionDetailPage component to display a specific question and its answers
const QuestionDetailPage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError("Please log in to post an answer.");
      return;
    }
    
    if (!answerText.trim()) {
      setError("Please enter your answer before submitting.");
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const newAnswer = await postAnswer(id, user.id, answerText);
      
      // Update the question state with the new answer
      setQuestion(prev => ({
        ...prev,
        answers: [newAnswer, ...(prev.answers || [])]
      }));
      
      // Clear the form
      setAnswerText("");
      
    } catch (error) {
      console.error("Error posting answer:", error);
      setError(error.message || "Failed to post answer");
    } finally {
      setSubmitting(false);
    }
  };

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
              <QuestionCard 
                question={question} 
                onVoteUpdate={(newVotes) => {
                  setQuestion(prev => ({
                    ...prev,
                    upvotes: newVotes.upvotes,
                    downvotes: newVotes.downvotes
                  }));
                }}
              />
              
              {/* Answer Form */}
              {user?.id && (
                <div className="mt-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Your Answer
                  </h3>
                  <form onSubmit={handleSubmitAnswer}>
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kiwi-500 focus:border-transparent resize-none"
                      rows="6"
                      disabled={submitting}
                    />
                    <div className="flex justify-end mt-3">
                      <Button
                        type="submit"
                        variant="kiwi"
                        disabled={submitting || !answerText.trim()}
                        className="min-w-[120px]"
                      >
                        {submitting ? "Posting..." : "Post Answer"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {!user?.id && (
                <div className="mt-6 mb-6 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">
                    Please log in to post an answer.
                  </p>
                </div>
              )}
              
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
                Answers ({question.answers?.length || 0})
              </h2>
              <div>
                {question.answers?.length > 0 ? (
                  question.answers.map((answer) => (
                    <AnswerCard key={answer.id} answer={answer} />
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-300">
                    No answers yet. Be the first to answer!
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
