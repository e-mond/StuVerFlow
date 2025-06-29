import { motion } from "framer-motion";
import Button from "../common/Button";

/**
 * FileUploadStep collects up to three PDF certificate files for Professional profiles.
 * @param {Object} props - Component props
 * @param {Object} props.formData - Form data state
 * @param {Function} props.handleChange - Function to handle input changes
 * @param {Function} props.prevStep - Function to go to the previous step
 * @param {Function} props.handleSubmit - Function to submit the form
 * @param {boolean} props.isSubmitting - Submission status
 */
const FileUploadStep = ({
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
          Upload Verification Documents
        </h3>
        {/* Certificate 1 upload */}
        <div className="mb-4">
          <label
            htmlFor="certificateFile1"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Certificate 1 (PDF, Max 5MB)
          </label>
          <input
            type="file"
            id="certificateFile1"
            name="certificateFile1"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
            required
            aria-label="Certificate file 1"
          />
        </div>
        {/* Certificate 2 upload */}
        <div className="mb-4">
          <label
            htmlFor="certificateFile2"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Certificate 2 (PDF, Max 5MB, Optional)
          </label>
          <input
            type="file"
            id="certificateFile2"
            name="certificateFile2"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
            aria-label="Certificate file 2"
          />
        </div>
        {/* Certificate 3 upload */}
        <div className="mb-4">
          <label
            htmlFor="certificateFile3"
            className="block text-gray-700 font-medium text-sm sm:text-base mb-2"
          >
            Certificate 3 (PDF, Max 5MB, Optional)
          </label>
          <input
            type="file"
            id="certificateFile3"
            name="certificateFile3"
            accept="application/pdf"
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-kiwi-200 bg-kiwi-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-kiwi-700 text-sm sm:text-base"
            aria-label="Certificate file 3"
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
              disabled={isSubmitting || !formData.certificateFile1}
              className="text-sm sm:text-base py-2"
            >
              {isSubmitting ? "Submitting..." : "Submit for Approval"}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileUploadStep;
