import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import KofiImg from "../../assets/images/KofiAbban.jpg";
import EdmondImg from "../../assets/images/Edmond.JPG";
import IsaacImg from "../../assets/images/Issac.jpg";
import PeggyImg from "../../assets/images/Peggy.jpg";
import JamesImg from "../../assets/images/James.jpg";

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

// Component for displaying the team section
const MeetTheTeamSection = () => {
  // Array of team members with names, GitHub links, and image paths
  const teamMembers = [
    {
      name: "Kofi Abban Davis",
      profileLink: "https://github.com/WingsDavis",
      img: KofiImg,
    },
    {
      name: "Edmond Anderson",
      profileLink: "https://github.com/e-mond",
      img: EdmondImg,
    },
    {
      name: "Isaac Crentsil",
      profileLink: "https://github.com/ikeCrest",
      img: IsaacImg,
    },
    {
      name: "Peggy Halm",
      profileLink: "https://github.com/peggyhalm",
      img: PeggyImg,
    },
    {
      name: "James Quaicoe",
      profileLink: "https://github.com/James0547",
      img: JamesImg,
    },
  ];

  return (
    <section className="bg-white text-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        style={{ fontFamily: "'Fira Sans', sans-serif" }}
      >
        Meet the Team Behind StuVerFlow
      </motion.h1>

      <motion.p
        className="text-sm sm:text-base text-center mb-8 sm:mb-12 py-1 text-gray-700"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        style={{ fontFamily: "'Fira Sans', sans-serif" }}
      >
        The StuVerFlow Innovators
      </motion.p>

      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {teamMembers.map((member, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-center text-center"
            variants={itemVariants}
          >
            <Link
              to={member.profileLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-300 rounded-full flex items-center justify-center mb-4 hover:scale-105 hover:shadow-lg transition-transform duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={member.img}
                  alt={`${member.name}'s profile`}
                  className="w-full h-full object-cover rounded-full"
                />
              </motion.div>
            </Link>
            <Link
              to={member.profileLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p
                className="text-lg sm:text-xl font-bold text-kiwi-700 hover:underline"
                style={{ fontFamily: "'Fira Sans', sans-serif" }}
              >
                {member.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default MeetTheTeamSection;
