import { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { voteOnQuestion, voteOnAnswer } from "../../utils/api";
import { useUser } from "../../context/useUser";

const Reactions = ({ upvotes, downvotes, questionId, answerId }) => {
  const [userUpvoted, setUserUpvoted] = useState(false);
  const [userDownvoted, setUserDownvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(upvotes || 0);
  const [downvoteCount, setDownvoteCount] = useState(downvotes || 0);
  const { user } = useUser();

  const handleVote = async (voteType) => {
    if (!user?.id) {
      alert("Please log in to vote.");
      return;
    }
    try {
      const voteFunction = questionId ? voteOnQuestion : voteOnAnswer;
      const id = questionId || answerId;
      const response = await voteFunction(id, user.id, voteType);

      if (voteType === "upvote") {
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
      } else {
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
      }
      // Update counts from server response if available
      if (response.upvotes !== undefined) setUpvoteCount(response.upvotes);
      if (response.downvotes !== undefined)
        setDownvoteCount(response.downvotes);
    } catch (error) {
      alert(`Failed to vote: ${error.message}`);
    }
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => handleVote("upvote")}
        className={`flex items-center space-x-1 text-gray-500 hover:text-[#1DA1F2] ${userUpvoted ? "text-[#1DA1F2]" : ""}`}
      >
        <FaArrowUp />
        <span>{upvoteCount}</span>
      </button>
      <button
        onClick={() => handleVote("downvote")}
        className={`flex items-center space-x-1 text-gray-500 hover:text-[#EF4444] ${userDownvoted ? "text-[#EF4444]" : ""}`}
      >
        <FaArrowDown />
        <span>{downvoteCount}</span>
      </button>
    </div>
  );
};

export default Reactions;
