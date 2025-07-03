import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateUserProfile } from "../api/profiles";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export const useProfileForm = () => {
  const { user, login } = useUser(); // Call hook at top level
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(!user?.id); // Initial loading based on user presence
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

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      setIsLoading(false); // End loading on redirect
    } else {
      setIsLoading(false);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setFormData((prev) => ({ ...prev, handle: `@user${randomNum}` }));
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    if (isLoading) return;
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
    if (isLoading) return;
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

      const profileData = new FormData();
      profileData.append("userType", userType || "student");
      console.log("Debug: userType before append:", userType);
      for (let pair of profileData.entries()) {
        console.log("FormData entry:", pair[0], pair[1]);
      }
      profileData.append("handle", handle);
      profileData.append("institution", institution);
      if (dob) profileData.append("dob", dob);
      if (bio) profileData.append("bio", bio);
      if (userType === "student" && interests)
        profileData.append("interests", interests);
      if (userType === "professional") {
        if (title) profileData.append("title", title);
        if (expertise) profileData.append("expertise", expertise);
        if (certifications)
          profileData.append("certifications", certifications);
        const certs = [
          certificateFile1,
          certificateFile2,
          certificateFile3,
        ].filter(Boolean);
        if (certs.length === 0) {
          throw new Error("Please upload at least one certificate (PDF).");
        }
        certs.forEach((file) => profileData.append("certificateFiles", file));
      }
      if (profilePicture) profileData.append("profilePicture", profilePicture);
      profileData.append(
        "name",
        `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
          "Unknown User",
      );

      console.log("Submitting profile data:", Object.fromEntries(profileData));
      const response = await updateUserProfile(user.id, profileData);

      if (response?.message) {
        const updatedUser = {
          id: response.data.id || user.id,
          name: response.data.name || user.name,
          handle: response.data.data?.handle || formData.handle || user.handle,
          token: user.token,
        };
        login(updatedUser);
        setTimeout(() => {
          toast.success("Profile setup completed successfully!");
          if (userType === "student" && step === 3) {
            navigate("/home");
          } else if (userType === "professional" && step === 5) {
            setStep(6);
          }
        }, 0);
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
