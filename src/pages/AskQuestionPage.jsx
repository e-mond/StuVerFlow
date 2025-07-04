import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import QuestionForm from "../components/feed/QuestionForm";
import Sidebar from "../components/common/Sidebar";
import { FaCommentAlt } from "react-icons/fa";

// Component for creating and previewing a new question
const AskQuestionPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
    image: null,
  });

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Update form data for live preview
  const handleFormChange = (data) => {
    setFormData(data);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 border-x border-kiwi-200">
        <div className="sticky top-0 bg-white border-kiwi-200 sm:p-4">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Ask a Question
          </h1>
        </div>
        <div className="p-3 sm:p-4 space-y-6">
          <div className="max-w-2xl mx-auto">
            <QuestionForm onChange={handleFormChange} />
          </div>
          <div className="max-w-xl mx-auto">
            <div className="bg-kiwi-50 rounded-lg shadow-md p-4 border border-kiwi-200">
              <div className="flex items-center mb-3">
                <div className="w-7 h-7 bg-kiwi-200 border-kiwi-800 rounded-full flex items-center justify-center mr-2">
                  <FaCommentAlt className="text-kiwi-700 text-base" />
                </div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  Live Preview
                </h2>
              </div>
              {formData.title ||
              formData.description ||
              formData.tags.length > 0 ||
              formData.image ? (
                <div className="space-y-2 overflow-scroll">
                  <h3 className="text-base sm:text-lg font-medium text-black">
                    {formData.title || "Question Title"}
                  </h3>
                  <p className="text-sm sm:text-base text-black">
                    {formData.description ||
                      "Question description will appear here..."}
                  </p>
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Question preview"
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.length > 0 ? (
                      formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-kiwi-50 dark:bg-kiwi-700 text-kiwi-900 dark:text-kiwi-50 text-xs sm:text-sm px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-black text-xs sm:text-sm">
                        Tags will appear here...
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 text-sm sm:text-base">
                  Your question preview will appear as you type...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionPage;
