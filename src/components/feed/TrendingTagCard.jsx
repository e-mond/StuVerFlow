import React from "react";

const TrendingTagCard = ({ tag, count }) => {
  return (
    <a
      href={`/topics/${tag}`}
      className="text-[13px] sm:text-sm px-2 py-1 bg-kiwi-50 border border-kiwi-200 text-kiwi-800 rounded-full flex items-center gap-2 hover:bg-kiwi-100 transition"
    >
      <span className="font-medium">#{tag}</span>
      <span className="text-xs text-gray-500">({count})</span>
    </a>
  );
};

export default TrendingTagCard;
