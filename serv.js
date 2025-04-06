const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Twilio credentials
const accountSid = 'your_account_sid'; // Replace with your Account SID
const authToken = 'your_auth_token';   // Replace with your Auth Token
const twilioClient = twilio(accountSid, authToken);

// Twilio Sandbox number for WhatsApp
const twilioWhatsAppNumber = 'whatsapp:+14155238886';

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Message to be sent
  const message = `Your OTP code is: ${otp}`;

  try {
    await twilioClient.messages.create({
      body: message,
      from: twilioWhatsAppNumber,
      to: `whatsapp:${phone}`
    });

    res.status(200).json({ success: true, otp });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
