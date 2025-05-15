const ActivityCard = ({ type, content, timestamp, link }) => {
  // Formatting timestamp for display
  const formattedTime = new Date(timestamp).toLocaleString();
  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
      <p className="text-gray-600 text-sm sm:text-base">
        <span className="font-medium">
          {type === "post" ? "Posted" : "Commented"}
        </span>
        : {content}
      </p>
      <p className="text-gray-500 text-xs sm:text-sm mt-1">{formattedTime}</p>
      <a
        href={link}
        className="text-kiwi hover:text-kiwi-dark text-sm sm:text-base underline"
      >
        View {type === "post" ? "Post" : "Comment"}
      </a>
    </div>
  );
};

export default ActivityCard;
