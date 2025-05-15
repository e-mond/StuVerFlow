import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { signup } from "../../utils/api";
import { useUser } from "../../context/useUser";

// Component for handling user signup with form submission and redirection
const SignUpForm = () => {
  // State for form inputs, submission status, and error handling
  const [username, setUsername] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [handleError, setHandleError] = useState("");

  // Hook for navigation after successful signup
  const navigate = useNavigate();
  // Hook for accessing user context to log in the user
  const { login } = useUser();

  // Validating handle: 2-14 characters, no hyphens, only dots or underscores allowed
  const validateHandle = (value) => {
    const handleRegex = /^[a-zA-Z0-9._]{2,14}$/;
    if (!value) {
      return "Handle is required";
    }
    if (value.length < 2 || value.length > 14) {
      return "Handle must be between 2 and 14 characters";
    }
    if (value.includes("-")) {
      return "Hyphens are not allowed in the handle";
    }
    if (!handleRegex.test(value)) {
      return "Handle can only contain letters, numbers, dots, or underscores";
    }
    return "";
  };

  // Handling handle input change with validation
  const handleHandleChange = (e) => {
    const value = e.target.value;
    setHandle(value);
    setHandleError(validateHandle(value));
  };

  // Handling form submission with API integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate handle before submission
    const handleValidationError = validateHandle(handle);
    if (handleValidationError) {
      setHandleError(handleValidationError);
      setIsSubmitting(false);
      return;
    }

    try {
      // Calling the signup API to register the user with handle
      const userData = await signup({ username, handle, email, password });
      // Logging the user in by updating the user context
      login(userData);
      // Clearing form fields after successful signup
      setUsername("");
      setHandle("");
      setEmail("");
      setPassword("");
      // Redirecting to the feed page
      navigate("/home");
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error.message || "Failed to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
    >
      {/* Form title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Sign Up for StoverFlow
      </h2>

      {/* Error message display */}
      {error && (
        <p className="text-red-500 text-sm mb-4" role="alert">
          {error}
        </p>
      )}

      {/* Username input field */}
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base"
          required
          aria-label="Username"
          placeholder="Choose a username"
        />
      </div>

      {/* Handle input field */}
      <div className="mb-4">
        <label
          htmlFor="handle"
          className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base"
        >
          Handle
        </label>
        <input
          type="text"
          id="handle"
          value={handle}
          onChange={handleHandleChange}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base"
          required
          aria-label="Handle"
          placeholder="Choose a handle (e.g., johndoe123)"
        />
        {handleError && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {handleError}
          </p>
        )}
      </div>

      {/* Email input field */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base"
          required
          aria-label="Email address"
          placeholder="Enter your email"
        />
      </div>

      {/* Password input field */}
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-gray-700 dark:text-gray-300 text-sm sm:text-base"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm sm:text-base"
          required
          aria-label="Password"
          placeholder="Create a password"
        />
      </div>

      {/* Submit button */}
      <Button
        variant="peach"
        type="submit"
        disabled={isSubmitting}
        className="w-full text-sm sm:text-base"
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </Button>
    </motion.form>
  );
};

export default SignUpForm;
