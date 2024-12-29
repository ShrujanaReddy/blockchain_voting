import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ElectionContext } from '../context/ElectionContext';
import Vote from './Vote';

function SeeCampaign() {
  const { electionStarted } = useContext(ElectionContext);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const user = localStorage.getItem('user');
  const parsedUser = JSON.parse(user);

  useEffect(() => {
    if (!electionStarted) {
      const fetchCampaignsAndComments = async () => {
        try {
          // Fetch campaigns
          const campaignsResponse = await axios.get('http://127.0.0.1:8000/api/candidates/campaigns', {
            headers: { 'Content-Type': 'application/json' },
          });
          if (campaignsResponse.status === 200) {
            setCampaigns(campaignsResponse.data);
          } else {
            setIsError(true);
          }

          // Fetch comments
          const commentsResponse = await axios.get('http://127.0.0.1:8000/api/comments', {
            headers: { 'Content-Type': 'application/json' },
          });

          if (commentsResponse.status === 200) {
            const commentsByCandidate = commentsResponse.data.reduce((acc, item) => {
              acc[item.candidate_id] = item.comments || [];
              return acc;
            }, {});
            setComments(commentsByCandidate);
          } else {
            setIsError(true);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCampaignsAndComments();
    }
  }, [electionStarted]);

  const handleCommentChange = (candidateId, value) => {
    setCommentInput((prev) => ({
      ...prev,
      [candidateId]: value,
    }));
  };

  const handleCommentSubmit = async (candidateId) => {
    const comment = commentInput[candidateId];
    if (!comment) return;

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/comments',
        {
          candidate_id: candidateId,
          user_id: parsedUser.user_id,
          name: parsedUser.name,
          comment: comment,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.status === 200) {
        alert('Comment added successfully!');
        setCommentInput((prev) => ({ ...prev, [candidateId]: '' }));

        // Update comments for this candidate
        const updatedComments = [...(comments[candidateId] || []), {
          candidate_id: candidateId,
          user_id: parsedUser.user_id,
          name: parsedUser.name,
          comment: comment,
        }];
        setComments((prev) => ({ ...prev, [candidateId]: updatedComments }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Only voters can add comments!');
    }
  };

  if (isLoading && !electionStarted) {
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
      {!electionStarted ? (
        <>
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

                  {/* Comment Form */}
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800">Add a Comment</h3>
                    <textarea
                      value={commentInput[campaign.candidate_id] || ''}
                      onChange={(e) => handleCommentChange(campaign.candidate_id, e.target.value)}
                      className="w-full p-2 mt-2 border rounded-md"
                      placeholder="Write your comment here..."
                      rows="4"
                    ></textarea>
                    <button
                      onClick={() => handleCommentSubmit(campaign.candidate_id)}
                      className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
                    >
                      Submit Comment
                    </button>
                  </div>

                  {/* Display Comments */}
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800">Comments</h3>
                    {comments[campaign.candidate_id] && comments[campaign.candidate_id].length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {comments[campaign.candidate_id].map((comment, index) => (
                          <li key={index} className="border-b pb-2">
                            <strong>{comment.name}:</strong> {comment.comment}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No comments yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (<Vote />)}
      </div>
    )

}
export default SeeCampaign;