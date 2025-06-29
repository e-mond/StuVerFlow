import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import Button from "../components/common/Button";
import { getUserProfile } from "../utils/api";

// Component to display and manage user profile
const ProfilePage = () => {
  const { user: authUser } = useUser();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authUser?.id) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  // Load user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (authUser?.id) {
          const response = await getUserProfile(authUser.id);
          setUser(response);
        }
      } catch (err) {
        setError(err.message || "Failed to load profile.");
      }
    };
    fetchProfile();
  }, [authUser]);

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-white px-4">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  // Loading state
  if (!user) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-white px-4">
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-tr from-kiwi-50 to-white">
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm flex flex-col justify-center items-center p-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Your Profile Hub
          </h2>
          <p className="text-gray-700 text-lg text-center max-w-md">
            Keep your academic presence updated and professional.
          </p>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center p-4 sm:p-6 lg:p-10">
        <motion.div
          className="w-full max-w-3xl bg-white rounded-xl border border-kiwi-200 shadow-md p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <div className="text-3xl font-extrabold text-kiwi-700">
              StuVerFlow
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Academic Profile Manager
            </p>
          </div>
          <div className="bg-kiwi-50 border border-kiwi-100 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Profile
            </h2>
            <p className="text-sm text-gray-600">
              Manage your academic identity and contact info.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ProfileField label="Username" value={user.username} />
            <ProfileField label="Handle" value={`@${user.handle}`} />
            <ProfileField label="Email" value={user.email} />
            <ProfileField
              label="Full Name"
              value={`${user.firstName} ${user.surname}`}
            />
            <ProfileField
              label="Date of Birth"
              value={user.dob || "Not provided"}
            />
            <ProfileField
              label="Contact Number"
              value={user.contact || "Not provided"}
            />
            <ProfileField
              label="Institution"
              value={user.institution || "Not provided"}
            />
            <ProfileField
              label="Course"
              value={user.course || "Not provided"}
            />
            <ProfileField
              label="Bio"
              value={user.bio || "Not provided"}
              className="sm:col-span-2"
            />
          </div>
          <div className="mt-8 text-end">
            <Button variant="kiwi" size="sm" as={Link} to="/edit-profile">
              Edit Profile
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable field component for consistent layout
const ProfileField = ({ label, value, className = "" }) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-sm text-gray-600 font-medium mb-1">{label}</label>
    <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
      {value}
    </p>
  </div>
);

export default ProfilePage;
