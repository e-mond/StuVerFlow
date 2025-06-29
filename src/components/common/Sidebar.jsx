import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import logo from "../../assets/logo/StuVerFlow3.png";
import { useUser } from "../../context/useUser";
import { getUserProfile, logout } from "../../utils/api";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    return stored === "true";
  });
  const [userData, setUserData] = useState({
    name: "Unknown",
    handle: "",
    institution: "",
  });
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setError("User not logged in");
        return;
      }
      try {
        setError(null);
        const profile = await getUserProfile(user.id);
        setUserData({
          name: profile.name || "Unknown",
          handle: profile.handle || "",
          institution: profile.institution || "",
        });
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
      }
    };
    fetchUserData();
  }, [user]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Failed to logout");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {!isOpen && (
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={toggleSidebar}
            className="p-3 rounded-full bg-kiwi-600 text-white shadow-lg hover:bg-kiwi-700 transition"
            aria-label="Open sidebar"
          >
            <FaBars size={20} />
          </button>
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"></div>
      )}
      <aside
        ref={sidebarRef}
        className={`
          bg-white border-r border-gray-200 h-full z-50 fixed top-0
          transition-[left,width] duration-300 ease-in-out
          ${isOpen ? "left-0" : "-left-64"} w-64
          lg:left-0 lg:sticky lg:top-0
          ${isCollapsed ? "lg:w-20" : "lg:w-64"} flex flex-col
        `}
      >
        <div className="flex justify-between items-center p-2 lg:hidden">
          <button onClick={toggleSidebar} aria-label="Close sidebar">
            <FaTimes className="text-xl text-gray-900" />
          </button>
        </div>
        <div className="hidden lg:flex justify-end p-2">
          <button
            onClick={toggleCollapse}
            className="text-gray-500 hover:text-gray-800"
          >
            {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>
        <div className="flex items-start justify-start p-4">
          <div className="flex items-center space-x-4">
            <img
              src={logo}
              alt="StuVerFlow Logo"
              className="w-10 h-10 rounded-full border-2 border-kiwi-600 object-cover"
            />
            {!isCollapsed && (
              <span
                className="text-xl italic text-kiwi-700 font-bold"
                style={{ fontFamily: "'Sacramento', cursive" }}
              >
                StuVerFlow
              </span>
            )}
          </div>
        </div>
        {error && (
          <p className="text-red-600 text-sm p-3" role="alert">
            {error}
          </p>
        )}
        <div className="mt-auto p-3">
          <nav className="space-y-2 flex-1 px-1">
            {[
              { to: "/home", label: "Home", icon: FaHome },
              { to: "/ask", label: "Ask", icon: FaPen },
              { to: "/notifications", label: "Notifications", icon: FaBell },
              { to: "/bookmarks", label: "Bookmarks", icon: FaBookmark },
              { to: "/communities", label: "Communities", icon: FaUsers },
              { to: "/search", label: "Search", icon: FaSearch },
            ].map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition group hover:bg-kiwi-100 ${
                    isActive
                      ? "bg-kiwi-600 text-white font-semibold"
                      : "text-gray-800"
                  }`
                }
              >
                <Icon className="text-lg" />
                {!isCollapsed && <span className="ml-3">{label}</span>}
              </NavLink>
            ))}
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2 px-3">
                Explore
              </h2>
            )}
            {[
              { to: "/trending", label: "Trending", icon: FaFire },
              {
                to: "/myquestions",
                label: "My Questions",
                icon: FaQuestionCircle,
              },
            ].map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition group hover:bg-kiwi-100 ${
                    isActive
                      ? "bg-kiwi-600 text-white font-semibold"
                      : "text-gray-800"
                  }`
                }
              >
                <Icon className="text-lg" />
                {!isCollapsed && <span className="ml-3">{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-3">
          <div
            className={`p-3 rounded-lg hover:bg-kiwi-100 ${
              isCollapsed
                ? "flex flex-col items-center space-y-2"
                : "flex items-center justify-between"
            }`}
          >
            <button
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
                navigate("/dashboard");
              }}
              className={`flex items-center ${
                isCollapsed ? "flex-col space-y-1" : "space-x-2"
              } focus:outline-none`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-300" />
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500">{userData.handle}</p>
                </div>
              )}
            </button>
            <button
              className="text-[#EF4444] hover:text-[#DC2626]"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="text-sm" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
