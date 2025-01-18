const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5173;
//transporter setup

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.BREVO_AUTH_USER,
        pass: process.env.BREVO_AUTH_PASS,
    },
});



const sendEmail = async (recipient, subject, text) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL, // Sender address
        to: recipient, // Recipient address
        subject, // Subject line
        text, // Plain text body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Endpoint to send email

app.post('/registration/fromissuer', async (req, res) => {
    const { recipient, subject, body } = req.body;
  
    try {
      await sendEmail(recipient, subject, body);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

// Endpoint to issue certificates
app.post('/certificates/issue', async (req, res) => {
    const certificateId = uuidv4();

    const certificateData = {
        message: 'Certificate issued successfully',
        certificateId,
        mainDocData: req.body,
        issueDate: new Date()
    };

    try {
        // Pinata API setup
        const pinataUrl = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
        const headers = {
            'Authorization': `Bearer ${process.env.PINATA_JWT_TOKEN}`
        };

        // Upload certificate data to IPFS
        const pinataResponse = await axios.post(pinataUrl, certificateData, { headers });
        const ipfsHash = pinataResponse.data.IpfsHash;

        if (!ipfsHash) {
            return res.status(500).json({ error: "Failed to upload data to IPFS." });
        }

        console.log("Certificate uploaded to IPFS:", ipfsHash);

        // Return the IPFS hash to the frontend
        res.status(200).json({
            message: "Certificate uploaded to IPFS",
            ipfsHash
        });
    } catch (error) {
        console.error("Error uploading to IPFS:", error);

        if (error.response) {
            console.error("Pinata error response:", error.response.data);
        }

        res.status(500).json({ error: "Failed to upload certificate to IPFS" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`TrueCert server running on http://localhost:${port}`);
});
