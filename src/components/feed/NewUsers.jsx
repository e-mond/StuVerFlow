import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import { fetchNewUsers, followUser } from "../../utils/api";

/**
 * Component to display a list of new users and experts.
 * Fetches users from API and handles follow functionality.
 */
const NewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState({});
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const newUsers = await fetchNewUsers();
        
        // Ensure we have an array
        const usersArray = Array.isArray(newUsers) ? newUsers : [];
        setUsers(usersArray);
        
        // Initialize following state (assuming API returns isFollowing)
        const followingState = usersArray.reduce(
          (acc, u) => ({
            ...acc,
            [u.id]: u.isFollowing || false,
          }),
          {},
        );
        setFollowing(followingState);
      } catch (err) {
        console.error("Failed to fetch new users:", err);
        setError(err.message || "Failed to fetch new users. Please try again later.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [retryCount]);

  const handleAddUser = async (userId) => {
    if (!user?.id) {
      setError("You must be logged in to follow users");
      return;
    }
    try {
      setError(null);
      await followUser(userId, user.id);
      setFollowing((prev) => ({ ...prev, [userId]: true }));
    } catch (err) {
      setError(err.message || "Failed to follow user");
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-kiwi-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        New Users
      </h2>
      {loading && (
        <p className="text-gray-600 text-sm text-center mt-4">Loading...</p>
      )}
      {error && (
        <div className="text-center mt-4" role="alert">
          <p className="text-red-600 text-sm mb-2">
          {error}
        </p>
          <button
            onClick={handleRetry}
            className="bg-kiwi-700 text-white text-xs px-3 py-1 rounded hover:bg-kiwi-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
      {!loading && !error && users.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid lg:grid-cols-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="min-w-[180px] max-w-full bg-gradient-to-br from-green-100 to-white border border-green-200 p-4 rounded-lg shadow-md flex flex-col justify-between transition-transform transform hover:scale-105"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
                <div>
                  <Link
                    to={`/profile/${user.handle || user.id}`}
                    className="text-sm font-semibold text-gray-800 hover:underline"
                  >
                    {user.name || user.username || 'New User'}
                  </Link>
                  <p className="text-xs text-gray-500">@{user.handle || user.username || `user${user.id}`}</p>
                </div>
              </div>
              <div className="text-gray-700 space-y-2 text-xs">
                {user.expert ? (
                  <>
                    <p className="font-medium text-gray-800">
                      {user.title && user.course ? `${user.title} | ${user.course}` : user.title || user.course || 'Expert'}
                    </p>
                    <p className="text-gray-500">Expertise: {user.expertise || 'Various subjects'}</p>
                  </>
                ) : (
                  <>
                    <p>Course: {user.course || 'General Studies'}</p>
                    <p>Joined: {user.joined ? new Date(user.joined).toLocaleDateString() : user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Recently'}</p>
                  </>
                )}
                <p>{user.questions || 0} Questions</p>
                <p className="flex items-center gap-2">
                  <FaArrowUp className="text-green-600" />
                  {user.upvotes || 0}
                  <FaArrowDown className="text-red-500 ml-2" />
                  {user.downvotes || 0}
                </p>
              </div>
              <button
                onClick={() => handleAddUser(user.id)}
                className={`mt-4 self-end px-2 py-1 rounded-full text-xs transition ${
                  following[user.id]
                    ? "bg-green-200 text-green-800 cursor-not-allowed"
                    : "bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-800"
                }`}
                aria-label={
                  following[user.id]
                    ? `Following ${user.name}`
                    : `Follow ${user.name}`
                }
                disabled={following[user.id]}
              >
                <FaUserPlus />
                {following[user.id] ? " Following" : ""}
              </button>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-gray-600 text-sm text-center mt-4">
            No new users found at the moment. Check back later!
          </p>
        )
      )}
    </div>
  );
};

export default NewUsers;
