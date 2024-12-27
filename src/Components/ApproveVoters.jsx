import React, { useState, useEffect } from "react";
import axios from "axios";

const ApproveVoters = () => {
  const [voters, setVoters] = useState([]);
  const [approvedVoters, setApprovedVoters] = useState([]);
  const [adminToken, setAdminToken] = useState("");
  const [isTokenSubmitted, setIsTokenSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allVotersResponse = await axios.get("http://127.0.0.1:8000/api/users/voters");
        setVoters(allVotersResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setVoters([]); // Handle "No voters found" case
        } else {
          console.error("Error fetching voters:", error);
        }
      }

      try {
        const approvedResponse = await axios.get("http://127.0.0.1:8000/api/users/approved-voters");
        setApprovedVoters(approvedResponse.data);
      } catch (error) {
        console.error("Error fetching approved voters:", error);
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

  const approveVoter = async (userId) => {
    if (!isTokenSubmitted) {
      alert("Please submit the admin token before approving voters.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/approve/${userId}?user_secret_token=${adminToken}`
      );
      console.log(response.data);

      const allVotersResponse = await axios.get("http://127.0.0.1:8000/api/users/voters");
      setVoters(allVotersResponse.data);

      const approvedResponse = await axios.get("http://127.0.0.1:8000/api/users/approved-voters");
      setApprovedVoters(approvedResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setVoters([]);
      } else {
        console.error("Error approving voter:", error);
        alert("Error approving the voter.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Approve Voters</h1>

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

      {/* Pending Voters Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pending Voters</h2>
        {voters.length > 0 ? (
          <ul className="space-y-4">
            {voters.map((voter) => (
              <li
                key={voter.user_id}
                className="p-4 border border-gray-300 rounded shadow-md flex justify-between items-center"
              >
                <div>
                  <p><strong>Name:</strong> {voter.name}</p>
                  <p><strong>Email:</strong> {voter.email}</p>
                  <p><strong>Wallet:</strong> {voter.wallet_address}</p>
                </div>
                <button
                  disabled={isLoading}
                  className={`bg-green-500 text-white px-4 py-2 rounded ${
                    isLoading ? "opacity-50" : "hover:bg-green-600"
                  }`}
                  onClick={() => approveVoter(voter.user_id)}
                >
                  {isLoading ? "Approving..." : "Approve"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No pending voters found.</p>
        )}
      </div>

      {/* Approved Voters Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Approved Voters</h2>
        {approvedVoters.length > 0 ? (
          <ul className="space-y-4">
            {approvedVoters.map((voter) => (
              <li
                key={voter.user_id}
                className="p-4 border border-gray-300 rounded shadow-md"
              >
                <p><strong>Name:</strong> {voter.name}</p>
                <p><strong>Email:</strong> {voter.email}</p>
                <p><strong>Wallet:</strong> {voter.wallet_address}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No approved voters found.</p>
        )}
      </div>
    </div>
  );
};

export default ApproveVoters;
