// Importing necessary React hooks and components
import { useState, useEffect } from "react";
import { useUser } from "../context/useUser";
import Sidebar from "../components/common/Sidebar";
import ProfileCard from "../components/dashboard/ProfileCard";
import ReputationCard from "../components/dashboard/ReputationCard";
import BioCard from "../components/dashboard/BioCard";
import ActivityCard from "../components/dashboard/ActivityCard";
import DraftCard from "../components/dashboard/DraftCard";
import {
  getUserProfile,
  updateUserProfile,
  fetchRecentActivity,
  fetchDrafts,
} from "../utils/api";

// Main component for the user dashboard page
const DashboardPage = () => {
  const { user } = useUser(); // Accessing user context for user ID
  const [profile, setProfile] = useState({
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80", // Mock profile picture of a Black student
    name: "Aisha Johnson",
    handle: "@aishaj",
    course: "Computer Science",
    joinYear: "2023",
    reputation: 150,
    bio: "Passionate about coding and learning new technologies. Always eager to help others with their questions!",
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [error, setError] = useState(null);

  // Loading profile, recent activity, and drafts on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile(user.id);
        setProfile({
          avatar: data.avatar || profile.avatar,
          name:
            data.name || `${data.firstName} ${data.surname}` || profile.name,
          handle: data.handle || profile.handle,
          course: data.course || profile.course,
          joinYear: data.created_at
            ? new Date(data.created_at).getFullYear()
            : profile.joinYear,
          reputation: data.reputation || profile.reputation,
          bio: data.bio || profile.bio,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch profile.");
      }
    };

    const loadRecentActivity = async () => {
      try {
        const data = await fetchRecentActivity(user.id);
        setRecentActivity(data);
      } catch (err) {
        setError(err.message || "Failed to fetch recent activity.");
      }
    };

    const loadDrafts = async () => {
      try {
        const data = await fetchDrafts(user.id);
        setDrafts(data);
      } catch (err) {
        setError(err.message || "Failed to fetch drafts.");
      }
    };

    if (user?.id) {
      loadProfile();
      loadRecentActivity();
      loadDrafts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handling profile update submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (newAvatar) formData.append("avatar", newAvatar);
    formData.append("firstName", profile.name.split(" ")[0] || "");
    formData.append("surname", profile.name.split(" ")[1] || "");
    formData.append("handle", profile.handle);
    formData.append("course", profile.course);
    formData.append("bio", profile.bio);

    try {
      const updatedProfile = await updateUserProfile(user.id, {
        firstName: profile.name.split(" ")[0] || "",
        surname: profile.name.split(" ")[1] || "",
        handle: profile.handle,
        course: profile.course,
        bio: profile.bio,
      });
      setProfile((prev) => ({
        ...prev,
        avatar: updatedProfile.avatar || prev.avatar,
      }));
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar /> {/* Sidebar for navigation */}
      <div className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Profile
        </h1>

        {error && (
          <p className="text-red-500 text-sm sm:text-base mb-4" role="alert">
            {error}
          </p>
        )}

        {isEditing ? (
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Edit Profile
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewAvatar(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-kiwi file:text-white hover:file:bg-kiwi-dark"
              />
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder="Full Name"
                className="w-full p-2 border rounded text-sm sm:text-base"
              />
              <input
                type="text"
                value={profile.handle}
                onChange={(e) =>
                  setProfile({ ...profile, handle: e.target.value })
                }
                placeholder="@handle"
                className="w-full p-2 border rounded text-sm sm:text-base"
              />
              <input
                type="text"
                value={profile.course}
                onChange={(e) =>
                  setProfile({ ...profile, course: e.target.value })
                }
                placeholder="Course"
                className="w-full p-2 border rounded text-sm sm:text-base"
              />
              <textarea
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                placeholder="Bio"
                className="w-full p-2 border rounded text-sm sm:text-base"
                rows="3"
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-kiwi text-white text-sm sm:text-base px-4 py-2 rounded hover:bg-kiwi-dark"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border border-gray-300 text-gray-700 text-sm sm:text-base px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Profile picture on the left */}
              <ProfileCard
                avatar={profile.avatar}
                name={profile.name}
                course={profile.course}
                joinYear={profile.joinYear}
                onEdit={() => setIsEditing(true)}
              />
              {/* Reputation and Bio cards on the right */}
              <div className="space-y-4">
                <ReputationCard
                  reputation={profile.reputation}
                  onEdit={() => setIsEditing(true)}
                />
                <BioCard bio={profile.bio} onEdit={() => setIsEditing(true)} />
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        type={activity.type}
                        content={activity.content}
                        timestamp={activity.timestamp}
                        link={activity.link}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm sm:text-base">
                    No recent activity found.
                  </p>
                )}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  Drafts
                </h3>
                {drafts.length > 0 ? (
                  <div className="space-y-4">
                    {drafts.map((draft) => (
                      <DraftCard
                        key={draft.id}
                        title={draft.title}
                        description={draft.description}
                        timestamp={draft.timestamp}
                        link={draft.link}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm sm:text-base">
                    No drafts found.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
