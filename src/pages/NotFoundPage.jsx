import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Animation for the traveler illustration with a gentle bounce
const travelerBounce = {
  bounce: {
    y: [0, -15, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Animation for fading in the entire card with a smooth effect
const cardFadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Component for displaying a friendly 404 Not Found page
const NotFoundPage = () => {
  return (
    // Full-screen container with a soft pastel gradient and cloud pattern
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center"
      style={{
        backgroundImage: `radial-gradient(circle at 10px 10px, rgba(255, 255, 255, 0.4) 2%, transparent 4%)`,
        backgroundSize: "60px 60px",
      }}
    >
      {/* Card container with a glow effect and rounded corners */}
      <motion.div
        className="bg-white p-12 rounded-2xl shadow-lg max-w-md text-center border border-gray-100 glow-effect"
        style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)" }}
        variants={cardFadeIn}
        initial="hidden"
        animate="visible"
      >
        {/* Playful 404 heading to grab attention */}
        <h1
          className="text-8xl font-bold text-kiwi-700 mb-6"
          style={{ fontFamily: "'Bubblegum Sans', cursive" }}
        >
          404
        </h1>

        {/* Animated illustration of a lost traveler with a map */}
        <motion.div
          className="w-36 h-36 mx-auto mb-8"
          variants={travelerBounce}
          animate="bounce"
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            className="text-kiwi-700"
          >
            {/* Head of the traveler */}
            <circle
              cx="50"
              cy="30"
              r="15"
              strokeWidth="4"
              fill="rgba(147, 197, 253, 0.2)"
            />
            {/* Body */}
            <path d="M50 45 L50 70" strokeWidth="4" />
            {/* Arms holding a map */}
            <path d="M50 50 L35 55 M50 50 L65 55" strokeWidth="4" />
            {/* Legs */}
            <path d="M50 70 L40 85 M50 70 L60 85" strokeWidth="4" />
            {/* Map rectangle */}
            <rect
              x="35"
              y="50"
              width="30"
              height="15"
              strokeWidth="4"
              fill="rgba(255, 255, 255, 0.5)"
            />
          </svg>
        </motion.div>

        {/* Friendly error message to reassure the user */}
        <p
          className="text-xl text-gray-700 mb-8"
          style={{ fontFamily: "'Fira Sans', sans-serif" }}
        >
          Oops! Looks like we took a wrong turn. Let’s get you back on track!
        </p>

        {/* Styled button to guide the user back to the home page */}
        <Link to="/">
          <motion.button
            className="bg-kiwi-800 text-white px-8 py-3 rounded-lg hover:bg-kiwi-200 transition-colors"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
