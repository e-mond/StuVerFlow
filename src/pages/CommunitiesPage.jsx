import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchStudyGroups } from "../utils/api";
import Button from "../components/common/Button";
import Sidebar from "../components/common/Sidebar";
import CreateCommunity from "../components/feed/CreateCommunity";

// Component for displaying and managing communities (study groups)
const CommunitiesPage = () => {
  // State for study groups, loading status, errors, search term, and modal visibility
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  // Fetch study groups when the component mounts
  useEffect(() => {
    const loadStudyGroups = async () => {
      try {
        const groups = await fetchStudyGroups();
        setStudyGroups(groups);
      } catch (err) {
        setError(err.message || "Failed to load study groups");
      } finally {
        setLoading(false);
      }
    };
    loadStudyGroups();
  }, []);

  // Filter study groups based on search term (name or description)
  const filteredGroups = studyGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle join request for a study group (placeholder for future API call)
  const handleJoinRequest = (groupId) => {
    console.log(`Request sent to join group with ID: ${groupId}`);
    // Future implementation: Call joinCommunity API
  };

  // Handle viewing a community's details (placeholder for navigation)
  const handleViewCommunity = (groupId) => {
    console.log(`Viewing community with ID: ${groupId}`);
    // Future implementation: Navigate to community details page
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-white text-gray-900">
      {/* Sidebar for navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-4 sm:p-1 lg:p-8 max-w-7xl mx-auto w-full ">
        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          Communities
        </h1>

        {/* Error message display */}
        {error && (
          <p
            className="text-red-500 text-sm sm:text-base lg:text-lg mb-4"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Search bar and create community button */}
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

        {/* Loading state */}
        {loading ? (
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Loading communities...
          </p>
        ) : filteredGroups.length === 0 ? (
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            No communities found.
          </p>
        ) : (
          /* Grid of community cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredGroups.map((group) => (
              <motion.div
                key={group.id}
                className="bg-white p-4 sm:p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Community name */}
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                  {group.name}
                </h2>
                {/* Community description */}
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 line-clamp-3">
                  {group.description}
                </p>
                {/* Member count */}
                <p className="text-gray-500 text-sm sm:text-base mb-3">
                  Members: {group.memberCount}
                </p>
                {/* Action buttons */}
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

        {/* Create community modal */}
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
