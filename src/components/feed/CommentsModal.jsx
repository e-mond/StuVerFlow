import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { postAnswer } from "../../utils/api";

const CommentsModal = ({ isOpen, onClose, answers, onReply, questionId }) => {
  const [replyText, setReplyText] = useState("");
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert("Please log in to post a reply.");
      return;
    }
    if (replyText.trim()) {
      try {
        await postAnswer(questionId, user.id, replyText);
        onReply(replyText);
        setReplyText("");
        onClose();
      } catch (error) {
        alert(`Failed to post reply: ${error.message}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
          <button
            onClick={onClose}
            className="text-kiwi-500 hover:text-kiwi-700 focus:outline-none"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto mb-4">
          {answers.length > 0 ? (
            answers.map((answer, index) => (
              <div key={index} className="border-b border-kiwi-200 py-3">
                <p className="text-gray-700">
                  {answer.content || "Sample reply text."}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  By {answer.user?.name || "Anonymous"} •{" "}
                  {new Date(
                    answer.created_at || new Date(),
                  ).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">
              No comments yet. Be the first to reply!
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Add your reply..."
            className="w-full p-3 rounded-lg bg-kiwi-100 text-gray-900 border border-kiwi-200 focus:outline-none focus:ring-2 focus:ring-kiwi-700 resize-none h-24"
            required
          />
          <div className="flex justify-end mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-kiwi-700 hover:bg-kiwi-800 text-white rounded-lg font-medium transition"
            >
              Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentsModal;
