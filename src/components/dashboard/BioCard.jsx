import { useState, useEffect } from "react";
import { useUser } from "../../context/useUser";
import { getUserProfile, updateUserProfile } from "../../utils/api";

const BioCard = ({ onEdit }) => {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchBio = async () => {
      if (!user?.id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const profile = await getUserProfile(user.id);
        setBio(profile.bio || "No bio available.");
      } catch (err) {
        setError(err.message || "Failed to fetch bio");
      } finally {
        setLoading(false);
      }
    };
    fetchBio();
  }, [user]);

  const handleEdit = async () => {
    if (!user?.id) {
      setError("User not logged in");
      return;
    }
    try {
      setError(null);
      const newBio = prompt("Enter your new bio:", bio);
      if (newBio !== null) {
        await updateUserProfile(user.id, { bio: newBio });
        setBio(newBio || "No bio available.");
      }
    } catch (err) {
      setError(err.message || "Failed to update bio");
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      {loading && <p className="text-gray-600 text-sm">Loading...</p>}
      {error && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && (
        <>
          <h3 className="text-sm sm:text-base font-medium text-gray-900">
            Bio
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            About Me
            <br />
            {bio}
          </p>
          <button
            onClick={onEdit || handleEdit}
            className="mt-2 bg-kiwi-200 text-white text-sm sm:text-base px-4 py-1 rounded hover:bg-kiwi-dark"
          >
            Edit Bio
          </button>
        </>
      )}
    </div>
  );
};

export default BioCard;
