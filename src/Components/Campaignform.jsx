import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Campaign() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    edu_background: '',
    criminal_cases: '',
    goals: '',
    motive: '',
    plan_of_action: '',
    slogan: '',
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isCandidate, setIsCandidate] = useState(false);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Check if the user's role is 'candidate'
      if (user.role === "candidate"&&user.is_approved === true) {
        setIsCandidate(true);
      }
    }
  }, []);

  if (!isCandidate) {
    // If the role is not 'candidate', don't render the component
    return <h1 className='text-4xl'>Only approved candidates can campaign!</h1>;
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user') 
      ? JSON.parse(localStorage.getItem('user')).user_id 
      : null;

    if (!userId) {
      setIsError(true);
      setResponseMessage('User is not logged in.');
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/candidates/campaign?user_id=${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response)
      setIsError(false);
      setResponseMessage('Campaign submitted successfully!');
    } catch (error) {
      setIsError(true);
      setResponseMessage(
        error.response?.data?.detail || 'Error submitting the campaign. Please try again.'
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Submit Your Campaign Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-600">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-600">
            Gender
          </label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="edu_background" className="block text-sm font-medium text-gray-600">
            Educational Background
          </label>
          <input
            type="text"
            id="edu_background"
            name="edu_background"
            value={formData.edu_background}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="criminal_cases" className="block text-sm font-medium text-gray-600">
            Criminal Cases (if any)
          </label>
          <input
            type="text"
            id="criminal_cases"
            name="criminal_cases"
            value={formData.criminal_cases}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="goals" className="block text-sm font-medium text-gray-600">
            Goals
          </label>
          <textarea
            id="goals"
            name="goals"
            value={formData.goals}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="motive" className="block text-sm font-medium text-gray-600">
            Motive
          </label>
          <textarea
            id="motive"
            name="motive"
            value={formData.motive}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="plan_of_action" className="block text-sm font-medium text-gray-600">
            Plan of Action
          </label>
          <textarea
            id="plan_of_action"
            name="plan_of_action"
            value={formData.plan_of_action}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="slogan" className="block text-sm font-medium text-gray-600">
            Slogan
          </label>
          <input
            type="text"
            id="slogan"
            name="slogan"
            value={formData.slogan}
            onChange={handleInputChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
      {responseMessage && (
        <div
          className={`mt-4 p-2 text-center rounded-lg ${
            isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {responseMessage}
        </div>
      )}
    </div>
  );
}

export default Campaign;