const express = require('express')
const { v4: uuidv4 } = require('uuid')


const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
    res.send('TrueCert home page')
})
//issue a certificate
app.post('/certificates/issue', (req, res) => {


    const { studentName, por, society, issueDate } = req.body;

    if (!studentName || !por || !society || !issueDate) {
        return res.status(400).send("All fields are required to issue a new certificate!");
    }

    const id = uuidv4();

    const responseData1 = {

        message: "Certificate issued successfully",
        id: id,
        studentName: studentName,
        por: por,
        society: society,
        issueDate: issueDate

    };

    //add ipfs hashing here



    res.status(200).send(responseData1);
});

app.listen(port, () => {
    console.log(`TrueCert listening on port ${port}`)
})