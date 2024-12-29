import React, { useState, useContext } from 'react';
import { ElectionContext } from '../context/ElectionContext';

function Election() {
  const { electionStarted, setElectionStarted } = useContext(ElectionContext);
  const [contractAddress, setContractAddress] = useState('');

  const startElection = (e) => {
    e.preventDefault(); // Prevent the form from submitting and refreshing the page
    if (contractAddress) {
      setElectionStarted(true);
    }
  };

  return (
    <div>
      {!electionStarted ? (
        <form onSubmit={startElection}>
          <h1 className="p-8 text-3xl">Enter Election Contract Address</h1>
          <input
            className="mt-1 block px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            type="text"
            placeholder="Enter Contract Address"
            required
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
          <button
            type="submit" onSubmit={startElection}
            className="px-4 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg"
          >
            Start Election
          </button>
        </form>
      ) : (
        <div>
          <h1>Election Started!</h1>
          <p>Contract Address: {contractAddress}</p>
        </div>
      )}
    </div>
  );
}

export default Election;