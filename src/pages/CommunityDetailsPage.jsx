import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Sidebar from "../components/common/Sidebar";
import Button from "../components/common/Button";
import QuestionCard from "../components/feed/QuestionCard";
import CommunityChat from "../components/community/CommunityChat";
import {
  fetchCommunityDetails,
  joinCommunity,
  leaveCommunity,
  fetchCommunityQuestions,
  checkCurrentUserMembership,
  getCommunityJoinRequests,
  approveJoinRequest,
  declineJoinRequest,
  getCommunityMembers,
  deleteCommunity,
} from "../utils/api";

// Component for displaying details of a specific community
const CommunityDetailsPage = () => {
  const [community, setCommunity] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discussion"); // Default to discussion tab
  const [joinRequests, setJoinRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { communityId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Check membership status using dedicated API
  const checkMembership = async () => {
    try {
      setMembershipLoading(true);
      const membershipResponse = await checkCurrentUserMembership(communityId);
      console.log('Membership response:', membershipResponse);
      setIsMember(membershipResponse.is_member);
      setIsAdmin(membershipResponse.is_admin);
      setHasPendingRequest(membershipResponse.has_pending_request);
      
      // Additional fallback check for admin status
      if (!membershipResponse.is_admin && community && user?.id) {
        // Check if user is the creator as fallback
        const isCreator = community.creator?.id === user.id || community.creator?.id === parseInt(user.id);
        if (isCreator) {
          console.log('User is creator, setting admin status to true');
          setIsAdmin(true);
        }
      }
    } catch (err) {
      console.error("Failed to check membership:", err);
      // Fallback to basic membership check
      if (community && user?.id) {
        const members = community.members || [];
        const userIdNum = parseInt(user.id);
        const userIdStr = String(user.id);
        
        const isMemberFallback = Array.isArray(members) 
          ? members.includes(userIdNum) || members.includes(userIdStr) || members.includes(user.id)
          : members?.some?.(m => 
              m === user.id || m === userIdNum || m === userIdStr || 
              (typeof m === 'object' && (m.id === user.id || m.id === userIdNum || m.id === userIdStr))
            ) || false;
        
        setIsMember(isMemberFallback);
        setIsAdmin(community.creator?.id === user.id || community.creator?.id === parseInt(user.id)); // Fallback admin check
      }
    } finally {
      setMembershipLoading(false);
    }
  };

  // Fetch community details and questions
  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch community details using dedicated endpoint
        const communityData = await fetchCommunityDetails(communityId);
        setCommunity(communityData);
        
        // Fetch community questions
        const communityQuestions = await fetchCommunityQuestions(communityId);
        setQuestions(communityQuestions);
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

  // Check membership after community is loaded
  useEffect(() => {
    if (user?.id && communityId && !loading) {
      checkMembership();
    }
  }, [communityId, user?.id, loading]);

  // Load admin data if user is admin
  const loadAdminData = async () => {
    if (!isAdmin) {
      console.log('User is not admin, skipping admin data load');
      return;
    }
    
    try {
      console.log('Loading admin data for community:', communityId);
      const [requestsData, membersData] = await Promise.all([
        getCommunityJoinRequests(communityId),
        getCommunityMembers(communityId)
      ]);
      console.log('Admin data loaded:', { requestsData, membersData });
      setJoinRequests(requestsData.data || []);
      setMembers(membersData.data || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      setError(err.message || "Failed to load admin data");
    }
  };

  // Load admin data when user becomes admin
  useEffect(() => {
    if (isAdmin && !membershipLoading) {
      loadAdminData();
    }
  }, [isAdmin, membershipLoading, communityId]);

  const handleJoin = async () => {
    try {
      const response = await joinCommunity(communityId, user.id);
      if (response.status === 'request_sent') {
        setHasPendingRequest(true);
        setError(null);
      } else {
        setIsMember(true);
        // Update member count in community state
        setCommunity((prev) => ({ ...prev, member_count: response.members }));
      }
    } catch (err) {
      setError(err.message || "Failed to join community.");
    }
  };

  const handleApproveRequest = async (membershipId) => {
    try {
      console.log('Approving request:', { communityId, membershipId });
      const response = await approveJoinRequest(communityId, membershipId);
      console.log('Approve response:', response);
      // Refresh admin data
      await loadAdminData();
      // Update member count with the value from the backend
      if (response.member_count !== undefined) {
        setCommunity((prev) => ({ ...prev, member_count: response.member_count }));
      } else {
        // Fallback to incrementing if backend doesn't return count
        setCommunity((prev) => ({ ...prev, member_count: (prev.member_count || 0) + 1 }));
      }
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error approving request:', err);
      setError(err.message || "Failed to approve request.");
    }
  };

  const handleDeclineRequest = async (membershipId) => {
    try {
      console.log('Declining request:', { communityId, membershipId });
      const response = await declineJoinRequest(communityId, membershipId);
      console.log('Decline response:', response);
      // Refresh admin data
      await loadAdminData();
      // Update member count with the value from the backend (for consistency)
      if (response.member_count !== undefined) {
        setCommunity((prev) => ({ ...prev, member_count: response.member_count }));
      }
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error declining request:', err);
      setError(err.message || "Failed to decline request.");
    }
  };

  const handleLeave = async () => {
    try {
      const response = await leaveCommunity(communityId, user.id);
      setIsMember(false);
      // Update member count in community state
      if (response.members !== undefined) {
        setCommunity((prev) => ({ ...prev, member_count: response.members }));
      } else {
        // Fallback to decrementing if backend doesn't return count
        setCommunity((prev) => ({ ...prev, member_count: Math.max((prev.member_count || 1) - 1, 0) }));
      }
    } catch (err) {
      setError(err.message || "Failed to leave community.");
    }
  };

  const handleDeleteCommunity = async () => {
    // Prevent multiple deletion attempts
    if (isDeleting) return;
    
    // Ask for confirmation with detailed warning
    const isConfirmed = window.confirm(
      `⚠️ DANGER: DELETE COMMUNITY\n\nAre you sure you want to delete "${community?.name}"?\n\nThis will permanently:\n• Delete all community messages and discussions\n• Remove all members and join requests\n• Delete all community-specific questions\n• Remove all related data\n\nThis action CANNOT be undone!\n\nClick OK to proceed with deletion, or Cancel to abort.`
    );
    
    if (!isConfirmed) return;
    
    // Double confirmation for extra safety
    const doubleConfirm = window.confirm(
      `FINAL CONFIRMATION\n\nType the community name to confirm deletion:\n"${community?.name}"\n\nAre you absolutely certain you want to delete this community?`
    );
    
    if (!doubleConfirm) return;
    
    setIsDeleting(true);
    
    try {
      console.log('Deleting community:', communityId);
      const response = await deleteCommunity(communityId);
      console.log('Delete response:', response);
      
      // Show success message
      alert(`✅ Success: ${response.message || 'Community deleted successfully'}`);
      
      // Redirect to communities page
      navigate('/communities');
    } catch (err) {
      console.error('Error deleting community:', err);
      const errorMessage = err.message || err.response?.data?.message || "Failed to delete community.";
      setError(errorMessage);
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
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
        {/* Community Header */}
        <div className="mb-6">
          {community ? (
            <>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {community.name}
                </h1>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">
                    Members: {community.member_count || 0}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base mb-2">
                {community.description}
              </p>
              <div className="mb-4">
                {membershipLoading && (
                  <span className="text-xs text-blue-500">Checking membership...</span>
                )}
                {!membershipLoading && isMember && (
                  <div className="flex gap-2">
                    <span className="text-xs text-green-600">✓ You are a member</span>
                    {isAdmin && (
                      <span className="text-xs text-purple-600 font-medium">👑 Administrator</span>
                    )}
                  </div>
                )}
                {!membershipLoading && !isMember && hasPendingRequest && (
                  <span className="text-xs text-orange-600">⏳ Join request pending approval</span>
                )}
              </div>
              <div className="flex gap-2">
                {!membershipLoading && (
                  isMember ? (
                    <Button variant="kiwi" onClick={handleLeave}>
                      Leave Community
                    </Button>
                  ) : hasPendingRequest ? (
                    <Button variant="outline" disabled>
                      Request Pending
                    </Button>
                  ) : (
                    <Button variant="kiwi" onClick={handleJoin}>
                      Request to Join
                    </Button>
                  )
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



        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("discussion")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "discussion"
                  ? "border-kiwi-500 text-kiwi-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Discussion
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "questions"
                  ? "border-kiwi-500 text-kiwi-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Questions ({questions.length})
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "admin"
                    ? "border-kiwi-500 text-kiwi-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Admin ({joinRequests.length})
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "discussion" && (
          <div>
            <CommunityChat 
              communityId={communityId} 
              isMember={isMember && !membershipLoading}
              membershipLoading={membershipLoading}
            />
          </div>
        )}

        {activeTab === "questions" && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              Community Questions
            </h2>
            {!membershipLoading && isMember ? (
              questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <QuestionCard key={question.id} question={question} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    No questions found in this community.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Use the Discussion tab to ask questions or start conversations!
                  </p>
                </div>
              )
            ) : !membershipLoading && !isMember ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-sm sm:text-base mb-4">
                  Join this community to view and ask questions.
                </p>
                <Button variant="kiwi" onClick={handleJoin}>
                  Request to Join
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  Checking your membership status...
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "admin" && isAdmin && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
              Community Administration
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            {/* Join Requests Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Pending Join Requests ({joinRequests.length})
              </h3>
              {joinRequests.length > 0 ? (
                <div className="space-y-3">
                  {joinRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-kiwi-100 rounded-full flex items-center justify-center">
                          <span className="text-kiwi-700 font-medium">
                            {request.user.name?.[0] || request.user.username?.[0] || "?"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{request.user.name || request.user.username}</p>
                          <p className="text-sm text-gray-500">{request.user.institution || request.user.email}</p>
                          <p className="text-xs text-gray-400">
                            Requested {new Date(request.requested_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="kiwi"
                          className="text-sm px-3 py-1"
                          onClick={() => handleApproveRequest(request.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="text-sm px-3 py-1"
                          onClick={() => handleDeclineRequest(request.id)}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">No pending join requests</p>
                </div>
              )}
            </div>

            {/* Members Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Community Members ({members.length})
              </h3>
              {members.length > 0 ? (
                <div className="grid gap-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-kiwi-100 rounded-full flex items-center justify-center">
                          <span className="text-kiwi-700 font-medium">
                            {member.user.name?.[0] || member.user.username?.[0] || "?"}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{member.user.name || member.user.username}</p>
                            {member.role === 'admin' && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{member.user.institution || "No institution"}</p>
                          <p className="text-xs text-gray-400">
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">No members found</p>
                </div>
              )}
            </div>

            {/* Dangerous Actions Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Dangerous Actions
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-800">Delete Community</h4>
                    <p className="text-sm text-red-600 mt-1">
                      Permanently delete this community and all its content. This action cannot be undone.
                    </p>
                  </div>
                  <Button
                    variant="kiwi"
                    className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                    onClick={handleDeleteCommunity}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Community'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetailsPage;
