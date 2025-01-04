const contractAddress = '0x14b230eE8D74Aebe6beee88B8263742D83A1C5Be'; // Replace with your contract address
const contractABI = [
    {
        "inputs": [{ "internalType": "string", "name": "_ipfsHash", "type": "string" }],
        "name": "getCertificate",
        "outputs": [
            { "internalType": "address", "name": "issuerAddress", "type": "address" },
            { "internalType": "uint256", "name": "timeStamp", "type": "uint256" },
            { "internalType": "bool", "name": "isRevoked", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_ipfsHash", "type": "string" },
            { "internalType": "address", "name": "_issuerAddress", "type": "address" }
        ],
        "name": "storeCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_ipfsHash", "type": "string" },
            { "internalType": "address", "name": "_issuerAddress", "type": "address" }
        ],
        "name": "checkExistence",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "_ipfsHash", "type": "string" }],
        "name": "revokeCertificate",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

async function initializeWeb3() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install MetaMask to proceed.');
        throw new Error('MetaMask not found.');
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (!accounts || accounts.length === 0) {
        alert('MetaMask is not connected. Please connect your account.');
        throw new Error('No MetaMask account connected.');
    }

    return { web3, userAccount: accounts[0] };
}

async function handleIssueCertificate() {
    try {
        const { web3, userAccount } = await initializeWeb3();

        const studentName = document.getElementById('studentName').value.trim();
        const por = document.getElementById('por').value.trim();
        const society = document.getElementById('society').value.trim();

        if (!studentName || !por || !society) {
            alert('Please fill in all fields.');
            return;
        }

        const response = await fetch('http://localhost:3000/certificates/issue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentName, por, society })
        });

        if (!response.ok) throw new Error(await response.text());

        const { ipfsHash } = await response.json();
        console.log("IPFS Hash:", ipfsHash);

        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const transaction = await contract.methods.storeCertificate(ipfsHash, userAccount).send({ from: userAccount });

        alert(`Certificate stored on blockchain! Transaction Hash: ${transaction.transactionHash}`);
    } catch (error) {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
    }
}

async function handleCheckCertificate() {
    try {
        const { web3, userAccount } = await initializeWeb3();

        const ipfsHash = document.getElementById('ipfsHash').value.trim();
        if (!ipfsHash) {
            alert('Please enter an IPFS hash.');
            return;
        }

        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const exists = await contract.methods.checkExistence(ipfsHash, userAccount).call();

        alert(exists ? "Certificate exists on the blockchain." : "Certificate does not exist.");
    } catch (error) {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
    }
}

async function handleRevokeCertificate() {
    try {
        const { web3, userAccount } = await initializeWeb3();

        const ipfsHash = document.getElementById('revokeIpfsHash').value.trim();
        if (!ipfsHash) {
            alert('Please enter an IPFS hash.');
            return;
        }

        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const transaction = await contract.methods.revokeCertificate(ipfsHash).send({ from: userAccount });

        alert(`Certificate revoked! Transaction Hash: ${transaction.transactionHash}`);
    } catch (error) {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
    }
}

async function handleGetCertificateData() {
    try {
        const { web3 } = await initializeWeb3();

        const ipfsHash = document.getElementById('getDataIpfsHash').value.trim();
        if (!ipfsHash) {
            alert('Please enter an IPFS hash.');
            return;
        }

        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const certificateData = await contract.methods.getCertificate(ipfsHash).call();

        const { issuerAddress, timeStamp, isRevoked } = certificateData;
        const date = new Date(timeStamp * 1000).toLocaleString();

        document.getElementById('certificateDataResult').innerText = `
            Issuer Address: ${issuerAddress}
            Timestamp: ${date}
            Revoked: ${isRevoked ? 'Yes' : 'No'}
        `;
    } catch (error) {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
    }
}

document.getElementById('issueCertificate').onclick = handleIssueCertificate;
document.getElementById('checkCertificate').onclick = handleCheckCertificate;
document.getElementById('revokeCertificate').onclick = handleRevokeCertificate;
document.getElementById('getCertificateData').onclick = handleGetCertificateData;
