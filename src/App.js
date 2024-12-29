import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/LoginForm';
import Register from './Components/RegisterForm';
import Admin from './Components/Admin';
import SeeCampaign from './Components/SeeCampaign';
import Campaign from './Components/Campaignform';
import ApproveCandidates from './Components/ApproveCandidates';
import ApproveVoters from './Components/ApproveVoters';
import PredictWinner from './Components/PredictWinner';
import Election from './Components/Election';
import Vote from './Components/Vote';
import Result from './Components/Result';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/see_campaigns" element={<SeeCampaign />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/approve_voters" element={<ApproveVoters />} />
          <Route path="/approve_candidates" element={<ApproveCandidates />} />
          <Route path="/predict_winner" element={<PredictWinner />} />
          <Route path="/election" element={<Election />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
