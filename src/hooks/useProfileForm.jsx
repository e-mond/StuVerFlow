import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateUserProfile } from "../api/profiles";
import { useUser } from "../context/UserContext"; // Assuming useUpdateUser from previous update
import { useNavigate } from "react-router-dom";

export const useProfileForm = () => {
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
  const { user, login } = useUser(); // Use login to update context
  // Use for partial updates
  const navigate = useNavigate();

  // Redirect to login if user is not present
  useEffect(() => {
    if (!user?.id) navigate("/login");
  }, [user, navigate]);

  // Generate a handle on mount
  useEffect(() => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, handle: `@user${randomNum}` }));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files?.[0]) {
      const file = files[0];
      const isProfile = name === "profilePicture";
      const isValidType = isProfile
        ? ["image/jpeg", "image/png"].includes(file.type)
        : file.type === "application/pdf";
      const maxSize = isProfile ? 2 * 1024 * 1024 : 5 * 1024 * 1024;

      if (!isValidType) {
        setError(
          isProfile
            ? "Profile picture must be JPEG or PNG"
            : `${name.slice(-1)} must be a PDF`,
        );
        return;
      }

      if (file.size > maxSize) {
        setError(
          `${name === "profilePicture" ? "Profile picture" : `Certificate ${name.slice(-1)}`} is too large`,
        );
        return;
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

      // ✅ Require at least one certificate for professionals
      if (userType === "professional") {
        const certs = [
          certificateFile1,
          certificateFile2,
          certificateFile3,
        ].filter(Boolean);
        if (certs.length === 0) {
          throw new Error("Please upload at least one certificate (PDF).");
        }
      }

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
        name:
          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
          "Unknown User",
      };

      console.log("Submitting profile data:", profileData);
      const response = await updateUserProfile(user.id, profileData);

      if (response?.message) {
        // Update context with the full user data including the new token if provided
        login({
          id: response.id || user.id,
          name: response.name || user.name,
          handle: response.handle || user.handle,
          institution: response.institution || user.institution,
          token: response.token || user.token, // Use new token if available
        });

        toast.success("Profile setup completed successfully!");

        if (userType === "student" && step === 3) {
          navigate("/home");
        } else if (userType === "professional" && step === 5) {
          setStep(6); // Show success step
        }
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to set up profile.";
      console.error("Profile update error:", error.response?.data || error);
      toast.error(message);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressSteps = userType === "student" ? 3 : 6;
  const progressWidth = `${(step / progressSteps) * 100}%`;

  return {
    step,
    userType,
    formData,
    isSubmitting,
    error,
    progressSteps,
    progressWidth,
    setUserType,
    setFormData,
    handleChange,
    nextStep,
    prevStep,
    handleSubmit,
  };
};
