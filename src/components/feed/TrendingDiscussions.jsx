import { Link } from "react-router-dom";

// Component displaying trending discussion topics based on tag data
const TrendingDiscussions = ({ tags }) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-kiwi-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Trending Discussions
      </h2>
      {tags.map((tag) => (
        <div key={tag.id} className="mb-4">
          <p className="text-sm text-gray-500">Trending Topic</p>
          <Link
            to={`/topics/${tag.name.toLowerCase()}`}
            className="font-semibold text-kiwi-700 hover:underline"
          >
            #{tag.name}
          </Link>
          <p className="text-sm text-gray-500">{tag.count} Questions</p>
        </div>
      ))}
    </div>
  );
};

export default TrendingDiscussions;
