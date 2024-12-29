import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    console.log(user);
    // If user data exists in localStorage and has the role 'admin'
    if (user) {
      const parsedUser = JSON.parse(user); // Safely parse the user data
      console.log(parsedUser)
      if (parsedUser.role === 'organization_admin') {
        // If the user is admin, continue rendering the Admin page
        return;
      }
    }
    
    // If no user or user is not admin, redirect to login or home page
    navigate('/login'); // or '/'; depending on your desired route
  }, [navigate]);

  const handlePredictWinner = () => {
    navigate('/predict_winner')
  };

  const handleApproveCandidates = () => {
    navigate('/approve_candidates');
  };

  const handleApproveVoters = () => {
    navigate('/approve_voters');
  };

  const handleStartElection = () => {
    navigate('/election')
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h2>
      <div className="space-y-4">
        <button
          onClick={handlePredictWinner}
          className="w-full px-4 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg"
        >
          Predict Winner
        </button>
        <button
          onClick={handleApproveCandidates}
          className="w-full px-4 py-2 text-white font-medium bg-green-600 hover:bg-green-700 rounded-lg shadow-lg"
        >
          Approve Candidates
        </button>
        <button
          onClick={handleApproveVoters}
          className="w-full px-4 py-2 text-white font-medium bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg"
        >
          Approve Voters
        </button>
        <button
          onClick={handleStartElection}
          className="w-full px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-700 rounded-lg shadow-lg"
        >
          Start Election
        </button>
      </div>
    </div>
  );
}

export default Admin;
