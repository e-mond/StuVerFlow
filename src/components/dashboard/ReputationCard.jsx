import { useState, useEffect } from "react";
import { useUser } from "../../context/useUser";
import { getUserProfile } from "../../utils/api";

const ReputationCard = () => {
  const [reputation, setReputation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchReputation = async () => {
      if (!user?.id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const profile = await getUserProfile(user.id);
        setReputation(profile.reputation || 0);
      } catch (err) {
        setError(err.message || "Failed to fetch reputation");
      } finally {
        setLoading(false);
      }
    };
    fetchReputation();
  }, [user]);

  return (
    <div className="bg-green-50 p-4 rounded-lg shadow-sm">
      {loading && <p className="text-gray-600 text-sm">Loading...</p>}
      {error && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && (
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
      )}
    </div>
  );
};

export default ReputationCard;
