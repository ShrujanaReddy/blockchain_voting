import React, { useState, useEffect } from "react";
import axios from "axios";

const ApproveCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [approvedCandidates, setApprovedCandidates] = useState([]);
  const [secretToken, setSecretToken] = useState(""); // State to hold the secret token
  const [isTokenProvided, setIsTokenProvided] = useState(false); // State to track if token is provided

  // Fetch all candidates and approved candidates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allCandidates = await axios.get("http://127.0.0.1:8000/api/users/candidates");
        const approved = await axios.get("http://127.0.0.1:8000/api/users/approved-candidates");
        setCandidates(allCandidates.data);
        setApprovedCandidates(approved.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchData();
  }, []);

  const approveCandidate = async (userId) => {
    if (!isTokenProvided) {
      alert("Please provide a secret token to approve candidates.");
      return;
    }
    
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/approve/${userId}`,
        null,
        {
          params: {
            user_secret_token: secretToken,
          },
          headers: {
            accept: "application/json",
          },
        }
      );
      console.log(response.data);
      
      // Refresh data after approval
      const allCandidates = await axios.get("http://127.0.0.1:8000/api/users/candidates");
      const approved = await axios.get("http://127.0.0.1:8000/api/users/approved-candidates");
      setCandidates(allCandidates.data);
      setApprovedCandidates(approved.data);
      
    } catch (error) {
      console.error("Error approving candidate:", error);
      alert("There was an error approving the candidate.");
    }
  };

  const handleTokenChange = (e) => {
    setSecretToken(e.target.value);
  };

  const handleTokenSubmit = () => {
    if (secretToken.trim()) {
      setIsTokenProvided(true);  // Allow approvals only if token is provided
    } else {
      alert("Please enter a valid secret token.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Approve Candidates</h1>

      {/* Secret token input section */}
      {!isTokenProvided ? (
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">Admin Secret Token</label>
          <input
            type="text"
            value={secretToken}
            onChange={handleTokenChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your secret token"
          />
          <button
            onClick={handleTokenSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
          >
            Submit Token
          </button>
        </div>
      ) : (
        <p className="text-green-500 mb-4">Token provided. You can now approve candidates.</p>
      )}

      {/* Pending Candidates Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pending Candidates</h2>
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
              {isTokenProvided && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => approveCandidate(candidate.user_id)}
                >
                  Approve
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Approved Candidates Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Approved Candidates</h2>
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
      </div>
    </div>
  );
};

export default ApproveCandidates;
