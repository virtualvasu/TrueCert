document.getElementById('issueCertificate').onclick = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum); // Use MetaMask's provider

        try {
            // Prompt user to connect MetaMask
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            if (!accounts || accounts.length === 0) {
                alert('MetaMask is not connected. Please connect your account.');
                return;
            }

            const userAccount = accounts[0];
            console.log("Connected MetaMask account:", userAccount);

            // Get input values
            const studentName = document.getElementById('studentName').value.trim();
            const por = document.getElementById('por').value.trim();
            const society = document.getElementById('society').value.trim();

            if (!studentName || !por || !society) {
                alert('Please fill in all fields.');
                return;
            }

            // Send data to the backend to upload to IPFS
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

            // Interact with the smart contract
            const contractAddress = '0x9b54840031448474B51bE88d29725A7E1830f9Bb'; // Replace with your contract address
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
