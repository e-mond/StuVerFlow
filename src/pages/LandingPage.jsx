import { motion } from "framer-motion";
import LandingPageHeader from "../components/LandingPage/PageHeader";
import HeroHeader from "../components/LandingPage/HeroHeader";
import HowToUseSection from "../components/LandingPage/HowToUseSection";
import TestimonialsSection from "../components/LandingPage/UserExperiences";
import MeetTheTeamSection from "../components/LandingPage/MeetTheTeamSection";
import Footer from "../components/common/Footer";

const LandingPage = () => {
  return (
    <div className="bg-white">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <LandingPageHeader />
        <HeroHeader />
        <HowToUseSection />
        <TestimonialsSection />
        <MeetTheTeamSection />
        <Footer />
      </motion.div>
    </div>
  );
};

export default LandingPage;
