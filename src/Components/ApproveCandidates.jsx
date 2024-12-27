import React, { useState, useEffect } from "react";
import axios from "axios";

const ApproveCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [approvedCandidates, setApprovedCandidates] = useState([]);
  const [adminToken, setAdminToken] = useState("");
  const [isTokenSubmitted, setIsTokenSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCandidatesResponse = await axios.get("http://127.0.0.1:8000/api/users/candidates");
        setCandidates(allCandidatesResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCandidates([]); // Handle "No candidates found" case
        } else {
          console.error("Error fetching candidates:", error);
        }
      }

      try {
        const approvedResponse = await axios.get("http://127.0.0.1:8000/api/users/approved-candidates");
        setApprovedCandidates(approvedResponse.data);
      } catch (error) {
        console.error("Error fetching approved candidates:", error);
      }
    };

    fetchData();
  }, []);

  const submitToken = () => {
    if (adminToken) {
      setIsTokenSubmitted(true);
    } else {
      alert("Please enter a valid token.");
    }
  };

  const approveCandidate = async (userId) => {
    if (!isTokenSubmitted) {
      alert("Please submit the admin token before approving candidates.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/approve/${userId}?user_secret_token=${adminToken}`
      );
      console.log(response.data);

      const allCandidatesResponse = await axios.get("http://127.0.0.1:8000/api/users/candidates");
      setCandidates(allCandidatesResponse.data);

      const approvedResponse = await axios.get("http://127.0.0.1:8000/api/users/approved-candidates");
      setApprovedCandidates(approvedResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setCandidates([]);
      } else {
        console.error("Error approving candidate:", error);
        alert("Error approving the candidate.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Approve Candidates</h1>

      {!isTokenSubmitted ? (
        <div className="mb-6">
          <input
            type="password"
            placeholder="Enter Admin Secret Token"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            className="border p-2 mr-2"
          />
          <button
            onClick={submitToken}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Token
          </button>
        </div>
      ) : null}

      {/* Pending Candidates Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pending Candidates</h2>
        {candidates.length > 0 ? (
          <ul className="space-y-4">
            {candidates.map((candidate) => (
              <li
                key={candidate.user_id}
                className="p-4 border border-gray-300 rounded shadow-md flex justify-between items-center"
              >
                <div>
                  <p><strong>Name:</strong> {candidate.name}</p>
                  <p><strong>Email:</strong> {candidate.email}</p>
                  <p><strong>Wallet:</strong> {candidate.wallet_address}</p>
                </div>
                <button
                  disabled={isLoading}
                  className={`bg-green-500 text-white px-4 py-2 rounded ${
                    isLoading ? "opacity-50" : "hover:bg-green-600"
                  }`}
                  onClick={() => approveCandidate(candidate.user_id)}
                >
                  {isLoading ? "Approving..." : "Approve"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No pending candidates found.</p>
        )}
      </div>

      {/* Approved Candidates Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Approved Candidates</h2>
        {approvedCandidates.length > 0 ? (
          <ul className="space-y-4">
            {approvedCandidates.map((candidate) => (
              <li
                key={candidate.user_id}
                className="p-4 border border-gray-300 rounded shadow-md"
              >
                <p><strong>Name:</strong> {candidate.name}</p>
                <p><strong>Email:</strong> {candidate.email}</p>
                <p><strong>Wallet:</strong> {candidate.wallet_address}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No approved candidates found.</p>
        )}
      </div>
    </div>
  );
};

export default ApproveCandidates;
