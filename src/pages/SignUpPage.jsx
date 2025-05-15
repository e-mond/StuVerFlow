import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { signup, updateUserProfile } from "../utils/api";
import { useUser } from "../context/useUser";

// Component rendering the signup page with a form, promotional image, and login option
const SignUpPage = () => {
  // State for form data, submission status, and error handling
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    handle: "",
    dob: "",
    email: "",
    createPassword: "",
    confirmPassword: "",
    institution: "",
    course: "",
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [error, setError] = useState(null);
  const [autoGenerateHandle, setAutoGenerateHandle] = useState(true);

  // Hook for navigation after successful signup
  const navigate = useNavigate();
  // Hook for accessing user context to log in the user
  const { login } = useUser();

  // Generating a default handle based on firstName and surname
  const generateHandle = () => {
    const baseHandle = `${formData.firstName.toLowerCase()}.${formData.surname.toLowerCase()}`;
    return `@${baseHandle.replace(/\s+/g, "")}`; // Remove spaces and add @ prefix
  };

  // Handling form input changes with password validation and handle generation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      // Auto-generate handle if the toggle is on and firstName or surname changes
      if (autoGenerateHandle && (name === "firstName" || name === "surname")) {
        updatedFormData.handle = generateHandle();
      }
      return updatedFormData;
    });

    // Validate password match
    if (name === "confirmPassword" || name === "createPassword") {
      setPasswordMatchError(
        formData.createPassword !== value && value !== ""
          ? "Passwords do not match"
          : "",
      );
    }

    // Reset handle to auto-generated if toggling back to auto-generate
    if (name === "autoGenerateHandle") {
      if (e.target.checked) {
        setFormData((prev) => ({ ...prev, handle: generateHandle() }));
      }
      setAutoGenerateHandle(e.target.checked);
    }
  };

  // Handling form submission to create a new user and update their profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      // Validating required fields
      const {
        firstName,
        surname,
        handle,
        email,
        createPassword,
        confirmPassword,
        institution,
      } = formData;
      if (
        !firstName ||
        !surname ||
        !handle ||
        !email ||
        !createPassword ||
        !institution
      ) {
        throw new Error(
          "First name, surname, handle, email, password, and institution are required",
        );
      }
      if (createPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (!handle.startsWith("@")) {
        throw new Error("Handle must start with @");
      }

      // Creating a username and handle for signup
      const username = `${firstName.toLowerCase()}.${surname.toLowerCase()}`;
      const signupData = { username, email, password: createPassword };
      // Signing up the user via API
      const userData = await signup(signupData);

      // Logging the user in by updating the user context
      login(userData);

      // Updating the user's profile with additional details, including handle
      await updateUserProfile(userData.id, {
        firstName,
        surname,
        handle: handle.replace("@", ""), // Remove @ for backend storage
        dob: formData.dob || null,
        institution,
        course: formData.course || null,
        bio: formData.bio || null,
      });

      // Clearing the form after successful signup
      setFormData({
        firstName: "",
        surname: "",
        handle: "",
        dob: "",
        email: "",
        createPassword: "",
        confirmPassword: "",
        institution: "",
        course: "",
        bio: "",
      });

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
    <div className="flex min-h-screen bg-white">
      {/* Left side with promotional image and glass-like effect (hidden on mobile) */}
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

      {/* Main content with signup form */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-6 w-full lg:w-1/2">
        <motion.div
          className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-kiwi-200 w-full max-w-md sm:max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* StuVerFlow Logo */}
          <div
            className="flex justify-center mb-4 sm:mb-6 text-3xl text-kiwi-700 font-bold"
            style={{ fontFamily: "'Sacramento', cursive" }}
          >
            StuVerFlow
          </div>

          {/* Card header */}
          <div className="flex items-center mb-4 sm:mb-6 p-4 bg-kiwi-50 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Create Account
            </h2>
          </div>

          {/* Error message display */}
          {error && (
            <p className="text-red-500 text-sm sm:text-base mb-4" role="alert">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* First Name field */}
            <div className="mb-4">
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
                aria-label="First name"
                placeholder="Enter your first name"
              />
            </div>

            {/* Surname field */}
            <div className="mb-4">
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
                aria-label="Surname"
                placeholder="Enter your surname"
              />
            </div>

            {/* Handle field with auto-generate toggle */}
            <div className="mb-4">
              <label
                htmlFor="handle"
                className="block text-gray-700 font-medium text-sm sm:text-base"
              >
                Handle
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="autoGenerateHandle"
                  name="autoGenerateHandle"
                  checked={autoGenerateHandle}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label
                  htmlFor="autoGenerateHandle"
                  className="text-gray-700 text-sm sm:text-base"
                >
                  Auto-generate handle
                </label>
              </div>
              <input
                type="text"
                id="handle"
                name="handle"
                value={formData.handle}
                onChange={handleChange}
                disabled={autoGenerateHandle}
                className={`w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base ${
                  autoGenerateHandle ? "opacity-50 cursor-not-allowed" : ""
                }`}
                required
                aria-label="Handle"
                placeholder="@username"
              />
            </div>

            {/* Date of Birth field */}
            <div className="mb-4">
              <label
                htmlFor="dob"
                className="block text-gray-700 font-medium text-sm sm:text-base"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
                aria-label="Date of birth"
              />
            </div>

            {/* Email field */}
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
                aria-label="Email address"
                placeholder="Enter your email address"
              />
            </div>

            {/* Create Password field */}
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
                aria-label="Create password"
                placeholder="Create a password"
              />
            </div>

            {/* Confirm Password field */}
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
                aria-label="Confirm password"
                placeholder="Confirm your password"
              />
              {passwordMatchError && (
                <p className="text-red-600 text-sm mt-1">
                  {passwordMatchError}
                </p>
              )}
            </div>

            {/* Institution field */}
            <div className="mb-4">
              <label
                htmlFor="institution"
                className="block text-gray-700 font-medium text-sm sm:text-base"
              >
                Institution
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
                required
                aria-label="Institution"
                placeholder="Enter your institution (e.g., University of Example)"
              />
            </div>

            {/* Course field */}
            <div className="mb-4">
              <label
                htmlFor="course"
                className="block text-gray-700 font-medium text-sm sm:text-base"
              >
                Course
              </label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
                aria-label="Course"
                placeholder="Enter your course (e.g., Calculus I)"
              />
            </div>

            {/* Bio field */}
            <div className="mb-4">
              <label
                htmlFor="bio"
                className="block text-gray-700 font-medium text-sm sm:text-base"
              >
                Bio (Optional)
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 rounded border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 resize-none text-sm sm:text-base"
                rows="3"
                aria-label="Bio"
                placeholder="Tell us about yourself (e.g., interests, skills)"
              />
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

            {/* Login option */}
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
