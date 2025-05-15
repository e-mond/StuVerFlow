// Component displaying user reputation with leaderboard access
const ReputationCard = ({ reputation }) => {
  return (
    <div className="bg-green-50 p-4 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="text-green-700">🎉</span>
        <div>
          <h3 className="text-sm sm:text-base font-medium text-gray-900">
            Reputation
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            {reputation} | +10 per upvote, +25 best answer
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReputationCard;
