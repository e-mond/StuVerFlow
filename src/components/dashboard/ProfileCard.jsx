// Component displaying user profile picture and basic details
const ProfileCard = ({ avatar, name, course, joinYear, onEdit }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
      {/* Profile picture container */}
      <div className="w-36 h-36 sm:w-32 sm:h-32 overflow-hidden rounded-lg">
        <img
          src={avatar || "https://via.placeholder.com/128"}
          alt={`${name}'s profile`}
          className="w-full h-full object-cover"
        />
      </div>
      {/* User details section */}
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{name}</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          {course && `${course}, 2025`} | Joined: {joinYear}
        </p>
        {/* Edit button */}
        <button
          onClick={onEdit}
          className="mt-2 bg-kiwi-200 text-white text-sm sm:text-base px-4 py-1 rounded hover:bg-kiwi-dark"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
