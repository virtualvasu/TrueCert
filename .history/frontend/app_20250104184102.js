document.getElementById('issueCertificate').onclick = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            if (!accounts || accounts.length === 0) {
                alert('MetaMask is not connected. Please connect your account.');
                return;
            }

            const userAccount = accounts[0];
            console.log("Connected MetaMask account:", userAccount);

            const studentName = document.getElementById('studentName').value.trim();
            const por = document.getElementById('por').value.trim();
            const society = document.getElementById('society').value.trim();

            if (!studentName || !por || !society) {
                alert('Please fill in all fields.');
                return;
            }

            const response = await fetch('http://localhost:3000/certificates/issue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentName, por, society }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const { ipfsHash, message } = await response.json();
            console.log(message, "IPFS Hash:", ipfsHash);

            const contractAddress = '0x14b230eE8D74Aebe6beee88B8263742D83A1C5Be'; // Replace with your contract address
            const contractABI = [
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
                }
            ];

            const contract = new web3.eth.Contract(contractABI, contractAddress);

            // Store the certificate on the blockchain
            const transaction = await contract.methods.storeCertificate(ipfsHash, userAccount).send({
                from: userAccount,
            });

            console.log("Transaction successful:", transaction);
            alert(`Certificate stored on blockchain! Transaction Hash: ${transaction.transactionHash}`);
        } catch (error) {
            console.error("Error:", error.message);
            alert(`Error: ${error.message}`);
        }
    } else {
        alert('MetaMask is not installed. Please install MetaMask to proceed.');
    }
};

// New function to check if a certificate exists
document.getElementById('checkCertificate').onclick = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            if (!accounts || accounts.length === 0) {
                alert('MetaMask is not connected. Please connect your account.');
                return;
            }

            const userAccount = accounts[0];
            console.log("Connected MetaMask account:", userAccount);

            const ipfsHash = document.getElementById('ipfsHash').value.trim();

            if (!ipfsHash) {
                alert('Please enter an IPFS hash.');
                return;
            }

            const contractAddress = '0x14b230eE8D74Aebe6beee88B8263742D83A1C5Be'; // Replace with your contract address
            const contractABI = [
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
                }
              ];

            const contract = new web3.eth.Contract(contractABI, contractAddress);

            // Check if the certificate exists
            const exists = await contract.methods.checkExistence(ipfsHash, userAccount).call();

            if (exists) {
                alert("Certificate exists on the blockchain.");
                console.log("Certificate exists.");
            } else {
                alert("Certificate does not exist.");
                console.log("Certificate does not exist.");
            }
        } catch (error) {
            console.error("Error:", error.message);
            alert(`Error: ${error.message}`);
        }
    } else {
        alert('MetaMask is not installed. Please install MetaMask to proceed.');
    }
};
