import { motion } from "framer-motion";
import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";
import Button from "../common/Button";

// AnswerCard component to display individual answers with voting functionality
const AnswerCard = ({ answer }) => {
  return (
    // Motion div for smooth animation on render
    <motion.div
      className="bg-kiwi-50 p-4 rounded-lg shadow-md mb-4 ml-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      role="article"
      aria-label={`Answer by ${answer.user?.name || "Unknown"}`}
    >
      {/* Answer content */}
      <h3 className="text-gray-600">{answer.content}</h3>

      {/* Voting buttons with rounded up/down arrows */}
      <div className="flex space-x-5 mt-4">
        <Button variant="outline" className="flex items-center space-x-1">
          <FaArrowCircleUp className="text-kiwi-700" />
          <span>{answer.upvotes || 0}</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-1">
          <FaArrowCircleDown className="text-kiwi-700" />
          <span>{answer.downvotes || 0}</span>
        </Button>
      </div>

      {/* Answer metadata: author and date */}
      <p className="text-sm text-gray-900 dark:text-gray-400 mt-2">
        Answered by {answer.user?.name || "Unknown"} on{" "}
        {new Date(answer.created_at).toLocaleDateString()}
      </p>
    </motion.div>
  );
};

export default AnswerCard;
