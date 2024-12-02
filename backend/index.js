const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware

const app = express();
const port = 4000;

// In-memory store for OTPs (could be replaced with Redis or MongoDB in production)
let otpStore = {};

// Middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin
    methods: ['GET', 'POST'],       // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
  }));

// Generate OTP and send via email
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).send('Email is required');
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Store OTP in memory with a timestamp
  otpStore[email] = {
    otp: otp,
    timestamp: Date.now(),
  };

  // Send OTP to the user's email using Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'percyjacker2002@gmail.com', // Use your email here
      pass: 'eafu pftl dldt ovto', // Use your email password or App Password
    },
  });

  const mailOptions = {
    from: 'percyjacker2002@gmail.com',
    to: email,
    subject: 'Your OTP for authentication',
    text: `Your OTP is: ${otp}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return res.status(200).send('OTP sent to your email');
  } catch (err) {
    console.error('Error sending OTP:', err);
    return res.status(500).send('Error sending OTP');
  }
});

// Verify the OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Check if email and OTP are provided
  if (!email || !otp) {
    return res.status(400).send('Email and OTP are required');
  }

  // Retrieve the stored OTP and timestamp
  const storedData = otpStore[email];

  // Check if OTP exists in store
  if (!storedData) {
    return res.status(400).send('No OTP sent to this email');
  }

  // Check if OTP is expired (5 minutes expiration time)
  const currentTime = Date.now();
  const expirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (currentTime - storedData.timestamp > expirationTime) {
    delete otpStore[email]; // Delete expired OTP
    return res.status(400).send('OTP has expired');
  }

  // Check if OTP matches
  if (storedData.otp === parseInt(otp)) {
    // OTP is valid, clear the OTP from memory
    delete otpStore[email];
    return res.send("OTP verified")
  } else {
    return res.status(400).send('Invalid OTP');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
