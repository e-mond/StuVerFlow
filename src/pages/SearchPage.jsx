import { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import HotQuestionCard from "../components/explore/HotQuestionCard";
import StudyGroupCard from "../components/explore/StudyGroupCard";
import TrendingTagCard from "../components/feed/TrendingTagCard";
import Filter from "../components/common/Filter";
import NewUsers from "../components/feed/NewUsers";
import SearchBar from "../components/common/SearchBar";
import {
  fetchTrendingTags,
  fetchHotQuestions,
  fetchStudyGroups,
  fetchNewUsers,
} from "../utils/api";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [trendingTags, setTrendingTags] = useState([]);
  const [hotQuestions, setHotQuestions] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [tags, questions, groups, users] = await Promise.all([
          fetchTrendingTags(searchQuery),
          fetchHotQuestions(searchQuery),
          fetchStudyGroups(searchQuery),
          fetchNewUsers(searchQuery),
        ]);
        setTrendingTags(tags);
        setHotQuestions(questions);
        setStudyGroups(groups);
        setNewUsers(users);
      } catch (err) {
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchQuery]);

  const handleSearch = (query) => setSearchQuery(query);
  const handleFilterChange = (category) => setFilterCategory(category);

  const filteredHotQuestions = hotQuestions.filter(
    () => filterCategory === "All" || filterCategory === "Questions",
  );

  const filteredStudyGroups = studyGroups.filter(
    () => filterCategory === "All" || filterCategory === "Groups",
  );

  const filteredTrendingTags = trendingTags.filter(
    () => filterCategory === "All" || filterCategory === "Trends",
  );

  const filteredNewUsers = newUsers.filter(
    () => filterCategory === "All" || filterCategory === "Experts",
  );

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
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-4 space-y-4">
        {error && (
          <p className="text-red-500 text-sm" role="alert">
            {error}
          </p>
        )}
        <section className="bg-white border border-kiwi-100 rounded-xl shadow-sm p-3 flex items-center gap-4">
          <SearchBar onSearch={handleSearch} />
          <Filter
            currentFilter={filterCategory}
            onFilterChange={handleFilterChange}
          />
        </section>

        {/* Trending Tags Section */}
        {(filterCategory === "All" || filterCategory === "Trends") && (
          <section className="bg-white border border-kiwi-100 rounded-xl shadow-sm p-3">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Trending Tags
            </h2>
            <div className="overflow-x-auto whitespace-nowrap flex gap-2 sm:flex-wrap sm:whitespace-normal">
              {filteredTrendingTags.length > 0 ? (
                filteredTrendingTags.map(({ name, count }, index) => (
                  <TrendingTagCard key={index} tag={name} count={count} />
                ))
              ) : (
                <p className="text-gray-600 text-sm">No tags found.</p>
              )}
            </div>
          </section>
        )}

        {/* Hot Questions Section */}
        {(filterCategory === "All" || filterCategory === "Questions") && (
          <section className="bg-white border border-kiwi-100 rounded-xl shadow-sm p-3">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Hot Questions
            </h2>
            <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory lg:grid lg:grid-cols-4">
              {filteredHotQuestions.length > 0 ? (
                filteredHotQuestions.map((q) => (
                  <HotQuestionCard key={q.id} question={q} />
                ))
              ) : (
                <p className="text-gray-600 text-sm">No questions found.</p>
              )}
            </div>
          </section>
        )}

        {/* Study Groups Section */}
        {(filterCategory === "All" || filterCategory === "Groups") && (
          <section className="bg-white border border-kiwi-100 rounded-xl shadow-sm p-3">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Study Groups
            </h2>
            <div className="flex flex-col gap-2 text-sm">
              {filteredStudyGroups.length > 0 ? (
                filteredStudyGroups.map((group) => (
                  <StudyGroupCard key={group.id} group={group} />
                ))
              ) : (
                <p className="text-gray-600 text-sm">No study groups found.</p>
              )}
            </div>
          </section>
        )}

        {/* New Users Section */}
        {(filterCategory === "All" || filterCategory === "Experts") && (
          <section className="bg-white border border-kiwi-100 rounded-xl shadow-sm p-3">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              New Users
            </h2>
            <NewUsers users={filteredNewUsers} />
          </section>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
