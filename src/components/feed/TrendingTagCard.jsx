// Importing React for component creation
import React from "react";

// Component displaying a single trending tag
const TrendingTagCard = ({ tag, count }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
      {/* Tag name with link to topic page */}
      <a
        href={`/topics/${tag}`}
        className="text-kiwi hover:text-kiwi-dark text-sm sm:text-base font-medium"
      >
        #{tag}
      </a>
      {/* Number of posts associated with the tag */}
      <p className="text-gray-600 text-xs sm:text-sm mt-1">
        {count} {count === 1 ? "post" : "posts"}
      </p>
    </div>
  );
};

export default TrendingTagCard;
