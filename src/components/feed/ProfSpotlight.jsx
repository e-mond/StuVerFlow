import { Link } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";

const ProfSpotlight = ({ professors }) => {
  return (
    <div className="bg-white dark:bg-blueberry-800 rounded-lg p-4 border border-gray-200 dark:border-blueberry-700 mt-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Prof Spotlight 🎓
      </h2>
      {professors.map((prof) => (
        <div key={prof.id} className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-blueberry-600" />
            <div>
              <Link
                to={`/profile/${prof.name.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-semibold text-gray-900 dark:text-white hover:underline"
              >
                {prof.name}
              </Link>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Course: {prof.course}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Expertise: {prof.expertise}
              </p>
            </div>
          </div>
          <button
            className="text-kiwi-700 dark:text-kiwi-200 hover:text-kiwi-800 dark:hover:text-kiwi-100"
            aria-label={`Connect with ${prof.name}`}
          >
            <FaUserGraduate />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProfSpotlight;
