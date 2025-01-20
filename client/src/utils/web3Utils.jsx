import Web3 from 'web3';

export async function initializeWeb3() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed. Please install MetaMask to proceed.');
        throw new Error('MetaMask not found.');
    }

    const web3 = new Web3(window.ethereum);
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
            alert('MetaMask is not connected. Please connect your account.');
            throw new Error('No MetaMask account connected.');
        }

        // Convert account to checksummed address for consistency
        const userAccount = web3.utils.toChecksumAddress(accounts[0]);

        // Optionally log in development
        console.log('MetaMask connected:', userAccount);

        return { web3, userAccount };
    } catch (error) {
        console.error('Error initializing Web3:', error.message);
        throw error;
    }
}


export async function revokeCertificate(web3, contractABI, contractAddress, ipfsHash, userAccount) {
    if (!ipfsHash) {
        alert('Please enter an IPFS hash.');
        throw new Error('IPFS hash is required.');
    }
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const transaction = await contract.methods.revokeCertificate(ipfsHash).send({ from: userAccount });
    return transaction.transactionHash;
}
