import { Link } from "react-router-dom";

// Component displaying a spotlight of academic experts
const ExpertSpotlight = ({ experts }) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-kiwi-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Expert Spotlight
      </h2>
      {experts.map((expert) => (
        <div key={expert.id} className="mb-4">
          <p className="text-sm text-gray-500">Featured Expert</p>
          <Link
            to={`/profile/${expert.id}`}
            className="font-semibold text-kiwi-700 hover:underline"
          >
            {expert.name}
          </Link>
          <p className="text-sm text-gray-600">{expert.title}</p>
          <p className="text-xs text-gray-500 italic">
            Teaches: {expert.course}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ExpertSpotlight;
