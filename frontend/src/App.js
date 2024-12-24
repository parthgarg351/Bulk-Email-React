import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function validateEmail(email) {
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(email);
}
 
function App() {
  const [emails, setEmails] = useState([]);
  const [validEmails, setValidEmails] = useState([]);
  const [invalidEmails, setInvalidEmails] = useState([]);
  const [response, setResponse] = useState();
  let valid = [];
  let invalid = [];

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

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
      const res = await axios.post("https://bulk-email-backend-dx5l.onrender.com/send-emails", {
        valid,
        subject,
        body: body,
      });
      setResponse(res.data.processedData); // Update the state with the processed data
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-center m-2 text-3xl">Bulk Email Sender</h1>
      <div className="px-2 mx-1 border-2 border-black">
        <div className="m-2">
          <label className="" for="subject">
            Subject:
          </label>
          <input
            className="p-2"
            type="text"
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            required
          />
        </div>

        <div className="m-2">
          <label for="message">Body:</label>
          <textarea
            className="p-2"
            value={body}
            id="message"
            name="message"
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body"
            required
          />
        </div>

        <div>
          <label for="emailFile">Upload Excel File:</label>
          <input
            className="p-2"
            type="file"
            id="emailFile"
            name="emailFile"
            accept=".xlsx"
            required
            onChange={(e) => {
              const file = e.target.files[0];
              // Read the email addresses from the Excel file
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
          />
        </div>

        <button
          className="p-4 m-4 border-2 border-black rounded-lg"
          onClick={handleSendEmails}
        >
          Send Emails
        </button>
      </div>

      <div className="p-2 mx-1 my-4 border-2 border-black">
        <h1 className="p-2 m-2 text-center text-2xl">Status</h1>
        <div className="flex">
          <div className="flex-1 flex p-2 mx-1 my-4 border-2 border-black">
            <h3 className="text-center ">Valid Emails:</h3>
            <ul className="block">
              <br></br>
              {validEmails.length > 0 ? (
                validEmails.map((email, index) => <li key={index}>{email}</li>)
              ) : (
                <li>No valid emails found</li>
              )}
            </ul>
          </div>
          <div className="flex-1 flex p-2 mx-1 my-4 border-2 border-black">
            <h3>Invalid Emails:</h3>
            <ul>
              {invalidEmails.length > 0 ? (
                invalidEmails.map((email, index) => (
                  <li key={index}>{email}</li>
                ))
              ) : (
                <li>No invalid emails found</li>
              )}
            </ul>
          </div>
          <div className="flex-1 flex p-2 mx-1 my-4 border-2 border-black">
            <h3>Failed Emails:</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
