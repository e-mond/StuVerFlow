import { motion } from "framer-motion";
import Button from "../common/Button";

/**
 * StudentDetailsStep collects DOB, bio, and interests for Student profiles.
 * @param {Object} props - Component props
 * @param {Object} props.formData - Form data state
 * @param {Function} props.handleChange - Function to handle input changes
 * @param {Function} props.prevStep - Function to go to the previous step
 * @param {Function} props.handleSubmit - Function to submit the form
 * @param {boolean} props.isSubmitting - Submission status
 */
const StudentDetailsStep = ({
  formData,
  handleChange,
  prevStep,
  handleSubmit,
  isSubmitting,
}) => {
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
          Complete Your Student Profile
        </h3>
        {/* Date of Birth input */}
        <div className="mb-4">
          <label
            htmlFor="dob"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Date of Birth (Optional)
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
            aria-label="Date of birth"
          />
        </div>
        {/* Bio input */}
        <div className="mb-4">
          <label
            htmlFor="bio"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Bio (Optional)
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 resize-none text-sm sm:text-base"
            rows="3"
            aria-label="Bio"
            placeholder="Tell us about yourself (e.g., your background, goals)"
          />
        </div>
        {/* Interests input */}
        <div className="mb-4">
          <label
            htmlFor="interests"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Interests
          </label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
            required
            aria-label="Interests"
            placeholder="List your interests (e.g., Machine Learning, Web Development)"
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
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.interests}
              className="text-sm sm:text-base py-2"
            >
              {isSubmitting ? "Submitting..." : "Complete Profile"}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentDetailsStep;
