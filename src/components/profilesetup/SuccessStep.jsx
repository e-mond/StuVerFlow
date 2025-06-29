import { motion } from "framer-motion";
import Button from "../common/Button";

/**
 * SuccessStep displays a success message for Professionals after profile submission.
 * @param {Object} props - Component props
 * @param {Function} props.navigate - Function to navigate to other routes
 */
const SuccessStep = ({ navigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        {/* Success heading */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
          Submission Successful <span className="text-xl">✅</span>
        </h3>
        {/* Approval message */}
        <p className="text-gray-600 text-sm sm:text-base mb-6">
          Your Professional account has been submitted for review. Our team will
          verify your credentials within 24-48 hours. You will receive a
          notification upon approval. Please log in later to check your account
          status.
        </p>
        {/* Navigation button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="kiwi"
            onClick={() => navigate("/login")}
            className="text-sm sm:text-base py-2"
          >
            Return to Login
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SuccessStep;
