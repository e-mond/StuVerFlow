import Button from "../common/Button";

// StudyGroupCard component for displaying study group details
const StudyGroupCard = ({ group }) => {
  return (
    <div
      className="bg-kiwi-50 p-3 sm:p-4 rounded-lg shadow-md mb-4"
      role="article"
      aria-label={`Study group: ${group.name}`}
    >
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
      >
        Join Group
      </Button>
    </div>
  );
};

export default StudyGroupCard;
