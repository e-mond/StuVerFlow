import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Animation settings for container and items
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

const HeroHeader = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-200 text-gray-800 px-6 py-20">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section Label */}
        <div>
          <p
            className="text-sm mb-2 text-start"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
          >
            Why StuVerFlow?
          </p>
        </div>

        {/* Heading and Description */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-16">
          <motion.h1
            className="text-4xl font-bold text-start md:max-w-xl"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
            variants={itemVariants}
          >
            Empowering Student
            <br />
            Collaboration and
            <br />
            Knowledge Sharing
          </motion.h1>

          <motion.p
            className="text-gray-700 text-base md:text-lg max-w-xl text-start"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
            variants={itemVariants}
          >
            StuVerFlow is your go-to platform for academic engagement. Ask
            questions, share insights, and collaborate with peers to enhance
            your learning experience. Join a vibrant community that values
            knowledge and support.
          </motion.p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 text-left gap-8 mb-10">
          {[
            {
              title: "Ask Questions to Enhance Your Learning",
              desc: "Get answers from fellow students and experts.",
            },
            {
              title: "Share Knowledge and Insights with Peers",
              desc: "Contribute your expertise to help others succeed.",
            },
            {
              title: "Collaborate on Projects and Ideas",
              desc: "Work together to create impactful solutions.",
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Package className="w-8 h-8 mb-4 text-gray-900" />
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: "'Fira Sans', sans-serif" }}
              >
                {feature.title}
              </h3>
              <p
                className="text-gray-600 text-sm"
                style={{ fontFamily: "'Fira Sans', sans-serif" }}
              >
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Sign Up Button  */}
        <div className="flex items-start sm:items-center">
          <motion.button
            variants={itemVariants}
            className="flex items-center gap-1 text-sm font-medium text-kiwi-700 hover:underline"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
            onClick={() => navigate("/signup")}
          >
            Sign Up <ArrowRight className="ml-2 w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroHeader;
