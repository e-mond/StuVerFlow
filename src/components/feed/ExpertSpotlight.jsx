import { Link } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";

// Component showcasing a list of experts with links to their profiles
const ExpertSpotlight = ({ experts }) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-kiwi-200 mt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Expert Spotlight
      </h2>
      {experts.map((expert) => (
        <div key={expert.id} className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-kiwi-300" />
            <div>
              <Link
                to={`/profile/${expert.name.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-semibold text-gray-900 hover:text-kiwi-700 hover:underline"
              >
                {expert.name}
              </Link>
              <p className="text-xs text-gray-600">
                {expert.title} | {expert.course}
              </p>
              <p className="text-xs text-gray-600">
                Expertise: {expert.expertise}
              </p>
            </div>
          </div>
          <button
            className="text-kiwi-700 hover:text-kiwi-800"
            aria-label={`Connect with ${expert.name}`}
          >
            <FaUserGraduate />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExpertSpotlight;
