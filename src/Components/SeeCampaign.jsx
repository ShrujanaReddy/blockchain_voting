import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SeeCampaign() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/candidates/campaigns', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response)
        if (response.status === 200) {
          setCampaigns(response.data);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (isLoading) {
    return <div className="text-center text-gray-600">Loading campaigns...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-600">
        An error occurred while fetching campaigns. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Campaigns
      </h1>
      {campaigns.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No campaigns found.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {campaigns.map((campaign) => (
            <div
              key={campaign.candidate_id}
              className="bg-white p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 hover:text-indigo-600">
                {campaign.name}
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong className="font-medium">Age:</strong> {campaign.campaign.age}
                </li>
                <li>
                  <strong className="font-medium">Gender:</strong> {campaign.campaign.gender}
                </li>
                <li>
                  <strong className="font-medium">Education:</strong> {campaign.campaign.edu_background}
                </li>
                <li>
                  <strong className="font-medium">Criminal Cases:</strong> {campaign.campaign.criminal_cases}
                </li>
                <li>
                  <strong className="font-medium">Goals:</strong> {campaign.campaign.goals}
                </li>
                <li>
                  <strong className="font-medium">Motive:</strong> {campaign.campaign.motive}
                </li>
                <li>
                  <strong className="font-medium">Plan of Action:</strong> {campaign.campaign.plan_of_action}
                </li>
                <li>
                  <strong className="font-medium">Slogan:</strong> {campaign.campaign.slogan}
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SeeCampaign;
