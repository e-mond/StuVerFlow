import { useState, useEffect } from "react";
import { useUser } from "../../context/useUser";
import { getUserProfile } from "../../utils/api";

const ProfileCard = ({ onEdit }) => {
  const [profile, setProfile] = useState({
    avatar: "",
    name: "",
    course: "",
    joinYear: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getUserProfile(user.id);
        setProfile({
          avatar: data.avatar || "https://via.placeholder.com/128",
          name: data.name || "Unknown",
          course: data.course || "",
          joinYear: data.joinYear || new Date().getFullYear().toString(),
        });
      } catch (err) {
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
      {loading && <p className="text-gray-600 text-sm">Loading...</p>}
      {error && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && (
        <>
          <div className="w-36 h-36 sm:w-32 sm:h-32 overflow-hidden rounded-lg">
            <img
              src={profile.avatar}
              alt={`${profile.name}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {profile.name}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {profile.course && `${profile.course}, 2025`} | Joined:{" "}
              {profile.joinYear}
            </p>
            <button
              onClick={onEdit}
              className="mt-2 bg-kiwi-200 text-white text-sm sm:text-base px-4 py-1 rounded hover:bg-kiwi-dark"
            >
              Edit Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
