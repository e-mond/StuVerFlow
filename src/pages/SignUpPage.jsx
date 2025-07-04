import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { signup } from "../utils/api";
import { useUser } from "../context/UserContext";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    createPassword: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "confirmPassword" || name === "createPassword") {
      const newPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;
      const confirmPassword =
        name === "createPassword" ? value : formData.createPassword;

      setPasswordMatchError(
        newPassword && confirmPassword && newPassword !== confirmPassword
          ? "Passwords do not match"
          : "",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { firstName, surname, email, createPassword, confirmPassword } =
      formData;

    try {
      if (
        !firstName ||
        !surname ||
        !email ||
        !createPassword ||
        !confirmPassword
      ) {
        throw new Error("All fields are required");
      }

      if (createPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const username = `${firstName.toLowerCase()}.${surname.toLowerCase()}`;
      const name = `${firstName} ${surname}`;

      const signupData = {
        username,
        email,
        password: createPassword,
        name,
      };

      const userData = await signup(signupData);
      login(userData); // Ensure context and localStorage are updated

      // Clear form
      setFormData({
        firstName: "",
        surname: "",
        email: "",
        createPassword: "",
        confirmPassword: "",
      });

      navigate("/profilesetup");
    } catch (err) {
      console.error("Error signing up:", err);
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left section with image */}
      <div
        className="hidden lg:flex w-full lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md flex flex-col justify-center items-center p-4 lg:p-8">
          <div className="flex items-center p-6 lg:p-10 bg-kiwi-50 rounded-lg max-w-md w-full">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Create Your Account{" "}
                <span className="text-xl lg:text-2xl mr-2">🔒</span>
              </h2>
              <p className="text-gray-600 text-sm lg:text-base">
                Join StuVerFlow to ask questions, share knowledge, and connect
                with your campus community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right section with form */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-6 w-full lg:w-1/2">
        <motion.div
          className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-kiwi-200 w-full max-w-md sm:max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="flex justify-center mb-4 sm:mb-6 text-3xl text-kiwi-700 font-bold"
            style={{ fontFamily: "'Sacramento', cursive" }}
          >
            StuVerFlow
          </div>

          <div className="flex items-center mb-4 sm:mb-6 p-4 bg-kiwi-50 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Create Account
            </h2>
          </div>

          {error && (
            <p className="text-red-500 text-sm sm:text-base mb-4" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name fields */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 font-medium text-sm sm:text-base"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
                  required
                  placeholder="Enter your first name"
                />
              </div>

              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="surname"
                  className="block text-gray-700 font-medium text-sm sm:text-base"
                >
                  Surname
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
                  required
                  placeholder="Enter your surname"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium text-sm sm:text-base"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
                required
                placeholder="Enter your email address"
              />
            </div>

            {/* Create password */}
            <div className="mb-4">
              <label
                htmlFor="createPassword"
                className="block text-gray-700 font-medium text-sm sm:text-base"
              >
                Create Password
              </label>
              <input
                type="password"
                id="createPassword"
                name="createPassword"
                value={formData.createPassword}
                onChange={handleChange}
                className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
                required
                placeholder="Create a password"
              />
            </div>

            {/* Confirm password */}
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium text-sm sm:text-base"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
                required
                placeholder="Confirm your password"
              />
              {passwordMatchError && (
                <p className="text-red-600 text-sm mt-1">
                  {passwordMatchError}
                </p>
              )}
            </div>

            {/* Submit button */}
            <Button
              variant="kiwi"
              type="submit"
              disabled={isSubmitting}
              className="w-full text-sm sm:text-base"
            >
              {isSubmitting ? "Submitting..." : "Sign Up"}
            </Button>

            {/* Navigation */}
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-kiwi-700 hover:underline font-medium"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
