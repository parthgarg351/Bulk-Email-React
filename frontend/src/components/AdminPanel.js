import React, { useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  const grantAccess = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(newUserEmail)) {
    setMessage('Please enter a valid email address');
    return;
  }
    
      const requestBody = {
        adminEmail: auth.currentUser.email,
        userEmailToGrant: newUserEmail
      };
    //   console.log("Sending request with data:", requestBody);

      try {
        // const response = await axios.post('http://localhost:5000/grant-access', requestBody, {
        const response = await axios.post('https://bulk-email-backend-dx5l.onrender.com/grant-access', requestBody, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
      setMessage('Access granted successfully');
      setNewUserEmail('');
    } catch (error) {
        if (error.response?.data?.error?.includes('no user record')) {
          setMessage('User must sign in with Google at least once before being granted access');
        } else {
          setMessage(error.response?.data?.error || 'Error granting access');
        }
      }
      
      
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grant Access to New User
              </label>
              <input 
                type="email" 
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="Enter user email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <button 
              onClick={grantAccess}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Grant Access
            </button>
            
            {message && (
              <div className={`p-4 rounded-md ${
                message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;