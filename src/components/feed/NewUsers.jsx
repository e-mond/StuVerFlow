import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

// Mock data for new users
const mockNewUsers = [
  {
    id: 1,
    name: "Liam",
    handle: "liam",
    course: "Calculus I",
    profilePic: "placeholder",
    joined: new Date("2025-01-15").toISOString(),
    questions: 8,
    upvotes: 45,
  },
  {
    id: 2,
    name: "Olivia",
    handle: "olivia",
    course: "Physics II",
    profilePic: "placeholder",
    joined: new Date("2025-02-20").toISOString(),
    questions: 5,
    upvotes: 30,
  },
  {
    id: 3,
    name: "Noah",
    handle: "noah",
    course: "Chemistry I",
    profilePic: "placeholder",
    joined: new Date("2025-03-10").toISOString(),
    questions: 3,
    upvotes: 15,
  },
];

const NewUsers = () => {
  const handleAddUser = (userId) => {
    console.log(`Adding user with ID: ${userId}`);
    // In a real app, this would trigger a follow/add user action
  };

  return (
    <div className="bg-white dark:bg-[#1C2526] rounded-lg p-4 border border-gray-200 dark:border-gray-700 mt-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        New Users to Follow
      </h2>
      {mockNewUsers.map((user) => (
        <div key={user.id} className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />{" "}
            {/* Profile pic placeholder */}
            <div>
              <Link
                to={`/profile/${user.handle}`}
                className="text-sm font-semibold text-gray-900 dark:text-white hover:underline"
              >
                {user.name}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Course: {user.course}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Joined: {new Date(user.joined).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.questions} Questions • {user.upvotes} Upvotes
              </p>
            </div>
          </div>
          <button
            onClick={() => handleAddUser(user.id)}
            className="text-[#1DA1F2] hover:text-[#1A91DA]"
            aria-label={`Add ${user.name}`}
          >
            <FaUserPlus />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NewUsers;
