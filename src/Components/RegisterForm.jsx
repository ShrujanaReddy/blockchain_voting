import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'voter', // default role is 'voter'
    wallet_address: '',
  });
  const [error, setError] = useState(null); // Track error message
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission and API call
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setError(null); // Reset any previous errors

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/register', formData);
      console.log('API Response:', response); // Log the API response for debugging

      if (response.status === 200) {
        alert(response.data.message); // Show success message

        // Assuming the API returns user data after registration
        const user = response.data;
        console.log('User data:', user); // Log user data

        // Store the user details in localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Check if the role exists and navigate accordingly
        if (user && user.role) {
          if (user.role === 'voter') {
            navigate('/see_campaigns');
          } else if (user.role === 'organization_admin') {
            navigate('/admin');
          } else if (user.role === 'candidate') {
            navigate('/campaign');
          } else {
            console.log('Unknown role, redirecting to default page');
            navigate('/default'); // Add a fallback route
          }
        } else {
          console.log('No user role found');
        }
      }
    } catch (error) {
      // Handle specific errors
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Registration failed');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
      
      {error && <div className="text-red-500 text-sm text-center mt-4">{error}</div>} {/* Error message */}

      <form onSubmit={handleRegister} className="mt-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-600">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="voter">Voter</option>
            <option value="candidate">Candidate</option>
            <option value="organization_admin">Organization Admin</option>
          </select>
        </div>
          <div>
            <label htmlFor="wallet_address" className="block text-sm font-medium text-gray-600">
              Wallet Address
            </label>
            <input
              type="text"
              id="wallet_address"
              name="wallet_address"
              value={formData.wallet_address}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your wallet address"
              required
            />
          </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg"
          >
            Register
          </button>
        </div>
      </form>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
