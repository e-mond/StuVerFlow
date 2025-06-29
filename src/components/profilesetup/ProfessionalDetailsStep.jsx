import { motion } from "framer-motion";
import Button from "../common/Button";

// List of valid professional title options
const TITLE_OPTIONS = [
  "Prof",
  "Dr",
  "Eng",
  "PhD",
  "MSc",
  "BSc",
  "MD",
  "JD",
  "MBA",
  "CPA",
  "PMP",
  "Other",
];

/**
 * ProfessionalDetailsStep collects professional title and expertise for Professional profiles.
 * @param {Object} props - Component props
 * @param {Object} props.formData - Form data state
 * @param {Function} props.handleChange - Function to handle input changes
 * @param {Function} props.prevStep - Function to go to the previous step
 * @param {Function} props.nextStep - Function to go to the next step
 */
const ProfessionalDetailsStep = ({
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
          Professional Details
        </h3>
        {/* Title selection */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Professional Title
          </label>
          <select
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
            required
            aria-label="Professional title"
          >
            <option value="" disabled>
              Select your title
            </option>
            {TITLE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {/* Expertise input */}
        <div className="mb-4">
          <label
            htmlFor="expertise"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Expertise
          </label>
          <textarea
            id="expertise"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 resize-none text-sm sm:text-base"
            rows="3"
            aria-label="Expertise"
            placeholder="List your areas of expertise (e.g., AI, Statistics)"
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
              disabled={!formData.title || !formData.expertise}
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

export default ProfessionalDetailsStep;
