import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { getUserProfile } from "../utils/api";

// Component rendering the profile page with user details and promotional image section
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = 1; // Hardcoded for demo; should come from auth context
        const response = await getUserProfile(userId);
        setUser(response);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen bg-white justify-center items-center p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-white justify-center items-center p-4">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side with promotional image and glass-like effect (hidden on mobile) */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md flex flex-col justify-center items-center p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your StuVerFlow Profile
          </h2>
          <p className="text-gray-700 text-lg text-center max-w-md">
            Showcase your academic journey, connect with peers, and share your
            expertise.
          </p>
        </div>
      </div>

      {/* Main content with user profile */}
      <div className="flex-1 flex justify-center items-center p-4 w-full lg:w-1/2">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md border border-kiwi-200 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* StuVerFlow Logo */}
          <div className="flex justify-center mb-6">
            <div className="text-3xl font-bold text-kiwi-700">StuVerFlow</div>
          </div>

          {/* Card header with icon and description */}
          <div className="flex items-center mb-6 p-4 bg-kiwi-50 rounded-lg">
            <span className="text-2xl mr-2">👤</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Your Profile
              </h2>
              <p className="text-gray-600 text-sm">
                View and manage your personal information.
              </p>
            </div>
          </div>

          {/* Profile details */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Username
              </label>
              <p className="text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Handle</label>
              <p className="text-gray-900">@{user.handle}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <p className="text-gray-900">
                {user.firstName} {user.surname}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Date of Birth
              </label>
              <p className="text-gray-900">{user.dob || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Contact Number
              </label>
              <p className="text-gray-900">{user.contact || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Institution
              </label>
              <p className="text-gray-900">
                {user.institution || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Course</label>
              <p className="text-gray-900">{user.course || "Not provided"}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Bio</label>
              <p className="text-gray-900">{user.bio || "Not provided"}</p>
            </div>
          </div>

          {/* Edit Profile button */}
          <div className="mt-6">
            <Button variant="kiwi">
              <Link to="/edit-profile">Edit Profile</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
