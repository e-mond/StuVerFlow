// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import { useUser } from "../context/useUser";
// import QuestionCard from "../components/feed/QuestionCard";
// import SearchBar from "../components/common/SearchBar";
// import Sidebar from "../components/common/Sidebar";
// import TrendingDiscussions from "../components/feed/TrendingDiscussions";
// import ExpertSpotlight from "../components/feed/ExpertSpotlight";
// import Footer from "../components/feed/Footer";
// import {
//   fetchHotQuestions,
//   fetchQuestionsByInterests,
//   fetchBookmarks,
//   searchQuestions,
// } from "../utils/api";
// import { fetchTrendingTags } from "../utils/api";
// import { fetchExperts } from "../utils/api";

// const HomePage = () => {
//   const [questions, setQuestions] = useState([]);
//   const [filteredQuestions, setFilteredQuestions] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [experts, setExperts] = useState([]);
//   const [activeTab, setActiveTab] = useState("latest");
//   const [isMobile, setIsMobile] = useState(false);
//   const [randomExpert, setRandomExpert] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useUser();
//   const navigate = useNavigate();

//   // Redirect to login if user is not authenticated
//   useEffect(() => {
//     if (!user?.id) {
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   // Fetch data based on activeTab
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch questions based on activeTab
//         let questionsData = [];
//         if (activeTab === "latest") {
//           questionsData = await fetchHotQuestions();
//         } else if (activeTab === "myInterests") {
//           if (!user?.id) throw new Error("User ID required for interests");
//           questionsData = await fetchQuestionsByInterests(user.id);
//         } else if (activeTab === "bookmarked") {
//           if (!user?.id) throw new Error("User ID required for bookmarks");
//           questionsData = await fetchBookmarks(user.id);
//         }

//         // Fetch tags and experts
//         const [tagsData, expertsData] = await Promise.all([
//           fetchTrendingTags(),
//           fetchExperts(),
//         ]);

//         setQuestions(questionsData);
//         setFilteredQuestions(questionsData);
//         setTags(tagsData);
//         setExperts(expertsData);
//         setRandomExpert(
//           expertsData[Math.floor(Math.random() * expertsData.length)]
//         );
//         setIsMobile(window.innerWidth < 1024);
//       } catch (err) {
//         setError(err.message || "Failed to load data");
//         setQuestions([]);
//         setFilteredQuestions([]);
//         setTags([]);
//         setExperts([]);
//         setRandomExpert(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.id) {
//       loadData();
//     }

//     const resizeHandler = () => setIsMobile(window.innerWidth < 1024);
//     window.addEventListener("resize", resizeHandler);
//     return () => window.removeEventListener("resize", resizeHandler);
//   }, [activeTab, user]);

//   const handleSearch = async (query) => {
//     if (!query) {
//       setFilteredQuestions(questions);
//       return;
//     }
//     try {
//       const searchResults = await searchQuestions(query);
//       setFilteredQuestions(searchResults);
//     } catch (err) {
//       setError(err.message || "Failed to search questions");
//       setFilteredQuestions([]);
//     }
//   };

//   const injectExpertIntoFeed = () => {
//     if (!isMobile || !randomExpert || filteredQuestions.length === 0) {
//       return filteredQuestions;
//     }
//     const copy = [...filteredQuestions];
//     copy.splice(
//       1,
//       0,
//       <motion.div
//         key="mobile-expert"
//         className="bg-white border border-kiwi-300 p-4 rounded-xl shadow-md relative overflow-hidden mb-4"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-kiwi-400 via-kiwi-500 to-kiwi-700 rounded-t-xl" />
//         <h3 className="text-kiwi-800 font-bold text-lg mb-1 mt-2 flex items-center gap-2">
//           🌟 Expert Spotlight
//         </h3>
//         <p className="text-sm text-gray-600 mb-2">Featured academic expert</p>
//         <div className="bg-kiwi-100 p-3 rounded-lg">
//           <h4 className="text-gray-900 font-semibold">{randomExpert.name}</h4>
//           <p className="text-sm text-gray-600">{randomExpert.title}</p>
//           <p className="text-xs text-gray-500 italic">
//             Teaches: {randomExpert.course}
//           </p>
//         </div>
//       </motion.div>
//     );
//     return copy;
//   };

//   const feed = injectExpertIntoFeed();

//   return (
//     <div className="flex min-h-screen bg-white border-4">
//       <Sidebar />
//       <div className="flex-1 w-full border-x border-kiwi-200">
//         <div className="p-4 bg-white text-kiwi-700 shadow-md">
//           <motion.h1
//             className="text-2xl font-bold"
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//           >
//             Academic Pulse
//           </motion.h1>
//           <div className="mt-4 w-full">
//             <SearchBar onSearch={handleSearch} />
//           </div>
//         </div>

//         <div className="flex bg-kiwi-100">
//           {["latest", "myInterests", "bookmarked"].map((tab) => (
//             <button
//               key={tab}
//               className={`flex-1 text-center py-3 font-semibold text-base hover:bg-kiwi-200 ${
//                 activeTab === tab
//                   ? "bg-white text-kiwi-800 font-bold border-b-2 border-kiwi-700"
//                   : "text-gray-700"
//               }`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {activeTab === tab && (
//                 <span className="mr-1">
//                   {tab === "latest"
//                     ? "📅"
//                     : tab === "myInterests"
//                       ? "⭐"
//                       : "📌"}
//                 </span>
//               )}
//               {tab === "latest"
//                 ? "Latest"
//                 : tab === "myInterests"
//                   ? "My Interests"
//                   : "Bookmarked"}
//             </button>
//           ))}
//         </div>

//         {/* Mobile trending tags */}
//         <div className="lg:hidden px-4 py-3 overflow-x-auto">
//           <div className="flex space-x-3">
//             {tags.map((tag) => (
//               <Link
//                 key={tag.id}
//                 to={`/topics/${tag.name.toLowerCase()}`}
//                 className="whitespace-nowrap bg-kiwi-100 text-kiwi-800 px-4 py-2 rounded-full border border-kiwi-300 hover:bg-kiwi-200 text-sm font-medium transition"
//               >
//                 #{tag.name}
//               </Link>
//             ))}
//           </div>
//         </div>

//         <div className="p-4 bg-white border border-kiwi-200 rounded-lg shadow-sm">
//           <div className="flex space-x-3">
//             <div className="w-12 h-12 rounded-full bg-kiwi-300" />
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Ask a Question
//               </h3>
//               <p className="text-sm text-gray-600">
//                 Share your academic queries with the world.
//               </p>
//               <div className="mt-4 flex justify-end">
//                 <Link to="/ask">
//                   <button className="bg-kiwi-700 hover:bg-kiwi-800 text-white rounded-lg px-6 py-2 font-medium transition">
//                     Ask Now
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>

//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//           <div className="p-4 space-y-4">
//             {loading && (
//               <p className="text-gray-600 text-base p-4">Loading...</p>
//             )}
//             {error && (
//               <p className="text-red-600 text-base p-4" role="alert">
//                 Error: {error}
//               </p>
//             )}
//             {!loading && feed.length > 0
//               ? feed.map((item, i) =>
//                   typeof item === "object" && item?.props ? (
//                     item
//                   ) : (
//                     <QuestionCard key={item.id || i} question={item} />
//                   )
//                 )
//               : !loading && (
//                   <p className="text-gray-600 text-base p-4">
//                     No questions found.
//                   </p>
//                 )}
//             {isMobile && (
//               <div className="mt-4">
//                 <TrendingDiscussions tags={tags} />
//                 <ExpertSpotlight experts={experts} />
//                 <Footer />
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div>

//       <div className="p-4 w-80 hidden lg:block bg-white">
//         <div className="sticky top-4 space-y-6">
//           <TrendingDiscussions tags={tags} />
//           <ExpertSpotlight experts={experts} />
//           <Footer />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/useUser";
import QuestionCard from "../components/feed/QuestionCard";
import SearchBar from "../components/common/SearchBar";
import Sidebar from "../components/common/Sidebar";
import TrendingDiscussions from "../components/feed/TrendingDiscussions";
import ExpertSpotlight from "../components/feed/ExpertSpotlight";
import NewUsers from "../components/feed/NewUsers";
import Footer from "../components/common/Footer";
import {
  fetchHotQuestions,
  fetchQuestionsByInterests,
  fetchBookmarks,
  searchQuestions,
} from "../utils/api";
import { fetchTrendingTags } from "../utils/api";
import { fetchExperts } from "../utils/api";

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [experts, setExperts] = useState([]);
  const [activeTab, setActiveTab] = useState("latest");
  const [isMobile, setIsMobile] = useState(false);
  const [randomExpert, setRandomExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        let questionsData = [];
        if (activeTab === "latest") {
          questionsData = await fetchHotQuestions();
        } else if (activeTab === "myInterests") {
          if (!user?.id) throw new Error("User ID required for interests");
          questionsData = await fetchQuestionsByInterests(user.id);
        } else if (activeTab === "bookmarked") {
          if (!user?.id) throw new Error("User ID required for bookmarks");
          questionsData = await fetchBookmarks(user.id);
        }
        const [tagsData, expertsData] = await Promise.all([
          fetchTrendingTags(),
          fetchExperts(),
        ]);
        setQuestions(questionsData);
        setFilteredQuestions(questionsData);
        setTags(tagsData);
        setExperts(expertsData);
        setRandomExpert(
          expertsData[Math.floor(Math.random() * expertsData.length)],
        );
        setIsMobile(window.innerWidth < 1024);
      } catch (err) {
        setError(err.message || "Failed to load data");
        setQuestions([]);
        setFilteredQuestions([]);
        setTags([]);
        setExperts([]);
        setRandomExpert(null);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      loadData();
    }
    const resizeHandler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [activeTab, user]);

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredQuestions(questions);
      return;
    }
    try {
      const searchResults = await searchQuestions(query);
      setFilteredQuestions(searchResults);
    } catch (err) {
      setError(err.message || "Failed to search questions");
      setFilteredQuestions([]);
    }
  };

  const injectExpertIntoFeed = () => {
    if (!isMobile || !randomExpert || filteredQuestions.length === 0) {
      return filteredQuestions;
    }
    const copy = [...filteredQuestions];
    copy.splice(
      1,
      0,
      <motion.div
        key="mobile-expert"
        className="bg-white border border-kiwi-300 p-4 rounded-xl shadow-md relative overflow-hidden mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-kiwi-400 via-kiwi-500 to-kiwi-700 rounded-t-xl" />
        <h3 className="text-kiwi-800 font-bold text-lg mb-1 mt-2 flex items-center gap-2">
          🌟 Expert Spotlight
        </h3>
        <p className="text-sm text-gray-600 mb-2">Featured academic expert</p>
        <div className="bg-kiwi-100 p-3 rounded-lg">
          <h4 className="text-gray-900 font-semibold">{randomExpert.name}</h4>
          <p className="text-sm text-gray-600">{randomExpert.title}</p>
          <p className="text-xs text-gray-500 italic">
            Teaches: {randomExpert.course}
          </p>
        </div>
      </motion.div>,
    );
    return copy;
  };

  const feed = injectExpertIntoFeed();

  return (
    <div className="flex min-h-screen bg-white border-4">
      <Sidebar />
      <div className="flex-1 w-full border-x border-kiwi-200">
        <div className="p-4 bg-white text-kiwi-700 shadow-md">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Academic Pulse
          </motion.h1>
          <div className="mt-4 w-full">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        <div className="flex bg-kiwi-100">
          {["latest", "myInterests", "bookmarked"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 text-center py-3 font-semibold text-base hover:bg-kiwi-200 ${
                activeTab === tab
                  ? "bg-white text-kiwi-800 font-bold border-b-2 border-kiwi-700"
                  : "text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {activeTab === tab && (
                <span className="mr-1">
                  {tab === "latest"
                    ? "📅"
                    : tab === "myInterests"
                      ? "⭐"
                      : "📌"}
                </span>
              )}
              {tab === "latest"
                ? "Latest"
                : tab === "myInterests"
                  ? "My Interests"
                  : "Bookmarked"}
            </button>
          ))}
        </div>
        <div className="lg:hidden px-4 py-3 overflow-x-auto">
          <div className="flex space-x-3">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/topics/${tag.name.toLowerCase()}`}
                className="whitespace-nowrap bg-kiwi-100 text-kiwi-800 px-4 py-2 rounded-full border border-kiwi-300 hover:bg-kiwi-200 text-sm font-medium transition"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="p-4 bg-white border border-kiwi-200 rounded-lg shadow-sm">
          <div className="flex space-x-3">
            <div className="w-12 h-12 rounded-full bg-kiwi-300" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Ask a Question
              </h3>
              <p className="text-sm text-gray-600">
                Share your academic queries with the world.
              </p>
              <div className="mt-4 flex justify-end">
                <Link to="/ask">
                  <button className="bg-kiwi-700 hover:bg-kiwi-800 text-white rounded-lg px-6 py-2 font-medium transition">
                    Ask Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="p-4 space-y-4">
            {loading && (
              <p className="text-gray-600 text-base p-4">Loading...</p>
            )}
            {error && (
              <p className="text-red-600 text-base p-4" role="alert">
                Error: {error}
              </p>
            )}
            {!loading && feed.length > 0
              ? feed.map((item, i) =>
                  typeof item === "object" && item?.props ? (
                    item
                  ) : (
                    <QuestionCard key={item.id || i} question={item} />
                  ),
                )
              : !loading && (
                  <p className="text-gray-600 text-base p-4">
                    No questions found.
                  </p>
                )}
            {isMobile && (
              <div className="mt-4">
                <TrendingDiscussions tags={tags} />
                <ExpertSpotlight experts={experts} />
                <NewUsers />
                <Footer />
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <div className="p-4 w-80 hidden lg:block bg-white">
        <div className="sticky top-4 space-y-6">
          <TrendingDiscussions tags={tags} />
          <ExpertSpotlight experts={experts} />
          <NewUsers />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
