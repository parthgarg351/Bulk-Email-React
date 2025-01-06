import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";


function validateEmail(email) {
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(email);
}

const Body = () => {
  const [emails, setEmails] = useState([]);
  const [validEmails, setValidEmails] = useState([]);
  const [invalidEmails, setInvalidEmails] = useState([]);
  const [response, setResponse] = useState();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  let valid = [];
  let invalid = [];

  const handleSendEmails = async () => {
    emails.forEach((email, index) => {
      if (validateEmail(email)) {
        valid.push(email);
      } else {
        invalid.push(email);
      }
    });
    setValidEmails(valid);
    setInvalidEmails(invalid);
    try {
      // Send data to the backend
      const res = await axios.post(
          "https://bulk-email-backend-dx5l.onrender.com/send-emails",
        // "http://localhost:5000/send-emails",
        {
          valid,
          subject,
          body: body,
        }
      );
      setResponse(res.data.processedData); // Update the state with the processed data
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen main-animated-gradient">

      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Bulk Email Sender</h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="subject">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
                Body
              </label>
              <textarea
                id="message"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="6"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter email body"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="emailFile">
                Upload Excel File
              </label>
              <input
                type="file"
                id="emailFile"
                accept=".xlsx"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = () => {
                    const data = reader.result;
                    const workbook = XLSX.read(data, { type: "binary" });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const emailsFromFile = XLSX.utils.sheet_to_json(worksheet, {
                      header: 1,
                      raw: true,
                    });
                    setEmails(emailsFromFile.map((row) => row[0]));
                  };
                  reader.readAsBinaryString(file);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSendEmails}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send Emails
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Valid Emails</h3>
              <ul className="space-y-2">
                {validEmails.length > 0 ? 
                  validEmails.map((email, index) => (
                    <li key={index} className="text-gray-600">{email}</li>
                  )) : 
                  <li className="text-gray-500">No valid emails found</li>
                }
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Invalid Emails</h3>
              <ul className="space-y-2">
                {invalidEmails.length > 0 ? 
                  invalidEmails.map((email, index) => (
                    <li key={index} className="text-gray-600">{email}</li>
                  )) : 
                  <li className="text-gray-500">No invalid emails found</li>
                }
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">Failed Emails</h3>
              <ul className="space-y-2">
                <li className="text-gray-500">No failed emails</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;