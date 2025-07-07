import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Sidebar from "../components/common/Sidebar";
import TrendingTagCard from "../components/feed/TrendingTagCard";
import HotQuestionCard from "../components/explore/HotQuestionCard";
import ActivityCard from "../components/dashboard/ActivityCard";
import {
  fetchTrendingTags,
  fetchHotQuestions,
  fetchRecentActivity,
} from "../utils/api";

const TrendingPage = () => {
  const [trendingTags, setTrendingTags] = useState([]);
  const [hotQuestions, setHotQuestions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityError, setActivityError] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    const loadTrendingData = async () => {
      try {
        const tags = await fetchTrendingTags();
        setTrendingTags(tags);

        const questions = await fetchHotQuestions();
        setHotQuestions(questions);

        if (user?.id) {
          try {
            const activity = await fetchRecentActivity(user.id);
            setRecentActivity(activity);
          } catch (activityErr) {
            console.warn("Recent activity not available:", activityErr);
            setActivityError(true);
            setRecentActivity([]);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load trending data.");
      } finally {
        setLoading(false);
      }
    };

    loadTrendingData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <p
            className="text-gray-600 text-sm sm:text-base animate-pulse"
            role="status"
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* Page Title */}
        <header>
          <h1
            className="text-2xl sm:text-3xl font-bold text-gray-900"
            role="heading"
            aria-level="1"
          >
            Trending
          </h1>
          {error && (
            <p className="text-red-500 text-sm sm:text-base mt-2" role="alert">
              {error}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Hot Questions */}
          <section
            className="lg:col-span-2 space-y-4"
            aria-labelledby="hot-questions-heading"
          >
            <h2
              id="hot-questions-heading"
              className="text-lg sm:text-xl font-semibold text-gray-800"
            >
              Hot Questions
            </h2>
            {hotQuestions.length > 0 ? (
              <div className="space-y-4">
                {hotQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="bg-kiwi-50 rounded-xl shadow-sm p-4"
                  >
                    <HotQuestionCard question={question} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No hot questions found.</p>
            )}
          </section>

          {/* Right: Tags and Activity */}
          <aside className="space-y-6">
            {/* Trending Tags */}
            <section aria-labelledby="tags-heading">
              <h2
                id="tags-heading"
                className="text-lg sm:text-xl font-semibold text-gray-800 mb-2"
              >
                Trending Tags
              </h2>
              {trendingTags.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                  {trendingTags.map((tag) => (
                    <TrendingTagCard
                      key={tag.name}
                      tag={tag.name}
                      count={tag.count}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No trending tags found.</p>
              )}
            </section>

            {/* Recent Activity - Only show if we have data and user is logged in */}
            {user && !activityError && (
              <section aria-labelledby="activity-heading">
                <h2
                  id="activity-heading"
                  className="text-lg sm:text-xl font-semibold text-gray-800 mb-2"
                >
                  Recent Activity
                </h2>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-white border border-kiwi-100 p-3 rounded-xl shadow-sm"
                      >
                        <ActivityCard
                          type={activity.type}
                          content={activity.content}
                          timestamp={activity.timestamp}
                          link={activity.link}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">
                    No recent activity found.
                  </p>
                )}
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TrendingPage;
