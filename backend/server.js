const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require("multer");
const admin = require('firebase-admin');
require('dotenv').config();
 
// Initialize Firebase Admin
// const serviceAccount = require('./config/bulk-email-5c174-firebase-adminsdk-l7wjc-2abd0cd92d.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  })
});

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
  
// Endpoint to grant access
app.post("/grant-access", async (req, res) => {
  const adminEmail = req.body.adminEmail;
  const userEmailToGrant = req.body.userEmailToGrant;
  console.log('Attempting to grant access:', {
    adminEmail,
    userEmailToGrant
  });
  
  try {
    const adminUser = await admin.auth().getUserByEmail(adminEmail);
    console.log('Admin user found:', adminUser.uid);
    const adminClaims = (await admin.auth().getUser(adminUser.uid)).customClaims;
    // console.log('Admin claims:', adminClaims);
    
    if (!adminClaims?.admin) {
      return res.status(403).json({ error: "Not authorized as admin" });
    }

    const userToGrant = await admin.auth().getUserByEmail(userEmailToGrant);
    await admin.auth().setCustomUserClaims(userToGrant.uid, { authorized: true });

    console.log('Access granted successfully to:', userEmailToGrant);
    res.json({ message: "Access granted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/send-emails", async (req, res) => {

    //Data Collection Part
    const { valid, subject, body } = req.body;
    // console.log(req.body);
    console.log(valid);
    console.log("Subject = ",subject);
    console.log("Body - ",body);
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

// Add this endpoint after your existing routes
app.post("/setup-admin", async (req, res) => {
  const uid = 'F95tLXwOIXVhLvpWrSRFTe4y3QX2'; // Replace with your Firebase user UID
  try {
    await admin.auth().setCustomUserClaims(uid, {
      admin: true,
      authorized: true
    });
    res.json({ message: "Admin setup successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Command to set up admin is ---  curl -X POST http://localhost:5000/setup-admin

app.get('/test-admin', async (req, res) => {
  try {
    const listUsers = await admin.auth().listUsers();
    res.json({ message: 'Firebase Admin SDK working', userCount: listUsers.users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  console.log('Firebase Admin initialized with project:', process.env.FIREBASE_PROJECT_ID);
});

//the command to check admin  ------ curl http://localhost:5000/test-admin



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
