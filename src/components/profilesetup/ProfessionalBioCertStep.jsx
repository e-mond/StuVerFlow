import { motion } from "framer-motion";
import Button from "../common/Button";

/**
 * ProfessionalBioCertStep collects bio and certifications for Professional profiles.
 * @param {Object} props - Component props
 * @param {Object} props.formData - Form data state
 * @param {Function} props.handleChange - Function to handle input changes
 * @param {Function} props.prevStep - Function to go to the previous step
 * @param {Function} props.nextStep - Function to go to the next step
 */
const ProfessionalBioCertStep = ({
  formData,
  handleChange,
  prevStep,
  nextStep,
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
          Bio and Certifications
        </h3>
        {/* Bio input */}
        <div className="mb-4">
          <label
            htmlFor="bio"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 resize-none text-sm sm:text-base"
            rows="3"
            aria-label="Bio"
            placeholder="Describe your professional background and achievements"
            required
          />
        </div>
        {/* Certifications input */}
        <div className="mb-4">
          <label
            htmlFor="certifications"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Certifications
          </label>
          <textarea
            id="certifications"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 resize-none text-sm sm:text-base"
            rows="3"
            aria-label="Certifications"
            placeholder="List your certifications (e.g., PhD in Physics, Certified Data Scientist)"
            required
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
              disabled={!formData.bio || !formData.certifications}
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

export default ProfessionalBioCertStep;
