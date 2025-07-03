import { motion, AnimatePresence } from "framer-motion";
import { useProfileForm } from "../hooks/useProfileForm";
import UserTypeStep from "../components/profilesetup/UserTypeStep";
import BasicDetailsStep from "../components/profilesetup/BasicDetailsStep";
import StudentDetailsStep from "../components/profilesetup/StudentDetailsStep";
import ProfessionalDetailsStep from "../components/profilesetup/ProfessionalDetailsStep";
import ProfessionalBioCertStep from "../components/profilesetup/ProfessionalBioCertStep";
import FileUploadStep from "../components/profilesetup/FileUploadStep";
import SuccessStep from "../components/profilesetup/SuccessStep";

const ProfileSetupPage = () => {
  const {
    step,
    userType,
    formData,
    isSubmitting,
    error,
    progressSteps,
    progressWidth,
    handleChange,
    nextStep,
    prevStep,
    handleSubmit,
    navigate,
    setUserType,
  } = useProfileForm();

  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url('https://images.unsplash.com/photo-1569141267000-6491d6822a5b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex-1 flex justify-center items-center p-4 sm:p-6">
        <motion.div
          className="bg-white/60 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 w-full max-w-md sm:max-w-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className="flex justify-center mb-6 text-4xl text-green-700 font-bold"
            style={{ fontFamily: "'Sacramento', cursive" }}
          >
            StuVerFlow
          </div>

          {step === 1 && (
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                You&apos;re One Step Away <span className="text-xl">🔒</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-2">
                Set up your profile to join the StuVerFlow community
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: progressWidth }}
                initial={{ width: 0 }}
                animate={{ width: progressWidth }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-gray-600 text-sm mt-2 text-center">
              Step {step} of {progressSteps}
            </p>
          </div>

          {error && (
            <p
              className="text-red-500 text-sm sm:text-base mb-4 text-center"
              role="alert"
            >
              {error}
            </p>
          )}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <UserTypeStep
                userType={userType}
                setUserType={setUserType}
                nextStep={nextStep}
              />
            )}

            {step === 2 && (
              <BasicDetailsStep
                formData={formData}
                handleChange={handleChange}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            )}

            {step === 3 && userType === "student" && (
              <StudentDetailsStep
                formData={formData}
                handleChange={handleChange}
                prevStep={prevStep}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 3 && userType === "professional" && (
              <ProfessionalDetailsStep
                formData={formData}
                handleChange={handleChange}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            )}

            {step === 4 && userType === "professional" && (
              <ProfessionalBioCertStep
                formData={formData}
                handleChange={handleChange}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            )}

            {step === 5 && userType === "professional" && (
              <FileUploadStep
                formData={formData}
                handleChange={handleChange}
                prevStep={prevStep}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}

            {step === 6 && userType === "professional" && (
              <SuccessStep navigate={navigate} />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
