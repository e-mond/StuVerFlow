import { motion } from "framer-motion";

/**
 * UserTypeStep allows users to select their account type (Student or Professional).
 * @param {Object} props - Component props
 * @param {string} props.userType - Selected user type
 * @param {Function} props.setUserType - Function to set user type
 * @param {Function} props.nextStep - Function to go to the next step
 */
const UserTypeStep = ({ userType, setUserType, nextStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        {/* Step heading */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Select Your Account Type
        </h3>
        {/* User type selection buttons */}
        <div className="flex justify-center gap-4">
          <motion.button
            type="button"
            onClick={() => {
              setUserType("student");
              nextStep();
            }}
            className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
              userType === "student"
                ? "bg-kiwi-700 text-white"
                : "bg-kiwi-50 text-gray-900 hover:bg-kiwi-100"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Student
          </motion.button>
          <motion.button
            type="button"
            onClick={() => {
              setUserType("professional");
              nextStep();
            }}
            className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-colors ${
              userType === "professional"
                ? "bg-kiwi-700 text-white"
                : "bg-kiwi-50 text-gray-900 hover:bg-kiwi-100"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Professional
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserTypeStep;
