const WhatsHappening = ({ tags }) => {
  return (
    <div className="bg-white dark:bg-[#1C2526] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        What&apos;s Happening
      </h2>
      {tags.map((tag) => (
        <div key={tag.id} className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Trending in Topics
          </p>
          <p className="font-semibold text-gray-900 dark:text-white">
            #{tag.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {tag.count} questions
          </p>
        </div>
      ))}
    </div>
  );
};

export default WhatsHappening;
