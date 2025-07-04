import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import AskQuestionPage from "./pages/AskQuestionPage";
import NotificationPage from "./pages/NotificationPage";
import BookmarksPage from "./pages/BookmarksPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import CommunityDetailsPage from "./pages/CommunityDetailsPage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import TrendingPage from "./pages/TrendingPage";
import MyQuestionsPage from "./pages/MyQuestionsPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import SearchPage from "./pages/SearchPage";
import TopicPage from "./pages/TopicPage";
import DashboardPage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "./context/UserContext";

function App() {
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user === null) {
      toast.info("Session expired. You've been logged out.");
    }
  }, [user, loading]);

  return (
    <>
      <Router>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <NavBar />
                    <LandingPage />
                  </>
                }
              />
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
              <Route path="/profilesetup" element={<ProfileSetupPage />} />

              {/* Authenticated user routes */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/ask" element={<AskQuestionPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/communities" element={<CommunitiesPage />} />
              <Route path="/myquestions" element={<MyQuestionsPage />} />
              <Route
                path="/communities/:communityId"
                element={<CommunityDetailsPage />}
              />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/question/:id" element={<QuestionDetailPage />} />
              <Route path="/profile/:handle" element={<ProfilePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/topics/:topic" element={<TopicPage />} />

              {/* 404 route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
