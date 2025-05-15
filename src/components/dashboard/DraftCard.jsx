// Component displaying a single draft item
const DraftCard = ({ title, description, timestamp, link }) => {
  // Formatting timestamp for display
  const formattedTime = new Date(timestamp).toLocaleString();
  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
      <h4 className="text-sm sm:text-base font-medium text-gray-900">
        {title}
      </h4>
      <p className="text-gray-600 text-sm sm:text-base mt-1">{description}</p>
      <p className="text-gray-500 text-xs sm:text-sm mt-1">{formattedTime}</p>
      <a
        href={link}
        className="text-kiwi hover:text-kiwi-dark text-sm sm:text-base underline"
      >
        Edit Draft
      </a>
    </div>
  );
};

export default DraftCard;
