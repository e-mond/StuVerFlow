import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { requestPasswordReset } from "../utils/api";
import forgottenPasswordImage from "../assets/images/Forgotten Password.jpg";

// Component for handling password reset requests
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      await requestPasswordReset(email);
      setSuccess("A password reset link has been sent to your email.");
      setEmail("");
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
      <motion.form
        className="w-full max-w-md backdrop-blur-md bg-white/30 border border-white/40 shadow-xl rounded-2xl p-6 sm:p-8"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center text-kiwi-700 mb-2">
          Forgot Password?
        </h2>
        <div className="bg-white/60 rounded-md px-4 py-3 mb-4">
          <p className="text-center text-sm sm:text-base text-gray-700">
            Don’t worry, it happens! Enter your email to receive a password
            reset link.
          </p>
        </div>
        {success && (
          <div className="mb-4 text-center">
            <p className="text-green-600 text-sm sm:text-base">{success}</p>
            <Button
              variant="peach"
              size="sm"
              className="mt-4"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </Button>
          </div>
        )}
        {error && (
          <p
            className="mb-4 text-center text-red-500 text-sm sm:text-base"
            role="alert"
          >
            {error}
          </p>
        )}
        {!success && (
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
        )}
        {!success && (
          <Button
            variant="peach"
            type="submit"
            disabled={isSubmitting}
            className="w-full text-sm font-medium bg-kiwi-50 hover:bg-peach-600 text-gray-500"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        )}
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
