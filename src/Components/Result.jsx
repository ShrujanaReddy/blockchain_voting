import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { contractAbi, contractAddress } from "../Constant/constant";
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Result = () => {
  const [candidates, setCandidates] = useState([]);

  // Fetch candidates data
  useEffect(() => {
    getCandidates();
  }, []);

  // Function to fetch candidates from the smart contract
  async function getCandidates() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const candidatesList = await contractInstance.getAllVotesOfCandiates();
    const formattedCandidates = candidatesList.map((candidate, index) => ({
      index: index,
      name: candidate.name,
      voteCount: candidate.voteCount.toNumber()
    }));
    setCandidates(formattedCandidates);
  }
}

  // Data for the bar chart
  const barChartData = {
    labels: candidates.map(candidate => candidate.name),
    datasets: [
      {
        label: 'Vote Count',
        data: candidates.map(candidate => candidate.voteCount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for the pie chart
  const pieChartData = {
    labels: candidates.map(candidate => candidate.name),
    datasets: [
      {
        label: 'Vote Distribution',
        data: candidates.map(candidate => candidate.voteCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="result-container">
      <h1 className='bg-white p-2 text-3xl text-bold text-center rounded-lg shadow-md mb-8'>Voting Results</h1>

      {/* Display results in a table */}
      <table className='bg-white p-10 m-2 rounded-lg shadow-md mb-8'>
        <thead>
          <tr>
            <th>Candidate Index</th>
            <th>Candidate Name</th>
            <th>Vote Count</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.index}>
              <td>{candidate.index}</td>
              <td>{candidate.name}</td>
              <td>{candidate.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bar Chart */}
      <div className="chart-container bg-white p-6 rounded-lg shadow-md mb-8">
        <h2>Vote Count Bar Chart</h2>
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Vote Count by Candidate',
              },
            },
          }}
        />
      </div>

      {/* Pie Chart */}
      <div className="chart-container bg-white p-6 rounded-lg shadow-md mb-8">
        <h2>Vote Distribution Pie Chart</h2>
        <Pie
          data={pieChartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Vote Distribution by Candidate',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Result;