import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Sidebar from "../components/common/Sidebar";
import Button from "../components/common/Button";
import QuestionCard from "../components/feed/QuestionCard";
import {
  fetchStudyGroups,
  joinCommunity,
  leaveCommunity,
  fetchCommunityQuestions,
} from "../utils/api";

// Component for displaying details of a specific community
const CommunityDetailsPage = () => {
  const [community, setCommunity] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { communityId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch community details and questions
  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        setLoading(true);
        setError(null);
        const groups = await fetchStudyGroups();
        const selectedCommunity = groups.find(
          (g) => g.id === parseInt(communityId),
        );
        if (!selectedCommunity) {
          setError("Community not found.");
          setLoading(false);
          return;
        }
        setCommunity(selectedCommunity);
        const communityQuestions = await fetchCommunityQuestions(communityId);
        setQuestions(communityQuestions);
        setIsMember(selectedCommunity.members.includes(user.id));
      } catch (err) {
        setError(err.message || "Failed to load community details.");
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      loadCommunityData();
    }
  }, [communityId, user]);

  const handleJoin = async () => {
    try {
      const { members } = await joinCommunity(communityId, user.id);
      setIsMember(true);
      setCommunity((prev) => ({ ...prev, members }));
    } catch (err) {
      setError(err.message || "Failed to join community.");
    }
  };

  const handleLeave = async () => {
    try {
      const { members } = await leaveCommunity(communityId, user.id);
      setIsMember(false);
      setCommunity((prev) => ({ ...prev, members }));
    } catch (err) {
      setError(err.message || "Failed to leave community.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6">
          <p className="text-gray-600 text-sm sm:text-base">
            Loading community details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          {community ? (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {community.name}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mb-2">
                {community.description}
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Members: {community.members}
              </p>
              <div className="flex gap-2">
                {isMember ? (
                  <Button variant="kiwi" onClick={handleLeave}>
                    Leave Community
                  </Button>
                ) : (
                  <Button variant="kiwi" onClick={handleJoin}>
                    Join Community
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => navigate("/communities")}
                >
                  Back to Communities
                </Button>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">
              Community not found.
            </p>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-sm sm:text-base mb-4" role="alert">
            {error}
          </p>
        )}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
          Questions
        </h2>
        {questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm sm:text-base">
            No questions found in this community.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommunityDetailsPage;
