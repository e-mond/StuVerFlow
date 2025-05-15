import { useState, useEffect } from "react";
import { useUser } from "../context/useUser";
import Sidebar from "../components/common/Sidebar";
import TrendingTagCard from "../components/feed/TrendingTagCard";
import HotQuestionCard from "../components/explore/HotQuestionCard";
import ActivityCard from "../components/dashboard/ActivityCard";
import {
  fetchTrendingTags,
  fetchHotQuestions,
  fetchRecentActivity,
} from "../utils/api";

// Component for the Trending page
const TrendingPage = () => {
  // State for trending tags, hot questions, recent activity, loading, and errors
  const [trendingTags, setTrendingTags] = useState([]);
  const [hotQuestions, setHotQuestions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accessing user context for user ID
  const { user } = useUser();

  // Fetching data on component mount
  useEffect(() => {
    const loadTrendingData = async () => {
      try {
        // Fetching trending tags
        const tags = await fetchTrendingTags();
        setTrendingTags(tags);

        // Fetching hot questions
        const questions = await fetchHotQuestions();
        setHotQuestions(questions);

        // Fetching recent activity if user is logged in
        if (user?.id) {
          const activity = await fetchRecentActivity(user.id);
          setRecentActivity(activity);
        }
      } catch (err) {
        setError(err.message || "Failed to load trending data.");
      } finally {
        setLoading(false);
      }
    };

    loadTrendingData();
  }, [user]);

  // Rendering loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6">
          <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar for navigation */}
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Trending
        </h1>

        {/* Error message display */}
        {error && (
          <p className="text-red-500 text-sm sm:text-base mb-4" role="alert">
            {error}
          </p>
        )}

        {/* Responsive grid layout for sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Hot Questions */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Hot Questions
            </h2>
            {hotQuestions.length > 0 ? (
              <div className="space-y-4">
                {hotQuestions.map((question) => (
                  <HotQuestionCard key={question.id} question={question} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">
                No hot questions found.
              </p>
            )}
          </div>

          {/* Right column: Trending Tags and Recent Activity */}
          <div className="space-y-6">
            {/* Trending Tags section */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Trending Tags
              </h2>
              {trendingTags.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                  {trendingTags.map((tag) => (
                    <TrendingTagCard
                      key={tag.name}
                      tag={tag.name}
                      count={tag.count}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm sm:text-base">
                  No trending tags found.
                </p>
              )}
            </div>

            {/* Recent Activity section */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Recent Activity
              </h2>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      type={activity.type}
                      content={activity.content}
                      timestamp={activity.timestamp}
                      link={activity.link}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm sm:text-base">
                  No recent activity found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;
