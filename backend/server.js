const express = require('express');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('TrueCert home page');
});




// Issue a certificate
app.post('/certificates/issue', async (req, res) => {
    const { studentName, por, society, issueDate } = req.body;

    if (!studentName || !por || !society || !issueDate) {
        return res.status(400).send("All fields are required to issue a new certificate!");
    }

    const id = uuidv4();

    const certificateData = {
        message: "Certificate issued successfully",
        id: id,
        studentName: studentName,
        por: por,
        society: society,
        issueDate: issueDate
    };

    try {
        const pinataUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
        const headers = {
            'Authorization': `Bearer ${process.env.PINATA_JWT_TOKEN}`
        };

        const pinataResponse = await axios.post(pinataUrl, certificateData, { headers });

        const ipfsHash = pinataResponse.data.IpfsHash;

        const responseData = {
            ...certificateData,
            ipfsHash: ipfsHash
        };

        res.status(200).send(responseData);
    } catch (error) {
        console.error("Error uploading to IPFS:", error.message);
        res.status(500).send("Failed to upload data to IPFS");
    }
});

app.listen(port, () => {
    console.log(`TrueCert listening on port ${port}`);
});
