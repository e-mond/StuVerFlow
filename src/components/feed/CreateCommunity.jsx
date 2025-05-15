import { useState } from "react";
import Button from "../common/Button";

// Component for creating a new community
const CreateCommunity = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description) {
      setError("Name and description are required");
      return;
    }
    if (name.length < 3) {
      setError("Name must be at least 3 characters long");
      return;
    }
    if (description.length < 10) {
      setError("Description must be at least 10 characters long");
      return;
    }
    const newGroup = {
      id: Date.now(),
      name,
      description,
      members: 1, // Initial member (creator)
    };
    onCreate(newGroup);
    onClose();
    setName("");
    setDescription("");
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Create Community
        </h2>
        {error && (
          <p className="text-red-500 text-sm mb-4" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 bg-white"
              aria-label="Community name"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 bg-white"
              aria-label="Community description"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="kiwi" type="submit">
              Create
            </Button>
            <Button variant="kiwi" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
