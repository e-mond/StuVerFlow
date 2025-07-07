import { useState } from "react";
import { useUser } from "../context/UserContext";
import { postAnswer, voteOnQuestion, voteOnAnswer } from "../utils/api";
import Button from "../components/common/Button";
import Sidebar from "../components/common/Sidebar";

const TestPage = () => {
  const { user } = useUser();
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testPostAnswer = async () => {
    if (!user?.id) {
      addResult("Post Answer", false, "User not logged in");
      return;
    }

    try {
      setIsLoading(true);
      // Test with a known question ID (you may need to adjust this)
      const questionId = 1;
      const content = "This is a test answer from the debug page.";
      
      const result = await postAnswer(questionId, user.id, content);
      addResult("Post Answer", true, "Answer posted successfully", result);
    } catch (error) {
      addResult("Post Answer", false, error.message || "Unknown error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testVoteQuestion = async () => {
    if (!user?.id) {
      addResult("Vote Question", false, "User not logged in");
      return;
    }

    try {
      setIsLoading(true);
      // Test with a known question ID
      const questionId = 1;
      
      const result = await voteOnQuestion(questionId, user.id, "upvote");
      addResult("Vote Question", true, "Question voted successfully", result);
    } catch (error) {
      addResult("Vote Question", false, error.message || "Unknown error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testVoteAnswer = async () => {
    if (!user?.id) {
      addResult("Vote Answer", false, "User not logged in");
      return;
    }

    try {
      setIsLoading(true);
      // Test with a known answer ID
      const answerId = 1;
      
      const result = await voteOnAnswer(answerId, user.id, "upvote");
      addResult("Vote Answer", true, "Answer voted successfully", result);
    } catch (error) {
      addResult("Vote Answer", false, error.message || "Unknown error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          API Test Page
        </h1>
        
        {user?.id ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              ✅ Logged in as: {user.name || user.username} (ID: {user.id})
            </p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              ❌ Not logged in. Please log in to test API functions.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button
            variant="kiwi"
            onClick={testPostAnswer}
            disabled={isLoading || !user?.id}
            className="h-12"
          >
            {isLoading ? "Testing..." : "Test Post Answer"}
          </Button>
          
          <Button
            variant="kiwi"
            onClick={testVoteQuestion}
            disabled={isLoading || !user?.id}
            className="h-12"
          >
            {isLoading ? "Testing..." : "Test Vote Question"}
          </Button>
          
          <Button
            variant="kiwi"
            onClick={testVoteAnswer}
            disabled={isLoading || !user?.id}
            className="h-12"
          >
            {isLoading ? "Testing..." : "Test Vote Answer"}
          </Button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Test Results ({testResults.length})
          </h2>
          <Button
            variant="outline"
            onClick={clearResults}
            disabled={testResults.length === 0}
          >
            Clear Results
          </Button>
        </div>

        <div className="space-y-4">
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tests run yet. Click the buttons above to test API functions.
            </div>
          ) : (
            testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-semibold ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}>
                    {result.success ? "✅" : "❌"} {result.test}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {result.timestamp}
                  </span>
                </div>
                
                <p className={`mb-2 ${
                  result.success ? "text-green-700" : "text-red-700"
                }`}>
                  {result.message}
                </p>
                
                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium text-gray-600">
                      Show Response Data
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage; 