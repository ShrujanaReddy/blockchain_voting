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
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Campaigns</h1>
      {campaigns.length === 0 ? (
        <p className="text-center text-gray-600">No campaigns found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.candidate_id}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {campaign.name}
              </h2>
              <ul className="space-y-2">
                <li>
                  <strong>Age:</strong> {campaign.campaign.age}
                </li>
                <li>
                  <strong>Gender:</strong> {campaign.campaign.gender}
                </li>
                <li>
                  <strong>Education:</strong> {campaign.campaign.edu_background}
                </li>
                <li>
                  <strong>Criminal Cases:</strong> {campaign.campaign.criminal_cases}
                </li>
                <li>
                  <strong>Goals:</strong> {campaign.campaign.goals}
                </li>
                <li>
                  <strong>Motive:</strong> {campaign.campaign.motive}
                </li>
                <li>
                  <strong>Plan of Action:</strong> {campaign.campaign.plan_of_action}
                </li>
                <li>
                  <strong>Slogan:</strong> {campaign.campaign.slogan}
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
