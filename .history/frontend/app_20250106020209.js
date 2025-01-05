const contractAddress = '0x8f5f84d66D04BcAe4DdBfe4F7939Ef46B4639880'; // Replace with your contract address
const contractABI = [
    // The contract ABI remains the same as before
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "certificates",
        "outputs": [
            {
                "internalType": "address",
                "name": "issuerAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timeStamp",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isRevoked",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_ipfsHash",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_issuerAddress",
                "type": "address"
            }
        ],
        "name": "checkExistence",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_orgAddress",
                "type": "string"
            }
        ],
        "name": "checkOganisationExistence",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_ipfsHash",
                "type": "string"
            }
        ],
        "name": "getCertificate",
        "outputs": [
            {
                "internalType": "address",
                "name": "issuerAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timeStamp",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isRevoked",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "organisations",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_ipfsHash",
                "type": "string"
            }
        ],
        "name": "revokeCertificate",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_ipfsHash",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_issuerAddress",
                "type": "address"
            }
        ],
        "name": "storeCertificate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_orgAddress",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_orgName",
                "type": "string"
            }
        ],
        "name": "storeOrganisation",
        "outputs": [],
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
    console.log("Connected account:", accounts[0]);

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

// New function to handle storing an organisation
async function handleStoreOrganisation() {
    try {
        const { web3, userAccount } = await initializeWeb3();

        const adminAddress = '0x3d7178de2a7d863629d429635db30a687a0a2f65'; // Replace with the actual admin address
        if (userAccount.toLowerCase() !== adminAddress.toLowerCase()) {
            alert('You must be the admin to store the organisation. Please switch to the admin account.');
            return;
        }

        const orgAddress = document.getElementById('orgAddress').value.trim();
        const orgName = document.getElementById('orgName').value.trim();

        if (!orgAddress || !orgName) {
            alert('Please fill in both fields.');
            return;
        }

        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const transaction = await contract.methods.storeOrganisation(orgAddress, orgName).send({ from: userAccount });

        alert(`Organisation stored on blockchain! Transaction Hash: ${transaction.transactionHash}`);
    } catch (error) {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
    }
}


document.getElementById('issueCertificate').onclick = handleIssueCertificate;
document.getElementById('checkCertificate').onclick = handleCheckCertificate;
document.getElementById('revokeCertificate').onclick = handleRevokeCertificate;
document.getElementById('storeOrganisation').onclick = handleStoreOrganisation; // Add event listener for storing organisation
