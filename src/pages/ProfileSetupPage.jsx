import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { updateUserProfile } from "../utils/api";
import { useUser } from "../context/useUser";
import UserTypeStep from "../components/profilesetup/UserTypeStep";
import BasicDetailsStep from "../components/profilesetup/BasicDetailsStep";
import StudentDetailsStep from "../components/profilesetup/StudentDetailsStep";
import ProfessionalDetailsStep from "../components/profilesetup/ProfessionalDetailsStep";
import ProfessionalBioCertStep from "../components/profilesetup/ProfessionalBioCertStep";
import FileUploadStep from "../components/profilesetup/FileUploadStep";
import SuccessStep from "../components/profilesetup/SuccessStep";

const ProfileSetupPage = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    dob: "",
    bio: "",
    interests: "",
    profilePicture: null,
    handle: "",
    institution: "",
    title: "",
    expertise: "",
    certifications: "",
    certificateFile1: null,
    certificateFile2: null,
    certificateFile3: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Generate random handle on mount
  useEffect(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedHandle = `@user${randomNum}`;
    setFormData((prev) => ({ ...prev, handle: generatedHandle }));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" || name.startsWith("certificateFile")) {
      const file = files[0];
      if (file) {
        if (
          name === "profilePicture" &&
          !["image/jpeg", "image/png"].includes(file.type)
        ) {
          setError("Profile picture must be a JPEG or PNG file");
          e.target.value = null; // Reset file input
          return;
        }
        if (
          name.startsWith("certificateFile") &&
          file.type !== "application/pdf"
        ) {
          setError(`Certificate ${name.slice(-1)} must be a PDF file`);
          e.target.value = null; // Reset file input
          return;
        }
        if (
          file.size >
          (name === "profilePicture" ? 2 * 1024 * 1024 : 5 * 1024 * 1024)
        ) {
          setError(
            `File size for ${name === "profilePicture" ? "profile picture" : `certificate ${name.slice(-1)}`} must be less than ${name === "profilePicture" ? "2MB" : "5MB"}`,
          );
          e.target.value = null; // Reset file input
          return;
        }
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      if (name === "handle" && value && !value.startsWith("@")) {
        setError("Handle must start with @");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const {
        dob,
        bio,
        interests,
        profilePicture,
        handle,
        institution,
        title,
        expertise,
        certifications,
        certificateFile1,
        certificateFile2,
        certificateFile3,
      } = formData;

      const profileData = {
        userType,
        handle,
        institution,
        dob: dob || null,
        bio: bio || null,
        ...(userType === "student" && { interests }),
        ...(userType === "professional" && {
          title,
          expertise,
          certifications,
          certificateFiles: [
            certificateFile1,
            certificateFile2,
            certificateFile3,
          ].filter(Boolean),
        }),
        ...(profilePicture && { profilePicture }),
      };

      await updateUserProfile(user.id, profileData);

      setFormData({
        dob: "",
        bio: "",
        interests: "",
        profilePicture: null,
        handle: "",
        institution: "",
        title: "",
        expertise: "",
        certifications: "",
        certificateFile1: null,
        certificateFile2: null,
        certificateFile3: null,
      });

      if (userType === "student") {
        navigate("/home");
      } else {
        setStep(6);
      }
    } catch (error) {
      console.error("Error setting up profile:", error);
      setError(error.message || "Failed to set up profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressSteps = userType === "student" ? 3 : 6;
  const progressWidth = `${(step / progressSteps) * 100}%`;

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
