import { motion } from "framer-motion";
import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";
import Button from "../common/Button";
import { useState } from "react";
import { useUser } from "../../context/useUser";
import { voteOnAnswer } from "../../utils/api";

// AnswerCard component to display individual answers with voting functionality
const AnswerCard = ({ answer }) => {
  const [upvotes, setUpvotes] = useState(answer.upvotes || 0);
  const [downvotes, setDownvotes] = useState(answer.downvotes || 0);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const handleVote = async (voteType) => {
    if (!user?.id) {
      setError("You must be logged in to vote");
      return;
    }
    try {
      setError(null);
      const response = await voteOnAnswer(answer.id, user.id, voteType);
      setUpvotes(response.upvotes || upvotes);
      setDownvotes(response.downvotes || downvotes);
    } catch (err) {
      setError(err.message || "Failed to vote");
    }
  };

  return (
    <motion.div
      className="bg-kiwi-50 p-4 rounded-lg shadow-md mb-4 ml-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      role="article"
      aria-label={`Answer by ${answer.user?.name || "Unknown"}`}
    >
      {error && (
        <p className="text-red-600 text-sm mb-2" role="alert">
          {error}
        </p>
      )}
      <h3 className="text-gray-600">{answer.content}</h3>
      <div className="flex space-x-5 mt-4">
        <Button
          variant="outline"
          className="flex items-center space-x-1"
          onClick={() => handleVote("upvote")}
        >
          <FaArrowCircleUp className="text-kiwi-700" />
          <span>{upvotes}</span>
        </Button>
        <Button
          variant="outline"
          className="flex items-center space-x-1"
          onClick={() => handleVote("downvote")}
        >
          <FaArrowCircleDown className="text-kiwi-700" />
          <span>{downvotes}</span>
        </Button>
      </div>
      <p className="text-sm text-gray-900 dark:text-gray-400 mt-2">
        Answered by {answer.user?.name || "Unknown"} on{" "}
        {new Date(answer.created_at).toLocaleDateString()}
      </p>
    </motion.div>
  );
};

export default AnswerCard;
