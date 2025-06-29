import Button from "../common/Button";
import { useState } from "react";
import { useUser } from "../../context/useUser";
import { joinCommunity } from "../../utils/api";

const StudyGroupCard = ({ group }) => {
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const handleJoin = async () => {
    if (!user?.id) {
      setError("You must be logged in to join a group");
      return;
    }
    try {
      setError(null);
      await joinCommunity(group.id, user.id);
      setIsJoined(true);
    } catch (err) {
      setError(err.message || "Failed to join group");
    }
  };

  return (
    <div
      className="bg-kiwi-50 p-3 sm:p-4 rounded-lg shadow-md mb-4"
      role="article"
      aria-label={`Study group: ${group.name}`}
    >
      {error && (
        <p className="text-red-600 text-xs mb-2" role="alert">
          {error}
        </p>
      )}
      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 line-clamp-1">
        {group.name}
      </h3>
      <p className="text-[10px] sm:text-xs text-gray-500 mb-2 line-clamp-2">
        {group.description}
      </p>
      <p className="text-[10px] sm:text-xs text-gray-500 mb-2">
        Members: {group.members}
      </p>
      <Button
        variant="kiwi"
        size="xs"
        smSize="sm"
        className="text-[10px] sm:text-sm"
        onClick={handleJoin}
        disabled={isJoined}
      >
        {isJoined ? "Joined" : "Join Group"}
      </Button>
    </div>
  );
};

export default StudyGroupCard;
