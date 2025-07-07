import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";
import Button from "../common/Button";
import { FaImage } from "react-icons/fa";
import { postQuestion } from "../../utils/api";

// Component for submitting a new question with live preview support
const QuestionForm = ({ onChange }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle form submission to post the question
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      setError("Please log in to post a question.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      
      const questionData = {
        title,
        description,
        tags: tagArray
      };
      
      const response = await postQuestion(user.id, questionData);
      alert("Question posted successfully!");
      setTitle("");
      setDescription("");
      setTags("");
      setImage(null);
      if (onChange)
        onChange({ title: "", description: "", tags: [], image: null });
      navigate(`/question/${response.id}`); // Redirect to the new question
    } catch (error) {
      console.error("Error posting question:", error);
      setError(error.message || "Failed to post question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update parent component with current form data for live preview
  const handleInputChange = () => {
    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const previewImage = image ? URL.createObjectURL(image) : null;
    if (onChange)
      onChange({ title, description, tags: tagArray, image: previewImage });
  };

  // Handle image file selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
    handleInputChange();
  };

  return (
    <motion.form
      className="bg-white p-5 rounded-lg shadow-md max-w-xl mx-auto border border-kiwi-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
    >
      {error && (
        <p className="text-red-500 text-sm mb-4" role="alert">
          {error}
        </p>
      )}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleInputChange();
          }}
          className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700"
          required
          aria-label="Question title"
          placeholder="Enter a concise question title"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-medium"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleInputChange();
          }}
          className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 resize-none"
          rows="6"
          required
          aria-label="Question description"
          placeholder="Provide details about your question"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="tags" className="block text-gray-700 font-medium">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
            handleInputChange();
          }}
          className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700"
          aria-label="Question tags"
          placeholder="e.g., math, algebra, calculus"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="kiwi" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Post Question"}
        </Button>
        <label className="cursor-pointer">
          <FaImage className="text-kiwi-700 hover:text-kiwi-900" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            aria-label="Upload image"
          />
        </label>
      </div>
    </motion.form>
  );
};

export default QuestionForm;
