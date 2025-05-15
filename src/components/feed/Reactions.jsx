import { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// Component handling upvote and downvote reactions with interactive state
const Reactions = ({ upvotes, downvotes }) => {
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [userDownvoted, setUserDownvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(upvotes);
  const [downvoteCount, setDownvoteCount] = useState(downvotes);

  const handleUpvote = () => {
    if (userUpvoted) {
      setUserUpvoted(false);
      setUpvoteCount(upvoteCount - 1);
    } else {
      setUserUpvoted(true);
      setUpvoteCount(upvoteCount + 1);
      if (userDownvoted) {
        setUserDownvoted(false);
        setDownvoteCount(downvoteCount - 1);
      }
    }
  };

  const handleDownvote = () => {
    if (userDownvoted) {
      setUserDownvoted(false);
      setDownvoteCount(downvoteCount - 1);
    } else {
      setUserDownvoted(true);
      setDownvoteCount(downvoteCount + 1);
      if (userUpvoted) {
        setUserUpvoted(false);
        setUpvoteCount(upvoteCount - 1);
      }
    }
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleUpvote}
        className={`flex items-center space-x-1 text-gray-500 hover:text-[#1DA1F2] ${userUpvoted ? "text-[#1DA1F2]" : ""}`}
      >
        <FaArrowUp />
        <span>{upvoteCount}</span>
      </button>
      <button
        onClick={handleDownvote}
        className={`flex items-center space-x-1 text-gray-500 hover:text-[#EF4444] ${userDownvoted ? "text-[#EF4444]" : ""}`}
      >
        <FaArrowDown />
        <span>{downvoteCount}</span>
      </button>
    </div>
  );
};

export default Reactions;
