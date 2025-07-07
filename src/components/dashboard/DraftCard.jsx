import { Link } from "react-router-dom";

const DraftCard = ({ draft }) => {
  const formattedTime = new Date(draft.timestamp).toLocaleString();
  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
      <h4 className="text-sm sm:text-base font-medium text-gray-900">
        {draft.title}
      </h4>
      <p className="text-gray-600 text-sm sm:text-base mt-1">
        {draft.description}
      </p>
      <p className="text-gray-500 text-xs sm:text-sm mt-1">{formattedTime}</p>
      <Link
        to={draft.link || `/draft/${draft.id}`}
        className="text-kiwi hover:text-kiwi-dark text-sm sm:text-base underline"
      >
        Edit Draft
      </Link>
    </div>
  );
};

export default DraftCard;
