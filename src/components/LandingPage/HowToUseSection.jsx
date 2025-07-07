import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ShareImg from "../../assets/images/Share.jpg";
import JoinImg from "../../assets/images/Join.jpg";
import GetImg from "../../assets/images/Get.jpg";

// Animation variants
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

// Features array
const features = [
  {
    title: "Share Your Knowledge and Expertise",
    description:
      "Support your peers by answering questions in your area of study. Share what you know, help others grow, and build your academic presence with every answer..",
    img: ShareImg,
  },
  {
    title: "Join Discussions and Build Connections",
    description:
      "Be part of active conversations in your study community. Ask questions, get helpful answers, and form connections that support your academic success.",
    img: JoinImg,
  },
  {
    title: "Get Help Fast from Students Like You",
    description:
      "Whether you're stuck on a tricky problem or need quick clarification, StuVerFlow connects you with fellow students who’ve been there. Get real answers, fast — from peers who understand your area of study and are ready to help.",
    img: GetImg,
  },
];

const HowToUseSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white text-gray-900 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section Heading */}
        <motion.div className="mb-8 sm:mb-12" variants={itemVariants}>
          <p
            className="text-sm sm:text-base mb-2 text-start"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
          >
            Connect
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4 text-start"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
          >
            How to Use StuVerFlow
          </h2>
          <p
            className="text-gray-700 text-base sm:text-lg max-w-3xl text-start"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
          >
            StuVerFlow helps students grow by connecting them with others in
            their academic field. <br />
            Join a learning community, ask for help, and share your own
            knowledge with ease.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-left"
              variants={itemVariants}
            >
              <div className="w-full h-32 sm:h-48 bg-gray-300 flex items-center justify-center mb-4 rounded-md overflow-hidden">
                <img
                  src={feature.img}
                  alt={`${feature.title} illustration`}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3
                className="text-lg sm:text-xl font-bold mb-2"
                style={{ fontFamily: "'Fira Sans', sans-serif" }}
              >
                {feature.title}
              </h3>
              <p
                className="text-gray-600 text-sm sm:text-base"
                style={{ fontFamily: "'Fira Sans', sans-serif" }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Sign Up Action */}
        <motion.div className="flex" variants={itemVariants}>
          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-1 text-sm sm:text-base font-medium text-kiwi-700 hover:underline"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
          >
            Sign Up <span>→</span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowToUseSection;
