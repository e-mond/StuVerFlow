const BioCard = ({ bio, onEdit }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="text-sm sm:text-base font-medium text-gray-900">Bio</h3>
      <p className="text-gray-600 text-sm sm:text-base mt-1">
        About Me
        <br />
        {bio || "No bio available."}
      </p>
      {/* Input button for editing bio */}
      <button
        onClick={onEdit}
        className="mt-2 bg-kiwi-200 text-white text-sm sm:text-base px-4 py-1 rounded hover:bg-kiwi-dark"
      >
        Edit Bio
      </button>
    </div>
  );
};

export default BioCard;
