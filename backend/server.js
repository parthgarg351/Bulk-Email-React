const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require("multer");
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());
require('dotenv').config();
 

const app = express();
const PORT = 5000;
const upload = multer(); 
 
app.use(cors());
app.use(express.json());
console.log(process.env.EMAIL_USER);

function extractNameFromEmail(email) {
    const localPart = email.split("@")[0];
    const nameParts = localPart
      .split(/[._]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
    return nameParts.join(" ");
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  

app.post("/send-emails", async (req, res) => {

    //Data Collection Part
    const { valid, subject, body } = req.body;
    // console.log(req.body);
    console.log(valid);
    console.log(subject);
    console.log(body);
    //processing part
    //const processedData = data.toUpperCase(); // Example: convert to uppercase
    for (const email of valid) {
        const name = extractNameFromEmail(email);
        const personalizedSubject = `Hello ${name}, ${subject}`;
        const personalizedMessage = `Hi ${name},\n\n${body}`;
  
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: personalizedSubject,
            text: personalizedMessage,
            //attachments: attachments, // Attachments array
          });
          console.log(`Email sent to: ${email}`);
          
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error);

        }
      }
    //response part
    //res.json({ processedData }); // Send back to frontend
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
