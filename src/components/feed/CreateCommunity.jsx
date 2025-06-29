import { useState } from "react";
import { useUser } from "../../context/useUser";
import Button from "../common/Button";
import { createCommunity } from "../../utils/api";

// Component for creating a new community
const CreateCommunity = ({ onClose, onCreate }) => {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setError("Please log in to create a community.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const newGroup = await createCommunity(user.id, { name, description });
      onCreate(newGroup);
      onClose();
      setName("");
      setDescription("");
    } catch (err) {
      setError(err.message || "Failed to create community.");
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 bg-white"
              aria-label="Community description"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="kiwi" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
            <Button variant="kiwi" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
