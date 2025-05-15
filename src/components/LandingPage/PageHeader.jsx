import { motion } from "framer-motion";
import LandingImage from "../../assets/images/Landing.jpg";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LandingPageHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white text-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header Text Section */}
      <motion.div className="mb-12 text-center" variants={itemVariants}>
        <h2 className="text-3xl font-bold mb-2">
          Ask, Answer, Ace Your Studies!
        </h2>
        <p className="text-gray-600">
          An educational community for questions, knowledge, and collaboration.
        </p>
      </motion.div>

      {/* Hero Image */}
      <img
        src={LandingImage}
        alt="StuVerFlow Banner"
        className="w-full h-auto object-cover mb-12"
      />

      {/* Buttons and Get Started Section */}
      <motion.div
        className="flex flex-col md:flex-row items-start justify-start w-full max-w-6xl gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-start gap-4">
          <motion.p
            className="text-sm mb-2 text-start"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
            variants={itemVariants}
          >
            Get Started
          </motion.p>

          {/* Join and Login Buttons */}
          <motion.div className="flex gap-4" variants={itemVariants}>
            <Button
              variant="outline"
              className="bg-kiwi-700 text-white border px-6 py-3 rounded-lg hover:bg-kiwi-800 transition-colors text-sm"
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
              onClick={() => navigate("/signup")}
            >
              Join
            </Button>
            <Button
              variant="outline"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg transition-colors text-sm"
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
              onClick={() => navigate("/login")}
            >
              Login <span>→</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
};

export default LandingPageHeader;
