import { motion } from "framer-motion";
import Button from "../common/Button";

/**
 * BasicDetailsStep collects handle, institution, and profile picture for both Students and Professionals.
 * @param {Object} props - Component props
 * @param {Object} props.formData - Form data state
 * @param {Function} props.handleChange - Function to handle input changes
 * @param {Function} props.prevStep - Function to go to the previous step
 * @param {Function} props.nextStep - Function to go to the next step
 */
const BasicDetailsStep = ({ formData, handleChange, prevStep, nextStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        {/* Step heading */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Basic Profile Details
        </h3>
        {/* Handle input */}
        <div className="mb-4">
          <label
            htmlFor="handle"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Handle
          </label>
          <input
            type="text"
            id="handle"
            name="handle"
            value={formData.handle}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
            required
            aria-label="Handle"
            placeholder="@username"
          />
        </div>
        {/* Institution input */}
        <div className="mb-4">
          <label
            htmlFor="institution"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Institution
          </label>
          <input
            type="text"
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
            required
            aria-label="Institution"
            placeholder="Enter your institution (e.g., University of Example)"
          />
        </div>
        {/* Profile picture upload */}
        <div className="mb-4">
          <label
            htmlFor="profilePicture"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Profile Picture (Optional, JPEG/PNG, Max 2MB)
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/jpeg,image/png"
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
            aria-label="Profile picture"
          />
        </div>
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={prevStep}
              className="text-sm sm:text-base py-2"
            >
              Back
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="kiwi"
              onClick={nextStep}
              disabled={!formData.handle || !formData.institution}
              className="text-sm sm:text-base py-2"
            >
              Next
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BasicDetailsStep;
