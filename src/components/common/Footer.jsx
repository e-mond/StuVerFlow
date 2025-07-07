import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

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

// Footer component
const Footer = () => {
  // State for controlling modal visibility and content
  const [modalContent, setModalContent] = useState(null);

  // Modal content definitions
  const modalData = {
    "about-us": {
      title: "About Us",
      content:
        "StuVerFlow is a platform designed to connect college students for collaboration and learning. Launched in 2025, we aim to foster a supportive academic community where students can ask questions, share knowledge, and connect with peers and experts.",
    },
    "contact-us": {
      title: "Contact Us",
      content:
        "Reach us at support@stuverflow.com or call +1-800-STUDENT. We're here to help 24/7! For urgent academic support, use our live chat feature.",
    },
    "help-centre": {
      title: "Help Centre",
      content:
        "Visit our Help Centre for FAQs, troubleshooting, and support articles at help.stuverflow.com. Find guides on asking questions, earning reputation, and connecting with study groups.",
    },
    "community-guidelines": {
      title: "Community Guidelines",
      content:
        "Follow our guidelines to ensure a respectful environment: be kind, stay on topic, cite sources, avoid plagiarism, and report violations to moderators. Academic integrity is our priority.",
    },
    "for-educators": {
      title: "For Educators",
      content:
        "Join StuVerFlow as an educator to mentor students, share expertise, and build your academic network. Create verified expert profiles, host Q&A sessions, and contribute to our knowledge base.",
    },
    "privacy-policy": {
      title: "Privacy Policy",
      content:
        "We protect your data with strict privacy measures. Your academic information is secure and only shared with your consent. Read more at stuverflow.com/privacy.",
    },
    "terms-of-use": {
      title: "Terms of Use",
      content:
        "By using StuVerFlow, you agree to our terms. Respect intellectual property, maintain academic integrity, and use the platform responsibly. Check details at stuverflow.com/terms.",
    },
    "cookie-preferences": {
      title: "Cookie Preferences",
      content:
        "Manage your cookie settings at stuverflow.com/cookies for a personalized experience. We use cookies to improve your learning experience and connect you with relevant content.",
    },
  };

  return (
    <footer className="bg-gray-100 text-black py-6 sm:py-8 px-4 sm:px-8 border-t border-gray-300 mt-auto">
      <motion.div
        className="max-w-7xl mx-auto flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo section */}
        <motion.div variants={itemVariants} className="text-center">
          <h3
            className="text-2xl sm:text-3xl font-bold text-kiwi-700"
            style={{ fontFamily: "'Sacramento', cursive" }}
          >
            StuVerFlow
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Connecting students through knowledge and collaboration
          </p>
        </motion.div>

        {/* Platform Stats */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-kiwi-600 font-semibold">📚</span>
              <span className="text-gray-700">1K+ Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-kiwi-600 font-semibold">👥</span>
              <span className="text-gray-700">500+ Students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-kiwi-600 font-semibold">🎓</span>
              <span className="text-gray-700">100+ Experts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-kiwi-600 font-semibold">🏫</span>
              <span className="text-gray-700">50+ Universities</span>
            </div>
          </div>
        </motion.div>

        {/* Navigation links section */}
        <motion.div variants={itemVariants} className="text-center">
          <ul className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm">
            {[
              "About Us",
              "Contact Us",
              "Help Centre",
              "Community Guidelines",
              "For Educators",
              "Join Now",
            ].map((link) => (
              <li key={link} className="w-full sm:w-auto">
                {link === "Join Now" ? (
                  <Link
                    to="/signup"
                    className="text-black hover:text-kiwi-600 hover:underline block w-full text-center sm:text-left transition-colors"
                    style={{ fontFamily: "'Arial', sans-serif" }}
                  >
                    {link}
                  </Link>
                ) : link === "For Educators" ? (
                  <Link
                    to="/educators"
                    className="text-black hover:text-kiwi-600 hover:underline block w-full text-center sm:text-left transition-colors"
                    style={{ fontFamily: "'Arial', sans-serif" }}
                  >
                    {link}
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      setModalContent(link.toLowerCase().replace(" ", "-"))
                    }
                    className="text-black hover:text-kiwi-600 hover:underline block w-full text-center sm:text-left transition-colors"
                    style={{ fontFamily: "'Arial', sans-serif" }}
                  >
                    {link}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Social media icons section */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="flex justify-center space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 text-lg sm:text-xl"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 text-lg sm:text-xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 text-lg sm:text-xl"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 text-lg sm:text-xl"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-600 text-lg sm:text-xl"
            >
              <FaYoutube />
            </a>
          </div>
        </motion.div>

        {/* Copyright and legal links section */}
        <motion.div
          className="text-center text-xs sm:text-sm border-t border-gray-200 pt-4"
          variants={itemVariants}
        >
          <p style={{ fontFamily: "'Arial', sans-serif" }}>
            © 2025 StuVerFlow. All rights reserved.{" "}
            {["Privacy Policy", "Terms of Use", "Cookie Preferences"].map(
              (link) => (
                <button
                  key={link}
                  onClick={() =>
                    setModalContent(link.toLowerCase().replace(" ", "-"))
                  }
                  className="underline hover:text-gray-600 mx-1"
                >
                  {link}
                </button>
              ),
            )}
          </p>
        </motion.div>

        {/* modal implementation */}
        {modalContent && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalContent(null)}
          >
            <motion.div
              className="bg-white p-6 rounded-xl max-w-md w-full shadow-2xl border border-gray-200"
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                {modalData[modalContent].title}
              </h3>
                <button
                  onClick={() => setModalContent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                {modalData[modalContent].content}
              </p>
              <div className="flex justify-end">
              <button
                onClick={() => setModalContent(null)}
                  className="bg-kiwi-700 text-white px-6 py-2 rounded-lg hover:bg-kiwi-800 transition-colors"
              >
                  Got it
              </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </footer>
  );
};

export default Footer;
