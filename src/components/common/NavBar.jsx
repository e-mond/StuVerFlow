import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Button from "./Button";

// Framer Motion animation variants for dropdown menu
const menuVariants = {
  open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle menu open/close
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav
      className="bg-white text-gray-900 px-6 py-4 sticky top-0 z-50 border-b border-gray-200 w-full"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top nav bar container */}
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl text-kiwi-700 font-bold"
          style={{ fontFamily: "'Sacramento', cursive" }}
        >
          StuVerFlow
        </Link>

        {/* Desktop navigation menu */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center space-x-10">
            {/* Redirect all links to signup */}
            <Link
              to="/signup"
              className="text-gray-900 hover:text-kiwi-700 px-3 py-2 rounded-lg font-medium text-base transition-colors text-start"
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
            >
              Ask Questions
            </Link>
            <Link
              to="/signup"
              className="text-gray-900 hover:text-kiwi-700 px-3 py-2 rounded-lg font-medium text-base transition-colors text-start"
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
            >
              Share Knowledge
            </Link>
            <Link
              to="/signup"
              className="text-gray-900 hover:text-kiwi-700 px-3 py-2 rounded-lg font-medium text-base transition-colors text-start"
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
            >
              Collaborate Now
            </Link>
          </div>
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/signup">
            <Button
              variant="kiwi"
              className="border-2 border-kiwi-700 text-kiwi-700 hover:bg-kiwi-700 hover:text-white px-4 py-1.5 rounded-lg font-medium text-base transition-colors"
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
            >
              Join
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="outline"
              className="border-2 border-gray-300 text-gray-900 hover:bg-gray-100 px-4 py-1.5 rounded-lg font-medium text-base transition-colors"
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
            >
              Log In
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger menu toggle */}
        <button
          className="md:hidden text-2xl focus:outline-none text-gray-900"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile dropdown menu with right-aligned items */}
      <motion.div
        className="md:hidden overflow-hidden bg-white border-t border-gray-200"
        variants={menuVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <div className="flex flex-col items-end space-y-3 mt-4 px-6 pb-4 text-right">
          <Link
            to="/signup"
            onClick={toggleMenu}
            className="text-gray-900 hover:text-kiwi-700 py-2 px-3 rounded-lg font-medium text-base transition-colors text-end"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
          >
            Ask Questions
          </Link>
          <Link
            to="/signup"
            onClick={toggleMenu}
            className="text-gray-900 hover:text-kiwi-700 py-2 px-3 rounded-lg font-medium text-base transition-colors text-end"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
          >
            Share Knowledge
          </Link>
          <Link
            to="/signup"
            onClick={toggleMenu}
            className="text-gray-900 hover:text-kiwi-700 py-2 px-3 rounded-lg font-medium text-base transition-colors text-end"
            style={{ fontFamily: "'Fira Sans', sans-serif" }}
          >
            Collaborate Now
          </Link>

          {/* Join button */}
          <Link to="/signup" className="py-2 px-3 w-full" onClick={toggleMenu}>
            <Button
              variant="kiwi"
              className="w-full border-2 border-kiwi-700 text-kiwi-700 hover:bg-kiwi-700 hover:text-white px-4 py-1.5 rounded-lg font-medium text-base transition-colors"
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
            >
              Join
            </Button>
          </Link>

          {/* Log In button */}
          <Link to="/login" className="py-2 px-3 w-full" onClick={toggleMenu}>
            <Button
              variant="outline"
              className="w-full border-2 border-gray-300 text-gray-900 hover:bg-gray-100 px-4 py-1.5 rounded-lg font-medium text-base transition-colors"
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
            >
              Log In
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default NavBar;
