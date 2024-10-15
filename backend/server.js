import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import express from 'express';
import bodyParser from 'body-parser';
import twilio from 'twilio';

const app = express(); // Express app
const PORT = 3000;

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Twilio Account SID from .env
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Twilio Auth Token from .env
const client = twilio(accountSid, authToken);      // Initialize Twilio client

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Example route to send OTP using Twilio Verify
app.post('/send-otp', async (req, res) => {
    const { phoneNumber } = req.body; // Get the phone number from request body

    try {
        // Use Twilio Verify to send OTP
        const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID; // Verify service SID from .env
        const verification = await client.verify.services(serviceSid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' }); // Send SMS OTP

        res.status(200).json({ message: 'OTP sent successfully!', sid: verification.sid });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
