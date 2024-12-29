import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

// Register required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function PredictWinner() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/sentiment", null, {
          headers: { Accept: "application/json" },
        });
        if (response.status === 200) {
          setData(response.data.predictions);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (isLoading) {
    return <div className="text-center text-gray-600">Loading predictions...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-600">
        An error occurred while fetching predictions. Please try again later.
      </div>
    );
  }

  const sentiments = data.map((candidate) => candidate.sentiment);
  const probabilities = data.map((candidate) => candidate.probability);
  const candidateNames = data.map((candidate) => candidate.name);

  const positiveCount = sentiments.filter((s) => s === "positive").length;
  const negativeCount = sentiments.filter((s) => s === "negative").length;
  const neutralCount = sentiments.filter((s) => s === "neutral").length;
  // Data for Pie Chart
  const pieData = {
    labels: ["positive", "negative","neutral"],
    datasets: [
      {
        data: [positiveCount, negativeCount, neutralCount],
        backgroundColor: ["#4CAF50", "#FF5733", "#808080"],
        hoverBackgroundColor: ["#45A049", "#FF4D4D", "#808080"],
      },
    ],
  };

  // Data for Bar Chart
  const barData = {
    labels: candidateNames,
    datasets: [
      {
        label: "Probability of Winning",
        data: probabilities,
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Sentiment Analysis Results
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sentiment Details:</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Sentiment</th>
              <th className="border border-gray-300 px-4 py-2">Probability</th>
            </tr>
          </thead>
          <tbody>
            {data.map((candidate) => (
              <tr key={candidate.candidate_id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{candidate.candidate_id}</td>
                <td className="border border-gray-300 px-4 py-2">{candidate.name}</td>
                <td className="border border-gray-300 px-4 py-2">{candidate.sentiment}</td>
                <td className="border border-gray-300 px-4 py-2">{candidate.probability.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Overall Sentiment Distribution
          </h2>
          <Pie data={pieData} />
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Sentiment Probabilities by Candidate
          </h2>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}

export default PredictWinner;