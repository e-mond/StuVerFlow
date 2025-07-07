import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHeart, 
  FaReply, 
  FaTrash, 
  FaQuestion, 
  FaPaperPlane,
  FaClock,
  FaUser
} from "react-icons/fa";
import Button from "../common/Button";
import {
  fetchCommunityMessages,
  postCommunityMessage,
  replyToCommunityMessage,
  likeCommunityMessage,
  deleteCommunityMessage,
  askCommunityQuestion
} from "../../utils/api";

const CommunityChat = ({ communityId, isMember, membershipLoading = false }) => {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionData, setQuestionData] = useState({
    title: "",
    content: "",
    tags: ""
  });

  // Load community messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const response = await fetchCommunityMessages(communityId);
        setMessages(response.data || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isMember && !membershipLoading) {
      loadMessages();
    } else {
      setLoading(false);
    }
  }, [communityId, isMember, membershipLoading]);

  // Post new message
  const handlePostMessage = async () => {
    if (!newMessage.trim() || posting) return;

    try {
      setPosting(true);
      const response = await postCommunityMessage(communityId, {
        content: newMessage,
        message_type: "message"
      });
      
      setMessages(prev => [response.data, ...prev]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to post message:", error);
    } finally {
      setPosting(false);
    }
  };

  // Reply to message
  const handleReply = async (messageId) => {
    if (!replyContent.trim()) return;

    try {
      const response = await replyToCommunityMessage(communityId, messageId, replyContent);
      
      // Add reply to the parent message
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, replies: [response.data, ...(msg.replies || [])] }
          : msg
      ));
      
      setReplyingTo(null);
      setReplyContent("");
    } catch (error) {
      console.error("Failed to reply:", error);
    }
  };

  // Like message
  const handleLike = async (messageId) => {
    try {
      const response = await likeCommunityMessage(communityId, messageId);
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              like_count: response.like_count, 
              is_liked: response.is_liked 
            }
          : msg
      ));
    } catch (error) {
      console.error("Failed to like message:", error);
    }
  };

  // Delete message
  const handleDelete = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await deleteCommunityMessage(communityId, messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  // Ask question in community
  const handleAskQuestion = async () => {
    if (!questionData.title.trim() || !questionData.content.trim()) return;

    try {
      const tags = questionData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean);

      await askCommunityQuestion(communityId, {
        title: questionData.title,
        content: questionData.content,
        tags
      });

      setQuestionData({ title: "", content: "", tags: "" });
      setShowQuestionForm(false);
      
      // Reload messages to show the new question
      const response = await fetchCommunityMessages(communityId);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Failed to ask question:", error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (membershipLoading) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-600">Checking your membership status...</p>
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-600">Join this community to participate in discussions!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Community Discussion</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowQuestionForm(!showQuestionForm)}
          >
            <FaQuestion className="mr-2" />
            Ask Question
          </Button>
        </div>
      </div>

      {/* Question Form */}
      <AnimatePresence>
        {showQuestionForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-200 p-4 bg-kiwi-50"
          >
            <h4 className="font-medium text-gray-900 mb-3">Ask a Question in This Community</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Question title..."
                value={questionData.title}
                onChange={(e) => setQuestionData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kiwi-500"
              />
              <textarea
                placeholder="Question details..."
                value={questionData.content}
                onChange={(e) => setQuestionData(prev => ({ ...prev, content: e.target.value }))}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kiwi-500"
              />
              <input
                type="text"
                placeholder="Tags (comma separated)..."
                value={questionData.tags}
                onChange={(e) => setQuestionData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kiwi-500"
              />
              <div className="flex gap-2">
                <Button onClick={handleAskQuestion} variant="kiwi" size="sm">
                  Post Question
                </Button>
                <Button onClick={() => setShowQuestionForm(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handlePostMessage()}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kiwi-500"
          />
          <Button 
            onClick={handlePostMessage} 
            disabled={posting || !newMessage.trim()}
            variant="kiwi"
            size="sm"
          >
            <FaPaperPlane />
          </Button>
        </div>
      </div>

      {/* Messages List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No messages yet. Start the conversation!</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                currentUser={user}
                onReply={setReplyingTo}
                onLike={handleLike}
                onDelete={handleDelete}
                replyingTo={replyingTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                handleReply={handleReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Message Item Component
const MessageItem = ({ 
  message, 
  currentUser, 
  onReply, 
  onLike, 
  onDelete,
  replyingTo,
  replyContent,
  setReplyContent,
  handleReply
}) => {
  const isOwner = message.author?.id === currentUser?.id;
  const isQuestion = message.message_type === "question";

  return (
    <div className="p-4">
      {/* Message Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 bg-kiwi-200 rounded-full flex items-center justify-center">
          <FaUser className="text-kiwi-700 text-sm" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">
              {message.author?.name || "Unknown User"}
            </span>
            {isQuestion && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Question
              </span>
            )}
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <FaClock className="text-xs" />
              {new Date(message.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="ml-11">
        {isQuestion && message.question_title && (
          <h4 className="font-semibold text-gray-900 mb-1">{message.question_title}</h4>
        )}
        <p className="text-gray-700 mb-3">{message.content}</p>

        {/* Question Tags */}
        {isQuestion && message.question_tags && message.question_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {message.question_tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Message Actions */}
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={() => onLike(message.id)}
            className={`flex items-center gap-1 text-sm ${
              message.is_liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <FaHeart className={message.is_liked ? "fill-current" : ""} />
            {message.like_count || 0}
          </button>

          <button
            onClick={() => onReply(message.id)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-kiwi-600"
          >
            <FaReply />
            Reply
          </button>

          {isOwner && (
            <button
              onClick={() => onDelete(message.id)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
            >
              <FaTrash />
              Delete
            </button>
          )}
        </div>

        {/* Reply Form */}
        {replyingTo === message.id && (
          <div className="bg-gray-50 p-3 rounded-md mb-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleReply(message.id)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              />
              <Button 
                onClick={() => handleReply(message.id)}
                size="sm"
                variant="kiwi"
              >
                Reply
              </Button>
              <Button 
                onClick={() => onReply(null)}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {message.replies && message.replies.length > 0 && (
          <div className="space-y-2">
            {message.replies.map((reply) => (
              <div key={reply.id} className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {reply.author?.name || "Unknown User"}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(reply.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{reply.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityChat; 