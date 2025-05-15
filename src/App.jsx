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
import SearchPage from "./pages/SearchPage";
import TopicPage from "./pages/TopicPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Router>
      {/* Main layout container with responsive design: column on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <NavBar />
                  <LandingPage />
                  {/** Route for the landing page, including the navigation bar */}
                </>
              }
            />
            {/** Route for auths */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            {/** Route for logged in user interface*/}
            <Route path="/home" element={<HomePage />} />
            <Route path="/ask" element={<AskQuestionPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/my-questions" element={<MyQuestionsPage />} />
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
            {/** Route for error or 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
