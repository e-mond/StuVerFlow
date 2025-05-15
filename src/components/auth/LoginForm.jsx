import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../common/Button";
import { login } from "../../api/api";
import { useNavigate } from "react-router-dom";

// Component for user login
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/home"); // Redirect to home or feed after successful login
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Log In to StoverFlow
      </h2>
      {error && (
        <p className="text-red-500 text-sm sm:text-base mb-4" role="alert">
          {error}
        </p>
      )}
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
          disabled={loading}
        />
      </div>
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
          disabled={loading}
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <Button variant="peach" type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </Button>
        <Button
          variant="mint"
          onClick={() => console.log("Google OAuth")}
          disabled={loading}
        >
          Log In with Google
        </Button>
      </div>
    </motion.form>
  );
};

export default LoginForm;
