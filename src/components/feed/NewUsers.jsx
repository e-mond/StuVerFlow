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
  const { user } = useUser();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const newUsers = await fetchNewUsers();
        setUsers(newUsers);
        // Initialize following state (assuming API returns isFollowing)
        const followingState = newUsers.reduce(
          (acc, u) => ({
            ...acc,
            [u.id]: u.isFollowing || false,
          }),
          {},
        );
        setFollowing(followingState);
      } catch (err) {
        setError(err.message || "Failed to fetch new users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

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

  return (
    <div>
      {loading && (
        <p className="text-gray-600 text-sm text-center mt-4">Loading...</p>
      )}
      {error && (
        <p className="text-red-600 text-sm text-center mt-4" role="alert">
          {error}
        </p>
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
                    to={`/profile/${user.handle}`}
                    className="text-sm font-semibold text-gray-800 hover:underline"
                  >
                    {user.name}
                  </Link>
                  <p className="text-xs text-gray-500">@{user.handle}</p>
                </div>
              </div>
              <div className="text-gray-700 space-y-2 text-xs">
                {user.expert ? (
                  <>
                    <p className="font-medium text-gray-800">
                      {user.title} | {user.course}
                    </p>
                    <p className="text-gray-500">Expertise: {user.expertise}</p>
                  </>
                ) : (
                  <>
                    <p>Course: {user.course}</p>
                    <p>Joined: {new Date(user.joined).toLocaleDateString()}</p>
                  </>
                )}
                <p>{user.questions} Questions</p>
                <p className="flex items-center gap-2">
                  <FaArrowUp className="text-green-600" />
                  {user.upvotes}
                  <FaArrowDown className="text-red-500 ml-2" />
                  {user.downvotes}
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
