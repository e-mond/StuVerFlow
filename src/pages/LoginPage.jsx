import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
//import { login } from "../utils/api";

// Component rendering the login page with a form, promotional image section, signup option, and forgot password link
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to log in a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { email, password } = formData;
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      //await login({ email, password });

      setFormData({ email: "", password: "" });
      navigate("/home");
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.message || "Failed to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side  */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md flex flex-col justify-center items-center p-8">
          <div className="mb-8 p-4 bg-kiwi-50 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Welcome Back to StuVerFlow
            </h2>
            <p className="text-gray-700 text-lg text-center max-w-md">
              Log in to continue asking questions, sharing knowledge, and
              connecting with your campus community.
            </p>
          </div>
        </div>
      </div>

      {/* Main content with login form */}
      <div className="flex-1 flex justify-center items-center p-4 w-full lg:w-1/2">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md border border-kiwi-200 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div
              className="text-3xl text-kiwi-700 font-bold"
              style={{ fontFamily: "'Sacramento', cursive" }}
            >
              StuVerFlow
            </div>
          </div>

          {/* Card header with icon and description */}
          <div className="flex items-center mb-6 p-4 bg-kiwi-50 rounded-lg">
            <span className="text-2xl mr-2">🔒</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Log In to Your Account
              </h2>
              <p className="text-gray-600 text-sm">
                Access the platform to continue your learning journey.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700"
                required
                aria-label="Email address"
                placeholder="Enter your email address"
              />
            </div>

            {/* Password field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700"
                required
                aria-label="Password"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit button */}
            <Button variant="kiwi" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>

            {/* Signup and Forgot Password options */}
            <div className="mt-4 text-center space-y-2">
              <p className="text-gray-600 text-sm">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-kiwi-700 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
              <p className="text-gray-600 text-sm">
                <Link
                  to="/forgot-password"
                  className="text-kiwi-700 hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
