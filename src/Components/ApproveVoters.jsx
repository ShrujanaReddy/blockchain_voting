import React, { useState, useEffect } from "react";
import axios from "axios";

const ApproveVoters = () => {
  const [voters, setVoters] = useState([]);
  const [approvedVoters, setApprovedVoters] = useState([]);

  // Fetch all voters and approved voters
  useEffect(() => {
    const fetchData = async () => {
      const allVoters = await axios.get("http://127.0.0.1:8000/api/users/voters");
      const approved = await axios.get("http://127.0.0.1:8000/api/users/approved-voters");
      setVoters(allVoters.data);
      setApprovedVoters(approved.data);
    };
    fetchData();
  }, []);

  const approveVoter = async (userId) => {
    await axios.put(`http://127.0.0.1:8000/api/users/approve/${userId}?user_secret_token=9713571b11024f169cc046223a18cf29`);
    // Refresh data after approval
    const allVoters = await axios.get("http://127.0.0.1:8000/api/users/voters");
    const approved = await axios.get("http://127.0.0.1:8000/api/users/approved-voters");
    setVoters(allVoters.data);
    setApprovedVoters(approved.data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Approve Voters</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pending Voters</h2>
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
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => approveVoter(voter.user_id)}
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Approved Voters</h2>
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
      </div>
    </div>
  );
};

export default ApproveVoters;
