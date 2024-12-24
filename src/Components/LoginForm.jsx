import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login', credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      console.log(data);

      if (response.status !== 200) {
        setIsError(true);
        setResponseMessage(data.detail || 'Invalid email or password');
      } else {
        setIsError(false);
        setResponseMessage('Login successful! Redirecting...');

        // Store the user data in localStorage
        localStorage.setItem('user', JSON.stringify(data)); // Store the response data in localStorage

        // Check user role and navigate
        const parsedData = data;
        if (parsedData.role === 'organization_admin') {
          navigate('/admin');
        } else if (parsedData.role === 'voter') {
          navigate('/see_campaigns');
        } else if (parsedData.role === 'candidate') {
          navigate('/campaign');
        } else {
          navigate('/'); // Redirect to homepage if not admin
        }
      }
    } catch (error) {
      setIsError(true);
      setResponseMessage('Network error. Please try again later.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ email, password });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg"
          >
            Log In
          </button>
        </div>
      </form>
      {responseMessage && (
        <div className={`mt-4 p-2 text-center rounded-lg ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {responseMessage}
        </div>
      )}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
