import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaHome,
  FaPen,
  FaBell,
  FaBookmark,
  FaUsers,
  FaSignOutAlt,
  FaFire,
  FaQuestionCircle,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

// Component managing the sidebar navigation with toggle functionality on smaller screens
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const user = {
    name: "Eddie",
    handle: "@eddie",
    institution: "Takoradi Technical University",
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside
      className={`p-1 sticky top-0 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      } lg:w-64`} // Always full width on large screens
    >
      {/* Toggle button visible on small to medium screens, hidden on large screens */}
      <div className="flex justify-between items-center mb-4 p-2 lg:hidden">
        <button onClick={toggleSidebar} aria-label="Toggle sidebar">
          {isOpen ? (
            <FaTimes className="text-gray-900 text-xl" />
          ) : (
            <FaBars className="text-gray-900 text-xl" />
          )}
        </button>
      </div>

      <nav className="space-y-2 flex-1">
        <div className="p-3">
          <span
            className={`text-xl italic text-kiwi-700 font-bold ${!isOpen ? "hidden" : ""} lg:inline`} // Always visible on large screens
            style={{ fontFamily: "'Sacramento', cursive" }}
          >
            StuVerFlow
          </span>
        </div>

        <NavLink
          to="/home"
          className={({ isActive }) =>
            `relative flex items-center p-3 rounded-lg hover:bg-kiwi-200 ${
              isActive
                ? "bg-kiwi-200 font-semibold text-kiwi-700"
                : "text-gray-900"
            }`
          }
        >
          <FaHome className="mr-3 text-xl" />
          <span className={`${!isOpen ? "hidden" : ""} lg:inline`}>Home</span>
          {!isOpen && (
            <span className="absolute left-16 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 hover:opacity-100 transition-opacity lg:hidden">
              Home
            </span>
          )}
        </NavLink>

        <NavLink
          to="/ask"
          className={({ isActive }) =>
            `relative flex items-center p-3 rounded-lg hover:bg-kiwi-200 ${
              isActive
                ? "bg-kiwi-200 font-semibold text-kiwi-700"
                : "text-gray-900"
            }`
          }
        >
          <FaPen className="mr-3 text-xl" />
          <span className={`${!isOpen ? "hidden" : ""} lg:inline`}>Ask</span>
          {!isOpen && (
            <span className="absolute left-16 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 hover:opacity-100 transition-opacity lg:hidden">
              Ask
            </span>
          )}
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `relative flex items-center p-3 rounded-lg hover:bg-kiwi-200 ${
              isActive
                ? "bg-kiwi-200 font-semibold text-kiwi-700"
                : "text-gray-900"
            }`
          }
        >
          <FaBell className="mr-3 text-xl" />
          <span className={`${!isOpen ? "hidden" : ""} lg:inline`}>
            Notifications
          </span>
          {!isOpen && (
            <span className="absolute left-16 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 hover:opacity-100 transition-opacity lg:hidden">
              Notifications
            </span>
          )}
        </NavLink>

        <NavLink
          to="/bookmarks"
          className={({ isActive }) =>
            `relative flex items-center p-3 rounded-lg hover:bg-kiwi-200 ${
              isActive
                ? "bg-kiwi-200 font-semibold text-kiwi-700"
                : "text-gray-900"
            }`
          }
        >
          <FaBookmark className="mr-3 text-xl" />
          <span className={`${!isOpen ? "hidden" : ""} lg:inline`}>
            Bookmarks
          </span>
          {!isOpen && (
            <span className="absolute left-16 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 hover:opacity-100 transition-opacity lg:hidden">
              Bookmarks
            </span>
          )}
        </NavLink>

        <NavLink
          to="/communities"
          className={({ isActive }) =>
            `relative flex items-center p-3 rounded-lg hover:bg-kiwi-200 ${
              isActive
                ? "bg-kiwi-200 font-semibold text-kiwi-700"
                : "text-gray-900"
            }`
          }
        >
          <FaUsers className="mr-3 text-xl" />
          <span className={`${!isOpen ? "hidden" : ""} lg:inline`}>
            Communities
          </span>
          {!isOpen && (
            <span className="absolute left-16 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 hover:opacity-100 transition-opacity lg:hidden">
              Communities
            </span>
          )}
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `relative flex items-center p-3 rounded-lg hover:bg-kiwi-200 ${
              isActive
                ? "bg-kiwi-200 font-semibold text-kiwi-700"
                : "text-gray-900"
            }`
          }
        >
          <FaSearch className="mr-3 text-xl" />
          <span className={`${!isOpen ? "hidden" : ""} lg:inline`}>Search</span>
          {!isOpen && (
            <span className="absolute left-16 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 hover:opacity-100 transition-opacity lg:hidden">
              Search
            </span>
          )}
        </NavLink>

        <div className="mt-6">
          <h2
            className={`text-lg font-semibold text-gray-900 mb-2 px-3 ${!isOpen ? "hidden" : ""} lg:block`}
          >
            Explore
          </h2>
          <NavLink
            to="/trending"
            className={({ isActive }) =>
              `relative flex items-center p-3 rounded-lg hover:bg-kiwi-200 ${
                isActive
                  ? "bg-kiwi-200 font-semibold text-kiwi-700"
                  : "text-gray-900"
              }`
            }
          >
            <FaFire className="mr-3 text-xl" />
            <span className={`${!isOpen ? "hidden" : ""} lg:inline`}>
              Trending
            </span>
            {!isOpen && (
              <span className="absolute left-16 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 hover:opacity-100 transition-opacity lg:hidden">
                Trending
              </span>
            )}
          </NavLink>
          <NavLink
            to="/my-questions"
            className={({ isActive }) =>
              `relative flex items-center p-3 rounded-lg hover:bg-kiwi-200 ${
                isActive
                  ? "bg-kiwi-200 font-semibold text-kiwi-700"
                  : "text-gray-900"
              }`
            }
          >
            <FaQuestionCircle className="mr-3 text-xl" />
            <span className={`${!isOpen ? "hidden" : ""} lg:inline`}>
              Your Questions
            </span>
            {!isOpen && (
              <span className="absolute left-16 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 hover:opacity-100 transition-opacity lg:hidden">
                Your Questions
              </span>
            )}
          </NavLink>
        </div>
      </nav>

      <div className="mt-auto">
        <Link to="/dashboard">
          <div
            className={`flex items-center justify-between p-3 rounded-lg hover:bg-kiwi-200 ${
              !isOpen ? "justify-center md:justify-between" : ""
            } lg:justify-between`} // Always full layout on large screens
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-300" />
              <div className={`${!isOpen ? "hidden" : ""} lg:block`}>
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">{user.handle}</p>
                <p className="text-xs text-gray-500">
                  Institution: {user.institution}
                </p>
              </div>
            </div>
            <button
              className={`text-[#EF4444] hover:text-[#DC2626] ${!isOpen ? "hidden" : ""} lg:block`}
              aria-label="Log out"
              onClick={(e) => {
                e.preventDefault();
                alert("Log out functionality to be implemented");
              }}
            >
              <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
