import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { requestPasswordReset } from "../utils/api";
import forgottenPasswordImage from "../assets/images/Forgotten Password.jpg";

// Component for handling password reset requests
const ForgotPasswordPage = () => {
  // State to manage email input, submission status, and feedback messages
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Hook for navigation after successful reset request
  const navigate = useNavigate();

  // Handling form submission to request a password reset link
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      // Sending the email to the API for password reset request
      await requestPasswordReset({ email });
      setSuccess("A password reset link has been sent to your email.");
      setEmail("");
      // Redirect to login page after a 3-second delay
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setError(error.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen w-full bg-cover bg-center p-4"
      style={{
        backgroundImage: `url(${forgottenPasswordImage})`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Form container with backdrop and styling */}
      <motion.form
        className="w-full max-w-md backdrop-blur-md bg-white/30 border border-white/40 shadow-xl rounded-2xl p-6 sm:p-8"
        onSubmit={handleSubmit}
      >
        {/* Title of the forgot password page */}
        <h2 className="text-xl sm:text-2xl font-bold text-center text-kiwi-700 mb-2">
          Forgot Password ?
        </h2>

        {/* Friendly message with background styling */}
        <div className="bg-white/60 rounded-md px-4 py-3 mb-4">
          <p className="text-center text-sm sm:text-base text-gray-700">
            Don’t worry, it happens! We’ll help you reset your password and get
            back on track.
          </p>
        </div>

        {/* Success message display */}
        {success && (
          <p className="mb-4 text-center text-green-600 text-sm sm:text-base">
            {success}
          </p>
        )}

        {/* Error message display */}
        {error && (
          <p
            className="mb-4 text-center text-red-500 text-sm sm:text-base"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Email input field */}
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-peach-500"
            placeholder="Enter your email"
            required
            aria-label="Email address"
          />
        </div>

        {/* Submit button with custom styling */}
        <Button
          variant="peach"
          type="submit"
          disabled={isSubmitting}
          className="w-full text-sm font-medium bg-kiwi-50 hover:bg-peach-600 text-gray-500"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>

        {/* Back to login link */}
        <div className="mt-5 text-center">
          <a href="/login" className="text-sm text-peach-700 hover:underline">
            Back to Login
          </a>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default ForgotPasswordPage;
