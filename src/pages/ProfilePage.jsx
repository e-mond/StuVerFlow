import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useUser, useUpdateUser } from "../context/UserContext";
import Button from "../components/common/Button";
import Sidebar from "../components/common/Sidebar";
import { getUserProfile, updateUserProfile } from "../utils/api";
import { toast } from "react-toastify";

// Component to display and manage user profile
const ProfilePage = () => {
  const { user: authUser } = useUser();
  const updateUser = useUpdateUser();
  const navigate = useNavigate();
  const { handle } = useParams(); // Get handle from URL params
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

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
        let targetUserId = authUser?.id;
        let isOwn = true;

        // If handle is provided in URL, we're viewing someone else's profile
        if (handle) {
          // For now, we'll assume handle parameter means viewing own profile
          // TODO: Implement logic to fetch user by handle
          targetUserId = authUser?.id;
          isOwn = authUser?.handle === handle;
        }

        setIsOwnProfile(isOwn);

        if (targetUserId) {
          const response = await getUserProfile(targetUserId);
          setUser(response);
          
          // Only set edit data if it's the user's own profile
          if (isOwn) {
            setEditData({
              name: response.name || "",
              handle: response.handle || "",
              email: response.email || "",
              bio: response.bio || "",
              institution: response.institution || "",
              interests: response.interests || "",
              title: response.title || "",
              expertise: response.expertise || "",
              // userType: response.userType || "student", // Commented out until backend support
              dob: response.dob || "",
            });
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load profile.");
      }
    };
    fetchProfile();
  }, [authUser, handle]);

  const handleEditToggle = () => {
    if (isOwnProfile) {
      setIsEditing(!isEditing);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!isOwnProfile) return;
    
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add required fields
      formData.append('name', editData.name);
      formData.append('handle', editData.handle.startsWith('@') ? editData.handle : `@${editData.handle}`);
      formData.append('email', editData.email);
      formData.append('bio', editData.bio);
      formData.append('institution', editData.institution);
      formData.append('interests', editData.interests);
      formData.append('title', editData.title);
      formData.append('expertise', editData.expertise);
      // formData.append('userType', editData.userType); // Commented out until backend support
      formData.append('dob', editData.dob);
      
      await updateUserProfile(authUser.id, formData);
      
      // Refresh user data
      const response = await getUserProfile(authUser.id);
      setUser(response);
      
      // Update UserContext with new profile data
      updateUser({
        ...authUser,
        interests: response.interests,
        bio: response.bio,
        institution: response.institution,
        title: response.title,
        expertise: response.expertise,
        handle: response.handle,
        email: response.email,
        name: response.name,
        dob: response.dob,
      });
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset edit data to original values
    setEditData({
      name: user.name || "",
      handle: user.handle || "",
      email: user.email || "",
      bio: user.bio || "",
      institution: user.institution || "",
      interests: user.interests || "",
      title: user.title || "",
      expertise: user.expertise || "",
      // userType: user.userType || "student", // Commented out until backend support
      dob: user.dob || "",
    });
    setIsEditing(false);
  };

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center px-4">
        <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (!user) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center px-4">
        <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto">
        <motion.div
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isOwnProfile ? "Your Profile" : `${user.name}'s Profile`}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {isOwnProfile 
                  ? "Manage your academic identity and information"
                  : "View academic profile and information"
                }
              </p>
            </div>
            {isOwnProfile && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="kiwi" 
                      size="sm" 
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <Button variant="kiwi" size="sm" onClick={handleEditToggle}>
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Profile Picture Section */}
          <div className="flex items-center mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-kiwi-300 flex items-center justify-center text-white text-2xl font-bold">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.handle}</p>
              <p className="text-sm text-gray-500">{user.institution}</p>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ProfileField
              label="Full Name"
              value={user.name} 
              isEditing={isEditing && isOwnProfile}
              editValue={editData.name}
              onChange={handleInputChange}
              name="name"
              required
            />
            <ProfileField 
              label="Handle" 
              value={user.handle} 
              isEditing={isEditing && isOwnProfile}
              editValue={editData.handle}
              onChange={handleInputChange}
              name="handle"
              placeholder="@username"
              required
            />
            <ProfileField 
              label="Email" 
              value={user.email} 
              isEditing={isEditing && isOwnProfile}
              editValue={editData.email}
              onChange={handleInputChange}
              name="email"
              type="email"
              required
            />
            <ProfileField 
              label="Institution" 
              value={user.institution} 
              isEditing={isEditing && isOwnProfile}
              editValue={editData.institution}
              onChange={handleInputChange}
              name="institution"
              required
            />
            <ProfileField
              label="Date of Birth"
              value={user.dob ? new Date(user.dob).toLocaleDateString() : "Not provided"} 
              isEditing={isEditing && isOwnProfile}
              editValue={editData.dob}
              onChange={handleInputChange}
              name="dob"
              type="date"
            />
            <ProfileField
              label="Title" 
              value={user.title || "Not provided"} 
              isEditing={isEditing && isOwnProfile}
              editValue={editData.title}
              onChange={handleInputChange}
              name="title"
            />
            {/* UserType field commented out until backend support is added
            <ProfileField
              label="Account Type" 
              value={user.userType || "student"} 
              isEditing={isEditing && isOwnProfile}
              editValue={editData.userType}
              onChange={handleInputChange}
              name="userType"
              type="select"
              options={[
                { value: "student", label: "Student" },
                { value: "professional", label: "Professional" }
              ]}
              required
            />
            */}
            <ProfileField
              label="Interests" 
              value={user.interests || "Not provided"} 
              isEditing={isEditing && isOwnProfile}
              editValue={editData.interests}
              onChange={handleInputChange}
              name="interests"
              className="sm:col-span-2"
              placeholder="Programming, Data Science, Machine Learning..."
            />
            <ProfileField
              label="Expertise" 
              value={user.expertise || "Not provided"} 
              isEditing={isEditing && isOwnProfile}
              editValue={editData.expertise}
              onChange={handleInputChange}
              name="expertise"
              className="sm:col-span-2"
              placeholder="Web Development, Research, Teaching..."
            />
            <ProfileField
              label="Bio"
              value={user.bio || "Not provided"}
              isEditing={isEditing && isOwnProfile}
              editValue={editData.bio}
              onChange={handleInputChange}
              name="bio"
              className="sm:col-span-2"
              isTextarea={true}
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600 font-medium">Member Since</label>
                <p className="text-sm text-gray-900 mt-1">
                  {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : "Unknown"}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium">Profile Status</label>
                <p className="text-sm text-green-600 mt-1">Active</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable field component for consistent layout
const ProfileField = ({ 
  label, 
  value, 
  isEditing, 
  editValue, 
  onChange, 
  name, 
  type = "text", 
  className = "", 
  required = false,
  isTextarea = false,
  placeholder = "",
  options = []
}) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-sm text-gray-600 font-medium mb-2">
      {label} {required && isEditing && <span className="text-red-500">*</span>}
    </label>
    {isEditing ? (
      type === "select" ? (
        <select
          name={name}
          value={editValue}
          onChange={onChange}
          required={required}
          className="text-sm text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kiwi-500 focus:border-transparent"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : isTextarea ? (
        <textarea
          name={name}
          value={editValue}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows="3"
          className="text-sm text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kiwi-500 focus:border-transparent"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={editValue}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="text-sm text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kiwi-500 focus:border-transparent"
        />
      )
    ) : (
      <p className="text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 min-h-[38px] flex items-center">
        {type === "select" && options.length > 0 
          ? options.find(opt => opt.value === value)?.label || value 
          : value || "Not provided"}
    </p>
    )}
  </div>
);

export default ProfilePage;
