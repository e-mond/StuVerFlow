import { Link } from "react-router-dom";

const ActivityCard = ({ activity }) => {
  const formattedTime = new Date(activity.timestamp).toLocaleString();
  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
      <p className="text-gray-600 text-sm sm:text-base">
        <span className="font-medium">
          {activity.type === "post" ? "Posted" : "Commented"}
        </span>
        : {activity.content}
      </p>
      <p className="text-gray-500 text-xs sm:text-sm mt-1">{formattedTime}</p>
      <Link
        to={activity.link || `/${activity.type}/${activity.id}`}
        className="text-kiwi hover:text-kiwi-dark text-sm sm:text-base underline"
      >
        View {activity.type === "post" ? "Post" : "Comment"}
      </Link>
    </div>
  );
};

export default ActivityCard;
