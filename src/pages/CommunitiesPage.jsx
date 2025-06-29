import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import { fetchStudyGroups, joinCommunity } from "../utils/api";
import Button from "../components/common/Button";
import Sidebar from "../components/common/Sidebar";
import CreateCommunity from "../components/feed/CreateCommunity";

// Component for displaying and managing communities (study groups)
const CommunitiesPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch study groups
  useEffect(() => {
    const loadStudyGroups = async () => {
      try {
        setLoading(true);
        setError("");
        const groups = await fetchStudyGroups();
        setStudyGroups(groups);
      } catch (err) {
        setError(err.message || "Failed to load study groups");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      loadStudyGroups();
    }
  }, [user]);

  // Filter study groups based on search term
  const filteredGroups = studyGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle join request
  const handleJoinRequest = async (groupId) => {
    try {
      const { members } = await joinCommunity(groupId, user.id);
      setStudyGroups((prev) =>
        prev.map((group) =>
          group.id === groupId ? { ...group, members } : group,
        ),
      );
    } catch (err) {
      setError(err.message || "Failed to join community.");
    }
  };

  // Handle viewing a community's details
  const handleViewCommunity = (groupId) => {
    navigate(`/communities/${groupId}`);
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-white text-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-1 lg:p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Communities
        </h1>
        {error && (
          <p
            className="text-red-500 text-sm sm:text-base lg:text-lg mb-4"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 p-2 sm:p-3 rounded-lg border border-gray-300 bg-white text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-kiwi-500"
            aria-label="Search for communities"
            disabled={loading}
          />
          <Button
            variant="kiwi"
            className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base lg:text-lg"
            disabled={loading}
            onClick={() => setShowCreate(true)}
          >
            Create a Community
          </Button>
        </div>
        {loading ? (
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Loading communities...
          </p>
        ) : filteredGroups.length === 0 ? (
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            No communities found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredGroups.map((group) => (
              <motion.div
                key={group.id}
                className="bg-white p-4 sm:p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                  {group.name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 line-clamp-3">
                  {group.description}
                </p>
                <p className="text-gray-500 text-sm sm:text-base mb-3">
                  Members: {group.members}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="kiwi"
                    className="w-full px-3 py-2 text-sm sm:text-base"
                    onClick={() => handleViewCommunity(group.id)}
                  >
                    View
                  </Button>
                  <Button
                    variant="kiwi"
                    className="w-full px-3 py-2 text-sm sm:text-base"
                    onClick={() => handleJoinRequest(group.id)}
                  >
                    Join
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {showCreate && (
          <CreateCommunity
            onClose={() => setShowCreate(false)}
            onCreate={(newGroup) => setStudyGroups([...studyGroups, newGroup])}
          />
        )}
      </div>
    </div>
  );
};

export default CommunitiesPage;
